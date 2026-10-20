import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { backendUrl } from "../utils/backend";

const AuthContext = createContext(null);

const TOKEN_KEY = "noorhub_access_token";
const REFRESH_KEY = "noorhub_refresh_token";

/** Persist tokens to sessionStorage (lost on tab close, safer than localStorage). */
function saveTokens(access, refresh) {
  sessionStorage.setItem(TOKEN_KEY, access);
  if (refresh) sessionStorage.setItem(REFRESH_KEY, refresh);
}

function clearTokens() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
}

/** Read stored access token synchronously (used on app boot). */
function getStoredToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

/** Make an authenticated JSON request to the Flask API. */
async function apiRequest(path, options = {}, token = null) {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(backendUrl(path), {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getStoredToken());
  const [loading, setLoading] = useState(() => !!getStoredToken());
  const refreshPromiseRef = useRef(null);

  const refreshSession = useCallback(() => {
    const refresh = sessionStorage.getItem(REFRESH_KEY);
    if (!refresh) return Promise.resolve(null);
    if (!refreshPromiseRef.current) {
      refreshPromiseRef.current = apiRequest("/api/auth/refresh", { method: "POST" }, refresh)
        .then(({ ok, data }) => {
          if (!ok || !data.access_token || !data.refresh_token) {
            clearTokens();
            setToken(null);
            setUser(null);
            return null;
          }
          saveTokens(data.access_token, data.refresh_token);
          setToken(data.access_token);
          return data.access_token;
        })
        .catch(() => null)
        .finally(() => { refreshPromiseRef.current = null; });
    }
    return refreshPromiseRef.current;
  }, []);

  /** Re-hydrate user from stored token on app mount if token exists. */
  useEffect(() => {
    const stored = getStoredToken();
    if (!stored) {
      return;
    }

    let mounted = true;
    const restore = async () => {
      try {
        let current = stored;
        let response = await apiRequest("/api/user/me", { method: "GET" }, current);
        if (response.status === 401) {
          current = await refreshSession();
          if (current) response = await apiRequest("/api/user/me", { method: "GET" }, current);
        }
        if (!mounted) return;
        if (response.ok && response.data.user) {
          setUser(response.data.user);
          setToken(current);
        } else if (response.status === 401 || response.status === 404) {
          clearTokens();
          setToken(null);
        }
      } catch {
        // Keep the session tokens during a temporary offline/API outage.
      } finally {
        if (mounted) setLoading(false);
      }
    };
    restore();
    return () => { mounted = false; };
  }, [refreshSession]);

  /** Register a new user. Returns { errors } on failure or sets user on success. */
  const register = useCallback(async ({ name, email, password }) => {
    const { ok, data } = await apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    if (!ok) {
      return {
        errors: data.errors ?? ["Registration failed. Please try again."],
      };
    }

    saveTokens(data.access_token, data.refresh_token);
    setToken(data.access_token);
    setUser(data.user);
    return { errors: null };
  }, []);

  /** Log in an existing user. Returns { errors } on failure. */
  const login = useCallback(async ({ email, password }) => {
    const { ok, data } = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!ok) {
      return { errors: data.errors ?? ["Login failed. Please try again."] };
    }

    saveTokens(data.access_token, data.refresh_token);
    setToken(data.access_token);
    setUser(data.user);
    return { errors: null };
  }, []);

  /** Sign out the current user. */
  const logout = useCallback(async () => {
    if (token) {
      const revoke = (accessToken) => apiRequest("/api/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refresh_token: sessionStorage.getItem(REFRESH_KEY) }),
      }, accessToken);
      let response = await revoke(token).catch(() => null);
      if (response?.status === 401) {
        const renewedToken = await refreshSession();
        if (renewedToken) await revoke(renewedToken).catch(() => null);
      }
    }
    clearTokens();
    setToken(null);
    setUser(null);
  }, [token, refreshSession]);

  /** Make an authenticated request using the stored token. */
  const authFetch = useCallback(async (path, options = {}) => {
    let response = await apiRequest(path, options, token);
    if (response.status !== 401) return response;
    const renewedToken = await refreshSession();
    if (!renewedToken) return response;
    response = await apiRequest(path, options, renewedToken);
    return response;
  }, [token, refreshSession]);

  const deleteAccount = useCallback(async () => {
    let response = await authFetch("/api/user/me", { method: "DELETE" });
    if (!response.ok) return { errors: response.data.errors ?? [response.data.error ?? "Account deletion failed."] };
    clearTokens();
    setToken(null);
    setUser(null);
    return { errors: null };
  }, [authFetch]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        register,
        login,
        logout,
        deleteAccount,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

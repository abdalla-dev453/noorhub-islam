import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:5000";
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

  const response = await fetch(`${API_BASE}${path}`, {
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

  /** Re-hydrate user from stored token on app mount if token exists. */
  useEffect(() => {
    const stored = getStoredToken();
    if (!stored) {
      return;
    }

    apiRequest("/api/user/me", { method: "GET" }, stored)
      .then(({ ok, data }) => {
        if (ok && data.user) {
          setUser(data.user);
          setToken(stored);
        } else {
          clearTokens();
          setToken(null);
        }
      })
      .catch(() => {
        clearTokens();
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

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
      await apiRequest("/api/auth/logout", { method: "POST" }, token).catch(
        () => {},
      );
    }
    clearTokens();
    setToken(null);
    setUser(null);
  }, [token]);

  /** Make an authenticated request using the stored token. */
  const authFetch = useCallback(
    (path, options = {}) => apiRequest(path, options, token),
    [token],
  );

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

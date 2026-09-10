import { AlertCircle, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      const res = await login(formData);
      if (res.errors) {
        setErrors(res.errors);
      } else {
        navigate("/learn");
      }
    } catch {
      setErrors(["An unexpected error occurred. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="noor-card w-full max-w-md space-y-6 p-6 sm:p-8">
        <div className="text-center space-y-2">
          <span className="label-badge">Account</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Welcome Back
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Sign in to sync your reading and learning progress across devices.
          </p>
        </div>

        {errors.length > 0 && (
          <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              {errors.map((err, i) => (
                <p key={i}>{err}</p>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
              Email Address
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="noor-input"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
                Password
              </label>
            </div>
            <input
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="noor-input"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary py-3 text-sm font-bold tracking-wider uppercase mt-2"
          >
            {loading ? (
              "Signing In..."
            ) : (
              <>
                <LogIn size={15} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-[var(--text-secondary)]">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-[var(--accent)] hover:underline font-semibold"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

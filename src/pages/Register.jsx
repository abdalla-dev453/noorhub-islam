import { AlertCircle, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (formData.password !== formData.confirmPassword) {
      setErrors(["Passwords do not match."]);
      return;
    }

    if (formData.password.length < 8) {
      setErrors(["Password must be at least 8 characters long."]);
      return;
    }

    setLoading(true);

    try {
      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

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
          <span className="label-badge">Registration</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Join NoorHub
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Create an account to track your study goals and Quran recitations.
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
              Full Name
            </label>
            <input
              type="text"
              required
              autoComplete="name"
              placeholder="Abdullah"
              className="noor-input"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={loading}
            />
          </div>

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
            <label className="text-xs font-mono font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="noor-input"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
              Confirm Password
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              placeholder="Re-enter password"
              className="noor-input"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
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
              "Creating Account..."
            ) : (
              <>
                <UserPlus size={15} />
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[var(--accent)] hover:underline font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

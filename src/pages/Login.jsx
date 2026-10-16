import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const POINTS = [
  "Your reading position, bookmarks and notes stay on this device unless you export them.",
  "Lesson progress can sync to your account so you can finish a course on another device.",
  "No advertising, no public activity feed, and no tracking pixels.",
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      const result = await login(formData);
      if (result.errors) {
        setErrors(result.errors);
      } else {
        navigate("/");
      }
    } catch {
      setErrors(["An unexpected error occurred. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth">
        <aside className="auth__aside">
          <span className="page-head__eyebrow">Account</span>
          <p className="auth__quote">
            “And We have certainly made the Quran easy to remember.”
          </p>
          <p className="auth__cite">Quran 54:17</p>

          <ul className="auth__points">
            {POINTS.map((point) => (
              <li key={point} className="auth__point">
                <span className="auth__point-bullet" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </aside>

        <div className="auth__card">
          <h1 className="auth__title">Sign in</h1>
          <p className="auth__sub">
            Sign in to sync your learning progress across devices. Reading
            bookmarks, notes and practice logs stay in this browser.
          </p>

          {errors.length > 0 ? (
            <div className="notice notice--danger auth__errors" role="alert">
              <AlertCircle size={17} className="notice__icon" aria-hidden="true" />
              <div>
                {errors.map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            </div>
          ) : null}

          <form className="auth__form" onSubmit={handleSubmit}>
            <label className="field">
              <span className="field__label">Email address</span>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="input"
                value={formData.email}
                onChange={(event) =>
                  setFormData({ ...formData, email: event.target.value })
                }
                disabled={loading}
              />
            </label>

            <label className="field">
              <span className="field__label">Password</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="Your password"
                className="input"
                value={formData.password}
                onChange={(event) =>
                  setFormData({ ...formData, password: event.target.value })
                }
                disabled={loading}
              />
            </label>

            <button
              type="submit"
              className="btn btn--primary btn--lg btn--block"
              disabled={loading}
            >
              <LogIn size={16} aria-hidden="true" />
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="auth__alt">
            New to NoorHub? <Link to="/register">Create an account</Link>, or keep
            reading as a guest — everything except progress sync works without an
            account.
          </p>
        </div>
      </div>
    </div>
  );
}

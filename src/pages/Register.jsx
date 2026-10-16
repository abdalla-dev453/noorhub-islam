import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const POINTS = [
  "Sync lesson progress so you can finish a course on another device.",
  "Reading bookmarks, notes, Hifz plans and prayer logs stay in this browser by default.",
  "Delete your account at any time from your profile page.",
];

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

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

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
            “The best of you are those who learn the Quran and teach it.”
          </p>
          <p className="auth__cite">Sahih al-Bukhari 5027</p>

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
          <h1 className="auth__title">Create an account</h1>
          <p className="auth__sub">
            An account is only needed to sync learning progress. Everything else
            works without signing in.
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
              <span className="field__label">Full name</span>
              <input
                type="text"
                required
                autoComplete="name"
                placeholder="Your name"
                className="input"
                value={formData.name}
                onChange={(event) =>
                  setFormData({ ...formData, name: event.target.value })
                }
                disabled={loading}
              />
            </label>

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
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className="input"
                value={formData.password}
                onChange={(event) =>
                  setFormData({ ...formData, password: event.target.value })
                }
                disabled={loading}
              />
              <span className="field__hint">
                Use at least 8 characters. A passphrase is easier to remember and
                harder to guess.
              </span>
            </label>

            <label className="field">
              <span className="field__label">Confirm password</span>
              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder="Re-enter your password"
                className="input"
                value={formData.confirmPassword}
                onChange={(event) =>
                  setFormData({ ...formData, confirmPassword: event.target.value })
                }
                disabled={loading}
              />
            </label>

            <button
              type="submit"
              className="btn btn--primary btn--lg btn--block"
              disabled={loading}
            >
              <UserPlus size={16} aria-hidden="true" />
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="auth__alt">
            Already have an account? <Link to="/login">Sign in</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

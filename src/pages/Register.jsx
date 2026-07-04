import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate(); // Hook to handle programmatic redirects
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Registering persistent storage node profile:", formData);

    // Redirect trigger: send user to the login page automatically after creating an account
    navigate("/login");
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center relative overflow-hidden px-4 py-8">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 `w-[400px]` `h-[400px`] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="noor-card w-full max-w-md space-y-8 relative overflow-hidden p-8 md:p-10">
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none geometric-overlay" />

        <div className="text-center space-y-2 relative z-10">
          <h1 className="text-3xl font-bold gradient-heading">Join NoorHub</h1>
          <p className="text-slate-400 text-sm">
            Create an open-source student profile to track your study goals.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="Abdullah"
              className="noor-input"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              className="noor-input"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="noor-input"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">
              Confirm Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="noor-input"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl `bg-gradient-to-r` from-teal-500 to-emerald-500 hover:brightness-110 text-red-600 font-bold tracking-wider uppercase text-xs transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
          >
            Create Account
          </button>
        </form>

        <div className="text-center pt-2 relative z-10">
          <p className="text-xs text-slate-500">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-teal-400 hover:text-teal-300 font-semibold underline transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

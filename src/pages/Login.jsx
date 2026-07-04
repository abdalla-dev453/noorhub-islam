import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate(); //  Hook to handle programmatic redirects
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Authenticating secure profile channel:", formData);
    
    // ⚡ REDIRECT TRIGGER: Send user straight to the Home landing page/Dashboard upon clicking "Sign In"
    navigate("/");
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 `w-[400px]` `h-[400px]` bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="noor-card w-full max-w-md space-y-8 relative overflow-hidden p-8 md:p-10">
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none geometric-overlay" />

        <div className="text-center space-y-2 relative z-10">
          <h1 className="text-3xl font-bold gradient-heading">Welcome Back</h1>
          <p className="text-slate-400 text-sm">
            Sign in to synchronize your reading progress and learning tracks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
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
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">
                Password
              </label>
              <button 
                type="button"
                className="text-xs font-sans text-teal-400 hover:text-teal-300 transition-colors"
              >
                Forgot?
              </button>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="noor-input"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-400 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-teal-500 cursor-pointer w-3.5 h-3.5 bg-slate-950 border-slate-800 rounded"
              />
              Remember session
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl `bg-gradient-to-r` from-teal-500 to-emerald-500 hover:brightness-110 text-red-700 font-bold tracking-wider uppercase text-xs transition-all duration-300 shadow-[0_0_20px_rgba(20,184,166,0.1)]"
          >
            Sign In
          </button>
        </form>

        <div className="text-center pt-2 relative z-10">
          <p className="text-xs text-slate-500">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-teal-400 hover:text-teal-300 font-semibold underline transition-colors"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

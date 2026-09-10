import { BookOpen, LogIn, LogOut, Moon, Sun, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { NAV_LINKS } from "../data/constants";
import { LogoMark } from "./ui/Primitives";

const ROUTE_MAP = {
  Home: "/",
  Quran: "/quran",
  Hadith: "/hadith",
  Learn: "/learn",
  About: "/about",
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("noorhub_theme") ?? "dark",
  );

  // Apply theme class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("noorhub_theme", theme);
  }, [theme]);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const activeRoute =
    Object.entries(ROUTE_MAP).find(([, r]) => r === location.pathname)?.[0] ??
    "Home";

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-8 ${
        scrolled
          ? "bg-[var(--bg)]/85 backdrop-blur-xl border-b border-[var(--border)] shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Brand */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 group focus:outline-none"
          aria-label="NoorHub home"
        >
          <div className="relative group-hover:scale-105 transition-transform">
            <LogoMark size={30} />
            <div className="pointer-events-none absolute inset-0 rounded-full bg-teal-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
            NoorHub
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 bg-[var(--surface-glass)] px-3 py-1.5 rounded-full border border-[var(--border)] backdrop-blur-md">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => navigate(ROUTE_MAP[link])}
              className={`nav-link px-3 py-1 text-xs font-semibold ${activeRoute === link ? "active text-[var(--accent)]" : ""}`}
            >
              {link}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost w-9 h-9 p-0 rounded-full border border-transparent hover:border-[var(--border)] transition-transform hover:rotate-12"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <Sun size={17} className="text-amber-400" strokeWidth={2} />
            ) : (
              <Moon size={17} className="text-teal-600" strokeWidth={2} />
            )}
          </button>

          {isAuthenticated ? (
            <>
              {/* User name pill */}
              <span className="hidden sm:inline text-xs text-[var(--text-secondary)] font-mono font-medium px-2 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)]">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-secondary text-xs py-1.5 px-3.5"
                title="Sign out"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="btn btn-ghost text-xs"
              >
                <LogIn size={14} />
                Sign In
              </button>
              <button
                onClick={() => navigate("/learn")}
                className="hidden sm:flex btn btn-primary text-xs py-2 px-4 shadow-[0_0_15px_rgba(20,184,166,0.3)]"
              >
                <BookOpen size={13} />
                Start Learning
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

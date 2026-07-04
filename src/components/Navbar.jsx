import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogoMark } from "./ui/Primitives";
import { NAV_LINKS } from "../data/constants";

const preloadRoute = (path) => {
  if (typeof window === "undefined") return;

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = path;
  document.head.appendChild(link);
};

const ROUTE_MAP = {
  Home: "/",
  Quran: "/quran",
  Hadith: "/hadith",
  Learn: "/learn",
  About: "/about",
  Login: "/login",
  Register: "/register",
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [, setMobileMenuOpen] = useState(false);

  // ⚡ Theme Persistent Engine State Setup
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("noorhub_theme") || "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("noorhub_theme", theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleNavHover = (path) => {
    preloadRoute(path);
  };

  const extendedNavLinks = [...NAV_LINKS, "Login", "Register"];
  const activeNav =
    Object.entries(ROUTE_MAP).find(([, r]) => r === location.pathname)?.[0] ||
    "Home";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 ${
        scrolled
          ? "bg-slate-100/90 dark:bg-[#060810]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 shadow-md"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 relative z-10">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <LogoMark size={34} />
          <span className="font-serif text-2xl font-bold tracking-wide text-slate-800 dark:text-slate-100 group-hover:text-teal-500 transition-colors">
            NoorHub
          </span>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8">
          {extendedNavLinks.map((link) => (
            <button
              key={link}
              onMouseEnter={() => handleNavHover(ROUTE_MAP[link])}
              onClick={() => {
                navigate(ROUTE_MAP[link]);
                setMobileMenuOpen(false);
              }}
              className={`relative px-1 py-2 text-xs font-semibold tracking-wide uppercase transition-all duration-300 ${
                activeNav === link
                  ? "text-teal-600 dark:text-teal-400 font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-teal-500"
              }`}
            >
              {link}
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-full transition-all duration-300 ${activeNav === link ? "scale-x-100" : "scale-x-0"}`}
              />
            </button>
          ))}
        </div>

        {/* CTA and Dynamic Action Switch Row */}
        <div className="flex items-center gap-4">
          {/* ☀️/🌙 Micro Theme Switcher Component */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-sm shadow-sm hover:border-teal-500/40 text-slate-700 dark:text-slate-300 transition-colors focus:outline-none"
            aria-label="Toggle Interface Theme Color"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          <button
            onClick={() => navigate("/learn")}
            className="hidden sm:inline-block relative px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase border border-teal-500/30 text-teal-600 dark:text-teal-400 bg-teal-500/5 hover:bg-teal-500 hover:text-slate-950 transition-all duration-300"
          >
            Start Free
          </button>
        </div>
      </div>
    </nav>
  );
}

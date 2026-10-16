import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogIn, LogOut, Menu, Moon, Search, Settings, Sun } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAppearance } from "../hooks/useAppearance";
import { usePrayerContext } from "../hooks/usePrayerContext";
import { NAV_GROUPS, PRIMARY_NAV } from "../data/defaults";
import { PRAYER_LABELS } from "../utils/prayerTimes";
import { readLocal } from "../utils/localData";
import IconButton from "./ui/IconButton";
import LogoMark from "./ui/LogoMark";
import Sheet from "./ui/Sheet";
import Wordmark from "./ui/Wordmark";
import BottomNav from "./BottomNav";
import Footer from "./Footer";

function AccountMenu({ onNavigate }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        className="btn btn--secondary btn--sm"
        onClick={() => {
          onNavigate?.();
          navigate("/login");
        }}
      >
        <LogIn size={15} aria-hidden="true" />
        Sign in
      </button>
    );
  }

  const initial = (user?.name || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="account-menu" ref={wrapperRef}>
      <button
        type="button"
        className="avatar"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">{initial}</span>
        <span className="sr-only">Account menu for {user?.name}</span>
      </button>

      {open ? (
        <div className="account-menu__panel" role="menu">
          <div className="account-menu__head">
            <p className="account-menu__name">{user?.name}</p>
            <p className="account-menu__email">{user?.email}</p>
          </div>
          <button
            type="button"
            role="menuitem"
            className="account-menu__item"
            onClick={() => {
              setOpen(false);
              onNavigate?.();
              navigate("/settings");
            }}
          >
            <Settings size={16} aria-hidden="true" />
            Profile and privacy
          </button>
          <button
            type="button"
            role="menuitem"
            className="account-menu__item"
            onClick={async () => {
              setOpen(false);
              onNavigate?.();
              await logout();
              navigate("/");
            }}
          >
            <LogOut size={16} aria-hidden="true" />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

function NavLink({ label, to }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <button
      type="button"
      className="primary-nav__link"
      aria-current={pathname === to ? "page" : undefined}
      onClick={() => navigate(to)}
    >
      {label}
    </button>
  );
}

/** Grouped navigation for the mobile drawer. */
function DrawerNav({ onNavigate }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav aria-label="All sections">
      <p className="drawer__group-title">Start</p>
      <button
        type="button"
        className="drawer__link"
        aria-current={pathname === "/" ? "page" : undefined}
        onClick={() => {
          onNavigate();
          navigate("/");
        }}
      >
        <LogoMark size={18} />
        Dashboard
      </button>
      {PRIMARY_NAV.map((item) => (
        <button
          key={item.to}
          type="button"
          className="drawer__link"
          aria-current={pathname === item.to ? "page" : undefined}
          onClick={() => {
            onNavigate();
            navigate(item.to);
          }}
        >
          {item.label}
        </button>
      ))}

      {NAV_GROUPS.map((group) => (
        <div key={group.title}>
          <p className="drawer__group-title">{group.title}</p>
          {group.items.map((item) => (
            <button
              key={item.label}
              type="button"
              className="drawer__link"
              aria-current={pathname === item.to ? "page" : undefined}
              onClick={() => {
                onNavigate();
                navigate(item.to);
              }}
            >
              <span>
                {item.label}
                <span className="drawer__link-desc">{item.desc}</span>
              </span>
            </button>
          ))}
        </div>
      ))}
    </nav>
  );
}

export default function AppShell({ children }) {
  const { appearance, cycleDarkMode } = useAppearance();
  const { next, profile, formattedTimes } = usePrayerContext();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [position, setPosition] = useState(() =>
    readLocal("noorhub_quran_position", null),
  );

  useEffect(() => {
    const refresh = () => setPosition(readLocal("noorhub_quran_position", null));
    window.addEventListener("noorhub:reading-position", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("noorhub:reading-position", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const nextLabel = PRAYER_LABELS[next.key];
  const countdown = `${Math.floor(next.inMinutes / 60)}h ${next.inMinutes % 60}m`;

  return (
    <div className="app-shell has-bottom-nav">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="app-header">
        <div className="container app-header__inner">
          <Wordmark />

          <nav className="primary-nav" aria-label="Primary">
            {PRIMARY_NAV.map((item) => (
              <NavLink key={item.to} {...item} />
            ))}
          </nav>

          <div className="header-utilities">
            <IconButton
              icon={Search}
              label="Search NoorHub"
              size={18}
              onClick={() => navigate("/search")}
            />

            <button
              type="button"
              className="prayer-chip"
              onClick={() => navigate("/prayer")}
            >
              <span className="prayer-chip__dot" aria-hidden="true" />
              <span className="prayer-chip__label">{nextLabel}</span>
              <span className="prayer-chip__count numeric">
                {formattedTimes[next.key]} · in {countdown}
              </span>
              <span className="sr-only">
                {next.tomorrow ? "Tomorrow" : "Today"} in {profile.label}. Open
                prayer times.
              </span>
            </button>

            <IconButton
              icon={appearance === "dark" ? Sun : Moon}
              label={
                appearance === "dark"
                  ? "Switch to light appearance"
                  : "Switch to dark reading appearance"
              }
              size={18}
              onClick={cycleDarkMode}
            />

            {position?.name ? (
              <button
                type="button"
                className="btn btn--quiet btn--sm reader-resume-link"
                onClick={() =>
                  navigate(
                    position.kind === "surah"
                      ? `/quran?surah=${position.id}&ayah=${position.ayah ?? 1}`
                      : "/quran",
                  )
                }
              >
                Continue {position.name}
              </button>
            ) : null}

            <AccountMenu />

            <IconButton
              icon={Menu}
              label="Open navigation menu"
              size={20}
              className="mobile-menu-button"
              onClick={() => setNavOpen(true)}
            />
          </div>
        </div>
      </header>

      <main className="app-shell__main" id="main-content">
        {children}
      </main>

      <Footer />

      <BottomNav />

      <Sheet
        open={navOpen}
        onClose={() => setNavOpen(false)}
        title="Browse NoorHub"
        variant="drawer"
      >
        <DrawerNav onNavigate={() => setNavOpen(false)} />

        <div className="drawer__foot">
          <AccountMenu onNavigate={() => setNavOpen(false)} />
        </div>
      </Sheet>
    </div>
  );
}

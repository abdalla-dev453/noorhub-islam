import { BookOpen, CalendarCheck, Compass, GraduationCap, House, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { MOBILE_NAV } from "../data/defaults";

const ICONS = {
  home: House,
  quran: BookOpen,
  daily: CalendarCheck,
  learn: GraduationCap,
  profile: User,
};

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Quick navigation">
      {MOBILE_NAV.map((item) => {
        const Icon = ICONS[item.icon] ?? Compass;
        return (
          <NavLink key={item.to} to={item.to} className="bottom-nav__link" end={item.to === "/"}>
            <Icon size={19} aria-hidden="true" className="bottom-nav__icon" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}

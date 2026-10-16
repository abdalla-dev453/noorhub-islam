import {
  BookMarked,
  Calculator,
  GraduationCap,
  BookOpenText,
  Compass,
  ScrollText,
} from "lucide-react";
import { Link } from "react-router-dom";

const DESTINATIONS = [
  {
    title: "Quran reader",
    description:
      "Uthmani Arabic with the Sahih International translation, verse audio from five reciters, bookmarks and private notes.",
    to: "/quran",
    icon: BookOpenText,
  },
  {
    title: "Hifz studio",
    description:
      "A calm memorisation plan: today’s new portion, spaced review, and a record of completed sessions.",
    to: "/hifz",
    icon: BookMarked,
  },
  {
    title: "Prayer and Qibla",
    description:
      "Times calculated on this device for your location and convention, with the Qibla bearing in degrees.",
    to: "/prayer",
    icon: Compass,
  },
  {
    title: "Hadith library",
    description:
      "Three English collections, searchable, with the source named for every narration. Grading and chains are not included yet.",
    to: "/hadith",
    icon: ScrollText,
  },
  {
    title: "Zakat calculator",
    description:
      "Enter your zakatable assets, choose the nisab standard, and review the estimate before it is calculated.",
    to: "/zakat",
    icon: Calculator,
  },
  {
    title: "Islamic learning",
    description:
      "Courses in aqeedah, fiqh, seerah and tajweed with lesson-level progress you can pick up again.",
    to: "/learn",
    icon: GraduationCap,
  },
];

/**
 * "Explore with intention" — an editorial index of destinations rather than a
 * grid of identical feature cards.
 */
export default function ExploreIndex() {
  return (
    <section aria-labelledby="explore-heading">
      <header className="section-header">
        <div>
          <span className="section-header__eyebrow label">Explore with intention</span>
          <h2 className="section-header__title" id="explore-heading">
            Every part of NoorHub
          </h2>
          <p className="section-header__desc">
            Six destinations. Each one opens on the tool itself, not on an
            explanation of it.
          </p>
        </div>
      </header>

      <div className="explore-list">
        {DESTINATIONS.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to} className="explore-row">
              <span className="explore-row__index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="explore-row__icon">
                <Icon size={19} aria-hidden="true" />
              </span>
              <span>
                <span className="explore-row__title">{item.title}</span>
                <span className="explore-row__desc">{item.description}</span>
              </span>
              <span className="explore-row__action">
                Open
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

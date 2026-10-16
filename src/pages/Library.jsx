import { BookOpenText, Bookmark, Calculator, Library as LibraryIcon, ScrollText } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeader from "../components/ui/SectionHeader";
import Notice from "../components/ui/Notice";
import { useReadingProfile } from "../hooks/useReadingProfile";

const SECTIONS = [
  {
    title: "Hadith collections",
    to: "/hadith",
    icon: ScrollText,
    description:
      "Sahih al-Bukhari, Sahih Muslim and Sunan Abi Dawud in English, searchable narration by narration, with the source named on every entry.",
    meta: "3 collections · grading and narrator chains not yet included",
  },
  {
    title: "Zakat calculator",
    to: "/zakat",
    icon: Calculator,
    description:
      "Enter your zakatable assets, choose the gold or silver nisab, and review the estimate before it is calculated. Nothing leaves this browser.",
    meta: "Private estimate · not a religious ruling",
  },
  {
    title: "Saved items",
    to: "/search",
    icon: Bookmark,
    description:
      "Your bookmarked ayat, private notes and saved duas, all searchable in one place.",
    meta: "Stored on this device",
  },
];

export default function Library() {
  const { bookmarked, notes } = useReadingProfile();

  return (
    <div className="page">
      <div className="container container--narrow">
        <header className="page-head">
          <span className="page-head__eyebrow">Library</span>
          <h1 className="page-head__title">Reference and saved items</h1>
          <div className="page-head__meta">
            <span>{bookmarked} bookmarked ayat</span>
            <span aria-hidden="true">·</span>
            <span>{notes} private notes</span>
          </div>
          <p className="page__lede">
            The library holds the reference material you return to: the Hadith
            collections, the Zakat calculator, and everything you have saved
            while reading.
          </p>
        </header>

        <section aria-labelledby="library-sections">
          <SectionHeader
            eyebrow="Sections"
            title="What is in the library"
            description="Each section opens directly on its tool."
          />

          <div className="collection-list">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <Link key={section.to} to={section.to} className="card card--interactive">
                  <span className="explore-row__icon">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <h3 className="card__title library-card__title">
                    {section.title}
                  </h3>
                  <p className="meta library-card__meta">{section.meta}</p>
                  <p className="library-card__desc">{section.description}</p>
                  <span className="section-header__action">
                    Open
                    <span aria-hidden="true">→</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="sources-heading">
          <SectionHeader
            eyebrow="Sources"
            title="What this content is, and what it is not"
          />
          <div className="stack library-notices">
            <Notice tone="sand">
              <BookOpenText size={16} className="notice__icon" aria-hidden="true" />
              Quran text and audio come from AlQuran Cloud: the Uthmani Arabic
              edition, the Sahih International translation, and verse audio from
              five reciters.
            </Notice>
            <Notice tone="sand">
              <LibraryIcon size={16} className="notice__icon" aria-hidden="true" />
              Hadith text comes from the fawazahmed0 hadith-api editions. Grading,
              narrator chains and tafsir are not yet included, and licensing and
              content review are still being verified.
            </Notice>
            <Notice tone="sand">
              <p>
                Nothing in the library is generated or summarised by a machine.
                Where a translation or a narration is shown, it is shown as the
                source provides it.
              </p>
            </Notice>
          </div>
        </section>
      </div>
    </div>
  );
}

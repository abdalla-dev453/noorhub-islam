import { BookOpen, CheckCircle, Clock, Gift, Heart, Palette, Share2 } from "lucide-react";
import { useState } from "react";
import Card from "../components/ui/Card";
import Notice from "../components/ui/Notice";
import SectionHeader from "../components/ui/SectionHeader";

const STORIES = [
  {
    title: "The Prophet and the Date ( ﷺ )",
    age: "3-6 yrs",
    moral: "Generosity",
    summary: "A poor family shares their last dates with a guest. The Prophet's kindness turns a small gift into lasting barakah.",
  },
  {
    title: "The Boy and the Dates ( ﷺ )",
    age: "4-7 yrs",
    moral: "Kindness",
    summary: "The Prophet teaches that smiling at a brother is charity, even with half a date.",
  },
  {
    title: "The Spider and the Cave ( ﷺ )",
    age: "5-8 yrs",
    moral: "Trust in Allah",
    summary: "Young Hassan learns that the smallest creature can be a great helper when you have Tawakkul.",
  },
  {
    title: "The Generous Farmer ( ﷺ )",
    age: "6-9 yrs",
    moral: "Sadaqah",
    summary: "A farmer plants extra date palms so the poor always have fruit. He teaches that planting is a form of charity.",
  },
];

const LETTERS = "اب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي".split(" ");
const SHORT_SURAHS = [
  { id: 109, name: "الكوثر", meaning: "Al-Kawthar" },
  { id: 112, name: "الإخلاص", meaning: "Al-Ikhlas" },
  { id: 113, name: "الفلق", meaning: "Al-Falaq" },
  { id: 114, name: "الناس", meaning: "An-Nas" },
];

const DUAS = [
  {
    label: "Bedtime dua",
    arabic: "اللَّهُمَّ رَبَّ السَّمَوَاتِ السَّبْعِ وَرَبَّ الْأَرْضِ الْخَمْسِ، رَبَّنَا وَإِلَيْكَ الْمَصِيرُ",
    meaning: "O Lord of the seven heavens and the five earths, our Lord, to You we return.",
  },
  {
    label: "Going out",
    arabic: "بِسْمِ اللَّهِ وَعَلَىٰ سُنَّةِ رَسُولِ اللَّهِ صَلَّىٰ عَلَيْهِ وَسَلَّمَ",
    meaning: "In the name of Allah, following the Sunnah of the Messenger of Allah.",
  },
];

export default function Kids() {
  const [tab, setTab] = useState("learn");
  const [selectedLetter, setSelectedLetter] = useState(LETTERS[0]);
  const [completed, setCompleted] = useState(new Set());

  const toggleComplete = (id) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="page">
      <div className="container container--narrow">
        <header className="page-head">
          <span className="page-head__eyebrow">Kids zone</span>
          <h1 className="page-head__title">Little learners</h1>
          <p className="page__lede">
            Child-safe: no external links, no comments, and every word is
            cited. Designed with parents and teachers in mind.
          </p>
        </header>

        <Notice tone="sand">
          <Gift size={17} className="notice__icon" aria-hidden="true" />
          Parent dashboard: create child profiles, set daily goals, and view
          progress from the Settings page.
        </Notice>

        <div className="tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "learn"}
            className={`tabs__tab ${tab === "learn" ? "is-active" : ""}`}
            onClick={() => setTab("learn")}
          >
            <Palette size={16} aria-hidden="true" />
            Learn & play
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "memorize"}
            className={`tabs__tab ${tab === "memorize" ? "is-active" : ""}`}
            onClick={() => setTab("memorize")}
          >
            <BookOpen size={16} aria-hidden="true" />
            Short surahs
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "dhikr"}
            className={`tabs__tab ${tab === "dhikr" ? "is-active" : ""}`}
            onClick={() => setTab("dhikr")}
          >
            <Heart size={16} aria-hidden="true" />
            Duas
          </button>
        </div>

        {tab === "learn" && (
          <>
            <SectionHeader title="Arabic alphabet" description="Tap a letter to highlight it." />
            <div className="cluster" style={{ flexWrap: "wrap", gap: "var(--space-2)" }}>
              {LETTERS.map((letter) => (
                <button
                  key={letter}
                  type="button"
                  className="badge badge--interactive"
                  onClick={() => setSelectedLetter(letter)}
                  style={{
                    fontSize: "1.75rem",
                    fontFamily: "var(--font-arabic)",
                    padding: "var(--space-3) var(--space-4)",
                    ...(selectedLetter === letter
                      ? {
                          background: "var(--accent-soft)",
                          color: "var(--green-ink)",
                        }
                      : {}),
                  }}
                >
                  {letter}
                </button>
              ))}
            </div>

            <SectionHeader title="Prophet stories" eyebrow="Stories" />
            <div className="collection-list">
              {STORIES.map((s) => (
                <Card key={s.title} tone="quiet">
                  <div className="cluster">
                    <Gift size={20} className="text-accent shrink-0" />
                    <div>
                      <h3 className="card__title">{s.title}</h3>
                      <p className="meta">
                        {s.age} · Moral: {s.moral}
                      </p>
                      <p className="meta">{s.summary}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {tab === "memorize" && (
          <>
            <SectionHeader title="Short surahs" description="Start with Surah Al-Kawthar." />
            <div className="collection-list">
              {SHORT_SURAHS.map((s) => (
                <Card
                  key={s.id}
                  tone="quiet"
                  onClick={() => toggleComplete(s.id + "-mem")}
                  selected={completed.has(s.id + "-mem")}
                >
                  <div className="cluster">
                    <CheckCircle
                      size={20}
                      className={
                        completed.has(s.id + "-mem")
                          ? "text-accent"
                          : "text-text-3"
                      }
                    />
                    <div>
                      <h3 className="card__title" lang="ar" dir="rtl">
                        {s.name}
                      </h3>
                      <p className="meta">{s.meaning}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {tab === "dhikr" && (
          <>
            <SectionHeader title="Daily duas" />
            <div className="collection-list">
              {DUAS.map((d) => (
                <Card key={d.label} tone="quiet">
                  <p className="label">{d.label}</p>
                  <p className="arabic-text" lang="ar" dir="rtl">
                    {d.arabic}
                  </p>
                  <p className="meta">{d.meaning}</p>
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    onClick={() => navigator.share
                      ? navigator.share({ title: d.label, text: d.meaning })
                      : null}
                  >
                    <Share2 size={14} />
                    Share
                  </button>
                </Card>
              ))}
            </div>
          </>
        )}

        <div className="dashboard-section">
          <div className="cluster">
            <Clock size={16} className="text-accent" />
            <span className="meta">
              {completed.size} of 7 stories completed today
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

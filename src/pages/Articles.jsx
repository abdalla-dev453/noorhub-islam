import { Calendar, Tag, User } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Notice from "../components/ui/Notice";
import SectionHeader from "../components/ui/SectionHeader";

const CATEGORIES = ["All", "Friday Reflections", "Seerah", "Practical Guidance", "Scholar Interviews", "Ramadan"];

const ARTICLES = [
  {
    id: "friday-reflection-1",
    title: "Patience in Hardship: What the Quran Teaches",
    excerpt:
      "When trials come, the immediate instinct is to question. But the Quran frames hardship as a doorway — not a dead end — to deeper reliance on Allah.",
    author: "Dr. Yasir Qadhi",
    date: "2026-10-10",
    category: "Friday Reflections",
    readTime: 7,
    featured: true,
  },
  {
    id: "seerah-1",
    title: "The Night of Power: Finding Laylat al-Qadr in the Last Ten",
    excerpt:
      "The Messenger of Allah (peace be upon him) used to strive hard in Ramadan and encourage others, without announcing it, so as not to cause hardship.",
    author: "Ustadh Omar Suleiman",
    date: "2026-10-08",
    category: "Ramadan",
    readTime: 12,
  },
  {
    id: "practical-1",
    title: "Establishing a Consistent Quran Reading Habit",
    excerpt:
      "Small, scheduled steps beat ambitious bursts. Here is how to read a juz' a week without burning out.",
    author: "Fatima R.",
    date: "2026-09-22",
    category: "Practical Guidance",
    readTime: 5,
  },
  {
    id: "interview-1",
    title: "On Preserving the Deen: An Interview with Shaykh Belal Assaad",
    excerpt:
      "We spoke with Shaykh Belal about teaching the next generation, the role of tajweed in reflection, and maintaining sincerity.",
    author: "NoorHub Editorial",
    date: "2026-09-18",
    category: "Scholar Interviews",
    readTime: 18,
  },
];

export default function Articles() {
  return (
    <div className="page">
      <div className="container container--reading">
        <header className="page-head">
          <span className="page-head__eyebrow">Editorial</span>
          <h1 className="page-head__title">Articles & reflections</h1>
          <p className="page__lede">
            Weekly Friday reflections, seasonal guides, and scholar interviews —
            all sourced and reviewed.
          </p>
        </header>

        <div className="cluster" style={{ flexWrap: "wrap", gap: "var(--space-2)" }}>
          {CATEGORIES.map((cat) => (
            <button key={cat} type="button" className="tag">
              {cat}
            </button>
          ))}
        </div>

        <section aria-labelledby="featured-heading">
          <SectionHeader eyebrow="Featured" title="This week" />
          {ARTICLES.filter((a) => a.featured).map((article) => (
            <Link
              key={article.id}
              to={`/articles/${article.id}`}
              className="card card--interactive"
            >
              <div className="cluster">
                <div style={{ flex: 1 }}>
                  <span className="badge badge--accent">{article.category}</span>
                  <h2 className="card__title">{article.title}</h2>
                  <p className="meta">{article.excerpt}</p>
                  <div className="cluster gap-sm" style={{ marginTop: "var(--space-3)" }}>
                    <span className="cluster gap-xs meta">
                      <User size={13} />
                      {article.author}
                    </span>
                    <span className="cluster gap-xs meta">
                      <Calendar size={13} />
                      {article.date}
                    </span>
                    <span className="cluster gap-xs meta">
                      <Tag size={13} />
                      {article.readTime} min read
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="dashboard-section" aria-labelledby="all-heading">
          <SectionHeader eyebrow="All articles" title="From the archive" />
          <div className="collection-list">
            {ARTICLES.filter((a) => !a.featured).map((article) => (
              <Card key={article.id} tone="quiet" to={`/articles/${article.id}`}>
                <div className="cluster justify-between">
                  <div style={{ flex: 1 }}>
                    <h3 className="card__title">{article.title}</h3>
                    <p className="meta">{article.excerpt}</p>
                    <div className="cluster gap-sm">
                      <span className="meta">{article.author}</span>
                      <span className="meta">{article.readTime} min</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <Notice tone="sand">
          <Calendar size={16} className="notice__icon" aria-hidden="true" />
          New articles every Friday. Subscribe to the weekly digest in Settings
          to receive reflections by email.
        </Notice>
      </div>
    </div>
  );
}

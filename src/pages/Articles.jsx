import { Calendar, Tag, User } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
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
    body: [
      "Hardship can make it difficult to see beyond the moment we are living through. The Quran acknowledges that pain while teaching believers to keep turning to Allah for help and steadiness.",
      "Allah tells us that with hardship comes ease (Quran 94:5–6). This does not promise that every difficulty disappears at once. It reminds us that hardship is not the whole story, and that patience includes asking for help, taking practical steps, and continuing to do what is right.",
      "A small, steady act of worship can help make that trust tangible: a prayer, a short passage of Quran, or a sincere conversation with someone you trust. Patience is active hope, practiced one step at a time.",
    ],
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
    body: ["Laylat al-Qadr is a night of worship and remembrance in Ramadan. The Prophet ﷺ encouraged seeking it during the last ten nights, and his example was to increase devotion during this time.", "Families can make a simple plan: protect time for prayer, read Quran at a manageable pace, and make personal dua. No single schedule fits everyone; consistency and sincerity matter more than exhausting ourselves.", "The Quran describes the night as better than a thousand months (97:3). Its value invites us to seek Allah's mercy through worship and kindness, while caring for our responsibilities and health."],
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
    body: ["A Quran habit is easier to sustain when it fits into a real day. Choose a regular time and a small amount you can keep, even when the week becomes busy.", "Try reading a few pages after a prayer, or divide a weekly goal into short daily sessions. Keep your place with a bookmark and note one question or reflection, rather than trying to study everything at once.", "If you miss a day, return to the habit without trying to make up everything at once. A steady practice gives you room to read, understand, and reflect."],
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
    body: ["In this editorial interview, Shaykh Belal Assaad reflects on teaching faith to the next generation, the role of tajweed in careful recitation, and the importance of renewing one's intention.", "He emphasizes making learning welcoming and building strong foundations through patient practice. Families and teachers can support young learners by listening attentively, celebrating effort, and giving children room to ask questions.", "The conversation also returns to sincerity: knowledge is most beneficial when it shapes our character and the way we treat the people around us."],
  },
];

export default function Articles() {
  const { articleId } = useParams();
  const selectedArticle = ARTICLES.find((article) => article.id === articleId);
  const [activeCategory, setActiveCategory] = useState("All");
  if (articleId) {
    if (!selectedArticle) return <div className="page"><div className="container container--reading"><h1>Article not found</h1><Link to="/articles">Back to articles</Link></div></div>;
    return <div className="page"><article className="container container--reading article-detail"><Link to="/articles" className="btn btn--quiet btn--sm">← All articles</Link><header className="page-head"><span className="page-head__eyebrow">{selectedArticle.category}</span><h1 className="page-head__title">{selectedArticle.title}</h1><div className="page-head__meta"><span>{selectedArticle.author}</span><span>{selectedArticle.date}</span><span>{selectedArticle.readTime} min read</span></div><p className="page__lede">{selectedArticle.excerpt}</p></header><div className="article-body">{selectedArticle.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></article></div>;
  }
  const visibleArticles = ARTICLES.filter((article) => activeCategory === "All" || article.category === activeCategory);
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
            <button key={cat} type="button" className={`tag ${activeCategory === cat ? "is-active" : ""}`} aria-pressed={activeCategory === cat} onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        <section aria-labelledby="featured-heading">
          <SectionHeader eyebrow="Featured" title="This week" />
          {visibleArticles.filter((a) => a.featured).map((article) => (
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
            {visibleArticles.filter((a) => !a.featured).map((article) => (
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

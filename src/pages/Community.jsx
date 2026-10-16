import { MessageCircle, Plus, Users, BookOpen, Heart } from "lucide-react";
import Card from "../components/ui/Card";
import Notice from "../components/ui/Notice";
import SectionHeader from "../components/ui/SectionHeader";

const GROUPS = [
  {
    id: "quran-hifz",
    title: "Quran & Hifz Circle",
    members: 342,
    topic: "Daily Quran reading + Hifz review accountability.",
    active: true,
  },
  {
    id: "beginners",
    title: "New Muslims Support",
    members: 128,
    topic: "Questions about basics of Islam, prayer, and daily practice.",
    active: false,
  },
  {
    id: "tajweed",
    title: "Tajweed Study Group",
    members: 89,
    topic: "Share recitation tips and practice together weekly.",
    active: false,
  },
];

const POSTS = [
  {
    id: 1,
    author: "Amina M.",
    avatar: "أ",
    content:
      "Started a group khatm of the Quran with my family this week. Any tips for keeping consistent daily?",
    likes: 24,
    replies: 8,
    time: "2 hours ago",
  },
  {
    id: 2,
    author: "Yusuf A.",
    avatar: "ي",
    content:
      "Completed Juz' Amma in Hifz this month. The spaced repetition tool really helped. BarakAllahu feek!",
    likes: 41,
    replies: 12,
    time: "5 hours ago",
  },
];

export default function Community() {
  return (
    <div className="page">
      <div className="container">
        <header className="page-head">
          <span className="page-head__eyebrow">Community</span>
          <h1 className="page-head__title">Study circles</h1>
          <div className="page-head__meta">
            <span>Guided by strict community guidelines</span>
          </div>
          <p className="page__lede">
            Join reading groups, share khatm progress, and learn together under
            clear rules that forbid sectarian debate and unverified rulings.
          </p>
        </header>

        <Notice tone="sand">
          <MessageCircle size={17} className="notice__icon" aria-hidden="true" />
          No fatwa battles. No sectarian attacks. All posts are moderated. Report
          any content that violates our community guidelines.
        </Notice>

        <section className="dashboard-section" aria-labelledby="groups-heading">
          <SectionHeader
            eyebrow="Active circles"
            title="Your groups"
            action={{ to: "/community", label: "Create new" }}
          />
          <div className="cluster">
            <button type="button" className="btn btn--primary btn--sm">
              <Plus size={16} aria-hidden="true" />
              New study circle
            </button>
          </div>
          <div className="collection-list">
            {GROUPS.map((group) => (
              <Card
                key={group.id}
                tone="quiet"
                to={`/community?group=${group.id}`}
              >
                <div className="cluster">
                  <Users size={20} className="text-accent shrink-0" />
                  <div style={{ flex: 1 }}>
                    <h3 className="card__title">{group.title}</h3>
                    <p className="meta">{group.topic}</p>
                    <div className="cluster gap-xs">
                      <span className="badge">
                        <Users size={12} />
                        {group.members} members
                      </span>
                      {group.active && (
                        <span className="badge badge--accent">Active today</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="dashboard-section" aria-labelledby="feed-heading">
          <SectionHeader eyebrow="Community feed" title="Recent activity" />
          <div className="stack" style={{ gap: "var(--space-3)" }}>
            {POSTS.map((post) => (
              <Card key={post.id} tone="quiet">
                <div className="cluster gap-sm">
                  <div
                    className="avatar"
                    style={{
                      background: "var(--accent-soft)",
                      color: "var(--green-ink)",
                      width: "2.25rem",
                      height: "2.25rem",
                    }}
                  >
                    {post.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="cluster justify-between">
                      <span className="font-bold">{post.author}</span>
                      <span className="meta">{post.time}</span>
                    </div>
                    <p className="meta">{post.content}</p>
                    <div className="cluster gap-sm">
                      <span className="meta">
                        <Heart size={14} />
                        {post.likes}
                      </span>
                      <span className="meta">
                        <MessageCircle size={14} />
                        {post.replies} replies
                      </span>
                      <button type="button" className="btn btn--quiet btn--sm">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <Card tone="quiet">
            <BookOpen size={18} className="notice__icon" aria-hidden="true" />
            <p className="meta">
              Mosque pages, event calendars, and shared khatm tracking are
              coming soon. For now, create a study circle to begin.
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
}

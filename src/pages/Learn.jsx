import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Cloud,
  GraduationCap,
  Play,
  Radio,
  Search,
  Sparkles,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import TrackCard from "../components/ui/TrackCard";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../context/ProgressContext";
import { api } from "../utils/api";
import { getVideoSourceConfig } from "../utils/video";

const FILTER_TAGS = [
  "All Pathways",
  "Theology",
  "Jurisprudence",
  "History",
  "Recitation",
];

const SCHOLARS = [
  "All Scholars",
  "Sheikh Omar Suleiman",
  "Dr. Yasir Qadhi",
  "Ustadh Nouman Ali Khan",
  "Sheikh Belal Assaad",
  "Mufti Menk",
  "Dr. Shadee Elmasry",
];

export default function Learn() {
  const { tracks, enrollInTrack, toggleLessonStatus } = useProgress();
  const { isAuthenticated } = useAuth();
  
  // Navigation tabs: 'curriculum' | 'live-feed'
  const [activeTab, setActiveTab] = useState("curriculum");
  const [activeCategory, setActiveCategory] = useState("All Pathways");
  const [selectedScholar, setSelectedScholar] = useState("All Scholars");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Ongoing & Recent Lessons from external API
  const [liveLessons, setLiveLessons] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(false);

  // Active Lesson State (from track or live stream)
  // { type: 'track', trackId, lessonId } or { type: 'live', lesson: {...} }
  const [activeLesson, setActiveLesson] = useState(null);
  const [playerTab, setPlayerTab] = useState("overview"); // 'overview' | 'notes' | 'curriculum'
  const [showCelebration, setShowCelebration] = useState(false);

  // Fetch Ongoing / Recent Lessons
  useEffect(() => {
    let isMounted = true;
    setLoadingFeed(true);
    api.getRecentAndOngoingLessons({
      category: activeCategory,
      speaker: selectedScholar,
    })
      .then((data) => {
        if (isMounted) setLiveLessons(data);
      })
      .catch(() => {
        if (isMounted) setLiveLessons([]);
      })
      .finally(() => {
        if (isMounted) setLoadingFeed(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeCategory, selectedScholar]);

  const enrolledCount = tracks.filter((t) => t.isEnrolled).length;
  const totalModules = tracks.reduce(
    (acc, curr) => acc + curr.syllabus.length,
    0,
  );

  const filteredTracks = tracks.filter((track) => {
    const matchesCategory =
      activeCategory === "All Pathways" ||
      track.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredLiveLessons = liveLessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Handle lesson completion with celebration animation
  const handleToggleComplete = (trackId, lessonId, currentStatus) => {
    toggleLessonStatus(trackId, lessonId);
    if (!currentStatus) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RENDER: ACTIVE LESSON CINEMA THEATER VIEW
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (activeLesson) {
    let title;
    let trackTitle;
    let instructor;
    let institution;
    let duration;
    let videoUrl;
    let overview;
    let keyPoints;
    let isCompleted;
    let currentTrack = null;
    let nextLessonId = null;
    let prevLessonId = null;

    if (activeLesson.type === "track") {
      currentTrack = tracks.find((t) => t.id === activeLesson.trackId);
      const sIndex = currentTrack?.syllabus.findIndex(
        (l) => l.id === activeLesson.lessonId,
      );
      const currentLessonObj = currentTrack?.syllabus[sIndex];

      title = currentLessonObj?.title;
      trackTitle = currentTrack?.title;
      instructor = currentLessonObj?.instructor || currentTrack?.instructor;
      institution = currentLessonObj?.institution || "NoorHub Academy";
      duration = currentLessonObj?.duration || "30 mins";
      videoUrl = currentLessonObj?.videoUrl;
      overview = currentLessonObj?.overview || "Follow along with this structured module. Review primary evidence and principles.";
      keyPoints = currentLessonObj?.keyPoints || [
        "Core theological and practical definitions",
        "Contextual proofs from Quran and Sunnah",
        "Practical implementation in daily worship"
      ];
      isCompleted = !!currentLessonObj?.completed;

      if (sIndex > 0) prevLessonId = currentTrack?.syllabus[sIndex - 1]?.id;
      if (sIndex < (currentTrack?.syllabus.length || 0) - 1) nextLessonId = currentTrack?.syllabus[sIndex + 1]?.id;
    } else {
      // Live / recent feed item
      const item = activeLesson.lesson;
      title = item.title;
      trackTitle = item.category;
      instructor = item.speaker;
      institution = item.institution;
      duration = item.duration;
      videoUrl = item.videoUrl;
      overview = item.description;
      keyPoints = item.keyPoints || [];
      isCompleted = false;
    }

    const videoConfig = getVideoSourceConfig(videoUrl);

    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-16">
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveLesson(null)}
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-[var(--accent)] hover:text-teal-300 transition-colors group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            Back to Academy Catalogue
          </button>

          {activeLesson.type === "track" && (
            <div className="flex items-center gap-2">
              {prevLessonId && (
                <button
                  onClick={() => setActiveLesson({ type: "track", trackId: activeLesson.trackId, lessonId: prevLessonId })}
                  className="btn btn-secondary text-xs py-1.5 px-3 font-mono"
                >
                  <ArrowLeft size={13} />
                  Previous Module
                </button>
              )}
              {nextLessonId && (
                <button
                  onClick={() => setActiveLesson({ type: "track", trackId: activeLesson.trackId, lessonId: nextLessonId })}
                  className="btn btn-primary text-xs py-1.5 px-3 font-mono"
                >
                  Next Module
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Video Cinema Card */}
        <div className="noor-card p-4 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden">
          {/* Subtle glowing cinema backdrop */}
          <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[radial-gradient(ellipse,rgba(20,184,166,0.25)_0%,transparent_70%)] blur-3xl" />

          {/* Header Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="label-badge text-[11px] py-0.5">
                  {trackTitle}
                </span>
                {instructor && (
                  <span className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-1">
                    <User size={12} className="text-[var(--accent)]" />
                    {instructor} • {institution}
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                {title}
              </h1>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] bg-[var(--surface)] px-3 py-1.5 rounded-lg border border-[var(--border)]">
              <Clock size={13} className="text-[var(--accent)]" />
              <span>{duration}</span>
            </div>
          </div>

          {/* Embedded Cinema Player */}
          <div className="rounded-2xl border border-teal-500/30 bg-black overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.6)] relative group">
            {videoConfig?.type === "youtube" ? (
              <iframe
                key={title}
                className="aspect-video w-full"
                src={videoConfig.embedUrl}
                title={`Islamic lecture: ${title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                key={title}
                className="aspect-video w-full"
                controls
                preload="metadata"
                playsInline
                aria-label={`Interactive video for ${title}`}
              >
                <source src={videoConfig?.src} type="video/mp4" />
                Your browser does not support embedded video playback.
              </video>
            )}
          </div>

          {/* Completion Celebration Banner */}
          {showCelebration && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-teal-500/20 via-emerald-500/20 to-teal-500/20 border border-teal-500/40 flex items-center justify-center gap-2 text-sm font-semibold text-teal-300 animate-fadeIn">
              <Sparkles size={16} className="text-amber-400 animate-spin" />
              <span>BarakAllahu Feek! Lesson marked as completed. Progress updated.</span>
            </div>
          )}

          {/* Tabs Navigation for Lesson Player */}
          <div className="flex items-center gap-2 border-b border-[var(--border)] pt-2">
            <button
              onClick={() => setPlayerTab("overview")}
              className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
                playerTab === "overview"
                  ? "border-[var(--accent)] text-[var(--accent)] bg-teal-500/10"
                  : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Lesson Overview & Takeaways
            </button>
            <button
              onClick={() => setPlayerTab("notes")}
              className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
                playerTab === "notes"
                  ? "border-[var(--accent)] text-[var(--accent)] bg-teal-500/10"
                  : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Study Notes & Key Points ({keyPoints.length})
            </button>
            {activeLesson.type === "track" && (
              <button
                onClick={() => setPlayerTab("curriculum")}
                className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
                  playerTab === "curriculum"
                    ? "border-[var(--accent)] text-[var(--accent)] bg-teal-500/10"
                    : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Track Syllabus ({currentTrack?.syllabus.length} modules)
              </button>
            )}
          </div>

          {/* Tab Content: Overview */}
          {playerTab === "overview" && (
            <div className="space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed animate-fadeIn">
              <p className="text-base text-[var(--text-primary)] font-medium">
                {overview}
              </p>
              
              {keyPoints.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
                    Primary Objectives Covered:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs">
                        <CheckCircle2 size={14} className="text-[var(--accent)] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Tab Content: Study Notes */}
          {playerTab === "notes" && (
            <div className="space-y-3 animate-fadeIn">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
                Key Educational Takeaways:
              </h4>
              <div className="space-y-2">
                {keyPoints.map((point, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-teal-500/10 text-[var(--accent)] font-mono text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content: Full Track Syllabus */}
          {playerTab === "curriculum" && currentTrack && (
            <div className="space-y-2 animate-fadeIn">
              {currentTrack.syllabus.map((l, idx) => {
                const isSelected = l.id === activeLesson.lessonId;
                return (
                  <div
                    key={l.id}
                    onClick={() => setActiveLesson({ type: "track", trackId: currentTrack.id, lessonId: l.id })}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-teal-500/15 border-teal-500/50 text-[var(--text-primary)]"
                        : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-teal-500/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {l.completed ? (
                        <CheckCircle2 size={16} className="text-[var(--accent)] shrink-0" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-[var(--border)] shrink-0" />
                      )}
                      <div>
                        <p className="text-xs font-semibold">
                          {idx + 1}. {l.title}
                        </p>
                        <p className="text-[11px] font-mono text-[var(--text-muted)]">
                          {l.duration || "30 mins"} • {l.instructor || currentTrack.instructor}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-mono text-[var(--accent)] flex items-center gap-1">
                      {isSelected ? "Now Playing" : "Switch Module"}
                      <ArrowRight size={12} />
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Action Bar */}
          {activeLesson.type === "track" && (
            <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-2">
                {isCompleted ? (
                  <>
                    <CheckCircle2 size={16} className="text-[var(--accent)]" />
                    <span className="text-[var(--accent)] font-bold">Module Completed</span>
                  </>
                ) : (
                  <>
                    <Clock size={16} className="text-amber-400" />
                    <span>In Progress</span>
                  </>
                )}
              </div>

              <button
                onClick={() =>
                  handleToggleComplete(activeLesson.trackId, activeLesson.lessonId, isCompleted)
                }
                className={`btn text-xs py-2.5 px-6 font-semibold shadow-md ${
                  isCompleted ? "btn-secondary" : "btn-primary"
                }`}
              >
                {isCompleted ? (
                  "Mark as Incomplete"
                ) : (
                  <>
                    <CheckCircle2 size={15} />
                    Complete Module & Save
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RENDER: ACADEMY CATALOG & LIVE ONGOING LESSONS VIEW
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  return (
    <div className="space-y-10 pb-16">
      {/* Academy Hero Header */}
      <div className="text-center space-y-3.5 relative">
        <span className="label-badge">
          <GraduationCap size={13} />
          Islamic Academy & Knowledge Network
        </span>
        <h1 className="section-title">
          Explore Structured Tracks &
          <br />
          <span className="text-[var(--accent)]">Live Islamic Halaqat</span>
        </h1>
        <p className="section-sub">
          Step-by-step curricula and recent ongoing lectures by reputable scholars, curated for steady spiritual growth.
        </p>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <div className="noor-card p-5 flex items-center justify-between group hover-elevate">
          <div>
            <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
              Enrolled Tracks
            </p>
            <p className="text-2xl font-extrabold text-[var(--text-primary)] mt-1 font-mono">
              {enrolledCount} Tracks
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-transform">
            <GraduationCap size={24} />
          </div>
        </div>

        <div className="noor-card p-5 flex items-center justify-between group hover-elevate">
          <div>
            <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
              Structured Modules
            </p>
            <p className="text-2xl font-extrabold text-[var(--text-primary)] mt-1 font-mono">
              {totalModules} Modules
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-transform">
            <BookOpen size={24} />
          </div>
        </div>

        <div className="noor-card p-5 flex items-center justify-between group hover-elevate">
          <div>
            <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
              Sync Mode
            </p>
            <p className="text-2xl font-extrabold text-[var(--accent)] mt-1 font-mono">
              {isAuthenticated ? "Cloud Synced" : "Guest Mode"}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-transform">
            <Cloud size={24} />
          </div>
        </div>
      </div>

      {/* Segmented View Switcher: Curricula vs Live/Ongoing Feed */}
      <div className="flex justify-center max-w-md mx-auto">
        <div className="glass-panel p-1 rounded-xl flex w-full border border-[var(--border)]">
          <button
            onClick={() => setActiveTab("curriculum")}
            className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === "curriculum"
                ? "bg-[var(--accent)] text-slate-950 shadow-md"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <BookOpen size={14} />
            <span>Structured Tracks</span>
          </button>
          
          <button
            onClick={() => setActiveTab("live-feed")}
            className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === "live-feed"
                ? "bg-[var(--accent)] text-slate-950 shadow-md"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span>Live & Ongoing Streams</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {/* Search Input */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
            />
            <input
              type="text"
              placeholder={activeTab === "curriculum" ? "Search tracks by title or topic..." : "Search lectures, topics, or scholars..."}
              className="noor-input pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Scholar Filter dropdown for Live & Ongoing */}
          {activeTab === "live-feed" ? (
            <select
              value={selectedScholar}
              onChange={(e) => setSelectedScholar(e.target.value)}
              className="noor-input text-xs font-mono"
            >
              {SCHOLARS.map((sch) => (
                <option key={sch} value={sch} className="bg-[var(--surface)] text-[var(--text-primary)]">
                  {sch}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex items-center justify-end text-xs font-mono text-[var(--text-muted)] px-2">
              <span>Showing {filteredTracks.length} structured curricula</span>
            </div>
          )}
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
          {FILTER_TAGS.map((tag) => {
            const isSelected = activeCategory === tag;
            return (
              <button
                key={tag}
                onClick={() => setActiveCategory(tag)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                  isSelected
                    ? "bg-[var(--accent)] text-slate-950 font-bold shadow-[0_0_15px_rgba(20,184,166,0.35)] scale-105"
                    : "bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-teal-500/40 hover:text-[var(--text-primary)]"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TAB 1: STRUCTURED CURRICULA VIEW ───────────────────────────────── */}
      {activeTab === "curriculum" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto animate-fadeIn">
          {filteredTracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              onEnroll={enrollInTrack}
              onSelectLesson={(lessonId) =>
                setActiveLesson({ type: "track", trackId: track.id, lessonId })
              }
            />
          ))}
        </div>
      )}

      {/* ── TAB 2: LIVE & RECENT ONGOING LECTURES FEED ───────────────────────── */}
      {activeTab === "live-feed" && (
        <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)]">
              <Radio size={14} className="text-red-500 animate-pulse" />
              <span>Authentic Islamic Knowledge Streams ({filteredLiveLessons.length} available)</span>
            </div>
            <span className="text-xs font-mono text-[var(--accent)]">
              Verified Scholar Pipeline
            </span>
          </div>

          {loadingFeed ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono text-[var(--text-muted)]">Loading verified Islamic lecture streams...</p>
            </div>
          ) : filteredLiveLessons.length === 0 ? (
            <div className="noor-card p-12 text-center space-y-3">
              <p className="text-base text-[var(--text-secondary)]">No lectures found matching your criteria.</p>
              <button
                onClick={() => {
                  setActiveCategory("All Pathways");
                  setSelectedScholar("All Scholars");
                  setSearchQuery("");
                }}
                className="btn btn-secondary text-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLiveLessons.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveLesson({ type: "live", lesson: item })}
                  className="noor-card p-4 space-y-4 group cursor-pointer hover-elevate transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Thumbnail with overlay */}
                    <div className="relative rounded-xl overflow-hidden aspect-video bg-black/60 border border-[var(--border)] group-hover:border-teal-500/40 transition-colors">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Live or Status badge */}
                      <div className="absolute top-2.5 left-2.5">
                        {item.isLive ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500 text-white flex items-center gap-1.5 shadow-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            LIVE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/60 backdrop-blur-md text-teal-300 border border-teal-500/30">
                            {item.status}
                          </span>
                        )}
                      </div>

                      {/* Duration */}
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-white">
                        {item.duration}
                      </div>

                      {/* Play hover button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-teal-500/90 text-slate-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <Play size={20} fill="currentColor" />
                        </div>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                        <span className="text-[var(--accent)] font-bold">{item.category}</span>
                        <span>{item.viewers}</span>
                      </div>
                      <h3 className="font-bold text-sm text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] font-mono flex items-center gap-1">
                        <User size={12} className="text-[var(--accent)]" />
                        {item.speaker}
                      </p>
                    </div>
                  </div>

                  {/* Watch CTA */}
                  <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--accent)]">
                    <span>{item.institution}</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Watch Lecture
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

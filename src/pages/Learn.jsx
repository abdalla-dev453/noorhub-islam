import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  GraduationCap,
  Search,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import TrackCard from "../components/ui/TrackCard";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../context/ProgressContext";
import { api } from "../utils/api";
import { getVideoSourceConfig } from "../utils/video";
import { Badge, Tag } from "../components/ui/Badge";
import ProgressBar from "../components/ui/ProgressBar";
import Notice from "../components/ui/Notice";
import EmptyState from "../components/ui/EmptyState";
import { PageSkeleton } from "../components/ui/Skeleton";
import SectionHeader from "../components/ui/SectionHeader";

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
  "Dr. Shadee Elmasry",
];

export default function Learn() {
  const [searchParams] = useSearchParams();
  const { tracks, enrollInTrack, toggleLessonStatus } = useProgress();
  const { isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState("curriculum");
  const [activeCategory, setActiveCategory] = useState("All Pathways");
  const [selectedScholar, setSelectedScholar] = useState("All Scholars");
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("search") || "",
  );

  const [liveLessons, setLiveLessons] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(false);

  const [activeLesson, setActiveLesson] = useState(null);
  const [playerTab, setPlayerTab] = useState("overview");
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoadingFeed(true); // eslint-disable-line react-hooks/set-state-in-effect -- reset pending state for a new filter
    api
      .getRecentAndOngoingLessons({ category: activeCategory, speaker: selectedScholar })
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

  const enrolledCount = tracks.filter((track) => track.isEnrolled).length;
  const completedLessons = tracks.reduce(
    (total, track) => total + track.syllabus.filter((lesson) => lesson.completed).length,
    0,
  );
  const totalModules = tracks.reduce(
    (total, track) => total + track.syllabus.length,
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
    const term = searchQuery.toLowerCase();
    return (
      lesson.title.toLowerCase().includes(term) ||
      lesson.speaker.toLowerCase().includes(term) ||
      lesson.description.toLowerCase().includes(term)
    );
  });

  const handleToggleComplete = (trackId, lessonId, currentStatus) => {
    toggleLessonStatus(trackId, lessonId);
    if (!currentStatus) {
      setSavedNotice(true);
      window.setTimeout(() => setSavedNotice(false), 3200);
    }
  };

  /* ── Lesson view ──────────────────────────────────────────────────────── */
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
      currentTrack = tracks.find((track) => track.id === activeLesson.trackId);
      const index = currentTrack?.syllabus.findIndex(
        (lesson) => lesson.id === activeLesson.lessonId,
      );
      const lesson = currentTrack?.syllabus[index];

      title = lesson?.title;
      trackTitle = currentTrack?.title;
      instructor = lesson?.instructor || currentTrack?.instructor;
      institution = lesson?.institution || "NoorHub";
      duration = lesson?.duration || "30 mins";
      videoUrl = lesson?.videoUrl;
      overview =
        lesson?.overview || "Follow along with this module and review the key points.";
      keyPoints = lesson?.keyPoints || [];
      isCompleted = Boolean(lesson?.completed);

      if (index > 0) prevLessonId = currentTrack?.syllabus[index - 1]?.id;
      if (index < (currentTrack?.syllabus.length || 0) - 1) {
        nextLessonId = currentTrack?.syllabus[index + 1]?.id;
      }
    } else {
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
      <div className="page">
        <div className="container">
          <div className="lesson-nav">
            <button
              type="button"
              className="btn btn--quiet btn--sm"
              onClick={() => setActiveLesson(null)}
            >
              <ArrowLeft size={15} aria-hidden="true" />
              All courses
            </button>

            {activeLesson.type === "track" ? (
              <div className="cluster">
                {prevLessonId ? (
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    onClick={() =>
                      setActiveLesson({
                        type: "track",
                        trackId: activeLesson.trackId,
                        lessonId: prevLessonId,
                      })
                    }
                  >
                    Previous
                  </button>
                ) : null}
                {nextLessonId ? (
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    onClick={() =>
                      setActiveLesson({
                        type: "track",
                        trackId: activeLesson.trackId,
                        lessonId: nextLessonId,
                      })
                    }
                  >
                    Next
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="lesson-player">
            <article className="card">
              <header className="lesson-head">
                <div className="cluster">
                  <Badge tone="accent">{trackTitle}</Badge>
                  <span className="meta cluster">
                    <Clock size={13} aria-hidden="true" />
                    {duration}
                  </span>
                </div>
                <h1 className="lesson-head__title">{title}</h1>
                <p className="meta cluster">
                  <User size={13} aria-hidden="true" />
                  {instructor}
                  {institution ? ` · ${institution}` : ""}
                </p>
              </header>

              <div className="lesson-player__frame">
                {videoConfig?.type === "youtube" ? (
                  <iframe
                    key={title}
                    src={videoConfig.embedUrl}
                    title={`Lecture: ${title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video key={title} controls preload="metadata" playsInline>
                    <source src={videoConfig?.src} type="video/mp4" />
                    Your browser does not support embedded video playback.
                  </video>
                )}
              </div>

              {savedNotice ? (
                <p className="lesson-saved" role="status">
                  <CheckCircle2 size={16} aria-hidden="true" />
                  Lesson marked as complete.{" "}
                  {isAuthenticated
                    ? "Progress synced to your account."
                    : "Progress saved in this browser."}
                </p>
              ) : null}

              <div className="tabs lesson-tabs">
                <button
                  type="button"
                  className="tabs__tab"
                  aria-selected={playerTab === "overview"}
                  onClick={() => setPlayerTab("overview")}
                >
                  Overview
                </button>
                <button
                  type="button"
                  className="tabs__tab"
                  aria-selected={playerTab === "notes"}
                  onClick={() => setPlayerTab("notes")}
                >
                  Key points ({keyPoints.length})
                </button>
                {activeLesson.type === "track" ? (
                  <button
                    type="button"
                    className="tabs__tab"
                    aria-selected={playerTab === "curriculum"}
                    onClick={() => setPlayerTab("curriculum")}
                  >
                    Syllabus ({currentTrack?.syllabus.length})
                  </button>
                ) : null}
              </div>

              {playerTab === "overview" ? (
                <div className="lesson-body">
                  <p className="lesson-overview">{overview}</p>
                  {keyPoints.length > 0 ? (
                    <ul className="key-points">
                      {keyPoints.map((point) => (
                        <li key={point} className="key-point">
                          <CheckCircle2 size={16} aria-hidden="true" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}

              {playerTab === "notes" ? (
                <ol className="stack key-points key-points--numbered">
                  {keyPoints.map((point, index) => (
                    <li key={point} className="key-point">
                      <span className="key-point__index">{index + 1}</span>
                      {point}
                    </li>
                  ))}
                </ol>
              ) : null}

              {playerTab === "curriculum" && currentTrack ? (
                <ol className="lesson-list">
                  {currentTrack.syllabus.map((lesson, index) => (
                    <li key={lesson.id}>
                      <button
                        type="button"
                        className={`lesson-list__item ${
                          lesson.completed ? "lesson-list__item--done" : ""
                        }`}
                        aria-current={lesson.id === activeLesson.lessonId ? "true" : undefined}
                        onClick={() =>
                          setActiveLesson({
                            type: "track",
                            trackId: currentTrack.id,
                            lessonId: lesson.id,
                          })
                        }
                      >
                        {lesson.completed ? (
                          <CheckCircle2 size={16} aria-hidden="true" />
                        ) : (
                          <Circle size={16} aria-hidden="true" />
                        )}
                        <span className="lesson-list__title">
                          {index + 1}. {lesson.title}
                        </span>
                        <span className="lesson-list__duration">
                          {lesson.duration}
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              ) : null}

              {activeLesson.type === "track" ? (
                <footer className="lesson-foot">
                  <p className="meta cluster">
                    {isCompleted ? (
                      <>
                        <CheckCircle2 size={16} aria-hidden="true" />
                        Lesson completed
                      </>
                    ) : (
                      <>
                        <Clock size={16} aria-hidden="true" />
                        Not marked complete yet
                      </>
                    )}
                  </p>
                  <button
                    type="button"
                    className={`btn ${isCompleted ? "btn--secondary" : "btn--primary"}`}
                    onClick={() =>
                      handleToggleComplete(
                        activeLesson.trackId,
                        activeLesson.lessonId,
                        isCompleted,
                      )
                    }
                  >
                    {isCompleted ? "Mark as not complete" : "Mark as complete"}
                  </button>
                </footer>
              ) : null}
            </article>

            <aside className="card lesson-aside">
              <h2 className="card__title">About this lesson</h2>
              <p className="lesson-aside__text">
                Lectures are hosted by the institutions credited above and are
                embedded from their public channels. NoorHub does not modify them.
              </p>
              <p className="meta">
                {activeLesson.type === "track"
                  ? `Lesson ${currentTrack?.syllabus.findIndex((lesson) => lesson.id === activeLesson.lessonId) + 1} of ${currentTrack?.syllabus.length} in ${currentTrack?.title}.`
                  : "Selected lecture from the NoorHub lecture index."}
              </p>
              {activeLesson.type === "track" && currentTrack ? (
                <div className="lesson-aside__progress">
                  <ProgressBar
                    value={
                      currentTrack.syllabus.filter((lesson) => lesson.completed).length
                    }
                    max={currentTrack.syllabus.length}
                    label="Course progress"
                  />
                </div>
              ) : null}
              <p className="meta lesson-aside__note">
                Questions about a ruling belong with a qualified scholar. These
                lessons are a starting point, not a fatwa.
              </p>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  /* ── Catalogue view ───────────────────────────────────────────────────── */
  return (
    <div className="page">
      <div className="container">
        <header className="page-head">
          <span className="page-head__eyebrow">Learn</span>
          <h1 className="page-head__title">Courses and selected lectures</h1>
          <div className="page-head__meta">
            <span>{enrolledCount} courses started</span>
            <span aria-hidden="true">·</span>
            <span>
              {completedLessons} of {totalModules} lessons completed
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {isAuthenticated ? "Progress synced to your account" : "Guest mode — progress saved in this browser"}
            </span>
          </div>
        </header>

        <div className="learn-toolbar">
          <div className="search-field learn-toolbar__search">
            <Search size={17} className="search-field__icon" aria-hidden="true" />
            <input
              type="search"
              className="input"
              placeholder={
                activeTab === "curriculum"
                  ? "Search courses by title or topic"
                  : "Search lectures, topics or scholars"
              }
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="Search courses and lectures"
            />
          </div>

          <div className="cluster learn-toolbar__filters">
            {FILTER_TAGS.map((tag) => (
              <Tag
                key={tag}
                active={activeCategory === tag}
                onClick={() => setActiveCategory(tag)}
              >
                {tag}
              </Tag>
            ))}
          </div>

          {activeTab === "live-feed" ? (
            <label className="field learn-toolbar__scholar">
              <span className="field__label">Scholar</span>
              <select
                className="select"
                value={selectedScholar}
                onChange={(event) => setSelectedScholar(event.target.value)}
              >
                {SCHOLARS.map((scholar) => (
                  <option key={scholar} value={scholar}>
                    {scholar}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>

        <div className="tabs" role="tablist" aria-label="Learning sections">
          <button
            type="button"
            role="tab"
            className="tabs__tab"
            aria-selected={activeTab === "curriculum"}
            onClick={() => setActiveTab("curriculum")}
          >
            <BookOpen size={15} aria-hidden="true" />
            Structured courses
          </button>
          <button
            type="button"
            role="tab"
            className="tabs__tab"
            aria-selected={activeTab === "live-feed"}
            onClick={() => setActiveTab("live-feed")}
          >
            <GraduationCap size={15} aria-hidden="true" />
            Selected lectures
          </button>
        </div>

        {activeTab === "curriculum" ? (
          <section aria-labelledby="courses-heading">
            <SectionHeader
              title={`${filteredTracks.length} ${filteredTracks.length === 1 ? "course" : "courses"}`}
              description="Four structured tracks with lesson-level progress. Enrol once and pick up where you stopped."
            />
            <h2 className="sr-only" id="courses-heading">
              Courses
            </h2>

            {filteredTracks.length ? (
              <div className="grid grid--2">
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
            ) : (
              <EmptyState
                icon={Search}
                title="No courses match that search"
                description="Try a broader term, or clear the filters to see all four tracks."
              />
            )}
          </section>
        ) : (
          <section aria-labelledby="lectures-heading">
            <SectionHeader
              title="Selected lectures"
              description="Individual lectures from the institutions credited on each entry. Watch here or open the original on the host platform."
            />
            <h2 className="sr-only" id="lectures-heading">
              Selected lectures
            </h2>

            {loadingFeed ? (
              <PageSkeleton label="Loading lectures" />
            ) : filteredLiveLessons.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No lectures match that search"
                description="Try another topic, or reset the filters to see the full index."
                action="Reset filters"
                onClick={() => {
                  setActiveCategory("All Pathways");
                  setSelectedScholar("All Scholars");
                  setSearchQuery("");
                }}
              />
            ) : (
              <div className="grid grid--3">
                {filteredLiveLessons.map((item) => (
                  <article key={item.id} className="card lecture-card">
                    <div className="lecture-card__thumb">
                      <img src={item.thumbnail} alt="" loading="lazy" />
                      <span className="lecture-card__duration">{item.duration}</span>
                    </div>

                    <div className="cluster lecture-card__tags">
                      <Badge tone="accent">{item.category}</Badge>
                      {item.isLive ? <Badge tone="outline">Live now</Badge> : null}
                    </div>

                    <h3 className="card__title lecture-card__title">{item.title}</h3>
                    <p className="meta cluster">
                      <User size={13} aria-hidden="true" />
                      {item.speaker} · {item.institution}
                    </p>
                    <p className="lecture-card__desc">{item.description}</p>

                    <div className="card__footer">
                      <button
                        type="button"
                        className="btn btn--secondary btn--sm"
                        onClick={() => setActiveLesson({ type: "live", lesson: item })}
                      >
                        Watch lecture
                        <ArrowRight size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        <Notice tone="sand">
          Course syllabi and lectures are credited to the instructors and
          institutions named on each entry. NoorHub hosts nothing and modifies
          nothing. For personal religious questions, ask a qualified scholar.{" "}
          <Link to="/about">Read more about how NoorHub handles sources</Link>.
        </Notice>
      </div>
    </div>
  );
}

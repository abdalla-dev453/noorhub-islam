import React, { useState } from "react";
import { useProgress } from "../context/ProgressContext";
import TrackCard from "../components/ui/TrackCard";
import { getVideoSourceConfig } from "../utils/video";

const FILTER_TAGS = [
  "All Pathways",
  "Theology",
  "Jurisprudence",
  "History",
  "Recitation",
];
const DEFAULT_LESSON_VIDEO =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

export default function Learn() {
  const { tracks, enrollInTrack, toggleLessonStatus } = useProgress();
  const [activeCategory, setActiveCategory] = useState("All Pathways");
  const [searchQuery, setSearchQuery] = useState("");

  // 🆕 Active Lesson Content Player Node References
  const [activeLesson, setActiveLesson] = useState(null); // Holds { trackId, lessonId }

  // Compute live calculations across analytics matrix
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

  // Render Condition A: Active Study Session Player View
  if (activeLesson) {
    const currentTrack = tracks.find((t) => t.id === activeLesson.trackId);
    const currentLesson = currentTrack?.syllabus.find(
      (l) => l.id === activeLesson.lessonId,
    );
    const videoConfig = getVideoSourceConfig(
      currentLesson?.videoUrl || DEFAULT_LESSON_VIDEO,
    );

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        <button
          type="button"
          onClick={() => setActiveLesson(null)}
          className="text-xs font-mono font-bold tracking-wider text-teal-500 hover:text-slate-400 transition-colors py-2"
        >
          ← BACK TO ACADEMY DASHBOARD
        </button>

        <div className="noor-card p-6 md:p-8 space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.015] pointer-events-none geometric-overlay" />

          <div className="space-y-2 relative z-10">
            <span className="text-xs font-mono text-teal-500/80 uppercase font-semibold tracking-wider">
              {currentTrack?.title}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-100">
              {currentLesson?.title}
            </h1>
          </div>

          <div className="rounded-2xl border border-slate-900 bg-slate-950 shadow-inner overflow-hidden">
            {videoConfig?.type === "youtube" ? (
              <iframe
                key={currentLesson?.id || activeLesson.lessonId}
                className="aspect-video w-full"
                src={videoConfig.embedUrl}
                title={`Lesson video: ${currentLesson?.title || "Islamic lesson"}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                key={currentLesson?.id || activeLesson.lessonId}
                className="aspect-video w-full"
                controls
                preload="metadata"
                playsInline
                aria-label={`Interactive classroom video for ${currentLesson?.title || "this lesson"}`}
              >
                <source
                  src={videoConfig?.src || DEFAULT_LESSON_VIDEO}
                  type="video/mp4"
                />
                Your browser does not support embedded video playback.
              </video>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-400 space-y-1">
            <p className="font-semibold text-slate-200">Lesson access</p>
            <p>
              Use the built-in play, pause, and seek controls to follow the
              lesson. The stream is designed to work in modern browsers.
            </p>
          </div>

          {/* Structured Text Content Summary Module */}
          <div className="space-y-4 text-slate-300 text-sm md:text-base leading-relaxed">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Lesson Summary Lecture Notes
            </h3>
            <p>
              Welcome to this modules structural overview session. Ensure you
              have your notebook ready as we analyze core primary text
              parameters, terminology breakdowns, and historical context maps
              vetted across authenticated student curricula.
            </p>
          </div>

          {/* ⚡ Dynamic Interactive Completion Trigger Row Element */}
          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs font-mono text-slate-500">
              Status:{" "}
              {currentLesson?.completed
                ? "✅ Completed & Logged"
                : "⏳ In Progress"}
            </div>

            <button
              onClick={() =>
                toggleLessonStatus(activeLesson.trackId, activeLesson.lessonId)
              }
              className={`px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-md ${
                currentLesson?.completed
                  ? "bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/20"
                  : "bg-linear-to-r from-teal-500 to-emerald-500 text-slate-950 hover:brightness-110 font-black shadow-teal-500/10"
              }`}
            >
              {currentLesson?.completed
                ? "Mark as Incomplete"
                : "✓ Complete Lesson & Update Progress"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Condition B: Standard Catalog Discovery Dashboard Grid
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <span className="glow-badge">Academy Dashboard</span>
        <h1 className="text-4xl md:text-5xl gradient-heading">
          Structured Tracks
        </h1>
        <p className="sub-heading">
          Select individual modules below inside course blueprints to enter
          active digital study spaces.
        </p>
      </div>

      {/* Live Statistics Metrics Banner Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <div className="noor-card p-4 flex items-center justify-between bg-slate-900/10">
          <div>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
              Active Paths
            </p>
            <p className="text-2xl font-bold text-white mt-1">
              {enrolledCount} Tracks
            </p>
          </div>
          <span className="text-2xl">🎓</span>
        </div>
        <div className="noor-card p-4 flex items-center justify-between bg-slate-900/10">
          <div>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
              Total Syllabus
            </p>
            <p className="text-2xl font-bold text-white mt-1">
              {totalModules} Lessons
            </p>
          </div>
          <span className="text-2xl">📖</span>
        </div>
        <div className="noor-card p-4 flex items-center justify-between bg-slate-900/10">
          <div>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
              Storage Sync
            </p>
            <p className="text-2xl font-bold text-teal-400 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400 inline-block animate-pulse" />{" "}
              Persistent
            </p>
          </div>
          <span className="text-2xl">💾</span>
        </div>
      </div>

      <div className="max-w-xl mx-auto relative">
        <input
          type="text"
          placeholder="Filter curriculum pathways by title names..."
          className="noor-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Navigation Filter Category Strip Component */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto border-b border-slate-900 pb-4">
        {FILTER_TAGS.map((tag) => {
          const isSelected = activeCategory === tag;
          return (
            <button
              key={tag}
              onClick={() => setActiveCategory(tag)}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-300 ${
                isSelected
                  ? "bg-teal-400 text-slate-950 font-bold"
                  : "bg-slate-900/40 border border-slate-800/80 text-slate-400 hover:text-white"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Dynamic Grid Layout Core Assembly Render */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {filteredTracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            onEnroll={enrollInTrack}
            onSelectLesson={(lessonId) =>
              setActiveLesson({ trackId: track.id, lessonId })
            } // 🆕 Pass trigger
          />
        ))}
      </div>
    </div>
  );
}

import React, { useState } from "react";

export default function TrackCard({ track, onEnroll, onSelectLesson }) {
  // 🆕 Added onSelectLesson prop
  const [isExpanded, setIsExpanded] = useState(false);

  const completedCount = track.syllabus.filter((item) => item.completed).length;
  const progressPercent = Math.round(
    (completedCount / track.syllabus.length) * 100,
  );

  return (
    <div className="noor-card flex flex-col justify-between space-y-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-colors" />

      <div className="space-y-4">
        <div className="flex justify-between items-center relative z-10">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-teal-400/80">
            {track.category}
          </span>
          <span className="text-[10px] px-2 py-0.5 border border-teal-500/20 bg-teal-500/10 text-teal-400 rounded font-medium font-mono">
            {track.difficulty}
          </span>
        </div>

        <div className="space-y-2 relative z-10">
          <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors duration-200">
            {track.title}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            {track.description}
          </p>
        </div>

        {track.isEnrolled && (
          <div className="space-y-2 pt-2 relative z-10">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Dynamic Progress Tracker</span>
              <span className="text-teal-400 font-bold">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 border border-slate-800/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-teal-500 via-emerald-400 to-cyan-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        <div className="pt-2 relative z-10">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-mono text-slate-500 hover:text-teal-400 transition-colors flex items-center gap-1 focus:outline-none"
          >
            {isExpanded
              ? "▼ Hide Syllabus Blueprint"
              : "▶ View Syllabus Blueprint"}
          </button>

          {isExpanded && (
            <div className="mt-3 pl-2 space-y-2.5 border-l border-slate-800 animate-fadeIn">
              {track.syllabus.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between text-xs text-slate-300 hover:text-white py-1 group/item rounded-lg transition-all"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={lesson.completed}
                      readOnly // Let player trigger change or keep click handler isolated
                      className="w-3.5 h-3.5 accent-teal-400 pointer-events-none rounded border-slate-800 bg-slate-950"
                    />
                    <span
                      className={`${lesson.completed ? "line-through text-slate-500" : "group-hover/item:text-teal-400"} transition-all duration-200`}
                    >
                      {lesson.title}
                    </span>
                  </div>

                  {/* 🆕 Launch Lesson button */}
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelectLesson(lesson.id);
                    }}
                    aria-label={`Open lesson ${lesson.title}`}
                    className="text-[10px] font-mono opacity-0 group-hover/item:opacity-100 bg-teal-500/10 border border-teal-500/20 text-teal-400 px-2 py-0.5 rounded transition-all hover:bg-teal-500 hover:text-slate-950"
                  >
                    Enter Lesson →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-900/60 flex items-center justify-between relative z-10">
        <div className="text-xs font-mono text-slate-500">
          {completedCount} / {track.syllabus.length} Completed
        </div>
        <button
          onClick={() => onEnroll(track.id)}
          className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all duration-200 ${
            track.isEnrolled
              ? "bg-teal-500/10 border-teal-500/30 text-teal-400 hover:bg-teal-500 hover:text-slate-950 hover:font-bold"
              : "bg-slate-950 hover:bg-slate-900 border-slate-800 text-white hover:text-teal-400 hover:border-teal-500/30"
          }`}
        >
          {track.isEnrolled ? "Continue Tracks" : "Enroll Pathway →"}
        </button>
      </div>
    </div>
  );
}

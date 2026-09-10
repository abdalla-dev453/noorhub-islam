import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
  User,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { useState } from "react";

export default function TrackCard({ track, onEnroll, onSelectLesson }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const completedCount = track.syllabus.filter((item) => item.completed).length;
  const progressPercent = Math.round(
    (completedCount / track.syllabus.length) * 100,
  );

  return (
    <div className="noor-card flex flex-col justify-between space-y-6 group hover-elevate transition-all duration-300">
      <div className="space-y-4">
        {/* Category & Difficulty */}
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)] bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full">
            {track.category}
          </span>
          <div className="flex items-center gap-2">
            {track.duration && (
              <span className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1">
                <Clock size={11} />
                {track.duration}
              </span>
            )}
            <span className="text-[11px] px-2.5 py-0.5 border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] rounded-full font-mono">
              {track.difficulty}
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
            {track.title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-normal">
            {track.description}
          </p>
        </div>

        {/* Instructor info */}
        {track.instructor && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
            <User size={13} className="text-[var(--accent)]" />
            <span>{track.instructor}</span>
          </div>
        )}

        {/* Glowing Progress bar if enrolled */}
        {track.isEnrolled && (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-mono text-[var(--text-secondary)]">
              <span className="flex items-center gap-1">
                <Sparkles size={12} className="text-[var(--accent)]" />
                Track Progress
              </span>
              <span className="text-[var(--accent)] font-bold">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full h-2 glowing-bar-track">
              <div
                className="h-full glowing-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Expandable syllabus */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-mono font-medium text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 focus:outline-none py-1"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={14} className="text-[var(--accent)]" />
                <span>Hide Lessons ({track.syllabus.length})</span>
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                <span>View Full Curriculum ({track.syllabus.length} modules)</span>
              </>
            )}
          </button>

          {isExpanded && (
            <div className="mt-3 pl-3 space-y-2.5 border-l-2 border-teal-500/20 animate-fadeIn">
              {track.syllabus.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  onClick={() => {
                    if (typeof onSelectLesson === "function") {
                      onSelectLesson(lesson.id);
                    }
                  }}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-[var(--surface-hover)] hover:bg-teal-500/10 cursor-pointer group/item transition-all duration-200"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    {lesson.completed ? (
                      <CheckCircle2
                        size={15}
                        className="text-[var(--accent)] shrink-0"
                      />
                    ) : (
                      <Circle
                        size={15}
                        className="text-[var(--text-muted)] shrink-0 group-hover/item:text-[var(--accent)] transition-colors"
                      />
                    )}
                    <div className="truncate">
                      <span
                        className={`font-medium ${
                          lesson.completed
                            ? "line-through text-[var(--text-muted)]"
                            : "text-[var(--text-secondary)] group-hover/item:text-[var(--text-primary)]"
                        }`}
                      >
                        {idx + 1}. {lesson.title}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pl-2">
                    {lesson.duration && (
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        {lesson.duration}
                      </span>
                    )}
                    <span className="text-[11px] font-mono opacity-80 group-hover/item:opacity-100 text-[var(--accent)] flex items-center gap-0.5">
                      Watch
                      <ArrowRight size={11} className="group-hover/item:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer / Enroll action */}
      <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
        <span className="text-xs font-mono text-[var(--text-muted)]">
          {completedCount} of {track.syllabus.length} completed
        </span>
        <button
          onClick={() => onEnroll(track.id)}
          className={`btn text-xs py-2 px-4 ${
            track.isEnrolled ? "btn-secondary" : "btn-primary"
          }`}
        >
          {track.isEnrolled ? "Continue Learning" : "Enroll Free"}
        </button>
      </div>
    </div>
  );
}

import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
  User,
} from "lucide-react";
import { useState } from "react";
import ProgressBar from "./ProgressBar";
import { Badge } from "./Badge";

/**
 * Editorial course card. Progress, instructor and duration are shown first;
 * the full syllabus stays available but collapsed until asked for.
 */
export default function TrackCard({ track, onEnroll, onSelectLesson }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const completedCount = track.syllabus.filter((item) => item.completed).length;
  const nextLesson = track.syllabus.find((lesson) => !lesson.completed);

  return (
    <article className="card course-card">
      <div className="card__header">
        <div className="cluster">
          <Badge tone="accent">{track.category}</Badge>
          <Badge tone="outline">{track.difficulty}</Badge>
        </div>
        <span className="meta cluster">
          <Clock size={13} aria-hidden="true" />
          {track.duration}
        </span>
      </div>

      <h3 className="card__title course-card__title">{track.title}</h3>
      <p className="course-card__desc">{track.description}</p>

      <p className="meta course-card__instructor">
        <User size={13} aria-hidden="true" />
        {track.instructor}
      </p>

      {track.isEnrolled ? (
        <div className="course-card__progress">
          <ProgressBar
            value={completedCount}
            max={track.syllabus.length}
            label="Lessons completed"
            showValue={false}
          />
        </div>
      ) : null}

      <div className="course-card__syllabus">
        <button
          type="button"
          className="btn btn--quiet btn--sm"
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((value) => !value)}
        >
          {isExpanded ? (
            <ChevronUp size={15} aria-hidden="true" />
          ) : (
            <ChevronDown size={15} aria-hidden="true" />
          )}
          {isExpanded ? "Hide" : "Show"} {track.syllabus.length} lessons
        </button>

        {isExpanded ? (
          <ol className="lesson-list">
            {track.syllabus.map((lesson, index) => (
              <li key={lesson.id}>
                <button
                  type="button"
                  className={`lesson-list__item ${lesson.completed ? "lesson-list__item--done" : ""}`}
                  aria-current={
                    nextLesson?.id === lesson.id && !lesson.completed ? "true" : undefined
                  }
                  onClick={() => onSelectLesson?.(lesson.id)}
                >
                  {lesson.completed ? (
                    <CheckCircle2 size={16} aria-hidden="true" />
                  ) : (
                    <Circle size={16} aria-hidden="true" />
                  )}
                  <span className="lesson-list__title">
                    {index + 1}. {lesson.title}
                  </span>
                  <span className="lesson-list__duration">{lesson.duration}</span>
                </button>
              </li>
            ))}
          </ol>
        ) : null}
      </div>

      <div className="card__footer course-card__footer">
        <span className="meta">
          {completedCount} of {track.syllabus.length} completed
        </span>
        <button
          type="button"
          className={`btn btn--sm ${track.isEnrolled ? "btn--secondary" : "btn--primary"}`}
          onClick={() => {
            if (track.isEnrolled && nextLesson) {
              onSelectLesson?.(nextLesson.id);
            } else {
              onEnroll?.(track.id);
            }
          }}
        >
          {track.isEnrolled ? "Continue" : "Enrol"}
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

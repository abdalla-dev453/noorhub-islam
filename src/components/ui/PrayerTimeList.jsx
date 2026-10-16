import { Minus, Plus } from "lucide-react";
import { PRAYER_LABELS } from "../../utils/prayerTimes";

const STATUS_OPTIONS = [
  { value: "on-time", label: "On time" },
  { value: "late", label: "Late" },
  { value: "qada", label: "Qada" },
];

/**
 * Calm timeline of the six daily times. The next prayer is marked with text
 * as well as colour, adjustments are visible, and the log control only
 * appears where logging is functional.
 */
export default function PrayerTimeList({
  order,
  times,
  nextKey,
  offsets = {},
  dayLogs = {},
  onOffsetChange,
  onMarkPrayer,
  showLog = true,
}) {
  return (
    <div className="timetable">
      {order.map((key) => {
        const time = times[key];
        const offset = offsets?.[key] ?? 0;
        const isNext = key === nextKey;
        const label = PRAYER_LABELS[key];

        return (
          <div className="timetable__row" key={key} data-next={isNext}>
            <p className="timetable__name">
              {label}
              {isNext ? <span className="badge badge--accent">Next</span> : null}
              {key === "sunrise" ? (
                <span className="meta">not a prayer</span>
              ) : null}
            </p>

            <p className="timetable__time">{time}</p>

            <div className="timetable__adjust">
              <span>Adjust</span>
              <button
                type="button"
                className="icon-btn icon-btn--sm"
                onClick={() => onOffsetChange?.(key, offset - 1)}
                aria-label={`Move ${label} one minute earlier`}
              >
                <Minus size={14} aria-hidden="true" />
              </button>
              <span className="numeric" style={{ minWidth: "3.5rem", textAlign: "center" }}>
                {offset > 0 ? `+${offset}` : offset} min
              </span>
              <button
                type="button"
                className="icon-btn icon-btn--sm"
                onClick={() => onOffsetChange?.(key, offset + 1)}
                aria-label={`Move ${label} one minute later`}
              >
                <Plus size={14} aria-hidden="true" />
              </button>
            </div>

            {showLog && key !== "sunrise" ? (
              <div className="timetable__status">
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="status-chip"
                    aria-pressed={dayLogs[key] === option.value}
                    onClick={() => onMarkPrayer?.(key, option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : (
              <span />
            )}
          </div>
        );
      })}
    </div>
  );
}

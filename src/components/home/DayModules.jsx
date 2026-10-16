import {
  ArrowRight,
  BookOpenCheck,
  Check,
  Compass,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import { usePersistentState } from "../../hooks/usePersistentState";
import { DAILY_ADHKAR } from "../../data/defaults";
import { PRAYER_LABELS } from "../../utils/prayerTimes";

const PRACTICE_KEY = "noorhub_daily_practice";
const DEFAULT_DHIKR = DAILY_ADHKAR[0];
const DEFAULT_DHIKR_ID = DEFAULT_DHIKR.id;

/**
 * "For your day" — four functional modules with live state, each pointing at a
 * real destination. Deliberately not a grid of equal marketing cards.
 */
export default function DayModules({
  prayer,
  formattedTime,
  profile,
  position,
  hifz,
  savedCount,
}) {
  const [practice, setPractice] = usePersistentState(PRACTICE_KEY, {});
  const today = new Date().toLocaleDateString("en-CA");
  const todayPractice = practice[today] || { habits: {}, counts: {}, target: 100 };

  const dhikr =
    DAILY_ADHKAR.find((item) => item.id === (todayPractice.activeDhikr || DEFAULT_DHIKR_ID)) ||
    DEFAULT_DHIKR;
  const activeDhikrId = dhikr.id;
  const count = todayPractice.counts?.[activeDhikrId] || 0;
  const target = todayPractice.target || dhikr.target;
  const complete = count >= target;

  const updateCount = useCallback(
    (nextCount) => {
      setPractice((previous) => {
        const current = previous[today] || { habits: {}, counts: {}, target: dhikr.target };
        return {
          ...previous,
          [today]: {
            ...current,
            counts: { ...current.counts, [activeDhikrId]: Math.max(0, nextCount) },
          },
        };
      });
    },
    [setPractice, today, activeDhikrId, dhikr.target],
  );

  return (
    <div className="day-modules">
      {/* Prayer */}
      <article className="day-module day-module--wide">
        <div className="day-module__head">
          <span className="day-module__icon">
            <Compass size={18} aria-hidden="true" />
          </span>
          <div>
            <h3 className="day-module__title">Prayer</h3>
            <p className="day-module__sub">{profile.label}</p>
          </div>
        </div>

        <p className="day-module__value">
          {PRAYER_LABELS[prayer.key]} <span className="numeric">{formattedTime}</span>
        </p>
        <p className="day-module__note">
          Next prayer in {Math.floor(prayer.inMinutes / 60)}h{" "}
          {prayer.inMinutes % 60}m{prayer.tomorrow ? " · after midnight" : ""}.
        </p>

        <div className="day-module__foot">
          <Link className="day-module__link" to="/prayer">
            View timetable and Qibla
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </article>

      {/* Quran */}
      <article className="day-module day-module--narrow">
        <div className="day-module__head">
          <span className="day-module__icon">
            <BookOpenCheck size={18} aria-hidden="true" />
          </span>
          <div>
            <h3 className="day-module__title">Quran</h3>
            <p className="day-module__sub">
              {savedCount} saved {savedCount === 1 ? "ayah" : "ayahs"}
            </p>
          </div>
        </div>

        <p className="day-module__value">{position?.name ?? "Al-Fatihah"}</p>
        <p className="day-module__note">
          {position?.name
            ? "Continue where you stopped, or start another surah."
            : "Open the reader and begin with the opening chapter."}
        </p>

        <div className="day-module__foot">
          <Link className="day-module__link" to={position?.id ? `/quran?surah=${position.id}` : "/quran?surah=1"}>
            {position?.name ? "Continue reading" : "Open Quran"}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </article>

      {/* Hifz */}
      <article className="day-module day-module--narrow">
        <div className="day-module__head">
          <span className="day-module__icon">
            <BookOpenCheck size={18} aria-hidden="true" />
          </span>
          <div>
            <h3 className="day-module__title">Hifz</h3>
            <p className="day-module__sub">
              {hifz ? hifz.name : "No plan yet"}
            </p>
          </div>
        </div>

        <p className="day-module__value">
          {hifz ? `${hifz.due} to review` : "Start a plan"}
        </p>
        <p className="day-module__note">
          {hifz
            ? hifz.nextNew
              ? `Next new portion: ayahs ${hifz.nextNew.fromAyah}–${hifz.nextNew.toAyah}.`
              : "All planned portions have been studied."
            : "Build a calm schedule with new portions and spaced review."}
        </p>

        <div className="day-module__foot">
          <Link className="day-module__link" to="/hifz">
            Open memorisation studio
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </article>

      {/* Dhikr */}
      <article className="day-module day-module--wide">
        <div className="day-module__head">
          <span className="day-module__icon">
            {complete ? <Check size={18} aria-hidden="true" /> : <RotateCcw size={18} aria-hidden="true" />}
          </span>
          <div>
            <h3 className="day-module__title">Dhikr</h3>
            <p className="day-module__sub">
              {complete ? "Target reached today" : `${count} of ${target} today`}
            </p>
          </div>
        </div>

        <div className="dhikr">
          <p className="dhikr__arabic" lang="ar" dir="rtl">
            {dhikr.arabic}
          </p>
          <p className="dhikr__meaning">{dhikr.meaning}</p>
        </div>

        <div className="dhikr__control">
          <button
            type="button"
            className="icon-btn icon-btn--bordered"
            onClick={() => updateCount(count - 1)}
            aria-label="Decrease the count"
            disabled={count === 0}
          >
            <Minus size={16} aria-hidden="true" />
          </button>
          <span className="dhikr__count" aria-live="polite">
            {count}
          </span>
          <button
            type="button"
            className="icon-btn icon-btn--bordered"
            onClick={() => updateCount(count + 1)}
            aria-label="Increase the count"
          >
            <Plus size={16} aria-hidden="true" />
          </button>
          <span className="meta">of {target}</span>
        </div>

        <p className="dhikr__source">Source: {dhikr.source}</p>

        <div className="day-module__foot">
          <Link className="day-module__link" to="/practice">
            Open dhikr, habits and duas
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </article>
    </div>
  );
}

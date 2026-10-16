import { ArrowRight, BookMarked, GraduationCap, ScrollText } from "lucide-react";
import { Link } from "react-router-dom";
import ProgressBar from "../ui/ProgressBar";
import { useProgress } from "../../context/ProgressContext";

/**
 * "Continue your journey" — content the reader is already using, or honest
 * discovery content when there is nothing to resume yet.
 */
export default function JourneySection({ position, hifz, notesCount }) {
  const { tracks } = useProgress();
  const activeTrack = tracks.find((track) => track.isEnrolled) ?? null;
  const nextLesson = activeTrack?.syllabus.find((lesson) => !lesson.completed) ?? null;
  const completed = activeTrack
    ? activeTrack.syllabus.filter((lesson) => lesson.completed).length
    : 0;

  const items = [];

  if (position?.name) {
    items.push({
      kind: "Quran",
      icon: BookMarked,
      title: position.name,
      meta: position.ayah ? `Continue at ayah ${position.ayah}` : "Open the reader",
      to: `/quran?surah=${position.id}&ayah=${position.ayah ?? 1}`,
      progress: typeof position.progress === "number" ? position.progress : null,
    });
  }

  if (hifz) {
    items.push({
      kind: "Hifz",
      icon: BookMarked,
      title: `${hifz.due} review ${hifz.due === 1 ? "portion" : "portions"} due`,
      meta: `${hifz.learned} of ${hifz.total} portions memorised · target finish ${hifz.endDate}`,
      to: "/hifz",
      progress: Math.round((hifz.learned / Math.max(1, hifz.total)) * 100),
    });
  }

  if (activeTrack && nextLesson) {
    items.push({
      kind: "Learning",
      icon: GraduationCap,
      title: nextLesson.title,
      meta: `${activeTrack.title} · ${nextLesson.duration}`,
      to: `/learn?lesson=${nextLesson.id}`,
      progress: Math.round((completed / activeTrack.syllabus.length) * 100),
    });
  }

  if (notesCount > 0) {
    items.push({
      kind: "Saved",
      icon: ScrollText,
      title: `${notesCount} private ${notesCount === 1 ? "note" : "notes"} on saved ayahs`,
      meta: "Search your bookmarks and notes",
      to: "/search",
      progress: null,
    });
  }

  const hasProgress = items.length > 0;

  return (
    <section aria-labelledby="journey-heading">
      <header className="section-header">
        <div>
          <span className="section-header__eyebrow label">Continue your journey</span>
          <h2 className="section-header__title" id="journey-heading">
            {hasProgress ? "Where you left off" : "A few good starting points"}
          </h2>
          <p className="section-header__desc">
            {hasProgress
              ? "Everything here is from this device — your reading position, review schedule and lesson progress."
              : "Signed out or just starting? These three take a few minutes each."}
          </p>
        </div>
      </header>

      <div className="journey">
        {hasProgress ? (
          items.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.kind} to={item.to} className="journey__item">
                <p className="journey__kind">
                  <Icon size={15} aria-hidden="true" />
                  {item.kind}
                </p>
                <h3 className="journey__title">{item.title}</h3>
                <p className="journey__meta">{item.meta}</p>
                {item.progress !== null ? (
                  <div className="journey__progress">
                    <ProgressBar value={item.progress} showValue={false} />
                  </div>
                ) : null}
              </Link>
            );
          })
        ) : (
          <>
            <Link to="/quran?surah=1" className="journey__item">
              <p className="journey__kind">
                <BookMarked size={15} aria-hidden="true" />
                Begin
              </p>
              <h3 className="journey__title">Begin with the Quran</h3>
              <p className="journey__meta">
                Read Al-Fatihah with the Sahih International translation, then
                listen verse by verse.
              </p>
            </Link>
            <Link to="/prayer" className="journey__item">
              <p className="journey__kind">
                <ArrowRight size={15} aria-hidden="true" />
                Build
              </p>
              <h3 className="journey__title">Build a steady prayer routine</h3>
              <p className="journey__meta">
                Set your location and calculation method once, then keep the
                timetable and Qibla a tap away.
              </p>
            </Link>
            <Link to="/hadith" className="journey__item">
              <p className="journey__kind">
                <ScrollText size={15} aria-hidden="true" />
                Explore
              </p>
              <h3 className="journey__title">Explore selected Hadith</h3>
              <p className="journey__meta">
                Browse Sahih al-Bukhari, Sahih Muslim and Sunan Abi Dawud by
                search, with the source shown for every narration.
              </p>
            </Link>
          </>
        )}
      </div>
    </section>
  );
}

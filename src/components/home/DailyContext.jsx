import { MapPin } from "lucide-react";
import ContinueCard from "../ui/ContinueCard";
import ReflectionPanel from "./ReflectionPanel";
import { PRAYER_LABELS } from "../../utils/prayerTimes";

/**
 * The honest daily header: who you are, what day it is, when the next prayer
 * is, and where you stopped reading. Replaces the marketing hero.
 */
export default function DailyContext({
  user,
  now,
  prayer,
  profile,
  hijriLabel,
  position,
  onContinue,
  reflection,
  reflectionStatus,
  onRetryReflection,
}) {
  const dateLabel = now.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const countdown = `${Math.floor(prayer.inMinutes / 60)}h ${prayer.inMinutes % 60}m`;
  const nextLabel = PRAYER_LABELS[prayer.key];

  return (
    <section className="daily-context" aria-labelledby="greeting-heading">
      <div>
        <h1 className="greeting__salaam" id="greeting-heading">
          Assalamu alaikum{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>

        <p className="greeting__date">
          <span>{dateLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{hijriLabel}</span>
        </p>

        <div className="greeting__prayer">
          <span className="greeting__prayer-label">{nextLabel}</span>
          <span className="greeting__prayer-time numeric">
            {formatTime(prayer.time)}
          </span>
          <span className="greeting__prayer-count">
            in {countdown}
            {prayer.tomorrow ? " · tomorrow" : ""}
          </span>
          <span className="greeting__location cluster">
            <MapPin size={13} aria-hidden="true" />
            {profile.label}
          </span>
        </div>

        {position?.name ? (
          <ContinueCard
            eyebrow="Continue reading"
            title={position.name}
            detail={
              position.ayah
                ? `Ayah ${position.ayah} · saved on this device`
                : "Picked up from your last session"
            }
            to={`/quran?surah=${position.id}&ayah=${position.ayah ?? 1}`}
            progress={position.progress}
            progressLabel={
              typeof position.progress === "number"
                ? "Surah completed"
                : undefined
            }
            cta="Continue reading"
            onNavigate={onContinue}
          />
        ) : (
          <ContinueCard
            eyebrow="Start here"
            title="Begin with the Quran"
            detail="Open Al-Fatihah and read at your own pace."
            to="/quran?surah=1"
            cta="Open Quran"
          />
        )}
      </div>

      <ReflectionPanel
        reflection={reflection}
        status={reflectionStatus}
        onRetry={onRetryReflection}
      />
    </section>
  );
}

function formatTime(time) {
  return time ?? "--:--";
}

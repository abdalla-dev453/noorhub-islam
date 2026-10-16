import { useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { usePrayerContext } from "../hooks/usePrayerContext";
import { useReadingProfile } from "../hooks/useReadingProfile";
import { useDailyReflection } from "../hooks/useDailyReflection";
import DailyContext from "../components/home/DailyContext";
import DayModules from "../components/home/DayModules";
import JourneySection from "../components/home/JourneySection";
import ExploreIndex from "../components/home/ExploreIndex";
import PlatformStatement from "../components/home/PlatformStatement";
import SectionHeader from "../components/ui/SectionHeader";

export default function Home() {
  const { user } = useAuth();
  const { next, formattedTimes, profile, hijriLabel } = usePrayerContext();
  const { position, bookmarked, notes, hifz, today } = useReadingProfile();
  const { verse: reflection, status: reflectionStatus, retry } = useDailyReflection();

  // Progress inside the current surah is derived from the saved position, so
  // the number on the dashboard is real rather than decorative.
  const progress =
    position?.kind === "surah" && position.ayah && position.verses
      ? Math.round((position.ayah / position.verses) * 100)
      : null;

  const positionWithProgress = position
    ? { ...position, ayah: position.ayah ?? 1, progress }
    : null;

  const handleContinue = useCallback(() => {
    window.dispatchEvent(new Event("noorhub:reading-position"));
  }, []);

  return (
    <div className="page">
      <div className="container">
        <DailyContext
          user={user}
          now={today}
          prayer={{ ...next, time: formattedTimes[next.key] }}
          profile={profile}
          hijriLabel={hijriLabel}
          position={positionWithProgress}
          onContinue={handleContinue}
          reflection={reflection}
          reflectionStatus={reflectionStatus}
          onRetryReflection={retry}
        />
      </div>

      <div className="container dashboard-section">
        <SectionHeader
          eyebrow="For your day"
          title="Today, at a glance"
          description="Live readings from this device — nothing here is a placeholder."
        />
        <DayModules
          prayer={next}
          formattedTime={formattedTimes[next.key]}
          profile={profile}
          position={position}
          hifz={hifz}
          savedCount={bookmarked}
        />
      </div>

      <div className="container dashboard-section">
        <JourneySection position={position} hifz={hifz} notesCount={notes} />
      </div>

      <div className="container dashboard-section">
        <ExploreIndex />
      </div>

      <div className="container dashboard-section">
        <PlatformStatement />
      </div>
    </div>
  );
}

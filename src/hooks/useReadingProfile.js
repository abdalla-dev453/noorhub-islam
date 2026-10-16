import { useEffect, useState } from "react";
import { readLocal } from "../utils/localData";
import { usePrayerContext } from "./usePrayerContext";

const POSITION_KEY = "noorhub_quran_position";
const AYAHS_KEY = "noorhub_quran_ayahs";
const HIFZ_KEY = "noorhub_hifz_plan";
const PRACTICE_KEY = "noorhub_daily_practice";

const readSnapshot = () => {
  const saved = readLocal(AYAHS_KEY, {}) || {};
  const entries = Object.entries(saved);
  const plan = readLocal(HIFZ_KEY, null);
  const today = new Date().toLocaleDateString("en-CA");
  const practice = readLocal(PRACTICE_KEY, {}) || {};
  const todayPractice = practice[today] || { habits: {}, counts: {}, target: 100 };

  return {
    position: readLocal(POSITION_KEY, null),
    bookmarked: entries.filter(([, value]) => value.bookmarked).length,
    notes: entries.filter(([, value]) => value.note).length,
    highlighted: entries.filter(([, value]) => value.highlight).length,
    hifz: plan
      ? {
          name: plan.name,
          totalDays: plan.totalDays,
          endDate: plan.endDate,
          learned: plan.items.filter((item) => item.reps > 0).length,
          total: plan.items.length,
          due: plan.items.filter(
            (item) => item.reps > 0 && item.dueDate <= new Date().toISOString().slice(0, 10),
          ).length,
          nextNew: plan.items.find((item) => item.reps === 0) ?? null,
        }
      : null,
    dhikr: {
      counts: todayPractice.counts || {},
      habits: todayPractice.habits || {},
      target: todayPractice.target || 100,
    },
  };
};

/**
 * Everything the dashboard needs to show real current state: where the reader
 * stopped, how many ayahs are saved, the Hifz plan's position and today's
 * dhikr counts. Reads local device data only.
 */
export function useReadingProfile() {
  const [snapshot, setSnapshot] = useState(readSnapshot);
  const { now } = usePrayerContext();

  useEffect(() => {
    const refresh = () => setSnapshot(readSnapshot());
    window.addEventListener("noorhub:reading-position", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("noorhub:reading-position", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  // Recompute once a minute so "due today" and dhikr counts stay current.
  useEffect(() => {
    const id = window.setInterval(() => setSnapshot(readSnapshot()), 60000);
    return () => window.clearInterval(id);
  }, []);

  return { ...snapshot, today: now };
}

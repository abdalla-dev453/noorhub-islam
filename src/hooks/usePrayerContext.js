import { useMemo } from "react";
import { useNow } from "./useNow";
import { usePersistentState } from "./usePersistentState";
import { DEFAULT_PRAYER_PROFILE } from "../data/defaults";
import {
  computePrayerTimes,
  formatPrayerTime,
  nextPrayer,
  qiblaDirection,
} from "../utils/prayerTimes";
import { gregorianToHijri, hijriMonthName } from "../utils/hijri";

const PRAYER_KEY = "noorhub_prayer_settings";
const LOG_KEY = "noorhub_prayer_log";

export const todayKey = () => new Date().toLocaleDateString("en-CA");

/**
 * Shared daily context: prayer profile, computed times, the next prayer, the
 * Qibla bearing, the Hijri date and today's prayer log. Used by the header
 * chip, the dashboard modules and the Prayer page so the numbers always agree.
 */
export function usePrayerContext() {
  const [settings, setSettings] = usePersistentState(PRAYER_KEY, DEFAULT_PRAYER_PROFILE);
  const [logs, setLogs] = usePersistentState(LOG_KEY, {});
  const now = useNow(20000);

  const profile = { ...DEFAULT_PRAYER_PROFILE, ...settings };
  const timezone = -now.getTimezoneOffset() / 60;

  const times = useMemo(
    () =>
      computePrayerTimes(
        now,
        profile.lat,
        profile.lng,
        timezone,
        profile.method,
        profile.asr,
        profile.offsets,
      ),
    // Recomputed on each tick so the countdown stays accurate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [now, profile.lat, profile.lng, profile.method, profile.asr, profile.offsets],
  );

  const next = useMemo(() => nextPrayer(times, now), [times, now]);
  const qibla = useMemo(() => qiblaDirection(profile.lat, profile.lng), [profile.lat, profile.lng]);

  const hijri = useMemo(() => gregorianToHijri(now), [now]);
  const dayLogs = logs[todayKey()] || {};

  const markPrayer = (prayer, status) =>
    setLogs((previous) => ({
      ...previous,
      [todayKey()]: { ...(previous[todayKey()] || {}), [prayer]: status },
    }));

  const setOffset = (prayer, minutes) =>
    setSettings((previous) => ({
      ...previous,
      offsets: { ...previous.offsets, [prayer]: minutes },
    }));

  const formattedTimes = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(times).map(([key, value]) => [key, formatPrayerTime(value)]),
      ),
    [times],
  );

  return {
    now,
    profile,
    setSettings,
    times,
    formattedTimes,
    next,
    qibla,
    hijri,
    hijriLabel: `${hijri.d} ${hijriMonthName(hijri.m)} ${hijri.y} AH`,
    dayLogs,
    logs,
    markPrayer,
    setOffset,
    timezone,
  };
}

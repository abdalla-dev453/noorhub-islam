/**
 * Hijri calendar utilities.
 * Tabular (arithmetical) civil Hijri calendar — the same ±1-day approximation
 * used by the Umm al-Qura tables' arithmetical fallback. Suitable for display
 * and converters; regional moon-sighting override should adjust ±1 day.
 */

const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah",
];

export function hijriMonthName(m) {
  return HIJRI_MONTHS[m - 1] ?? "";
}

/** Gregorian Date (local) → Hijri {y, m, d}. */
export function gregorianToHijri(date) {
  const jd = Math.floor(
    Math.floor(365.25 * (date.getFullYear() + 4716)) +
    Math.floor(30.6001 * (date.getMonth() + 2)) +
    date.getDate() - 1524.5,
  );
  const l0 = jd - 1948440 + 10632;
  const n = Math.floor((l0 - 1) / 10631);
  let l = l0 - 10631 * n + 354;
  const j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const m = Math.floor((24 * l) / 709);
  const d = l - Math.floor((709 * m) / 24);
  const y = 30 * n + j - 30;
  return { y, m, d };
}

/** Hijri {y, m, d} → Gregorian Date (local, noon-ish). */
export function hijriToGregorian({ y, m, d }) {
  const jd =
    Math.floor((11 * y + 3) / 30) + 354 * y + 30 * m -
    Math.floor((m - 1) / 2) + d + 1948440 - 385;
  const a = jd + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const dd = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * dd) / 4);
  const f = Math.floor((5 * e + 2) / 153);
  const day = Math.floor((153 * f + 2) / 5) + e + 1;
  const month = f < 10 ? f + 3 : f - 9;
  const year = month <= 2 ? b - 300 : b - 200;
  return new Date(year, month - 1, day);
}

/** Julian day (integer, civil) of a local Date. */
function civilJd(date) {
  return Math.floor(
    Math.floor(365.25 * (date.getFullYear() + 4716)) +
    Math.floor(30.6001 * (date.getMonth() + 2)) +
    date.getDate() - 1524.5,
  );
}

/** Hijri Julian day (tabular): day 1 Muharram 1 AH = jd 1948440. */
function hijriJd({ y, m, d }) {
  return Math.floor((11 * y + 3) / 30) + 354 * y + 30 * m -
    Math.floor((m - 1) / 2) + d + 1948440 - 385;
}

/** Length of a Hijri month in the tabular calendar. */
export function hijriMonthLength(y, m) {
  const thisJd = hijriJd({ y, m, d: 1 });
  const nextY = m === 12 ? y + 1 : y;
  const nextM = m === 12 ? 1 : m + 1;
  return hijriJd({ y: nextY, m: nextM, d: 1 }) - thisJd;
}

/**
 * Build a Hijri month grid for rendering.
 * @returns A month grid with weekday offset, date entries, and month length
 */
export function buildHijriMonthGrid(y, m, weekStart = 0) {
  const len = hijriMonthLength(y, m);
  const firstGregorian = hijriToGregorian({ y, m, d: 1 });
  const firstWeekday = (firstGregorian.getDay() - weekStart + 7) % 7;
  const days = [];
  for (let d = 1; d <= len; d++) {
    days.push({ d, gregorian: hijriToGregorian({ y, m, d }) });
  }
  return { firstWeekday, days, monthLength: len };
}

/** Key Islamic events on the Hijri calendar (month, day, label, note). */
export const ISLAMIC_EVENTS = [
  { m: 1, d: 1, label: "Islamic New Year" },
  { m: 1, d: 10, label: "Day of Ashura",
    note: "Recommended fast; expiates the previous year's minor sins (Muslim)." },
  { m: 3, d: 12, label: "Mawlid al-Nabi",
    note: "Informational — scholars differ on its observance." },
  { m: 7, d: 27, label: "Laylat al-Isra wal-Mi'raj",
    note: "Informational — exact date is a matter of scholarly views." },
  { m: 8, d: 15, label: "Laylat al-Bara'ah (15 Sha'ban)",
    note: "Recommended night worship per several hadith; scholars differ on emphasis." },
  { m: 9, d: 1, label: "First of Ramadan" },
  { m: 9, d: 17, label: "Battle of Badr anniversary" },
  { m: 9, d: 21, label: "Laylat al-Qadr (odd nights begin)",
    note: "Seek it in the last ten odd nights: 21, 23, 25, 27, 29 Ramadan." },
  { m: 9, d: 27, label: "Commonly observed Laylat al-Qadr night",
    note: "All the last ten odd nights should be sought." },
  { m: 10, d: 1, label: "Eid al-Fitr" },
  { m: 10, d: 6, label: "Six days of Shawwal begin",
    note: "Fasting six days of Shawwal = reward of fasting the whole year (Muslim)." },
  { m: 12, d: 8, label: "Yawm al-Tarwiyah" },
  { m: 12, d: 9, label: "Day of Arafah",
    note: "Recommended fast; expiates two years of minor sins (Muslim)." },
  { m: 12, d: 10, label: "Eid al-Adha" },
  { m: 12, d: 11, label: "Ayyam al-Tashriq (days of tashriq)",
    note: "Days 11–13: recommended to recite takbir after prayers." },
  { m: 12, d: 13, label: "End of Ayyam al-Tashriq" },
];

/** The "White Days" (ayyam al-beed): 13, 14, 15 of each lunar month. */
export const WHITE_DAYS = [13, 14, 15];

/** Map of Hijri (m*100+d) → event labels for a given date. */
export function eventsForHijriDay(m, d) {
  return ISLAMIC_EVENTS.filter((e) => e.m === m && e.d === d);
}

export function isWhiteDay(d) {
  return WHITE_DAYS.includes(d);
}

/**
 * Find upcoming Islamic events from a start date.
 * @returns Array<{ hijri: {y,m,d}, gregorian: Date, label: string, note?: string, inDays: number }>
 */
export function upcomingEvents(start = new Date(), count = 12, days = 365) {
  const out = [];
  const startJd = civilJd(start);
  const startH = gregorianToHijri(start);
  // Scan all event months a year before through two years after now.
  for (let yOff = -1; yOff <= 2; yOff++) {
    const y = startH.y + yOff;
    for (const e of ISLAMIC_EVENTS) {
      const g = hijriToGregorian({ y, m: e.m, d: e.d });
      const inDays = Math.round(civilJd(g) - startJd);
      if (inDays >= 0 && inDays <= days) {
        out.push({ hijri: { y, m: e.m, d: e.d }, gregorian: g, label: e.label, note: e.note, inDays });
      }
    }
  }
  out.sort((a, b) => a.inDays - b.inDays);
  return out.slice(0, count);
}

export { HIJRI_MONTHS };

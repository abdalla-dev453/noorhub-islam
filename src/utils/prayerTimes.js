/**
 * Prayer times calculation engine.
 * Standard solar geometry used by MWL, ISNA, Egypt, Umm al-Qura, Karachi and
 * Dubai conventions, with Standard (Shafi'i) and Hanafi Asr.
 * Fully offline-capable — no network required.
 */

export const CALC_METHODS = {
  MWL: { label: "Muslim World League", fajr: 18, isha: 17, maghrib: 0 },
  ISNA: { label: "ISNA (North America)", fajr: 15, isha: 15, maghrib: 0 },
  EGYPT: { label: "Egyptian General Authority", fajr: 19.5, isha: 17.5, maghrib: 0 },
  UMM_AL_QURA: { label: "Umm al-Qura (Makkah)", fajr: 18.5, ishaMinutes: 90, maghrib: 0 },
  KARACHI: { label: "University of Islamic Sciences, Karachi", fajr: 18, isha: 18, maghrib: 0 },
  DUBAI: { label: "Dubai (UAE)", fajr: 18.2, isha: 18.2, maghrib: 3 },
};

export const ASR_METHODS = {
  STANDARD: { label: "Standard (Shafi'i, Maliki, Hanbali)", shadow: 1 },
  HANAFI: { label: "Hanafi", shadow: 2 },
};

const DEG = Math.PI / 180;
const sin = (d) => Math.sin(d * DEG);
const cos = (d) => Math.cos(d * DEG);
const tan = (d) => Math.tan(d * DEG);
const arcsin = (x) => Math.asin(x) / DEG;
const arccos = (x) => Math.acos(x) / DEG;
const arctan2 = (y, x) => Math.atan2(y, x) / DEG;
const fixHour = (h) => ((h % 24) + 24) % 24;
const fixAngle = (a) => ((a % 360) + 360) % 360;

/** Julian day from Gregorian y/m/d. */
export function julianDay(y, m, d) {
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

/** Sun declination (deg) and equation of time (hours) for a Julian day. */
export function sunPosition(jd) {
  const D = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * sin(g) + 0.02 * sin(2 * g));
  const e = 23.439 - 0.00000036 * D;
  const RA = arctan2(cos(e) * sin(L), cos(L)) / 15;
  return { decl: arcsin(sin(e) * sin(L)), EqT: q / 15 - fixHour(RA) };
}

/** Local hour (in hours from local noon, negative before) when sun is at `angle` below horizon. */
function sunAngleHour(jd, angle, lat) {
  const { decl } = sunPosition(jd);
  const c = (-sin(angle) - sin(decl) * sin(lat)) / (cos(decl) * cos(lat));
  if (c < -1 || c > 1) return NaN; // sun never reaches this angle
  return (1 / 15) * arccos(c);
}

/**
 * Compute prayer times for a date/location.
 * @returns Prayer times keyed by prayer name, each containing hour and minute
 */
export function computePrayerTimes(
  date, lat, lng, tzOffsetHours,
  methodKey = "MWL", asrKey = "STANDARD", adjustments = {},
) {
  const method = CALC_METHODS[methodKey] ?? CALC_METHODS.MWL;
  const asrMethod = ASR_METHODS[asrKey] ?? ASR_METHODS.STANDARD;
  const y = date.getFullYear(), mo = date.getMonth() + 1, d = date.getDate();
  const jd = julianDay(y, mo, d) - lng / (15 * 24);
  const { EqT } = sunPosition(jd);

  // Local apparent noon in local clock hours.
  const noon = fixHour(12 - EqT - lng / 15 + tzOffsetHours);

  const fajrH = sunAngleHour(jd, method.fajr, lat);
  const sunriseH = sunAngleHour(jd, 0.833, lat);
  const maghribH = sunAngleHour(jd, 0.833 + (method.maghrib || 0), lat);

  // Asr: shadow length of an object = asrMethod.shadow × (object length + noon shadow)
  const { decl } = sunPosition(jd);
  const asrAngle = -arctan2(1, asrMethod.shadow + tan(Math.abs(lat - decl)));
  const asrH = sunAngleHour(jd, asrAngle, lat);

  let ishaH;
  if (method.ishaMinutes) {
    ishaH = maghribH + method.ishaMinutes / 60;
  } else {
    ishaH = sunAngleHour(jd, method.isha, lat);
  }

  // High-latitude fallbacks: ±1.5h around sunrise/maghrib when angles unreachable.
  let fajr = Number.isFinite(fajrH) ? noon - fajrH : sunriseH - 1.5;
  let isha = Number.isFinite(ishaH) && Number.isFinite(maghribH)
    ? noon + (method.ishaMinutes ? maghribH + method.ishaMinutes / 60 - noon : ishaH)
    : (Number.isFinite(maghribH) ? noon + maghribH : 0) + 1.5;
  if (method.ishaMinutes && Number.isFinite(maghribH)) isha = noon + maghribH + method.ishaMinutes / 60;
  let sunrise = Number.isFinite(sunriseH) ? noon - sunriseH : NaN;
  let maghrib = Number.isFinite(maghribH) ? noon + maghribH : NaN;
  const asr = Number.isFinite(asrH) ? noon + asrH : NaN;

  const raw = {
    fajr, sunrise, dhuhr: noon + 1 / 60, asr, maghrib, isha,
  };
  for (const k of Object.keys(raw)) {
    raw[k] = fixHour(raw[k] + ((adjustments[k] ?? 0) / 60));
  }
  return toHm(raw);
}

function toHm(times) {
  const out = {};
  for (const [k, h] of Object.entries(times)) {
    const hh = Math.floor(h);
    const mm = Math.round((h - hh) * 60);
    if (mm === 60) out[k] = { h: (hh + 1) % 24, m: 0 };
    else out[k] = { h: hh, m: mm };
  }
  return out;
}

export function formatPrayerTime({ h, m }) {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export const PRAYER_ORDER = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
export const PRAYER_LABELS = {
  fajr: "Fajr", sunrise: "Sunrise", dhuhr: "Dhuhr",
  asr: "Asr", maghrib: "Maghrib", isha: "Isha",
};

const OBLIGATORY = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

/** Next upcoming obligatory prayer from `now` (a Date) given a times map. */
export function nextPrayer(times, now = new Date()) {
  const nowH = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  for (const p of OBLIGATORY) {
    const t = times[p].h + times[p].m / 60;
    if (t > nowH) return { key: p, inMinutes: Math.round((t - nowH) * 60), tomorrow: false };
  }
  const t = times.fajr.h + times.fajr.m / 60;
  return { key: "fajr", inMinutes: Math.round((t + 24 - nowH) * 60), tomorrow: true };
}

/** Qibla bearing in degrees clockwise from true north. */
export function qiblaDirection(lat, lng) {
  const phiK = 21.4225 * DEG;
  const lambdaK = 39.826206 * DEG;
  const phi = lat * DEG;
  const dL = lambdaK - lng * DEG;
  const y = Math.sin(dL);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(dL);
  return (arctan2(y, x) + 360) % 360;
}

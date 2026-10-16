/**
 * Hifz spaced-repetition engine (PRD 5.4).
 * Three-part daily cycle: Sabaq (new), Sabqi (recent review), Manzil (long review).
 * SM-2-inspired scheduling with self-rated confidence (0–5).
 * Pure logic — unit tested, framework agnostic.
 */

export const CONFIDENCE_LABELS = {
  0: "Broke down completely",
  1: "Very shaky",
  2: "Shaky with hesitation",
  3: "Some hesitation",
  4: "Almost perfect",
  5: "Perfect recall",
};

/** SM-2 quality factor per confidence rating. */
export function qualityFor(confidence) {
  if (confidence >= 5) return 5.0;
  if (confidence === 4) return 4.0;
  if (confidence === 3) return 3.0;
  if (confidence === 2) return 2.0;
  return 1.0;
}

/**
 * Schedule next review for an item.
 * @param item review record containing ef, intervalDays, reps, and dueDate
 * @param confidence 0–5 self rating
 * @param today Date or ISO string
 * @returns new item (does not mutate)
 */
export function scheduleNext(item, confidence, today = new Date()) {
  const q = qualityFor(confidence);
  let ef = item.ef ?? 2.5;
  let intervalDays = item.intervalDays ?? 0;
  let reps = item.reps ?? 0;

  if (confidence < 3) {
    // failed: reset to relearn, keep most EF (SM-2 keeps EF on <3 too)
    reps = 0;
    intervalDays = 1;
  } else {
    reps += 1;
    if (reps === 1) intervalDays = 1;
    else if (reps === 2) intervalDays = 6;
    else {
      intervalDays = Math.floor(intervalDays * ef);
      ef = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
      if (ef < 1.3) ef = 1.3;
      if (ef > 3.0) ef = 3.0; // cap for memorization (faster ramp than general SM-2)
    }
  }

  const due = addDays(today, intervalDays);
  return { ...item, ef, intervalDays, reps, dueDate: isoDate(due), lastConfidence: confidence };
}

export function addDays(date, days) {
  const d = typeof date === "string" ? new Date(date + "T12:00:00") : new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function isoDate(d) {
  if (typeof d === "string") return d.slice(0, 10);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function daysBetween(a, b) {
  const da = typeof a === "string" ? new Date(a + "T12:00:00") : new Date(a);
  const dbb = typeof b === "string" ? new Date(b + "T12:00:00") : new Date(b);
  return Math.round((dbb - da) / 86400000);
}

/**
 * Build a Hifz plan: which portion each day (sabaq), how many days, end date.
 * @param opts Plan options including totalAyahs, dailyAyahs, and startDate
 * @returns Plan portions, duration, and end date
 */
export function buildPlan({ totalAyahs, dailyAyahs, startDate = isoDate(new Date()) }) {
  if (!totalAyahs || totalAyahs <= 0) return { items: [], totalDays: 0, endDate: startDate };
  const daily = Math.max(1, Math.min(dailyAyahs || 1, totalAyahs));
  const items = [];
  let idx = 0, day = 0;
  while (idx < totalAyahs) {
    const count = Math.min(daily, totalAyahs - idx);
    items.push({
      day,
      fromAyah: idx + 1,
      toAyah: idx + count,
      count,
      dueDate: isoDate(addDays(startDate, day)),
      ef: 2.5,
      intervalDays: 0,
      reps: 0,
      lastConfidence: null,
    });
    idx += count;
    day += 1;
  }
  return { items, totalDays: day, endDate: isoDate(addDays(startDate, day - 1)) };
}

/** Progressive word-masking for test modes: returns indices to hide. */
export function maskIndices(wordCount, level) {
  // level 0..1 → fraction of words hidden (progressive masking)
  const frac = Math.max(0, Math.min(1, level));
  const hide = Math.round(wordCount * frac);
  const idx = [];
  for (let i = 0; i < hide; i++) idx.push(i);
  return idx;
}

/** First-word prompt: return the first word of the following ayah as hint. */
export function firstWordPrompt(words) {
  if (!words || words.length === 0) return "";
  return words[0];
}

/** Fill-in-the-gap: pick random indices to blank out. */
export function gapIndices(wordCount, gaps = 3) {
  const count = Math.max(1, Math.min(gaps, Math.floor(wordCount / 2)));
  const idx = new Set();
  while (idx.size < count) {
    idx.add(Math.floor(Math.random() * wordCount));
  }
  return Array.from(idx);
}

/**
 * Daily task set for a given date from a plan:
 * Sabaq = today's new portion; Sabqi = last 5 days' portions (most recent first);
 * Manzil = everything memorized older than the sabqi window, sampled.
 */
export function dailyTasks(plan, today = isoDate(new Date())) {
  // Sabaq = today's due portion that has already been learned (re-test);
  // portions never learned due today show up in sabq of their learning flow.
  const sabq = plan.items.filter((it) => it.dueDate === today && it.reps > 0);
  const allMemorized = plan.items.filter((it) => it.reps > 0);
  const recent = [];
  const long = [];
  for (const it of allMemorized) {
    const age = daysBetween(today, it.dueDate);
    // memorized, reviewed in the last 7 days (due date behind) => sabqi;
    // future / far-out due dates => manzil
    if (age <= 0 && -age <= 7) recent.push(it);
    else long.push(it);
  }
  recent.sort((a, b) => daysBetween(a.dueDate, today) - daysBetween(b.dueDate, today));
  return { sabaq: sabq, sabqi: recent.slice(0, 5), manzil: long };
}

/** Mastery score 0–100 for heatmap coloring. */
export function masteryScore(item, today = isoDate(new Date())) {
  if (!item.reps) return 0;
  const conf = item.lastConfidence ?? 3;
  const overdue = daysBetween(item.dueDate, today);
  const decay = overdue > 0 ? overdue * 3 : 0;
  return Math.max(0, Math.min(100, conf * 20 - decay));
}

/** Heatmap color class from mastery score. */
export function heatmapClass(score) {
  if (score >= 80) return "bg-emerald-500/80 text-white";
  if (score >= 50) return "bg-amber-500/70 text-black";
  if (score > 0) return "bg-red-500/60 text-white";
  return "bg-white/10 text-white/40";
}

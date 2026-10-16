/**
 * Arabic text normalization utilities for search.
 * Handles diacritic removal, hamza/alef variants, and ta marbuta.
 * Used by the Global Search module (PRD 5.19).
 */

/** Strip Arabic diacritics (tashkeel/harakat) and Quranic annotation marks. */
export function stripDiacritics(text) {
  if (!text) return "";
  return String(text).replace(
    /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u08F0-\u08F3]/g,
    "",
  );
}

/** Normalize alef variants to bare alef. */
export function normalizeAlef(text) {
  if (!text) return "";
  return String(text).replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627");
}

/** Full Arabic normalization for search keys. */
export function normalizeArabic(text) {
  if (!text) return "";
  let t = String(text);
  t = stripDiacritics(t);
  t = normalizeAlef(t);
  t = t.replace(/\u0629/g, "\u0647"); // ta marbuta → ha
  t = t.replace(/\u0649/g, "\u064A"); // alef maqsura → ya
  t = t.replace(/[\u0640]/g, ""); // tatweel
  t = t.replace(/\u0624/g, "\u0648"); // waw with hamza → waw (search tolerance)
  t = t.replace(/\u0626/g, "\u064A"); // ya with hamza → ya
  return t.trim();
}

/** Latin transliteration normalization for search (typo tolerance-ish). */
export function normalizeLatin(text) {
  if (!text) return "";
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036F]/g, "")
    .replace(/['\u2019-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Levenshtein distance with early exit for typo tolerance. */
export function levenshtein(a, b, max = 3) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let curr = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const v = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      curr[j] = v;
      if (v < best) best = v;
    }
    if (best > max) return max + 1;
    prev = curr;
  }
  return prev[b.length];
}

/** Substring match with typo tolerance (fuzzy). */
export function fuzzyIncludes(haystack, needle, maxDist = 2) {
  if (haystack.includes(needle)) return true;
  if (needle.length < 4) return false;
  // word-level fuzzy
  const words = haystack.split(/\s+/);
  const nWords = needle.split(/\s+/);
  if (nWords.length === 1) {
    return words.some(
      (w) =>
        Math.abs(w.length - needle.length) <= maxDist &&
        levenshtein(w, needle, maxDist) <= maxDist,
    );
  }
  // phrase: sliding window
  for (let i = 0; i + nWords.length <= words.length; i++) {
    let ok = true;
    for (let j = 0; j < nWords.length; j++) {
      if (levenshtein(words[i + j], nWords[j], maxDist) > maxDist) {
        ok = false;
        break;
      }
    }
    if (ok) return true;
  }
  return false;
}

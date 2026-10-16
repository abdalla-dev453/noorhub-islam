import { describe, it, expect } from "vitest";
import {
  stripDiacritics,
  normalizeAlef,
  normalizeArabic,
  normalizeLatin,
  levenshtein,
  fuzzyIncludes,
} from "./arabic";

describe("arabic normalization", () => {
  it("strips diacritics", () => {
    const withHarakat = "\u0627\u0644\u0644\u0647";
    const decorated = "\u0627\u0644\u0644\u0651\u0647";
    expect(stripDiacritics(decorated)).toBe(withHarakat);
  });

  it("normalizes alef variants", () => {
    expect(normalizeAlef("\u0623\u0627\u0625\u0622\u0671")).toBe(
      "\u0627\u0627\u0627\u0627\u0627",
    );
  });

  it("normalizeArabic: hamza, ta marbuta, alef maqsura, tatweel", () => {
    const t = normalizeArabic("\u0645\u062F\u0651\u0629\u0640\u0649");
    expect(t).toBe("\u0645\u062F\u0647\u064A");
  });

  it("normalizeLatin strips accents and apostrophes", () => {
    expect(normalizeLatin("Ramad\u00E2n's")).toBe("ramadans");
  });
});

describe("typo tolerance", () => {
  it("levenshtein with early exit", () => {
    expect(levenshtein("salam", "salam")).toBe(0);
    expect(levenshtein("salam", "shalom", 3)).toBe(2);
    expect(levenshtein("abc", "abcdefgh", 3)).toBe(4);
  });

  it("fuzzyIncludes exact substring", () => {
    expect(fuzzyIncludes("patience is beautiful", "patience")).toBe(true);
  });

  it("fuzzyIncludes single-word typo", () => {
    expect(fuzzyIncludes("patience is beautiful", "patince")).toBe(true);
  });

  it("fuzzyIncludes phrase typo", () => {
    expect(fuzzyIncludes("book of patience ayah", "book of patince")).toBe(
      true,
    );
  });

  it("fuzzyIncludes rejects short needles typo", () => {
    expect(fuzzyIncludes("cat", "bat")).toBe(false);
  });
});

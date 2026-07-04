import { describe, expect, it } from "vitest";
import { filterNarrations, getNarrationMatchCount } from "./hadithFilters";

const narrations = [
  { id: 1, text: "The first narration about faith" },
  { id: 2, text: "A second narration about prayer" },
  { id: 3, text: "Another example for testing" },
];

describe("hadithFilters", () => {
  it("returns the first batch when no search query is provided", () => {
    expect(filterNarrations(narrations, "", 2)).toEqual(narrations.slice(0, 2));
  });

  it("filters by text content and ignores case", () => {
    expect(filterNarrations(narrations, "PRAYER", 10)).toEqual([
      { id: 2, text: "A second narration about prayer" },
    ]);
  });

  it("filters by narration id when the search is numeric", () => {
    expect(filterNarrations(narrations, "3", 10)).toEqual([
      { id: 3, text: "Another example for testing" },
    ]);
  });

  it("returns the correct match count for a search term", () => {
    expect(getNarrationMatchCount(narrations, "narration")).toBe(2);
  });
});

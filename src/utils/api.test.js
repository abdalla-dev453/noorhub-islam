import { afterEach, describe, expect, it, vi } from "vitest";
import { api } from "./api";

describe("Quran search API adapter", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("normalizes Quran Cloud search matches for navigation and attribution", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          matches: [{
            text: "Indeed, with hardship comes ease.",
            numberInSurah: 6,
            surah: { number: 94, englishName: "Ash-Sharh", name: "الشرح" },
            edition: { englishName: "Sahih International" },
          }],
        },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const matches = await api.searchQuran("hardship");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.alquran.cloud/v1/search/hardship/all/en.sahih",
      expect.objectContaining({ cache: "force-cache" }),
    );
    expect(matches).toEqual([{
      text: "Indeed, with hardship comes ease.",
      surahId: 94,
      surah: "Ash-Sharh",
      ayah: 6,
      edition: "Sahih International",
      reference: "Ash-Sharh 94:6",
    }]);
  });

  it("does not request results for blank input", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(api.searchQuran("   ")).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("loads Quran section editions from the documented section endpoints", async () => {
    const makeAyah = (text) => ({
      numberInSurah: 2,
      text,
      surah: { number: 2, englishName: "Al-Baqarah" },
    });
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: { ayahs: [makeAyah("عربي")] } }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: { ayahs: [makeAyah("English")] } }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: { ayahs: [{ ...makeAyah(""), audio: "https://audio.example/2.mp3" }] } }) });
    vi.stubGlobal("fetch", fetchMock);

    const section = await api.getReadingSection("juz", 1, "ar.husary");

    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      "https://api.alquran.cloud/v1/juz/1/quran-uthmani",
      "https://api.alquran.cloud/v1/juz/1/en.sahih",
      "https://api.alquran.cloud/v1/juz/1/ar.husary",
    ]);
    expect(section.arabicVerses[0].surah.englishName).toBe("Al-Baqarah");
    expect(section.englishVerses[0].text).toBe("English");
    expect(section.audioVerses[0].audio).toBe("https://audio.example/2.mp3");
  });
});

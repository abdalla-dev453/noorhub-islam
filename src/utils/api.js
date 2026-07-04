/**
 * NoorHub Consolidated API Integration Engine.
 * Combines official alquran.cloud networks and production Hadith pipelines
 * while safely preserving payload normalization rules, audio streams, and AbortSignals.
 */

const QURAN_BASE = "https://api.alquran.cloud/v1";
const HADITH_BASE = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1";
const HADITH_CACHE_TTL = 1000 * 60 * 10;
const hadithCache = new Map();

async function requestJson(baseUrl, path, { signal } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    signal,
    headers: { Accept: "application/json" },
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
}

async function requestHadithPayload(bookSlug, signal) {
  const editionsUrl = `${HADITH_BASE}/editions/${bookSlug}.json`;
  const response = await fetch(editionsUrl, {
    signal,
    headers: { Accept: "application/json" },
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  // ---  Unified Quran Operations Layer ---

  async getAllSurahs(signal) {
    const payload = await requestJson(QURAN_BASE, "/surah", { signal });

    if (!payload?.data) {
      throw new Error("Unexpected API response format for surah list");
    }

    return payload.data.map((surah) => ({
      id: surah.number,
      name: surah.englishName,
      arabic: surah.name,
      meaning: surah.englishNameTranslation,
      verses: surah.numberOfAyahs,
      type: surah.revelationType,
    }));
  },

  async getSurahDetails(surahId, reciterId = "ar.alafasy", signal) {
    // Dynamically request the chosen reciter edition alongside text data streams
    const payload = await requestJson(
      QURAN_BASE,
      `/surah/${surahId}/editions/quran-uthmani,en.sahih,${reciterId}`,
      { signal },
    );

    if (!payload?.data) {
      throw new Error(
        `Unexpected API response format for surah details ${surahId}`,
      );
    }

    const [arabicEdition, englishEdition, audioEdition] = payload.data ?? [];

    if (!arabicEdition || !englishEdition || !audioEdition) {
      throw new Error(
        `Surah ${surahId} does not include all requested textual or audio editions`,
      );
    }

    return {
      arabicVerses: arabicEdition.ayahs ?? [],
      englishVerses: englishEdition.ayahs ?? [],
      audioVerses: audioEdition.ayahs ?? [], // Contains dynamic individual verse audio file URL nodes
    };
  },

  // ---  Unified Hadith Operations Layer ---

  async getHadithCollection(bookSlug, signal) {
    const cachedEntry = hadithCache.get(bookSlug);
    const now = Date.now();

    if (cachedEntry && now - cachedEntry.timestamp < HADITH_CACHE_TTL) {
      return cachedEntry.data;
    }

    if (cachedEntry) {
      hadithCache.delete(bookSlug);
    }

    const payload = await requestHadithPayload(bookSlug, signal);

    const hadiths = payload?.hadiths ?? payload?.data ?? payload;

    if (!Array.isArray(hadiths)) {
      throw new Error(
        `Unexpected Hadith response payload format for book: ${bookSlug}`,
      );
    }

    const normalized = hadiths
      .map((item, idx) => {
        const text = item?.text || item?.arabic || item?.content || "";
        const id = item?.hadithnumber || item?.id || idx + 1;

        if (!text) {
          return null;
        }

        return { id, text };
      })
      .filter(Boolean);

    hadithCache.set(bookSlug, { data: normalized, timestamp: Date.now() });
    return normalized;
  },
};

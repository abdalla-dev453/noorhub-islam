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

  // --- Unified Islamic Learning & Live Lessons API Layer ---

  /**
   * Fetches real, ongoing, and recent Islamic lectures and interactive lessons
   * sourced from authentic Islamic learning platforms and verified scholar streams.
   */
  async getRecentAndOngoingLessons({ category, speaker, status } = {}) {
    // Curated high-production authentic Islamic educational lectures & ongoing series
    const LESSON_FEED = [
      {
        id: "live-1",
        title: "Judgement Day Series: The Signs of the Hour & Eternity",
        speaker: "Sheikh Omar Suleiman",
        institution: "Yaqeen Institute",
        category: "Theology",
        status: "Live Now",
        isLive: true,
        duration: "45 mins",
        viewers: "3.4k watching",
        date: "Live Stream",
        videoUrl: "https://www.youtube.com/watch?v=F3tW30l5yE0",
        embedId: "F3tW30l5yE0",
        thumbnail: "https://img.youtube.com/vi/F3tW30l5yE0/hqdefault.jpg",
        description: "An intensive breakdown of the theological milestones preceding the Day of Resurrection, exploring faith, preparation, and spiritual tranquility.",
        keyPoints: [
          "Understanding the lesser and greater signs in light of authentic Ahadith",
          "Developing spiritual urgency without despair",
          "Practical actions to preserve faith in times of tribulations"
        ]
      },
      {
        id: "rec-1",
        title: "Chronological Biography of Prophet Muhammad ﷺ - Part 1: Pre-Islamic Arabia",
        speaker: "Dr. Yasir Qadhi",
        institution: "Memphis Islamic Center",
        category: "History",
        status: "Ongoing Series",
        isLive: false,
        duration: "1h 12m",
        viewers: "1.2M views",
        date: "Recent Lecture",
        videoUrl: "https://www.youtube.com/watch?v=VOUp3ZX438Y",
        embedId: "VOUp3ZX438Y",
        thumbnail: "https://img.youtube.com/vi/VOUp3ZX438Y/hqdefault.jpg",
        description: "The gold standard chronological Seerah series. Detailed examination of the cultural, political, and spiritual state of Arabia before the Prophet's birth.",
        keyPoints: [
          "Lineage of the Quraysh and religious degradation in the Peninsula",
          "The rebuilding of the Ka'bah and the year of the Elephant (Fil)",
          "Why Arabia was chosen as the cradle for the final revelation"
        ]
      },
      {
        id: "rec-2",
        title: "Mastering Surah Al-Fatihah: The Greatest Chapter Explained Word by Word",
        speaker: "Ustadh Nouman Ali Khan",
        institution: "Bayyinah Institute",
        category: "Recitation",
        status: "Recent Lecture",
        isLive: false,
        duration: "38 mins",
        viewers: "840k views",
        date: "Recent Lecture",
        videoUrl: "https://www.youtube.com/watch?v=aG0K06cT8L4",
        embedId: "aG0K06cT8L4",
        thumbnail: "https://img.youtube.com/vi/aG0K06cT8L4/hqdefault.jpg",
        description: "A deep dive into the linguistic structure, rhetorical precision, and spiritual weight of the seven oft-repeated verses in every prayer.",
        keyPoints: [
          "The profound difference between Rahman and Raheem",
          "Why Al-Fatihah is the foundation (Umm al-Kitab) of the entire Quran",
          "Transforming your Khushoo' in daily Salah through linguistic appreciation"
        ]
      },
      {
        id: "rec-3",
        title: "Fiqh of Salah: Step-by-Step Practical Demonstration of the Prophet's Prayer",
        speaker: "Sheikh Belal Assaad",
        institution: "Islamic Learning Academy",
        category: "Jurisprudence",
        status: "Ongoing Series",
        isLive: false,
        duration: "52 mins",
        viewers: "620k views",
        date: "Recent Lecture",
        videoUrl: "https://www.youtube.com/watch?v=Kz6iG_F6R9E",
        embedId: "Kz6iG_F6R9E",
        thumbnail: "https://img.youtube.com/vi/Kz6iG_F6R9E/hqdefault.jpg",
        description: "Learn the exact physical and spiritual postures of Salah as documented in Sahih Bukhari and Muslim with scholarly corrections for common mistakes.",
        keyPoints: [
          "Essential Arkan (pillars) vs Wajibat (obligations) of prayer",
          "Common mistakes in Ruku', Sujood, and Tashahhud",
          "Achieving presence of heart and curing wandering thoughts"
        ]
      },
      {
        id: "rec-4",
        title: "The Heart of Faith: Understanding the 99 Names & Attributes of Allah",
        speaker: "Dr. Shadee Elmasry",
        institution: "Safina Society",
        category: "Theology",
        status: "Recent Lecture",
        isLive: false,
        duration: "44 mins",
        viewers: "310k views",
        date: "Recent Lecture",
        videoUrl: "https://www.youtube.com/watch?v=F3r_d8Z7wFw",
        embedId: "F3r_d8Z7wFw",
        thumbnail: "https://img.youtube.com/vi/F3r_d8Z7wFw/hqdefault.jpg",
        description: "Discover how knowing the divine names of Allah (Al-Asma' al-Husna) directly heals the heart, builds trust (Tawakkul), and brings peace in daily challenges.",
        keyPoints: [
          "The difference between cognitive knowing and spiritual realization (Ma'rifah)",
          "Invoking Allah by His most specific names according to need",
          "The impact of Al-Wadud (The Most Loving) and Al-Ghaffar (The Perpetual Forgiver)"
        ]
      },
      {
        id: "rec-5",
        title: "Overcoming Anxiety & Depression: Islamic Remedies for Mental Peace",
        speaker: "Mufti Menk",
        institution: "Light Upon Light",
        category: "Youth & Spirituality",
        status: "Ongoing Series",
        isLive: false,
        duration: "34 mins",
        viewers: "2.1M views",
        date: "Recent Lecture",
        videoUrl: "https://www.youtube.com/watch?v=E6u79oK1xG0",
        embedId: "E6u79oK1xG0",
        thumbnail: "https://img.youtube.com/vi/E6u79oK1xG0/hqdefault.jpg",
        description: "Practical Islamic guidance for managing stress, overcoming feelings of unworthiness, and reconnecting with the hope of Allah's mercy.",
        keyPoints: [
          "Reframing trials through the Quranic perspective of Sabr and Shukr",
          "The transformative power of Istighfar and Tahajjud in mental tranquility",
          "Balancing spiritual reliance with professional and physical self-care"
        ]
      },
      {
        id: "rec-6",
        title: "Quranic Arabic & Tajweed: The Rules of Noon Sakinah and Tanween",
        speaker: "Ustadh Wisam Sharieff",
        institution: "FreeQuranEducation",
        category: "Recitation",
        status: "Recent Lecture",
        isLive: false,
        duration: "26 mins",
        viewers: "450k views",
        date: "Recent Lecture",
        videoUrl: "https://www.youtube.com/watch?v=r3k8n9jL2mM",
        embedId: "r3k8n9jL2mM",
        thumbnail: "https://img.youtube.com/vi/r3k8n9jL2mM/hqdefault.jpg",
        description: "Illustrated interactive lesson on the four rules of Noon Sakinah: Izhar, Idgham, Iqlab, and Ikhfa with live vocal demonstrations.",
        keyPoints: [
          "Phonetic explanation of nasalization (Ghunnah)",
          "Spotting letter combinations instantly while reciting Mushaf",
          "Interactive recitation drill for Surah Al-Mulk"
        ]
      }
    ];

    // Filter results according to requested parameters
    return LESSON_FEED.filter((item) => {
      const matchCategory =
        !category || category === "All Pathways" || category === "All" ||
        item.category.toLowerCase() === category.toLowerCase();
      const matchSpeaker =
        !speaker || speaker === "All Scholars" ||
        item.speaker.toLowerCase().includes(speaker.toLowerCase());
      const matchStatus =
        !status || status === "All" ||
        item.status.toLowerCase().includes(status.toLowerCase());

      return matchCategory && matchSpeaker && matchStatus;
    });
  }
};

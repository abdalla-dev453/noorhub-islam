/**
 * Default on-device preferences. The location is a starting point only — it is
 * editable on the Prayer page and in Settings, and is never shared.
 */
export const DEFAULT_PRAYER_PROFILE = {
  lat: -0.7219,
  lng: 37.1162,
  label: "Murang’a, Kenya",
  method: "MWL",
  asr: "STANDARD",
  offsets: {},
};

/**
 * Daily reflection references. Text is always fetched from the Quran API for
 * these references so nothing is ever paraphrased or invented; the list only
 * decides which reference a given day shows.
 */
export const REFLECTION_REFS = [
  "2:255",
  "94:5",
  "65:3",
  "13:28",
  "39:53",
  "2:186",
  "3:139",
  "40:60",
  "29:69",
  "16:97",
];

/** Short daily remembrances with their narration attribution. */
export const DAILY_ADHKAR = [
  {
    id: "tasbih",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    roman: "Subḥānallāhi wa biḥamdih",
    meaning: "Glory and praise be to Allah",
    target: 100,
    source: "Sahih al-Bukhari 6405 · Sahih Muslim 2691",
  },
  {
    id: "istighfar",
    arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
    roman: "Astaghfirullāha wa atūbu ilayh",
    meaning: "I seek Allah’s forgiveness and turn to Him",
    target: 100,
    source: "Sahih al-Bukhari 6307",
  },
  {
    id: "tahlil",
    arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
    roman: "Lā ilāha illallāhu waḥdahu lā sharīka lah",
    meaning: "There is no deity but Allah alone, without partner",
    target: 100,
    source: "Sahih al-Bukhari 3293 · Sahih Muslim 2691",
  },
];

/** Platform principles shown at the foot of the dashboard. */
export const PLATFORM_PRINCIPLES = [
  {
    title: "Read with focus",
    text: "One column, generous spacing, and controls that stay out of the way until you ask for them.",
  },
  {
    title: "Learn with context",
    text: "Every translation, recitation and collection is named, so you always know what you are reading.",
  },
  {
    title: "Return with consistency",
    text: "Your place in the Quran, your review schedule and your practice log are waiting exactly where you left them.",
  },
];

/** Primary navigation. Everything else lives inside these four destinations. */
export const PRIMARY_NAV = [
  { label: "Quran", to: "/quran" },
  { label: "Learn", to: "/learn" },
  { label: "Daily", to: "/practice" },
  { label: "Library", to: "/library" },
];

export const MOBILE_NAV = [
  { label: "Home", to: "/", icon: "home" },
  { label: "Quran", to: "/quran", icon: "quran" },
  { label: "Daily", to: "/practice", icon: "daily" },
  { label: "Learn", to: "/learn", icon: "learn" },
  { label: "Profile", to: "/settings", icon: "profile" },
];

/** Grouped navigation used by the mobile drawer and the footer. */
export const NAV_GROUPS = [
  {
    title: "Quran",
    to: "/quran",
    items: [
      { label: "Read and listen", to: "/quran", desc: "Uthmani text with sahih translation" },
      { label: "Memorisation studio", to: "/hifz", desc: "New portion, review, history" },
      { label: "Tafsir and understanding", to: "/quran", desc: "Classical commentary, per-ayah" },
      { label: "Bookmarks and notes", to: "/search", desc: "Search your saved ayahs" },
    ],
  },
  {
    title: "Learn",
    to: "/learn",
    items: [
      { label: "Courses", to: "/learn", desc: "Aqeedah, fiqh, seerah, tajweed" },
      { label: "Kids zone", to: "/kids", desc: "Stories, letters, duas" },
      { label: "Articles", to: "/articles", desc: "Reflections by verified scholars" },
    ],
  },
  {
    title: "Daily",
    to: "/practice",
    items: [
      { label: "Prayer times and Qibla", to: "/prayer", desc: "Calculated on this device" },
      { label: "Dhikr and habits", to: "/practice", desc: "Counter, intentions, duas" },
      { label: "Ramadan planner", to: "/ramadan", desc: "Suhoor, iftar, last ten nights" },
    ],
  },
  {
    title: "Community",
    to: "/community",
    items: [
      { label: "Study circles", to: "/community", desc: "Shared khatm and progress" },
    ],
  },
  {
    title: "Library",
    to: "/library",
    items: [
      { label: "Hadith collections", to: "/hadith", desc: "Bukhari, Muslim, Abu Dawud" },
      { label: "Halal finder", to: "/halal", desc: "Restaurants and ingredients" },
      { label: "Hajj and Umrah", to: "/hajj", desc: "Step-by-step pilgrimage guide" },
      { label: "Zakat calculator", to: "/zakat", desc: "Nisab, assets, 2.5% estimate" },
      { label: "Saved items", to: "/search", desc: "Bookmarks, notes and duas" },
    ],
  },
];

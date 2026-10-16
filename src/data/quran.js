/** Reading-section catalogue shared by the navigator and the reader toolbar. */
export const READING_SECTIONS = {
  surah: { label: "Surah", max: 114 },
  juz: { label: "Juz’", max: 30 },
  hizbQuarter: { label: "Hizb / Rubʿ", max: 240 },
  page: { label: "Mushaf page", max: 604 },
  ruku: { label: "Rukuʿ", max: 556 },
  manzil: { label: "Manzil", max: 7 },
};

export const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Rashid Alafasy" },
  { id: "ar.minshawi", name: "Muhammad Siddiq al-Minshawi" },
  { id: "ar.abdulbasit", name: "Abdul Basit Abdul Samad" },
  { id: "ar.husary", name: "Mahmoud Khalil Al-Husary" },
  { id: "ar.ghamadi", name: "Saad Al-Ghamdi" },
];

export const FONT_SIZES = [
  { id: "sm", label: "Small", hint: "18px" },
  { id: "md", label: "Medium", hint: "24px" },
  { id: "lg", label: "Large", hint: "30px" },
  { id: "xl", label: "Largest", hint: "36px" },
];

export const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5];

export const APPEARANCES = [
  { id: "light", label: "Light", hint: "Parchment" },
  { id: "sepia", label: "Sepia", hint: "Warm paper" },
  { id: "dark", label: "Dark", hint: "Night reading" },
];

export const DEFAULT_READING_OPTIONS = {
  fontSize: "md",
  showTranslation: true,
  showTransliteration: false,
  reciter: "ar.alafasy",
  speed: 1,
  continuous: true,
};

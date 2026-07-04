export const EMOJI_ASSET_URLS = {
  moon: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f319.png",
  diamond:
    "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f536.png",
  sparkle:
    "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/2728.png",
  check: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/2714.png",
  star: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/2b50.png",
  close: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/274c.png",
  lightning:
    "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/26a1.png",
  loop: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f504.png",
  new: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f195.png",
};

export const NAV_LINKS = ["Home", "Quran", "Hadith", "Learn", "About"];

export const BENEFITS = [
  {
    icon: EMOJI_ASSET_URLS.moon,
    title: "Your Deen, Instantly Accessible",
    desc: "From Fajr to Isha, every surah, hadith, and lesson you need is a single tap away — no subscriptions, no friction, no gatekeeping.",
    accent: "#22d3a5",
  },
  {
    icon: EMOJI_ASSET_URLS.diamond,
    title: "Knowledge That Actually Sticks",
    desc: "Structured learning paths built around how Muslims really grow — contextual tafsir, graded hadith explanations, and bite-sized lessons you can finish in 5 minutes.",
    accent: "#a78bfa",
  },
  {
    icon: EMOJI_ASSET_URLS.sparkle,
    title: "A Community Growing Together",
    desc: "Join thousands of Muslims worldwide on the same journey. Share reflections, track your daily wird, and never feel like you're learning alone.",
    accent: "#f59e0b",
  },
];

export const TESTIMONIALS = [
  {
    initials: "AM",
    name: "Amina M.",
    loc: "Nairobi, Kenya",
    quote:
      "NoorHub replaced 4 apps I used to juggle for Quran, hadith, and classes. SubhanAllah.",
  },
  {
    initials: "YA",
    name: "Yusuf A.",
    loc: "Lagos, Nigeria",
    quote:
      "The learning paths feel like having a sheikh guide you step by step. Genuinely changed my mornings.",
  },
  {
    initials: "FR",
    name: "Fatima R.",
    loc: "Mombasa, Kenya",
    quote:
      "Finally an Islamic platform that doesn't feel like a 2009 website. Beautiful and beneficial.",
  },
];

export const STATS = [
  { num: "6,236", label: "Quranic Verses", sub: "with full tafsir" },
  { num: "7,563", label: "Sahih Hadiths", sub: "graded & explained" },
  { num: "200+", label: "Learning Paths", sub: "from beginner to alim" },
  { num: "40+", label: "Countries", sub: "Ummah represented" },
];

export const QURAN_FEATURES = [
  "Listen to 50+ reciters, including Sudais and Mishary",
  "Cross-reference Quran with thematically linked hadiths",
  "Bookmark, annotate, and share any verse or narration",
];

export const STARS = Array.from({ length: 60 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 1.5 + 0.5,
  opacity: Math.random() * 0.5 + 0.2,
}));

export const AVATAR_COLORS = ["#22d3a5", "#a78bfa", "#f59e0b", "#0ea5e9"];

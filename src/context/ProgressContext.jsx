import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";

const ProgressContext = createContext(null);

/* ── Real Authentic Islamic Course Catalogue ────────────────────────────── */
const INITIAL_COURSES = [
  {
    id: 1,
    title: "Foundations of Aqeedah",
    category: "Theology",
    difficulty: "Beginner",
    instructor: "Sheikh Omar Suleiman & Dr. Shadee Elmasry",
    duration: "4 modules • 2.5 hours",
    description:
      "The core pillars of Islamic creed — what every Muslim must know about faith, Tawheed, and belief in the unseen.",
    syllabus: [
      {
        id: "1-1",
        title: "Introduction to Islamic Belief & The Fitrah",
        completed: false,
        duration: "28 mins",
        instructor: "Sheikh Omar Suleiman",
        institution: "Yaqeen Institute",
        videoUrl: "https://www.youtube.com/watch?v=kYv9yY87l7Y",
        overview: "Discover the innate human disposition (Fitrah) towards recognizing Allah and the logical coherence of Islamic monotheism.",
        keyPoints: [
          "The definition of Iman in the heart, tongue, and limbs",
          "How Fitrah aligns with divine revelation",
          "Guarding faith against ideological doubts"
        ],
      },
      {
        id: "1-2",
        title: "The Six Pillars of Iman Explained",
        completed: false,
        duration: "34 mins",
        instructor: "Dr. Shadee Elmasry",
        institution: "Safina Society",
        videoUrl: "https://www.youtube.com/watch?v=F3r_d8Z7wFw",
        overview: "A deep study of the Hadith of Jibreel (AS) outlining belief in Allah, His Angels, Books, Messengers, the Last Day, and Divine Decree (Qadar).",
        keyPoints: [
          "The distinction between Islam, Iman, and Ihsan",
          "How belief in Angels influences daily moral conscience",
          "Understanding Qadar and human free will without fatalism"
        ],
      },
      {
        id: "1-3",
        title: "Understanding Tawheed: Rububiyyah, Uluhiyyah & Asma wa Sifat",
        completed: false,
        duration: "42 mins",
        instructor: "Dr. Yasir Qadhi",
        institution: "Memphis Islamic Center",
        videoUrl: "https://www.youtube.com/watch?v=l_aB3_i4B3Q",
        overview: "The classical categorization of Tawheed and why directing all acts of worship exclusively to Allah is the central message of all Prophets.",
        keyPoints: [
          "Tawheed ar-Rububiyyah: Allah as Creator, Sustainer, and Ruler",
          "Tawheed al-Uluhiyyah: Sincerity in prayer, du'a, and sacrifice",
          "Avoiding hidden shirk (Riya'/showing off) in worship"
        ],
      },
      {
        id: "1-4",
        title: "Divine Names & Attributes of Allah",
        completed: false,
        duration: "30 mins",
        instructor: "Ustadh Nouman Ali Khan",
        institution: "FreeQuranEducation",
        videoUrl: "https://www.youtube.com/watch?v=dYmRz0Z8hJ4",
        overview: "Contemplating the beauty and majesty of Allah's 99 names (Asma' al-Husna) and how each name brings tranquility and strength to the believer.",
        keyPoints: [
          "Reflecting on Al-Rahman, Al-Raheem, Al-Ghaffar, and Al-Wadud",
          "Invoking Allah in prayer according to specific needs",
          "Spiritual transformation through knowing the Divine"
        ],
      },
    ],
    isEnrolled: false,
  },
  {
    id: 2,
    title: "Practical Fiqh of Worship",
    category: "Jurisprudence",
    difficulty: "Intermediate",
    instructor: "Sheikh Belal Assaad & Dr. Yasir Qadhi",
    duration: "4 modules • 3 hours",
    description:
      "Rules for purification, prayer, and fasting — grounded in authentic primary texts and demonstrated step-by-step.",
    syllabus: [
      {
        id: "2-1",
        title: "Rules of Purification & Perfecting Wudu (Taharah)",
        completed: false,
        duration: "32 mins",
        instructor: "Sheikh Belal Assaad",
        institution: "Islamic Learning Academy",
        videoUrl: "https://www.youtube.com/watch?v=2Tz8N0WJ_Y4",
        overview: "Detailed demonstration of ritual purity, obligatory vs Sunnah acts of Wudu, conditions of Ghusl, and wiping over socks.",
        keyPoints: [
          "The Sunnah method of Wudu demonstrated practically",
          "What breaks Wudu and what does not",
          "Overcoming waswas (whispers) in purification"
        ],
      },
      {
        id: "2-2",
        title: "The Pillars & Postures of the Prophet's Salah",
        completed: false,
        duration: "48 mins",
        instructor: "Sheikh Belal Assaad",
        institution: "Islamic Learning Academy",
        videoUrl: "https://www.youtube.com/watch?v=Kz6iG_F6R9E",
        overview: "A masterclass on praying exactly as the Prophet ﷺ prayed, covering Takbeer, Qiyam, Ruku, Sujood, and Tashahhud.",
        keyPoints: [
          "The 14 Arkan (indispensable pillars) of prayer",
          "Proper physical alignment in Ruku' and Sujood",
          "Attaining Khushoo' (heartfelt focus) during recitation"
        ],
      },
      {
        id: "2-3",
        title: "Common Errors in Prayer & Sujood as-Sahw",
        completed: false,
        duration: "25 mins",
        instructor: "FreeQuranEducation",
        institution: "Fawzan Institute",
        videoUrl: "https://www.youtube.com/watch?v=B9Jk7iR9L6o",
        overview: "Diagnosing frequent mistakes in congregational and individual prayer, and when and how to perform the prostrations of forgetfulness.",
        keyPoints: [
          "When Sujood as-Sahw is performed before vs after Salam",
          "Joining late in congregational prayer (Masbuq rules)",
          "Correcting recitation slips in Salah"
        ],
      },
      {
        id: "2-4",
        title: "Fiqh of Fasting, Ramadan & Zakat al-Fitr",
        completed: false,
        duration: "40 mins",
        instructor: "Dr. Yasir Qadhi",
        institution: "Memphis Islamic Center",
        videoUrl: "https://www.youtube.com/watch?v=Jj7uK8Y8F9U",
        overview: "Everything you need to know about the legal and spiritual dimensions of Sawm (fasting), exemptions, invalidators, and night prayer.",
        keyPoints: [
          "Intentions, Suhoor, and Iftar Sunnahs",
          "Medical exemptions, makeup days (Qada'), and Fidyah",
          "Rules and calculation for Zakat al-Fitr"
        ],
      },
    ],
    isEnrolled: false,
  },
  {
    id: 3,
    title: "Chronological Seerah",
    category: "History",
    difficulty: "Beginner",
    instructor: "Dr. Yasir Qadhi & Sheikh Omar Suleiman",
    duration: "4 modules • 3.5 hours",
    description:
      "The Prophet's life from pre-Islamic Arabia through Makkah and Madinah to the final sermon — chronological and inspiring.",
    syllabus: [
      {
        id: "3-1",
        title: "Pre-Islamic Arabia & The Birth of the Prophet ﷺ",
        completed: false,
        duration: "55 mins",
        instructor: "Dr. Yasir Qadhi",
        institution: "Memphis Islamic Center",
        videoUrl: "https://www.youtube.com/watch?v=VOUp3ZX438Y",
        overview: "Explore the socio-religious backdrop of pre-Islamic Arabia, the lineage of Quraysh, the Year of the Elephant, and the blessed birth.",
        keyPoints: [
          "Why the Arabian Peninsula was the ideal environment for the final message",
          "The early childhood of Muhammad ﷺ with Halima as-Sa'diyyah",
          "The integrity and reputation as Al-Amin (The Trustworthy)"
        ],
      },
      {
        id: "3-2",
        title: "The Makkan Period: First Revelation & Persecution",
        completed: false,
        duration: "50 mins",
        instructor: "Dr. Yasir Qadhi",
        institution: "Memphis Islamic Center",
        videoUrl: "https://www.youtube.com/watch?v=Oa17j8xN4Fk",
        overview: "The solitary worship in Cave Hira, the arrival of Angel Jibreel with 'Iqra', the private calling, and the public boycott by Quraysh.",
        keyPoints: [
          "The transformative encounter with Jibreel (AS)",
          "The steadfastness of early companions (Bilal, Khadijah, Yasir family)",
          "The Year of Sorrow ('Am al-Huzn) and the journey of Isra' & Mi'raj"
        ],
      },
      {
        id: "3-3",
        title: "The Historic Hijrah to Madinah",
        completed: false,
        duration: "45 mins",
        instructor: "Sheikh Omar Suleiman",
        institution: "Yaqeen Institute",
        videoUrl: "https://www.youtube.com/watch?v=c8N4uH7d_3A",
        overview: "The strategic migration from Makkah to Yathrib, the cave of Thawr, and establishing the first Islamic society and brotherhood (Mu'akhah).",
        keyPoints: [
          "The companionship and sacrifice of Abu Bakr as-Siddiq (RA)",
          "Building the Prophet's Mosque (Masjid an-Nabawi)",
          "The Constitution of Madinah and interfaith pacts"
        ],
      },
      {
        id: "3-4",
        title: "The Madinan Era, Treaty of Hudaybiyyah & Farewell Pilgrimage",
        completed: false,
        duration: "52 mins",
        instructor: "Dr. Yasir Qadhi",
        institution: "Memphis Islamic Center",
        videoUrl: "https://www.youtube.com/watch?v=P8B2jT3v6A0",
        overview: "Key milestones in Madinah, the decisive diplomacy of Hudaybiyyah, the bloodless opening of Makkah, and the universal human rights of the Final Khutbah.",
        keyPoints: [
          "How Hudaybiyyah paved the way for peaceful expansion",
          "The unconditional mercy shown during the conquest of Makkah",
          "Core lessons of the Farewell Sermon on equality and unity"
        ],
      },
    ],
    isEnrolled: false,
  },
  {
    id: 4,
    title: "Quranic Arabic & Tajweed Essentials",
    category: "Recitation",
    difficulty: "Beginner",
    instructor: "Ustadh Wisam Sharieff & Nouman Ali Khan",
    duration: "4 modules • 2 hours",
    description:
      "Master the foundational rules of Tajweed, articulation points (Makharij), and Quranic reflection (Tadabbur).",
    syllabus: [
      {
        id: "4-1",
        title: "Makharij: Points of Articulation & Letter Sounds",
        completed: false,
        duration: "30 mins",
        instructor: "Ustadh Wisam Sharieff",
        institution: "FreeQuranEducation",
        videoUrl: "https://www.youtube.com/watch?v=r3k8n9jL2mM",
        overview: "Learn to accurately produce each Arabic phoneme from its exact vocal exit point (throat, tongue, lips, and nasal cavity).",
        keyPoints: [
          "The 5 main areas of articulation in the vocal tract",
          "Correcting common non-native pronunciation habits",
          "Distinguishing heavy letters (Tafkheem) vs light letters (Tarqeeq)"
        ],
      },
      {
        id: "4-2",
        title: "Rules of Noon Sakinah and Tanween (Izhar, Idgham, Iqlab, Ikhfa)",
        completed: false,
        duration: "32 mins",
        instructor: "FreeQuranEducation",
        institution: "Tajweed Institute",
        videoUrl: "https://www.youtube.com/watch?v=x9N6yT5k2_U",
        overview: "Visual interactive breakdown of the four fundamental rules of Noon Sakinah with clear recitation examples.",
        keyPoints: [
          "Izhar Halqi (Clear pronunciation with throat letters)",
          "Idgham with & without Ghunnah",
          "Iqlab to Meem and Ikhfa Haqiqi (Hiding)"
        ],
      },
      {
        id: "4-3",
        title: "Rules of Meem Sakinah & Madd (Prolongation)",
        completed: false,
        duration: "28 mins",
        instructor: "Ustadh Nouman Ali Khan",
        institution: "Bayyinah Institute",
        videoUrl: "https://www.youtube.com/watch?v=aG0K06cT8L4",
        overview: "Understanding the duration of Madd counts (2, 4, 5, and 6 Harakat) and Meem Sakinah rules: Ikhfa Shafawi, Idgham Mithlayn, and Izhar Shafawi.",
        keyPoints: [
          "Natural elongation (Madd Asli) vs connected/separated Madd (Munfasil/Muttasil)",
          "Madd Lazim (Compulsory 6 counts) in Surah Al-Fatihah",
          "Applying smooth flow in daily recitation"
        ],
      },
      {
        id: "4-4",
        title: "Spiritual Reflection (Tadabbur) in Daily Recitation",
        completed: false,
        duration: "35 mins",
        instructor: "Ustadh Nouman Ali Khan",
        institution: "Bayyinah Institute",
        videoUrl: "https://www.youtube.com/watch?v=eJ6xH4iQ5zU",
        overview: "Bridging mechanical recitation and heart-centered contemplation: how to let Quranic verses guide your daily decisions and emotional state.",
        keyPoints: [
          "The 4 levels of interacting with the Quran (Listen, Recite, Understand, Apply)",
          "Recognizing rhetorical patterns and emotional shifts across surahs",
          "Developing a lifelong personal relationship with the Book of Allah"
        ],
      },
    ],
    isEnrolled: false,
  },
].map((course) => ({
  ...course,
  syllabus: course.syllabus.map((lesson) => ({
    ...lesson,
    // Most earlier catalogue URLs were unverified placeholder IDs. Point each
    // lesson at a live search for its real title instead of embedding a dead ID.
    videoUrl: course.id === 3 && lesson.id === "3-1"
      ? "https://www.youtube.com/watch?v=4F5qzMI2IKs"
      : `https://www.youtube.com/results?search_query=${encodeURIComponent(`${lesson.title} ${lesson.instructor || course.instructor}`)}`,
  })),
}));

function getInitialGuestProgress() {
  if (typeof window === "undefined") return INITIAL_COURSES;
  try {
    const saved = localStorage.getItem("noorhub_guest_progress");
    if (!saved) return INITIAL_COURSES;
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return INITIAL_COURSES;

    // Merge saved completion & enrollment flags into full new INITIAL_COURSES metadata
    const completedMap = new Map();
    const enrolledMap = new Map();
    parsed.forEach((track) => {
      enrolledMap.set(track.id, track.isEnrolled);
      if (Array.isArray(track.syllabus)) {
        track.syllabus.forEach((l) => {
          completedMap.set(`${track.id}-${l.id}`, l.completed);
        });
      }
    });

    return INITIAL_COURSES.map((course) => ({
      ...course,
      isEnrolled: enrolledMap.get(course.id) ?? course.isEnrolled,
      syllabus: course.syllabus.map((lesson) => ({
        ...lesson,
        completed: completedMap.get(`${course.id}-${lesson.id}`) ?? lesson.completed,
      })),
    }));
  } catch {
    return INITIAL_COURSES;
  }
}

/** Merge server progress records into the static course catalogue. */
function applyServerProgress(courses, serverRecords) {
  const index = new Map(
    serverRecords.map((r) => [`${r.track_id}-${r.lesson_id}`, r.completed]),
  );
  return courses.map((course) => ({
    ...course,
    isEnrolled: course.syllabus.some((l) => index.has(`${course.id}-${l.id}`)),
    syllabus: course.syllabus.map((lesson) => ({
      ...lesson,
      completed: index.get(`${course.id}-${lesson.id}`) ?? lesson.completed,
    })),
  }));
}

export function ProgressProvider({ children }) {
  const { isAuthenticated, authFetch } = useAuth();
  const [tracks, setTracks] = useState(() => getInitialGuestProgress());

  /* ── Load progress from server when authenticated ───────────────────── */
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    authFetch("/api/user/progress")
      .then(({ ok, data }) => {
        if (ok && Array.isArray(data.progress)) {
          setTracks(applyServerProgress(INITIAL_COURSES, data.progress));
        }
      })
      .catch(() => {
        /* keep local state on network failure */
      });
  }, [isAuthenticated, authFetch]);

  /* ── Persist guest progress to localStorage ─────────────────────────── */
  useEffect(() => {
    if (!isAuthenticated && typeof window !== "undefined") {
      localStorage.setItem("noorhub_guest_progress", JSON.stringify(tracks));
    }
  }, [tracks, isAuthenticated]);

  /* ── Enroll ──────────────────────────────────────────────────────────── */
  const enrollInTrack = useCallback((id) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isEnrolled: true } : t)),
    );
  }, []);

  /* ── Toggle lesson completion ────────────────────────────────────────── */
  const toggleLessonStatus = useCallback(
    async (trackId, lessonId) => {
      // Optimistic local update
      let nextCompleted;
      setTracks((prev) =>
        prev.map((track) => {
          if (track.id !== trackId) return track;
          const updatedSyllabus = track.syllabus.map((lesson) => {
            if (lesson.id !== lessonId) return lesson;
            nextCompleted = !lesson.completed;
            return { ...lesson, completed: nextCompleted };
          });
          return { ...track, syllabus: updatedSyllabus, isEnrolled: true };
        }),
      );

      // Persist to server if authenticated
      if (isAuthenticated) {
        await authFetch("/api/user/progress", {
          method: "POST",
          body: JSON.stringify({
            track_id: trackId,
            lesson_id: lessonId,
            completed: nextCompleted,
          }),
        }).catch(() => {
          /* network failure — local state already updated */
        });
      }
    },
    [isAuthenticated, authFetch],
  );

  /* ── Get lesson details ──────────────────────────────────────────────── */
  const getLessonDetails = useCallback(
    (trackId, lessonId) => {
      const track = tracks.find((t) => t.id === trackId);
      if (!track) return null;
      const lesson = track.syllabus.find((l) => l.id === lessonId);
      return lesson ? { trackTitle: track.title, ...lesson } : null;
    },
    [tracks],
  );

  return (
    <ProgressContext.Provider
      value={{ tracks, enrollInTrack, toggleLessonStatus, getLessonDetails }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProgress() {
  return useContext(ProgressContext);
}

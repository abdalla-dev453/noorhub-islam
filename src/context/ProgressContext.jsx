import { createContext, useContext, useState, useEffect } from "react";

const ProgressContext = createContext(null);

const INITIAL_COURSES = [
  {
    id: 1,
    title: "Foundations of Aqeedah",
    category: "Theology",
    difficulty: "Beginner",
    description:
      "Explore the core pillars of Islamic creed, understanding foundational faith attributes cleanly.",
    syllabus: [
      {
        id: "1-1",
        title: "Introduction to Belief Structure",
        completed: true,
        videoUrl:
          "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      },
      {
        id: "1-2",
        title: "The Six Pillars of Iman",
        completed: true,
        videoUrl:
          "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      },
      {
        id: "1-3",
        title: "Understanding Tawheed",
        completed: false,
        videoUrl:
          "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      },
      {
        id: "1-4",
        title: "Attributes of Allah",
        completed: false,
        videoUrl:
          "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      },
    ],
    isEnrolled: true,
  },
  {
    id: 2,
    title: "Practical Fiqh of Worship",
    category: "Jurisprudence",
    difficulty: "Intermediate",
    description:
      "A comprehensive structural study detailing rules regarding purification, prayers, and everyday fasts.",
    syllabus: [
      {
        id: "2-1",
        title: "Rules of Purification (Taharah)",
        completed: false,
        videoUrl:
          "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      },
      {
        id: "2-2",
        title: "The Pillars of Salah",
        completed: false,
        videoUrl:
          "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      },
      {
        id: "2-3",
        title: "Common Errors in Prayer",
        completed: false,
        videoUrl:
          "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      },
      {
        id: "2-4",
        title: "Fiqh of Ramadan",
        completed: false,
        videoUrl:
          "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      },
    ],
    isEnrolled: false,
  },
  {
    id: 3,
    title: "Chronological Seerah",
    category: "History",
    difficulty: "Beginner",
    description:
      "Trace the life accounts, structural movements, and historical lessons from the Prophetic biography.",
    syllabus: [
      {
        id: "3-1",
        title: "Pre-Islamic Arabia Context",
        completed: true,
        videoUrl:
          "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      },
      {
        id: "3-2",
        title: "The Makkan Period",
        completed: false,
        videoUrl:
          "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      },
      {
        id: "3-3",
        title: "The Hijrah Migration",
        completed: false,
        videoUrl:
          "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      },
      {
        id: "3-4",
        title: "The Madinan Era Framework",
        completed: false,
        videoUrl:
          "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      },
    ],
    isEnrolled: true,
  },
];

export function ProgressProvider({ children }) {
  const [tracks, setTracks] = useState(() => {
    if (typeof window === "undefined") {
      return INITIAL_COURSES;
    }

    try {
      const saved = window.localStorage.getItem("noorhub_academy_progress");
      return saved ? JSON.parse(saved) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "noorhub_academy_progress",
        JSON.stringify(tracks),
      );
    }
  }, [tracks]);

  const enrollInTrack = (id) => {
    setTracks((prev) =>
      prev.map((track) => {
        if (track.id === id) {
          return { ...track, isEnrolled: true };
        }
        return track;
      }),
    );
  };

  // ⚡ New Method: Mutates checkbox parameters and records progress percentages
  const toggleLessonStatus = (trackId, lessonId) => {
    setTracks((prev) =>
      prev.map((track) => {
        if (track.id === trackId) {
          const updatedSyllabus = track.syllabus.map((lesson) =>
            lesson.id === lessonId
              ? { ...lesson, completed: !lesson.completed }
              : lesson,
          );
          return { ...track, syllabus: updatedSyllabus, isEnrolled: true };
        }
        return track;
      }),
    );
  };

  // ⚡ New Method: Grabs full lesson data records cleanly across nested arrays
  const getLessonDetails = (trackId, lessonId) => {
    const track = tracks.find((t) => t.id === trackId);
    if (!track) return null;
    const lesson = track.syllabus.find((l) => l.id === lessonId);
    return lesson ? { trackTitle: track.title, ...lesson } : null;
  };

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

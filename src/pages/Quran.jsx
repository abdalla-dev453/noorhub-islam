import { Bookmark, BookOpen } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../utils/api";
import { readLocal, writeLocal } from "../utils/localData";
import { useAppearance } from "../hooks/useAppearance";
import { usePersistentState } from "../hooks/usePersistentState";
import {
  DEFAULT_READING_OPTIONS,
  READING_SECTIONS,
  RECITERS,
} from "../data/quran";
import ChapterNavigator from "../components/quran/ChapterNavigator";
import ReaderToolbar from "../components/quran/ReaderToolbar";
import ReadingOptionsSheet from "../components/quran/ReadingOptionsSheet";
import VerseRow from "../components/ui/VerseRow";
import Sheet from "../components/ui/Sheet";
import Notice from "../components/ui/Notice";
import EmptyState from "../components/ui/EmptyState";
import { SkeletonList } from "../components/ui/Skeleton";

const POSITION_KEY = "noorhub_quran_position";
const AYAHS_KEY = "noorhub_quran_ayahs";
const OPTIONS_KEY = "noorhub_reading_options";

export default function Quran() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { appearance, setAppearance } = useAppearance();
  const [options, setOptions] = usePersistentState(OPTIONS_KEY, DEFAULT_READING_OPTIONS);
  const readingOptions = useMemo(
    () => ({ ...DEFAULT_READING_OPTIONS, ...options }),
    [options],
  );

  const [surahs, setSurahs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [activeSurah, setActiveSurah] = useState(null);
  const [activeKind, setActiveKind] = useState("surah");
  const [verses, setVerses] = useState([]);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [sectionError, setSectionError] = useState("");

  const [playingAyahIndex, setPlayingAyahIndex] = useState(null);
  const [paused, setPaused] = useState(false);
  const [fullPlayback, setFullPlayback] = useState(false);
  const [savedAyahs, setSavedAyahs] = useState(() => readLocal(AYAHS_KEY, {}));
  const [lastReading, setLastReading] = useState(() => readLocal(POSITION_KEY, null));
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const [jumpReference, setJumpReference] = useState("");
  const [jumpError, setJumpError] = useState("");
  const [copied, setCopied] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");

  const audioRef = useRef(null);
  const audioQueueRef = useRef(new Map());
  const forceContinuousRef = useRef(false);
  const pendingAyahRef = useRef(null);
  const handledDeepLink = useRef("");
  const activeTargetRef = useRef({ surah: null, kind: "surah", number: null });

  /* Reading options are read through a ref so the audio and load callbacks
     stay stable while still using the latest reciter, speed and toggles. */
  const optionsRef = useRef(readingOptions);
  useEffect(() => {
    optionsRef.current = readingOptions;
  }, [readingOptions]);

  /* ── Audio ────────────────────────────────────────────────────────────── */
  const stopAudio = useCallback(() => {
    forceContinuousRef.current = false;
    setFullPlayback(false);
    audioQueueRef.current.forEach((element) => {
      element.pause();
      element.onended = null;
      element.onerror = null;
    });
    audioQueueRef.current.clear();
    audioRef.current = null;
    setPlayingAyahIndex(null);
    setPaused(false);
  }, []);

  /* Continuous playback recurses through a ref so the callback identity stays
     stable for the loaders below. */
  const playAudioStreamRef = useRef(null);

  const playAudioStream = useCallback((versesArray, index) => {
    const currentAyah = versesArray[index];
    if (!currentAyah?.audio) {
      setSectionError("Audio is not available for this verse. Choose another reciter or try again later.");
      stopAudio();
      return;
    }

    setSectionError("");
    setPlayingAyahIndex(index);
    setPaused(false);

    let element = audioQueueRef.current.get(index);
    if (!element) {
      element = new Audio(currentAyah.audio);
      element.preload = "auto";
      audioQueueRef.current.set(index, element);
    }
    audioQueueRef.current.forEach((queued, queuedIndex) => {
      if (queuedIndex !== index) {
        queued.pause();
        queued.onended = null;
        queued.onerror = null;
        audioQueueRef.current.delete(queuedIndex);
      }
    });
    element.playbackRate = optionsRef.current.speed;
    audioRef.current = element;

    const nextAyah = versesArray[index + 1];
    if ((forceContinuousRef.current || optionsRef.current.continuous) && nextAyah?.audio && !audioQueueRef.current.has(index + 1)) {
      const nextElement = new Audio(nextAyah.audio);
      nextElement.preload = "auto";
      audioQueueRef.current.set(index + 1, nextElement);
    }

    document
      .getElementById(`ayah-${currentAyah.anchor}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });

    element.play().catch((error) => {
      console.error("Audio playback interrupted:", error);
      setPlayingAyahIndex(null);
      setSectionError("Audio could not start. Check your connection and try again.");
    });
    element.onerror = () => {
      setPlayingAyahIndex(null);
      setSectionError("This verse's audio could not be played. Try another reciter or try again later.");
    };

    element.onended = () => {
      const nextIndex = index + 1;
      audioQueueRef.current.delete(index);
      if ((forceContinuousRef.current || optionsRef.current.continuous) && nextIndex < versesArray.length) {
        playAudioStreamRef.current?.(versesArray, nextIndex);
      } else {
        audioQueueRef.current.clear();
        setPlayingAyahIndex(null);
        setFullPlayback(false);
        forceContinuousRef.current = false;
      }
    };
  }, [stopAudio]);

  useEffect(() => {
    playAudioStreamRef.current = playAudioStream;
  }, [playAudioStream]);

  const togglePlayPause = (index) => {
    if (playingAyahIndex !== index) {
      playAudioStream(verses, index);
      return;
    }
    const element = audioRef.current;
    if (!element) return;
    if (element.paused) {
      element.play().catch(() => setPlayingAyahIndex(null));
      setPaused(false);
    } else {
      element.pause();
      setPaused(true);
    }
  };

  const playFromStart = () => {
    if (verses.length > 0) {
      forceContinuousRef.current = true;
      setFullPlayback(true);
      playAudioStream(verses, 0);
    }
  };

  /* ── Content loading ──────────────────────────────────────────────────── */
  const loadSurahContent = useCallback(async (surah, resumeIndex = null) => {
    const { reciter, showTransliteration } = optionsRef.current;
    setSectionLoading(true);
    setSectionError("");
    try {
      const data = await api.getSurahDetails(surah.id, reciter, undefined, {
        transliteration: showTransliteration,
      });
      const integrated = data.arabicVerses.map((ayah, index) => ({
        index,
        number: ayah.numberInSurah,
        surahId: surah.id,
        surahName: surah.name,
        anchor: `${surah.id}:${ayah.numberInSurah}`,
        reference: `${surah.name} ${ayah.numberInSurah}`,
        text: ayah.text,
        translation: data.englishVerses[index]?.text || "",
        transliteration: data.transliterationVerses[index]?.text || "",
        audio: data.audioVerses[index]?.audio || "",
      }));
      setVerses(integrated);

      if (resumeIndex !== null && integrated[resumeIndex]) {
        playAudioStream(integrated, resumeIndex);
      }
    } catch (error) {
      console.error("Failed to load surah details:", error);
      setVerses([]);
      setSectionError(
        "This surah could not be loaded. Check your connection and try again.",
      );
    } finally {
      setSectionLoading(false);
    }
  }, [playAudioStream]);

  const loadReadingSection = useCallback(async (kind, number) => {
    const section = READING_SECTIONS[kind];
    const value = Number(number);
    if (!section || !Number.isInteger(value) || value < 1 || value > section.max) return;

    const { reciter } = optionsRef.current;
    setSectionLoading(true);
    setSectionError("");
    try {
      const data = await api.getReadingSection(kind, value, reciter);
      const integrated = data.arabicVerses.map((ayah, index) => ({
        index,
        number: ayah.numberInSurah,
        surahId: ayah.surah?.number,
        surahName: ayah.surah?.englishName || ayah.surah?.name || "Surah",
        anchor: `${ayah.surah?.number}:${ayah.numberInSurah}`,
        reference: `${ayah.surah?.englishName || "Surah"} ${ayah.numberInSurah}`,
        text: ayah.text,
        translation: data.englishVerses[index]?.text || "",
        transliteration: "",
        audio: data.audioVerses[index]?.audio || "",
      }));
      setVerses(integrated);
    } catch (error) {
      console.error("Failed to load Quran section:", error);
      setVerses([]);
      setSectionError(
        `Could not load ${section.label} ${value}. Check your connection and try again.`,
      );
    } finally {
      setSectionLoading(false);
    }
  }, []);

  const openSurahReader = (surah, targetAyah = null) => {
    stopAudio();
    setSectionError("");
    setJumpError("");
    setActiveSurah(surah);
    setActiveKind("surah");
    activeTargetRef.current = { surah, kind: "surah", number: surah.id };
    pendingAyahRef.current = targetAyah ? `${surah.id}:${targetAyah}` : null;

    const position = { ...surah, kind: "surah", ayah: targetAyah ?? 1 };
    setLastReading(position);
    writeLocal(POSITION_KEY, position);
    loadSurahContent(surah);
  };
  const openSurahReaderRef = useRef(openSurahReader);

  const openReadingSection = (kind, number) => {
    const section = READING_SECTIONS[kind];
    const value = Number(number);
    if (!section || !Number.isInteger(value) || value < 1 || value > section.max) return;

    stopAudio();
    const reading = {
      kind,
      number: value,
      name: `${section.label} ${value}`,
      meaning: "Reading section",
    };
    setSectionError("");
    setJumpError("");
    setActiveSurah(reading);
    setActiveKind(kind);
    activeTargetRef.current = { surah: reading, kind, number: value };
    setLastReading(reading);
    writeLocal(POSITION_KEY, reading);
    pendingAyahRef.current = null;
    loadReadingSection(kind, value);
  };

  /* ── Surah index ──────────────────────────────────────────────────────── */
  useEffect(() => {
    const controller = new AbortController();
    api
      .getAllSurahs(controller.signal)
      .then(setSurahs)
      .catch((error) => {
        // StrictMode mounts effects twice, so an aborted request is expected
        // and must not surface as an error.
        if (error.name === "AbortError") return;
        setLoadError(
          "The surah index could not be loaded. Check your connection and try again.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  /* ── Deep links: /quran?surah=2&ayah=255 ───────────────────────────────── */
  const deepLinkSurah = searchParams.get("surah");
  const deepLinkAyah = searchParams.get("ayah");

  useEffect(() => {
    if (!deepLinkSurah) {
      handledDeepLink.current = "";
      return;
    }
    if (!surahs.length) return;

    const linkKey = `${deepLinkSurah}:${deepLinkAyah || ""}`;
    if (handledDeepLink.current === linkKey) return;

    const surah = surahs.find((item) => item.id === Number(deepLinkSurah));
    if (!surah) return;

    handledDeepLink.current = linkKey;
    const parsedAyah = Number(deepLinkAyah);
    const ayah = Number.isInteger(parsedAyah) && parsedAyah > 0 ? parsedAyah : null;
    openSurahReaderRef.current(surah, ayah);
    setSearchParams({}, { replace: true });
  }, [surahs, deepLinkSurah, deepLinkAyah, setSearchParams]);

  /* ── Scroll to the requested ayah once its verses arrive ───────────────── */
  useEffect(() => {
    const target = pendingAyahRef.current;
    if (!activeSurah || !verses.length || !target) return undefined;
    const frame = requestAnimationFrame(() => {
      document.getElementById(`ayah-${target}`)?.scrollIntoView({ block: "center" });
      pendingAyahRef.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, [activeSurah, verses]);

  /* ── Persistence ──────────────────────────────────────────────────────── */
  useEffect(() => writeLocal(AYAHS_KEY, savedAyahs), [savedAyahs]);

  /* ── Reload the open section when the reciter or transliteration changes ── */
  const { reciter, showTransliteration } = readingOptions;
  useEffect(() => {
    const { surah, kind, number } = activeTargetRef.current;
    if (!surah) return undefined;
    if (kind === "surah") {
      loadSurahContent(surah);
    } else {
      loadReadingSection(kind, number);
    }
    return undefined;
  }, [reciter, showTransliteration, loadSurahContent, loadReadingSection]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = readingOptions.speed;
  }, [readingOptions.speed]);

  /* ── Actions ──────────────────────────────────────────────────────────── */
  const continueReading = () => {
    if (!lastReading) return;
    if (lastReading.kind === "surah") {
      const surah = surahs.find((item) => item.id === lastReading.id);
      if (surah) openSurahReader(surah, lastReading.ayah ?? null);
    } else {
      openReadingSection(lastReading.kind, lastReading.number);
    }
  };

  const toggleBookmark = (verse) => {
    const key = `${verse.surahId}:${verse.number}`;
    setSavedAyahs((previous) => {
      const entry = previous[key];
      if (entry?.bookmarked) {
        const { bookmarked, ...rest } = entry;
        void bookmarked;
        const next = { ...previous, [key]: rest };
        if (!Object.values(rest).some(Boolean)) delete next[key];
        return next;
      }
      return { ...previous, [key]: { ...entry, bookmarked: true } };
    });
  };

  const toggleHighlight = (verse) => {
    const key = `${verse.surahId}:${verse.number}`;
    setSavedAyahs((previous) => {
      const entry = { ...(previous[key] || {}), highlight: !previous[key]?.highlight };
      const next = { ...previous, [key]: entry };
      if (!Object.values(entry).some(Boolean)) delete next[key];
      return next;
    });
  };

  const openNoteEditor = (verse) => {
    const existing = savedAyahs[`${verse.surahId}:${verse.number}`]?.note || "";
    setEditingNote(`${verse.surahId}:${verse.number}`);
    setNoteDraft(existing);
  };

  const saveNote = (verse) => {
    const key = `${verse.surahId}:${verse.number}`;
    const value = noteDraft.trim();
    setSavedAyahs((previous) => {
      const entry = { ...(previous[key] || {}), note: value };
      const next = { ...previous, [key]: entry };
      if (!Object.values(entry).some(Boolean)) delete next[key];
      return next;
    });
    setEditingNote(null);
    setNoteDraft("");
  };

  const shareAyah = async (verse) => {
    const url = `${window.location.origin}/quran?surah=${verse.surahId}&ayah=${verse.number}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `Quran ${verse.reference}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2400);
      }
    } catch {
      /* the share sheet was dismissed */
    }
  };

  const handleJump = (event) => {
    event.preventDefault();
    const match = jumpReference.trim().match(/^(\d{1,3})\s*[:.]\s*(\d{1,3})$/);
    if (!match) {
      setJumpError("Enter a reference such as 2:255.");
      return;
    }
    const surahId = Number(match[1]);
    const ayah = Number(match[2]);
    const surah = surahs.find((item) => item.id === surahId);
    if (!surah || ayah > surah.verses) {
      setJumpError("That surah and ayah reference was not found.");
      return;
    }
    setJumpError("");
    setSearchParams({ surah: String(surahId), ayah: String(ayah) });
  };

  const hasPosition = Boolean(lastReading?.name);
  const resumeVisible =
    hasPosition &&
    !sectionLoading &&
    (lastReading.kind !== "surah" || activeSurah?.id !== lastReading.id);

  const savedCount = useMemo(
    () => Object.values(savedAyahs).filter((entry) => entry?.bookmarked).length,
    [savedAyahs],
  );

  return (
    <div className="page">
      <div className="container container--reading">
        <header className="page-head">
          <span className="page-head__eyebrow">Quran</span>
          <h1 className="page-head__title">Read and listen</h1>
          <div className="page-head__meta">
            <span>Arabic: Uthmani edition</span>
            <span aria-hidden="true">·</span>
            <span>Translation: Sahih International</span>
            <span aria-hidden="true">·</span>
            <span>Text and audio: AlQuran Cloud</span>
          </div>
          <p className="page-head__meta">
            <span>
              {savedCount} bookmarked {savedCount === 1 ? "ayah" : "ayahs"} on
              this device
            </span>
          </p>
        </header>

        <div className="reader" data-font-size={readingOptions.fontSize}>
          <aside className="navigator" aria-label="Chapter navigator">
            <ChapterNavigator
              surahs={surahs}
              loading={loading}
              activeSurahId={activeSurah?.id}
              search={search}
              onSearchChange={setSearch}
              onSelectSurah={(surah) => openSurahReader(surah)}
              onSelectSection={openReadingSection}
            />
          </aside>

          <div className="stack reader__column">
            {loadError ? <Notice tone="danger">{loadError}</Notice> : null}

            <ReaderToolbar
              surah={activeSurah}
              kind={activeKind}
              verseCount={verses.length}
              playing={playingAyahIndex !== null && !paused}
              fullPlayback={fullPlayback}
              loading={sectionLoading}
              onPlayAll={playFromStart}
              onPause={stopAudio}
              onOpenOptions={() => setOptionsOpen(true)}
              onOpenNavigator={() => setNavigatorOpen(true)}
              onJump={handleJump}
              jumpValue={jumpReference}
              onJumpChange={setJumpReference}
              jumpError={jumpError}
            />

            {jumpError ? (
              <p className="field__error" role="alert">
                {jumpError}
              </p>
            ) : null}

            {copied ? (
              <p className="field__hint" role="status">
                Link to this ayah copied to the clipboard.
              </p>
            ) : null}

            {resumeVisible ? (
              <div className="resume-callout">
                <div>
                  <p className="resume-callout__label">Continue from last verse</p>
                  <p className="resume-callout__text">{lastReading.name}</p>
                </div>
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  onClick={continueReading}
                >
                  <BookOpen size={15} aria-hidden="true" />
                  Continue
                </button>
              </div>
            ) : null}

            {sectionError ? <Notice tone="danger">{sectionError}</Notice> : null}

            {!activeSurah && !sectionLoading ? (
              <EmptyState
                icon={BookOpen}
                title="Open a surah to begin"
                description="Choose a chapter from the navigator, or jump straight to an ayah reference such as 2:255."
                action="Start with Al-Fatihah"
                onClick={() => {
                  const surah = surahs.find((item) => item.id === 1);
                  if (surah) openSurahReader(surah);
                }}
              />
            ) : null}

            {sectionLoading ? <SkeletonList rows={4} /> : null}

            {!sectionLoading && verses.length > 0 ? (
              <div className="verse-list">
                {verses.map((verse, index) => {
                  const saved = savedAyahs[`${verse.surahId}:${verse.number}`] || {};
                  const noteKey = `${verse.surahId}:${verse.number}`;
                  return (
                    <div key={verse.anchor}>
                      <VerseRow
                        verse={verse}
                        index={index}
                        playing={playingAyahIndex === index && !paused}
                        saved={saved}
                        showTransliteration={
                          readingOptions.showTransliteration &&
                          Boolean(verse.transliteration)
                        }
                        onPlay={togglePlayPause}
                        onToggleBookmark={toggleBookmark}
                        onToggleHighlight={toggleHighlight}
                        onAddNote={openNoteEditor}
                        onShare={shareAyah}
                      />

                      {editingNote === noteKey ? (
                        <div className="verse-row__note-edit">
                          <label className="field">
                            <span className="field__label">
                              Private note for {verse.reference}
                            </span>
                            <textarea
                              className="textarea"
                              value={noteDraft}
                              onChange={(event) => setNoteDraft(event.target.value)}
                              rows={3}
                              autoFocus
                            />
                          </label>
                          <div className="cluster verse-row__note-actions">
                            <button
                              type="button"
                              className="btn btn--primary btn--sm"
                              onClick={() => saveNote(verse)}
                            >
                              Save note
                            </button>
                            <button
                              type="button"
                              className="btn btn--quiet btn--sm"
                              onClick={() => setEditingNote(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}

            {!sectionLoading && activeSurah && verses.length === 0 ? (
              <EmptyState
                icon={Bookmark}
                title="No verses loaded"
                description="This section could not be loaded from AlQuran Cloud. Try another chapter, or check your connection."
              />
            ) : null}
          </div>
        </div>
      </div>

      <ReadingOptionsSheet
        open={optionsOpen}
        onClose={() => setOptionsOpen(false)}
        options={readingOptions}
        onChange={setOptions}
        appearance={appearance}
        onAppearanceChange={setAppearance}
        reciters={RECITERS}
      />

      <Sheet
        open={navigatorOpen}
        onClose={() => setNavigatorOpen(false)}
        title="Chapters"
        variant="drawer"
      >
        <ChapterNavigator
          surahs={surahs}
          loading={loading}
          activeSurahId={activeSurah?.id}
          search={search}
          onSearchChange={setSearch}
          onSelectSurah={(surah) => {
            setNavigatorOpen(false);
            openSurahReader(surah);
          }}
          onSelectSection={(kind, number) => {
            setNavigatorOpen(false);
            openReadingSection(kind, number);
          }}
        />
      </Sheet>
    </div>
  );
}

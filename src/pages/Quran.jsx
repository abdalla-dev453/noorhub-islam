import { Pause, Play, Search, Volume2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api } from "../utils/api";

const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Rashid Alafasy" },
  { id: "ar.minshawi", name: "Muhammad Siddiq al-Minshawi" },
  { id: "ar.abdulbasit", name: "Abdul Basit Abdul Samad" },
  { id: "ar.husary", name: "Mahmoud Khalil Al-Husary" },
  { id: "ar.ghamadi", name: "Saad Al-Ghamdi" },
];

export default function Quran() {
  const [surahs, setSurahs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal & Audio Tracking States
  const [activeSurah, setActiveSurah] = useState(null);
  const [verses, setVerses] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  const [selectedReciter, setSelectedReciter] = useState("ar.alafasy");
  const [playingAyahIndex, setPlayingAyahIndex] = useState(null);
  const [isContinuous, setIsContinuous] = useState(true);

  const audioRef = useRef(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingAyahIndex(null);
  };

  const playAudioStream = (versesArray, index) => {
    const currentAyah = versesArray[index];
    if (!currentAyah || !currentAyah.audio) {
      stopAudio();
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    setPlayingAyahIndex(index);
    audioRef.current = new Audio(currentAyah.audio);

    const element = document.getElementById(`ayah-${currentAyah.number}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    audioRef.current
      .play()
      .catch((e) => console.error("Audio playback interrupted:", e));

    audioRef.current.onended = () => {
      const nextIndex = index + 1;
      if (isContinuous && nextIndex < versesArray.length) {
        playAudioStream(versesArray, nextIndex);
      } else {
        setPlayingAyahIndex(null);
      }
    };
  };

  const loadSurahContent = async (
    surah,
    resumeIndex = null,
    reciter = selectedReciter,
  ) => {
    setModalLoading(true);
    try {
      const data = await api.getSurahDetails(surah.id, reciter);
      const integratedVerses = data.arabicVerses.map((ayah, i) => ({
        index: i,
        number: ayah.numberInSurah,
        text: ayah.text,
        translation: data.englishVerses[i]?.text || "",
        audio: data.audioVerses[i]?.audio || "",
      }));

      setVerses(integratedVerses);

      if (resumeIndex !== null && integratedVerses[resumeIndex]) {
        playAudioStream(integratedVerses, resumeIndex);
      }
    } catch (err) {
      console.error("Failed to load surah details:", err);
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    api
      .getAllSurahs(controller.signal)
      .then(setSurahs)
      .catch(console.error)
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const openSurahReader = (surah) => {
    setActiveSurah(surah);
    loadSurahContent(surah);
  };

  const handleReciterChange = (event) => {
    const nextReciter = event.target.value;
    setSelectedReciter(nextReciter);

    if (activeSurah) {
      stopAudio();
      loadSurahContent(activeSurah, playingAyahIndex, nextReciter);
    }
  };

  const togglePlayPause = (index) => {
    if (playingAyahIndex === index) {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setPlayingAyahIndex(null);
      } else if (audioRef.current) {
        audioRef.current.play();
        setPlayingAyahIndex(index);
      }
    } else {
      playAudioStream(verses, index);
    }
  };

  const playFullSurah = () => {
    if (verses.length > 0) {
      playAudioStream(verses, 0);
    }
  };

  const handleCloseModal = () => {
    stopAudio();
    setActiveSurah(null);
    setVerses([]);
    setPlayingAyahIndex(null);
  };

  const filteredSurahs = surahs.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toString() === search.trim(),
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="label-badge">Holy Text</span>
        <h1 className="section-title">The Noble Quran</h1>
        <p className="section-sub">
          Read verses in clear Arabic script with English translation and listen
          to high quality audio recitations.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search by chapter number, name, or meaning..."
          className="noor-input pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center text-sm font-mono text-[var(--accent)] animate-pulse py-12">
          Loading Surah index...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {filteredSurahs.map((surah) => (
            <div
              key={surah.id}
              onClick={() => openSurahReader(surah)}
              className="noor-card group cursor-pointer flex justify-between items-center p-4 hover:border-[var(--accent)]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-xs font-mono font-bold text-[var(--accent)] shrink-0">
                  {surah.id}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    {surah.name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {surah.meaning} • {surah.verses} verses
                  </p>
                </div>
              </div>
              <p className="arabic text-lg text-[var(--accent)]" lang="ar">
                {surah.arabic}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Surah Reader Modal */}
      {activeSurah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[var(--surface)] border border-[var(--border)] w-full max-w-4xl h-[85vh] rounded-2xl flex flex-col shadow-xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[var(--border)] flex flex-col sm:flex-row gap-4 justify-between sm:items-center bg-[var(--surface)]">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <span>{activeSurah.name}</span>
                  <span className="text-xs font-normal text-[var(--text-secondary)]">
                    ({activeSurah.meaning})
                  </span>
                </h2>
                <div className="flex items-center gap-3 mt-1.5">
                  <button
                    onClick={playFullSurah}
                    disabled={modalLoading}
                    className="btn btn-primary text-xs py-1 px-3"
                  >
                    <Volume2 size={13} />
                    Play Surah
                  </button>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-[var(--text-secondary)] select-none">
                    <input
                      type="checkbox"
                      checked={isContinuous}
                      onChange={(e) => setIsContinuous(e.target.checked)}
                      className="accent-[var(--accent)] cursor-pointer w-3.5 h-3.5"
                    />
                    Autoplay Next
                  </label>
                </div>
              </div>

              {/* Reciter selector & Close */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedReciter}
                  onChange={handleReciterChange}
                  className="bg-[var(--bg)] border border-[var(--border)] rounded-md px-2.5 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
                >
                  {RECITERS.map((qari) => (
                    <option key={qari.id} value={qari.id}>
                      {qari.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleCloseModal}
                  className="btn btn-ghost w-8 h-8 p-0 rounded-md"
                  aria-label="Close reader"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Verses Scroll Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
              {modalLoading ? (
                <div className="h-full flex items-center justify-center text-sm font-mono text-[var(--text-secondary)] animate-pulse">
                  Loading verses and audio...
                </div>
              ) : (
                verses.map((ayah) => {
                  const isCurrentPlaying = playingAyahIndex === ayah.index;
                  return (
                    <div
                      key={ayah.index}
                      id={`ayah-${ayah.number}`}
                      className={`p-4 rounded-xl border transition-colors flex gap-4 items-start ${
                        isCurrentPlaying
                          ? "border-[var(--accent)] bg-[var(--accent)]/5"
                          : "border-[var(--border)] bg-[var(--bg)]/50"
                      }`}
                    >
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)] font-bold shrink-0 mt-1">
                        {ayah.number}
                      </span>

                      <div className="flex-1 space-y-2">
                        <p
                          className="arabic text-xl sm:text-2xl text-[var(--text-primary)] text-right leading-loose"
                          lang="ar"
                        >
                          {ayah.text}
                        </p>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                          {ayah.translation}
                        </p>
                      </div>

                      <button
                        onClick={() => togglePlayPause(ayah.index)}
                        className={`btn text-xs py-1.5 px-2.5 shrink-0 ${
                          isCurrentPlaying ? "btn-primary" : "btn-secondary"
                        }`}
                        title={isCurrentPlaying ? "Pause Ayah" : "Play Ayah"}
                      >
                        {isCurrentPlaying ? (
                          <Pause size={13} />
                        ) : (
                          <Play size={13} />
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

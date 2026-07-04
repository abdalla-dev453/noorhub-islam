import React, { useState, useEffect, useRef } from "react";
import { api } from "../utils/api";

const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Rashid Alafasy" },
  { id: "ar.minshawi", name: "Muhammad Siddiq al-Minshawi" },
  { id: "ar.abdulbasit", name: "Abdul Basit Abdul Samad" },
  { id: "ar.husary", name: "Mahmoud Khalil Al-Husary" },
  { id: "ar.ghamadi", name: "Saad Al-Ghamdi" }
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
  const [playingAyahIndex, setPlayingAyahIndex] = useState(null); // Tracks array indices (0, 1, 2...)
  const [isContinuous, setIsContinuous] = useState(true); // Toggle autoplay workflow
  
  const audioRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    api.getAllSurahs(controller.signal)
      .then(setSurahs)
      .catch(console.error)
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  // Hot-reload specific verse audio files if user changes the reciter mid-stream
  useEffect(() => {
    if (activeSurah) {
      const activeIdx = playingAyahIndex;
      stopAudio();
      loadSurahContent(activeSurah, activeIdx);
    }
  }, [selectedReciter]);

  const loadSurahContent = async (surah, resumeIndex = null) => {
    setModalLoading(true);
    try {
      const data = await api.getSurahDetails(surah.id, selectedReciter);
      const integratedVerses = data.arabicVerses.map((ayah, i) => ({
        index: i,
        number: ayah.numberInSurah,
        text: ayah.text,
        translation: data.englishVerses[i]?.text || "",
        audio: data.audioVerses[i]?.audio || ""
      }));

      setVerses(integratedVerses);
      
      // Resume playback at targeted indices if switching vocal profiles live
      if (resumeIndex !== null && integratedVerses[resumeIndex]) {
        playAudioStream(integratedVerses, resumeIndex);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const openSurahReader = (surah) => {
    setActiveSurah(surah);
    loadSurahContent(surah);
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
    
    // Smooth scrolling alignment block to keep active verse central on screen
    const element = document.getElementById(`ayah-${currentAyah.number}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    audioRef.current.play().catch(e => console.error("Playback interrupted", e));

    // 🔄 Continuous Audio flow event handler mapping hook
    audioRef.current.onended = () => {
      const nextIndex = index + 1;
      if (isContinuous && nextIndex < versesArray.length) {
        playAudioStream(versesArray, nextIndex);
      } else {
        setPlayingAyahIndex(null);
      }
    };
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

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingAyahIndex(null);
  };

  const handleCloseModal = () => {
    stopAudio();
    setActiveSurah(null);
    setVerses([]);
    setPlayingAyahIndex(null);
  };

  const filteredSurahs = surahs.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toString() === search.trim()
  );

  return (
    <div className="space-y-12 relative">
      {/* Header section */}
      <div className="text-center space-y-4">
        <span className="glow-badge">Holy Text</span>
        <h1 className="text-4xl md:text-5xl gradient-heading">The Noble Quran</h1>
        <p className="sub-heading">Select a chapter to read verses and stream adaptive continuous play audio recitations.</p>
      </div>

      <div className="max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search by index, name, or meaning..."
          className="noor-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center text-teal-400 font-mono animate-pulse">Syncing surah indexes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSurahs.map((surah) => (
            <div 
              key={surah.id} 
              onClick={() => openSurahReader(surah)}
              className="noor-card group cursor-pointer flex justify-between items-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-colors" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative w-10 h-10 flex items-center justify-center `flex-shrink-0`">
                  <div className="absolute inset-0 bg-teal-500/10 border border-teal-400/20 rotate-45 rounded-sm" />
                  <span className="relative text-xs font-mono font-bold text-teal-400">{surah.id}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 group-hover:text-teal-400 transition-colors">{surah.name}</h3>
                  <p className="text-xs text-slate-400">{surah.meaning}</p>
                </div>
              </div>
              <p className="text-xl font-serif text-teal-400 relative z-10">{surah.arabic}</p>
            </div>
          ))}
        </div>
      )}

      {/*  Advanced Audio Enabled Modal Viewer */}
      {activeSurah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-opacity">
          <div className="bg-[#0b0f19] border border-slate-800 w-full max-w-4xl h-[85vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Control Dashboard Header Area */}
            <div className="p-6 border-b border-slate-900 bg-slate-900/40 flex flex-col md:flex-row gap-4 justify-between md:items-center">
              <div>
                <h2 className="text-xl font-bold text-teal-400 font-serif flex items-center gap-3">
                  <span>{activeSurah.name}</span>
                  <span className="text-sm font-sans font-normal text-slate-500">({activeSurah.meaning})</span>
                </h2>
                <div className="flex items-center gap-3 mt-1.5">
                  <button 
                    onClick={playFullSurah}
                    disabled={modalLoading}
                    className="text-[10px] font-sans font-bold bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-slate-950 px-2.5 py-1 rounded shadow-md tracking-wider uppercase transition-colors"
                  >
                    ^ Play Full Surah
                  </button>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-mono text-slate-400 select-none">
                    <input 
                      type="checkbox" 
                      checked={isContinuous} 
                      onChange={(e) => setIsContinuous(e.target.checked)}
                      className="accent-teal-500 cursor-pointer w-3.5 h-3.5"
                    />
                    Continuous Autoplay
                  </label>
                </div>
              </div>

              {/*  Reciter Picker Component */}
              <div className="flex items-center gap-3 self-end md:self-auto">
                <select
                  value={selectedReciter}
                  onChange={(e) => setSelectedReciter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-teal-500/60 cursor-pointer"
                >
                  {RECITERS.map(qari => (
                    <option key={qari.id} value={qari.id} className="bg-slate-950 text-slate-300">{qari.name}</option>
                  ))}
                </select>
                <button 
                  onClick={handleCloseModal}
                  className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-mono text-xs transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Scrollable Text Window Frame */}
            <div className="flex-grow p-6 md:p-8 overflow-y-auto space-y-8 custom-scrollbar">
              {modalLoading ? (
                <div className="h-full flex items-center justify-center text-sm font-mono text-slate-500 animate-pulse">
                  Streaming target reciter digital assets...
                </div>
              ) : (
                verses.map((ayah) => {
                  const isCurrentPlaying = playingAyahIndex === ayah.index;
                  return (
                    <div 
                      key={ayah.index}
                      className={`flex gap-4 items-center ${isCurrentPlaying ? "text-teal-400" : ""}`}
                        id={`ayah-${ayah.number}`}
                    >
                        <div className="flex-shrink-0">
                            <span className="text-xs font-mono px-2 py-0.5 bg-slate-950/60 border border-slate-900 text-teal-400 font-bold rounded">
                                {ayah.number}
                            </span>
                        </div>
                        <div className="flex-grow space-y-1">
                            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-sans selection:bg-teal-500 selection:text-slate-950">
                                {ayah.text}
                            </p>
                            <p className="text-xs md:text-sm text-slate-400 leading-snug font-sans italic selection:bg-teal-500/30 selection:text-slate-950">
                                {ayah.translation}
                            </p>
                        </div>
                        <button
                            onClick={() => togglePlayPause(ayah.index)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wider uppercase border border-slate-800 text-slate-300 bg-slate-900/20 hover:bg-slate-900 hover:text-teal-400 hover:border-teal-500/30 transition-all duration-200 shadow-md ${isCurrentPlaying ? "bg-teal-500/20 text-teal-400 border-teal-400" : ""}`}
                        >
                            {isCurrentPlaying ? "Pause" : "Play"}
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

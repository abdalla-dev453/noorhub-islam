import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { api } from "../utils/api";
import {
  filterNarrations,
  getNarrationMatchCount,
} from "../utils/hadithFilters";

const REPOS = [
  {
    slug: "eng-bukhari",
    title: "Sahih al-Bukhari",
    key: "bukhari",
    total: 7563,
  },
  { slug: "eng-muslim", title: "Sahih Muslim", key: "muslim", total: 7563 },
  { slug: "eng-abudawud", title: "Sunan Abi Dawud", key: "dawud", total: 5274 },
];

const BATCH_SIZE = 20;

const HIGHLIGHT_PATTERNS = [
  {
    regex: /\b(Allah|God|The Lord|Almighty)\b/gi,
    className: "text-red-400 font-semibold",
  },
  {
    regex:
      /\b(Prophet|Messenger|Muhammad|Prophet Muhammad|Jesus|Moses|Abraham|Ibrahim|Isa|Musa|Adam)\b/gi,
    className: "text-emerald-400 font-semibold",
  },
  {
    regex: /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g,
    className: "text-sky-400 font-semibold",
  },
  { regex: /\(([^)]+)\)/g, className: "text-amber-300 font-medium" },
  {
    regex: /\b(very|truly|indeed|certainly|always)\b/gi,
    className: "text-violet-400 font-medium",
  },
];

function renderHighlightedText(text) {
  if (!text) return null;

  const parts = [];
  let remaining = text;

  while (remaining) {
    let nextMatch = null;
    for (const pattern of HIGHLIGHT_PATTERNS) {
      const match = remaining.match(pattern.regex);
      if (match) {
        const index = remaining.search(pattern.regex);
        if (nextMatch === null || index < nextMatch.index) {
          nextMatch = { match: match[0], index, pattern };
        }
      }
    }

    if (!nextMatch) {
      parts.push(<span key={parts.length}>{remaining}</span>);
      break;
    }

    const before = remaining.slice(0, nextMatch.index);
    const matched = nextMatch.match;
    const after = remaining.slice(nextMatch.index + matched.length);

    if (before) {
      parts.push(<span key={`${parts.length}-text`}>{before}</span>);
    }

    parts.push(
      <span
        key={`${parts.length}-highlight`}
        className={nextMatch.pattern.className}
      >
        {matched}
      </span>,
    );

    remaining = after;
  }

  return <>{parts}</>;
}

export default function Hadith() {
  const [activeBook, setActiveBook] = useState(null);
  const [allNarrations, setAllNarrations] = useState([]);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fallbackNote, setFallbackNote] = useState(false);

  // A ref to abort in-flight network requests if the user clicks back instantly.
  const abortControllerRef = useRef(null);

  const normalizedSearch = useMemo(() => search.trim().toLowerCase(), [search]);

  const filteredNarrations = useMemo(() => {
    if (!activeBook || allNarrations.length === 0) return [];
    return filterNarrations(allNarrations, normalizedSearch, visibleCount);
  }, [activeBook, allNarrations, normalizedSearch, visibleCount]);

  const activeFilteredTotal = useMemo(() => {
    if (!activeBook || allNarrations.length === 0) return 0;
    return getNarrationMatchCount(allNarrations, normalizedSearch);
  }, [activeBook, allNarrations, normalizedSearch]);

  const selectBook = useCallback(async (book) => {
    setActiveBook(book);
    setLoading(true);
    setError(false);
    setFallbackNote(false);
    setVisibleCount(BATCH_SIZE);
    setSearch("");

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    try {
      const data = await api.getHadithCollection(
        book.slug,
        abortControllerRef.current.signal,
      );
      setAllNarrations(data);
      setFallbackNote(false);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(true);
        setAllNarrations([]);
        setFallbackNote(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleBack = useCallback(() => {
    abortControllerRef.current?.abort();
    setActiveBook(null);
    setAllNarrations([]);
    setSearch("");
    setVisibleCount(BATCH_SIZE);
  }, []);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + BATCH_SIZE);
  }, []);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return (
    <div className="space-y-12">
      {/* Dynamic Sub-Header Block Layout */}
      <div className="text-center space-y-4">
        <span className="glow-badge">Prophetic Traditions</span>
        <h1 className="text-4xl md:text-5xl gradient-heading">
          Hadith Encyclopedia
        </h1>
        <p className="sub-heading">
          Explore historical accounts and verified narrations from the primary
          textual resources.
        </p>
      </div>

      {!activeBook ? (
        /* Main Catalog Selection Board Grid Matrix */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {REPOS.map((book) => (
            <div
              key={book.slug}
              onClick={() => selectBook(book)}
              className="noor-card text-center group cursor-pointer space-y-4 py-8"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 font-bold flex items-center justify-center mx-auto text-sm font-mono border border-teal-500/20 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all duration-300">
                {book.key.toUpperCase()}
              </div>
              <h3 className="font-bold text-lg text-slate-200 group-hover:text-teal-400 transition-colors">
                {book.title}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {book.total.toLocaleString()} Records loaded
              </p>
              <span className="text-[10px] tracking-widest text-slate-400 group-hover:text-teal-400 uppercase block font-semibold transition-colors pt-2">
                Query Book →
              </span>
            </div>
          ))}
        </div>
      ) : (
        /* Active Collection Narrative Content Panel Grid */
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
            <button
              onClick={handleBack}
              className="text-xs font-mono font-semibold tracking-wider text-teal-400 hover:text-white transition-colors self-start py-2"
            >
              ← BACK TO COLLECTIONS
            </button>
            <h2 className="text-2xl font-bold text-white font-serif tracking-tight">
              {activeBook.title}
            </h2>
          </div>

          {/* Unified dynamic text filtering input frame control */}
          {!loading && !error && (
            <div className="relative">
              <input
                type="text"
                placeholder={`Search inside ${activeBook.title} by index or text keys...`}
                className="noor-input"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleCount(BATCH_SIZE);
                }}
              />
              {search && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                  {activeFilteredTotal} matches
                </span>
              )}
            </div>
          )}

          {loading && (
            <div className="space-y-6" aria-live="polite">
              <div className="noor-card space-y-4 animate-pulse">
                <div className="h-4 w-24 rounded bg-slate-800" />
                <div className="h-4 w-full rounded bg-slate-800/80" />
                <div className="h-4 w-5/6 rounded bg-slate-800/70" />
                <div className="h-4 w-4/5 rounded bg-slate-800/60" />
              </div>
              <div className="noor-card space-y-4 animate-pulse">
                <div className="h-4 w-20 rounded bg-slate-800" />
                <div className="h-4 w-full rounded bg-slate-800/80" />
                <div className="h-4 w-3/4 rounded bg-slate-800/70" />
              </div>
              <div className="noor-card space-y-4 animate-pulse">
                <div className="h-4 w-28 rounded bg-slate-800" />
                <div className="h-4 w-full rounded bg-slate-800/80" />
                <div className="h-4 w-2/3 rounded bg-slate-800/70" />
              </div>
            </div>
          )}

          {error && (
            <div className="noor-card border-red-500/20 text-center py-8 max-w-md mx-auto space-y-3">
              <p className="text-sm text-red-400">
                Failed to stream target text data node blocks.
              </p>
              {fallbackNote && (
                <p className="text-xs text-slate-400 font-mono">
                  A fallback source is being used. If this persists, please try
                  again shortly.
                </p>
              )}
              <button
                onClick={() => selectBook(activeBook)}
                className="mt-3 text-xs text-teal-400 underline font-mono"
              >
                Retry with fallback source
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-6">
              {filteredNarrations.map((item, index) => (
                <div
                  key={item.id}
                  className="noor-card relative overflow-hidden group animate-[fadeIn_250ms_ease-out]"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-teal-500/40 to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono px-2 py-0.5 bg-slate-950/60 border border-slate-900 text-teal-400 font-bold rounded">
                      Reference #{item.id}
                    </span>
                  </div>
                  <p className="text-[15px] md:text-base text-slate-300 leading-8 font-serif tracking-wide pl-1.5 selection:bg-teal-500 selection:text-slate-950">
                    {renderHighlightedText(item.text)}
                  </p>
                </div>
              ))}

              {/* Dynamic Lazy Load Action Panel Element block */}
              {activeFilteredTotal > filteredNarrations.length && (
                <div className="text-center pt-6">
                  <button
                    onClick={loadMore}
                    className="px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase border border-slate-800 text-slate-300 bg-slate-900/20 hover:bg-slate-900 hover:text-teal-400 hover:border-teal-500/30 transition-all duration-200 shadow-md"
                  >
                    Load More Traditions (
                    {activeFilteredTotal - filteredNarrations.length} remaining)
                  </button>
                </div>
              )}

              {filteredNarrations.length === 0 && (
                <div className="text-center text-slate-500 py-12 text-sm font-mono">
                  No narrations match your text filter query parameters.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

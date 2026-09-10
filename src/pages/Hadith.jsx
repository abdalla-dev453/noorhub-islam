import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  RefreshCw,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    className: "text-[var(--accent)] font-semibold",
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
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(true);
        setAllNarrations([]);
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
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="label-badge">Prophetic Traditions</span>
        <h1 className="section-title">Hadith Encyclopedia</h1>
        <p className="section-sub">
          Explore authentic narrations and teachings from the classical hadith
          compilations.
        </p>
      </div>

      {!activeBook ? (
        /* Collection Selector */
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {REPOS.map((book) => (
            <div
              key={book.slug}
              onClick={() => selectBook(book)}
              className="noor-card text-center group cursor-pointer space-y-4 py-8 hover:border-[var(--accent)]"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--surface-hover)] text-[var(--accent)] font-bold flex items-center justify-center mx-auto text-sm font-mono border border-[var(--border)] group-hover:bg-[var(--accent)] group-hover:text-slate-950 transition-colors">
                <BookOpen size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                  {book.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  {book.total.toLocaleString()} Narrations
                </p>
              </div>
              <span className="text-xs font-semibold text-[var(--accent)] block pt-1">
                Browse Collection →
              </span>
            </div>
          ))}
        </div>
      ) : (
        /* Active Collection */
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold tracking-wider text-[var(--accent)] hover:underline"
            >
              <ArrowLeft size={14} />
              Back to Collections
            </button>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {activeBook.title}
            </h2>
          </div>

          {/* Search bar */}
          {!loading && !error && (
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
              />
              <input
                type="text"
                placeholder={`Search inside ${activeBook.title}...`}
                className="noor-input pl-10 pr-24"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleCount(BATCH_SIZE);
                }}
              />
              {search && (
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] px-2 py-0.5 rounded font-mono">
                  {activeFilteredTotal} matches
                </span>
              )}
            </div>
          )}

          {loading && (
            <div className="space-y-4 py-8" aria-live="polite">
              <div className="noor-card space-y-3 animate-pulse">
                <div className="h-4 w-24 rounded bg-[var(--surface-hover)]" />
                <div className="h-4 w-full rounded bg-[var(--surface-hover)]" />
                <div className="h-4 w-4/5 rounded bg-[var(--surface-hover)]" />
              </div>
              <div className="noor-card space-y-3 animate-pulse">
                <div className="h-4 w-20 rounded bg-[var(--surface-hover)]" />
                <div className="h-4 w-full rounded bg-[var(--surface-hover)]" />
                <div className="h-4 w-3/4 rounded bg-[var(--surface-hover)]" />
              </div>
            </div>
          )}

          {error && (
            <div className="noor-card border-red-500/20 text-center py-8 max-w-md mx-auto space-y-3">
              <AlertCircle size={24} className="text-red-400 mx-auto" />
              <p className="text-sm text-red-400">
                Could not load hadith records. Please try again.
              </p>
              <button
                onClick={() => selectBook(activeBook)}
                className="btn btn-secondary text-xs py-1.5 px-4"
              >
                <RefreshCw size={13} />
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              {filteredNarrations.map((item) => (
                <div key={item.id} className="noor-card space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 bg-[var(--bg)] border border-[var(--border)] text-[var(--accent)] font-bold rounded">
                      #{item.id}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-[var(--text-primary)] leading-relaxed">
                    {renderHighlightedText(item.text)}
                  </p>
                </div>
              ))}

              {activeFilteredTotal > filteredNarrations.length && (
                <div className="text-center pt-4">
                  <button
                    onClick={loadMore}
                    className="btn btn-secondary text-xs py-2.5 px-6"
                  >
                    Load More Narrations (
                    {activeFilteredTotal - filteredNarrations.length} remaining)
                  </button>
                </div>
              )}

              {filteredNarrations.length === 0 && (
                <div className="text-center text-[var(--text-muted)] py-12 text-sm font-mono">
                  No narrations match your search query.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

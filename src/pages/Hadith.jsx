import {
  AlertCircle,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  RefreshCw,
  Search,
  Share2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "../utils/api";
import { usePersistentState } from "../hooks/usePersistentState";
import {
  filterNarrations,
  getNarrationMatchCount,
} from "../utils/hadithFilters";
import ProgressBar from "../components/ui/ProgressBar";
import Notice from "../components/ui/Notice";
import EmptyState from "../components/ui/EmptyState";
import { SkeletonList } from "../components/ui/Skeleton";
import IconButton from "../components/ui/IconButton";

const REPOS = [
  { slug: "eng-bukhari", title: "Sahih al-Bukhari", key: "bukhari" },
  { slug: "eng-muslim", title: "Sahih Muslim", key: "muslim" },
  { slug: "eng-abudawud", title: "Sunan Abi Dawud", key: "dawud" },
];

const BATCH_SIZE = 20;
const SAVED_KEY = "noorhub_hadith_saved";

export default function Hadith() {
  const [activeBook, setActiveBook] = useState(null);
  const [allNarrations, setAllNarrations] = useState([]);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [saved, setSaved] = usePersistentState(SAVED_KEY, []);
  const [copiedId, setCopiedId] = useState(null);

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
    setVisibleCount((previous) => previous + BATCH_SIZE);
  }, []);

  useEffect(
    () => () => {
      abortControllerRef.current?.abort();
    },
    [],
  );

  const isSaved = (book, id) => saved.some((item) => item.book === book && item.id === id);

  const toggleSaved = (narration, book) => {
    setSaved((previous) => {
      const exists = previous.some(
        (item) => item.book === book.slug && item.id === narration.id,
      );
      if (exists) {
        return previous.filter(
          (item) => !(item.book === book.slug && item.id === narration.id),
        );
      }
      return [
        ...previous,
        {
          book: book.slug,
          bookTitle: book.title,
          id: narration.id,
          text: narration.text,
          savedAt: new Date().toISOString(),
        },
      ].slice(-200);
    });
  };

  const share = async (narration, book) => {
    const label = `${book.title} · narration ${narration.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: label, text: narration.text });
      } else {
        await navigator.clipboard.writeText(narration.text);
        setCopiedId(narration.id);
        window.setTimeout(() => setCopiedId(null), 2400);
      }
    } catch {
      /* share dismissed */
    }
  };

  return (
    <div className="page">
      <div className="container container--narrow">
        <header className="page-head">
          <span className="page-head__eyebrow">Library</span>
          <h1 className="page-head__title">Hadith collections</h1>
          <div className="page-head__meta">
            <span>English narration text</span>
            <span aria-hidden="true">·</span>
            <span>Grading and narrator chains not yet included</span>
          </div>
          <p className="page__lede">
            Browse three collections narration by narration, or search inside one.
            Every entry names its source, and anything you save stays on this
            device.
          </p>
        </header>

        {!activeBook ? (
          <section aria-labelledby="collections-heading">
            <h2 className="sr-only" id="collections-heading">
              Choose a collection
            </h2>
            <div className="collection-list">
              {REPOS.map((book) => (
                <button
                  key={book.slug}
                  type="button"
                  className="card card--interactive collection-card"
                  onClick={() => selectBook(book)}
                >
                  <span className="explore-row__icon">
                    <BookOpen size={19} aria-hidden="true" />
                  </span>
                  <h3 className="card__title collection-card__title">{book.title}</h3>
                  <p className="meta collection-card__meta">
                    {saved.filter((item) => item.book === book.slug).length} saved
                    from this collection
                  </p>
                  <p className="collection-card__desc">
                    English text as published in the fawazahmed0 hadith-api
                    edition. Open the collection to search and save narrations.
                  </p>
                  <span className="section-header__action">
                    Browse collection
                    <span aria-hidden="true">→</span>
                  </span>
                </button>
              ))}
            </div>

            {saved.length > 0 ? (
              <section className="card hadith-saved" aria-labelledby="saved-heading">
                <h2 className="card__title" id="saved-heading">
                  Saved narrations
                </h2>
                <p className="meta">
                  {saved.length} saved on this device. Saved text is stored
                  locally, not synced.
                </p>
                <ul className="stack hadith-saved__list">
                  {saved.map((item) => (
                    <li key={`${item.book}-${item.id}`} className="hadith-saved__item">
                      <p className="meta">
                        {item.bookTitle} · narration {item.id}
                      </p>
                      <p className="hadith-saved__text">{item.text}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </section>
        ) : (
          <section aria-labelledby="collection-heading">
            <div className="collection-head">
              <button type="button" className="btn btn--quiet btn--sm" onClick={handleBack}>
                <ArrowLeft size={15} aria-hidden="true" />
                All collections
              </button>
              <h2 className="card__title" id="collection-heading">
                {activeBook.title}
              </h2>
            </div>

            {!loading && !error ? (
              <div className="search-field hadith-search">
                <Search size={17} className="search-field__icon" aria-hidden="true" />
                <input
                  type="search"
                  className="input"
                  placeholder={`Search inside ${activeBook.title}`}
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setVisibleCount(BATCH_SIZE);
                  }}
                  aria-label={`Search inside ${activeBook.title}`}
                />
                {search ? (
                  <span className="hadith-search__count">
                    {activeFilteredTotal} matches
                  </span>
                ) : null}
              </div>
            ) : null}

            {loading ? <SkeletonList rows={3} /> : null}

            {error ? (
              <EmptyState
                icon={AlertCircle}
                title="The collection could not be loaded"
                description="Check your connection and try again. Nothing was saved from this attempt."
                action="Retry"
                onClick={() => selectBook(activeBook)}
              />
            ) : null}

            {!loading && !error ? (
              <>
                <div className="reading-progress">
                  <ProgressBar
                    value={filteredNarrations.length}
                    max={activeFilteredTotal || 1}
                    label={`Showing ${filteredNarrations.length} of ${activeFilteredTotal} narrations`}
                  />
                </div>

                <div className="stack">
                  {filteredNarrations.map((item) => {
                    const savedItem = isSaved(activeBook.slug, item.id);
                    return (
                      <article key={item.id} className="hadith-card">
                        <div className="hadith-card__head">
                          <span className="hadith-card__source">
                            {activeBook.title} · narration {item.id}
                          </span>
                          <div className="cluster">
                            <IconButton
                              icon={savedItem ? BookmarkCheck : Bookmark}
                              label={
                                savedItem
                                  ? `Remove narration ${item.id} from saved`
                                  : `Save narration ${item.id}`
                              }
                              size={17}
                              active={savedItem}
                              onClick={() => toggleSaved(item, activeBook)}
                            />
                            <IconButton
                              icon={Share2}
                              label={copiedId === item.id ? "Text copied" : `Share narration ${item.id}`}
                              size={17}
                              onClick={() => share(item, activeBook)}
                            />
                          </div>
                        </div>

                        <p className="hadith-card__text">{item.text}</p>

                        <p className="hadith-card__foot meta">
                          English text · verify against a printed edition before
                          quoting
                        </p>
                      </article>
                    );
                  })}
                </div>

                {activeFilteredTotal > filteredNarrations.length ? (
                  <div className="cluster load-more">
                    <button type="button" className="btn btn--secondary" onClick={loadMore}>
                      Load {Math.min(BATCH_SIZE, activeFilteredTotal - filteredNarrations.length)} more
                    </button>
                    <span className="meta">
                      {activeFilteredTotal - filteredNarrations.length} remaining
                    </span>
                  </div>
                ) : null}

                {filteredNarrations.length === 0 ? (
                  <EmptyState
                    icon={RefreshCw}
                    title="No narrations match that search"
                    description="Try a shorter phrase, or clear the search to browse the collection from the beginning."
                    action="Clear search"
                    onClick={() => setSearch("")}
                  />
                ) : null}
              </>
            ) : null}
          </section>
        )}

        <Notice tone="sand">
          <strong>Source.</strong> Narration text from the fawazahmed0/hadith-api
          editions. Licensing and content review are still being verified, and
          grading, narrator chains and explanatory notes are not included.
        </Notice>
      </div>
    </div>
  );
}

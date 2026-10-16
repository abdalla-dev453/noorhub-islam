import {
  ArrowUpRight,
  BookOpen,
  BookOpenText,
  GraduationCap,
  Search as SearchIcon,
} from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { api } from "../utils/api";
import { fuzzyIncludes, normalizeArabic, normalizeLatin } from "../utils/arabic";
import { readLocal } from "../utils/localData";
import { Tag } from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import Notice from "../components/ui/Notice";
import { PageSkeleton } from "../components/ui/Skeleton";

const HADITH_BOOKS = [
  { slug: "eng-bukhari", title: "Sahih al-Bukhari" },
  { slug: "eng-muslim", title: "Sahih Muslim" },
  { slug: "eng-abudawud", title: "Sunan Abi Dawud" },
];

const SOURCES = ["All", "Quran", "Hadith", "Learning", "Saved items"];

function matchesText(text, term) {
  const arabic = normalizeArabic(text);
  const arabicTerm = normalizeArabic(term);
  const latin = normalizeLatin(text);
  const latinTerm = normalizeLatin(term);
  return arabic.includes(arabicTerm) || fuzzyIncludes(latin, latinTerm, 2);
}

export default function Search() {
  const navigate = useNavigate();
  const { tracks } = useProgress();
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [source, setSource] = useState("All");
  const [book, setBook] = useState(HADITH_BOOKS[0].slug);
  const [results, setResults] = useState({
    quran: [],
    hadith: [],
    learning: [],
    saved: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchId = useRef(0);

  const localSearch = useCallback(
    (term) => {
      const learning = tracks
        .flatMap((track) => [
          {
            type: "Course",
            title: track.title,
            detail: track.description,
            trackId: track.id,
          },
          ...track.syllabus.map((lesson) => ({
            type: "Lesson",
            title: lesson.title,
            detail: `${track.title} · ${lesson.instructor || track.instructor}`,
            trackId: track.id,
          })),
        ])
        .filter((item) => matchesText(`${item.title} ${item.detail}`, term));

      const bookmarks = readLocal("noorhub_quran_ayahs", {});
      const savedAyahs = Object.entries(bookmarks)
        .filter(([, item]) => item.bookmarked || item.note)
        .map(([reference, item]) => ({
          type: item.bookmarked ? "Quran bookmark" : "Quran note",
          title: `Ayah ${reference.replace(":", ":")}`,
          detail: item.note || "Bookmarked ayah",
          reference,
        }))
        .filter((item) => matchesText(`${item.title} ${item.detail}`, term));

      const duas = readLocal("noorhub_private_duas", [])
        .filter((dua) => matchesText(dua.text, term))
        .map((dua) => ({
          type: "Private dua",
          title: dua.text,
          detail: "Saved on this device",
        }));

      return { learning, saved: [...savedAyahs, ...duas] };
    },
    [tracks],
  );

  const runSearch = async (event) => {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    const id = ++searchId.current;
    setSubmittedQuery(term);
    setLoading(true);
    setError("");

    const showQuran = source === "All" || source === "Quran";
    const showHadith = source === "Hadith" || source === "All";
    const showLearning = source === "Learning" || source === "All";
    const showSaved = source === "Saved items" || source === "All";

    const local = localSearch(term);
    setResults({
      quran: [],
      hadith: [],
      learning: showLearning ? local.learning : [],
      saved: showSaved ? local.saved : [],
    });

    const tasks = [];
    if (showQuran) {
      const arabicTerm = normalizeArabic(term);
      const isArabic = /[\u0600-\u06FF]/.test(term);
      const edition = isArabic ? "quran-uthmani" : "en.sahih";
      tasks.push(
        api
          .searchQuran(isArabic ? arabicTerm : term, edition)
          .then((quran) => ({ key: "quran", data: quran })),
      );
    }
    if (showHadith) {
      const books =
        source === "Hadith" ? HADITH_BOOKS.filter((item) => item.slug === book) : HADITH_BOOKS;
      tasks.push(
        Promise.all(
          books.map(async (item) => ({
            book: item.title,
            matches: (await api.getHadithCollection(item.slug))
              .filter((narration) => matchesText(narration.text, term))
              .map((narration) => ({
                ...narration,
                book: item.title,
                detail: `Narration ${narration.id}`,
              })),
          })),
        ).then((collections) => ({
          key: "hadith",
          data: collections.flatMap((collection) => collection.matches).slice(0, 50),
        })),
      );
    }

    const settled = await Promise.allSettled(tasks);
    if (id !== searchId.current) return;

    const next = {
      quran: [],
      hadith: [],
      learning: showLearning ? local.learning : [],
      saved: showSaved ? local.saved : [],
    };
    settled.forEach((result) => {
      if (result.status === "fulfilled") next[result.value.key] = result.value.data;
    });

    const failures = settled.filter((result) => result.status === "rejected");
    if (failures.length) {
      setError(
        "Some online sources could not be reached. Saved items and learning matches are still available.",
      );
    }
    setResults(next);
    setLoading(false);
  };

  const total = useMemo(
    () => Object.values(results).reduce((sum, items) => sum + items.length, 0),
    [results],
  );

  const hasResults = total > 0;

  return (
    <div className="page">
      <div className="container container--narrow">
        <header className="page-head">
          <span className="page-head__eyebrow">Find</span>
          <h1 className="page-head__title">Search NoorHub</h1>
          <div className="page-head__meta">
            <span>Quran text, Hadith, courses and your private notes</span>
          </div>
          <p className="page__lede">
            Search the Uthmani text and the Sahih International translation, the
            three Hadith collections, the course catalogue, and everything you
            have saved on this device.
          </p>
        </header>

        <form className="search-panel" onSubmit={runSearch}>
          <div className="search-field">
            <SearchIcon size={17} className="search-field__icon" aria-hidden="true" />
            <input
              className="input search-panel__input"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Arabic, translation, Hadith, a course, or your notes"
              aria-label="Search NoorHub"
            />
            <button
              type="submit"
              className="btn btn--primary btn--sm search-panel__submit"
              disabled={loading || !query.trim()}
            >
              Search
            </button>
          </div>

          <div className="cluster">
            <span className="field__label">Search in</span>
            {SOURCES.map((item) => (
              <Tag
                key={item}
                active={source === item}
                onClick={() => setSource(item)}
              >
                {item}
              </Tag>
            ))}
            {source === "Hadith" ? (
              <label className="field search-panel__book">
                <span className="sr-only">Hadith collection</span>
                <select
                  className="select"
                  value={book}
                  onChange={(event) => setBook(event.target.value)}
                >
                  {HADITH_BOOKS.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>

          <p className="meta">
            An all-source search checks the three available Hadith collections,
            which is the slowest option. Choose Hadith to search one collection.
          </p>
        </form>

        {loading ? <PageSkeleton label="Searching" /> : null}

        {error ? <Notice tone="sand">{error}</Notice> : null}

        {!loading && submittedQuery ? (
          <section className="search-results" aria-live="polite">
            <header className="section-header">
              <div>
                <span className="section-header__eyebrow label">Results</span>
                <h2 className="section-header__title">
                  {total} {total === 1 ? "match" : "matches"} for “{submittedQuery}”
                </h2>
              </div>
            </header>

            {!hasResults ? (
              <EmptyState
                icon={SearchIcon}
                title="No matches in the selected sources"
                description="Try a shorter phrase, a single word, or search in All sources."
              />
            ) : null}

            {results.quran.length > 0 ? (
              <section className="search-section" aria-labelledby="quran-results">
                <h3 className="search-section__title" id="quran-results">
                  <BookOpen size={16} aria-hidden="true" />
                  Quran · {results.quran.length}
                </h3>
                <div className="stack search-list">
                  {results.quran.slice(0, 30).map((item) => {
                    const isArabic = /[\u0600-\u06FF]/.test(item.text);
                    return (
                      <button
                        key={`${item.reference}-${item.edition}`}
                        type="button"
                        className="search-result"
                        onClick={() =>
                          navigate(`/quran?surah=${item.surahId}&ayah=${item.ayah}`)
                        }
                      >
                        <span className="search-result__head">
                          <span className="search-result__source">
                            {item.reference} · {item.edition}
                          </span>
                          <ArrowUpRight size={15} aria-hidden="true" />
                        </span>
                        <span
                          className={
                            isArabic
                              ? "arabic-text search-result__arabic"
                              : "search-result__text"
                          }
                          lang={isArabic ? "ar" : undefined}
                          dir={isArabic ? "rtl" : undefined}
                        >
                          {item.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {results.hadith.length > 0 ? (
              <section className="search-section" aria-labelledby="hadith-results">
                <h3 className="search-section__title" id="hadith-results">
                  <BookOpenText size={16} aria-hidden="true" />
                  Hadith · {results.hadith.length}
                </h3>
                <div className="stack search-list">
                  {results.hadith.map((item) => (
                    <article key={`${item.book}-${item.id}`} className="hadith-card">
                      <div className="hadith-card__head">
                        <span className="hadith-card__source">
                          {item.book} · narration {item.id}
                        </span>
                      </div>
                      <p className="hadith-card__text">{item.text}</p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {results.learning.length > 0 ? (
              <section className="search-section" aria-labelledby="learning-results">
                <h3 className="search-section__title" id="learning-results">
                  <GraduationCap size={16} aria-hidden="true" />
                  Learning · {results.learning.length}
                </h3>
                <div className="stack search-list">
                  {results.learning.slice(0, 20).map((item) => (
                    <button
                      key={`${item.type}-${item.trackId}-${item.title}`}
                      type="button"
                      className="search-result"
                      onClick={() => navigate(`/learn?search=${encodeURIComponent(submittedQuery)}`)}
                    >
                      <span className="search-result__head">
                        <span className="search-result__source">{item.type}</span>
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </span>
                      <span className="search-result__text search-result__text--title">
                        {item.title}
                      </span>
                      <span className="meta">{item.detail}</span>
                    </button>
                  ))}
                </div>
              </section>
            ) : null}

            {results.saved.length > 0 ? (
              <section className="search-section" aria-labelledby="saved-results">
                <h3 className="search-section__title" id="saved-results">
                  <SearchIcon size={16} aria-hidden="true" />
                  Private saved items · {results.saved.length}
                </h3>
                <div className="stack search-list">
                  {results.saved.map((item, index) => (
                    <button
                      key={`${item.type}-${item.title}-${index}`}
                      type="button"
                      className="search-result"
                      onClick={() => {
                        if (item.reference) {
                          const [surah, ayah] = item.reference.split(":");
                          navigate(`/quran?surah=${surah}&ayah=${ayah}`);
                        }
                      }}
                    >
                      <span className="search-result__head">
                        <span className="search-result__source">{item.type}</span>
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </span>
                      <span className="search-result__text search-result__text--title">
                        {item.title}
                      </span>
                      <span className="meta">{item.detail}</span>
                    </button>
                  ))}
                </div>
              </section>
            ) : null}
          </section>
        ) : null}
      </div>
    </div>
  );
}

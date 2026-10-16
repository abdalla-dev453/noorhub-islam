import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { READING_SECTIONS } from "../../data/quran";
import { Skeleton } from "../ui/Skeleton";

/**
 * Chapter navigator. Used as the sticky desktop sidebar and inside the mobile
 * slide-over, so both stay in sync on the same props.
 */
export default function ChapterNavigator({
  surahs,
  loading,
  activeSurahId,
  search,
  onSearchChange,
  onSelectSurah,
  onSelectSection,
}) {
  const [sectionKind, setSectionKind] = useState("surah");
  const [sectionNumber, setSectionNumber] = useState("1");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return surahs;
    return surahs.filter(
      (surah) =>
        surah.name.toLowerCase().includes(term) ||
        surah.arabic.includes(search.trim()) ||
        String(surah.id) === term,
    );
  }, [surahs, search]);

  const section = READING_SECTIONS[sectionKind];

  return (
    <div className="navigator__content">
      <div className="navigator__head">
        <p className="label">Chapters</p>
        <p className="meta">114 surahs · Uthmani</p>
      </div>

      <div className="navigator__search">
        <div className="search-field">
          <Search size={16} className="search-field__icon" aria-hidden="true" />
          <input
            type="search"
            className="input"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Find a surah"
            aria-label="Find a surah by name, meaning or number"
          />
        </div>

        <form
          className="input-group navigator__section-form"
          onSubmit={(event) => {
            event.preventDefault();
            const value = Number(sectionNumber);
            if (!Number.isInteger(value) || value < 1 || value > section.max) return;
            if (sectionKind === "surah") {
              const surah = surahs.find((item) => item.id === value);
              if (surah) onSelectSurah(surah);
            } else {
              onSelectSection(sectionKind, value);
            }
          }}
        >
          <label className="sr-only" htmlFor="section-kind">
            Open by section
          </label>
          <select
            id="section-kind"
            className="select navigator__section-select"
            value={sectionKind}
            onChange={(event) => {
              setSectionKind(event.target.value);
              setSectionNumber("1");
            }}
          >
            {Object.entries(READING_SECTIONS).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="section-number">
            Section number
          </label>
          <input
            id="section-number"
            className="input navigator__section-number"
            type="number"
            min="1"
            max={section.max}
            value={sectionNumber}
            onChange={(event) => setSectionNumber(event.target.value)}
          />
          <button type="submit" className="btn btn--secondary btn--sm">
            Open
          </button>
        </form>
      </div>

      <div className="navigator__list">
        {loading ? (
          <div className="navigator__loading">
            {Array.from({ length: 10 }, (_, index) => (
              <div key={index} className="navigator__loading-row">
                <Skeleton />
              </div>
            ))}
          </div>
        ) : (
          filtered.map((surah) => (
            <button
              key={surah.id}
              type="button"
              className="navigator__item"
              aria-current={activeSurahId === surah.id ? "true" : undefined}
              onClick={() => onSelectSurah(surah)}
            >
              <span className="navigator__number">{surah.id}</span>
              <span>
                <span className="navigator__name">{surah.name}</span>
                <span className="navigator__meta">
                  {surah.meaning} · {surah.verses} ayat
                </span>
              </span>
              <span className="navigator__arabic" lang="ar" dir="rtl">
                {surah.arabic}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

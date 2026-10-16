import { Bookmark, Link2, RefreshCw, Share2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "../ui/IconButton";
import Notice from "../ui/Notice";
import { Skeleton } from "../ui/Skeleton";
import { writeLocal } from "../../utils/localData";

const AYAHS_KEY = "noorhub_quran_ayahs";
const ayahKey = (verse) => `${verse.surahId}:${verse.ayah}`;

/**
 * "Today's reflection" — one ayah a day inside a quiet double border, with the
 * transliteration, the translation and save/share controls that do something.
 */
function readStoredBookmark(reflection) {
  if (!reflection) return false;
  try {
    const bookmarks = JSON.parse(localStorage.getItem(AYAHS_KEY) || "{}");
    return Boolean(bookmarks[ayahKey(reflection)]?.bookmarked);
  } catch {
    return false;
  }
}

export default function ReflectionPanel({ reflection, status, onRetry }) {
  const navigate = useNavigate();
  const [bookmark, setBookmark] = useState({ reference: null, saved: false });
  const [shared, setShared] = useState(false);

  /* The bookmark reflects the same store the reader writes to, so the button
     always matches what is actually saved. */
  const reference = reflection ? ayahKey(reflection) : null;
  const saved =
    bookmark.reference === reference
      ? bookmark.saved
      : readStoredBookmark(reflection);

  const toggleBookmark = useCallback(() => {
    if (!reflection) return;
    const key = ayahKey(reflection);
    const wasSaved = readStoredBookmark(reflection);
    try {
      const bookmarks = JSON.parse(localStorage.getItem(AYAHS_KEY) || "{}");
      const next = { ...bookmarks };
      if (wasSaved) {
        delete next[key].bookmarked;
        if (!next[key].note && !next[key].highlight) delete next[key];
      } else {
        next[key] = { ...next[key], bookmarked: true };
      }
      writeLocal(AYAHS_KEY, next);
    } catch {
      /* storage unavailable — keep the visual state */
    }
    setBookmark({ reference: key, saved: !wasSaved });
  }, [reflection]);

  const share = useCallback(async () => {
    if (!reflection) return;
    const url = `${window.location.origin}/quran?surah=${reflection.surahId}&ayah=${reflection.ayah}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `Quran ${reflection.reference}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        window.setTimeout(() => setShared(false), 2400);
      }
    } catch {
      /* share dismissed */
    }
  }, [reflection]);

  return (
    <section className="reflection" aria-labelledby="reflection-heading">
      <div className="reflection__head">
        <h2 className="reflection__title" id="reflection-heading">
          Today’s reflection
        </h2>
        <div className="reflection__actions">
          <IconButton
            icon={Bookmark}
            label={saved ? "Remove this ayah from bookmarks" : "Bookmark this ayah"}
            size={17}
            active={saved}
            onClick={toggleBookmark}
          />
          <IconButton
            icon={shared ? Link2 : Share2}
            label={shared ? "Link copied" : "Share this ayah"}
            size={17}
            onClick={share}
          />
        </div>
      </div>

      {status === "loading" ? (
        <div className="reflection__body reflection--loading">
          <Skeleton className="reflection__arabic" />
          <Skeleton />
          <Skeleton className="reflection__skeleton" />
        </div>
      ) : null}

      {status === "ready" && reflection ? (
        <>
          <div className="reflection__body">
            <p className="reflection__arabic" lang="ar" dir="rtl">
              {reflection.text}
            </p>
            {reflection.transliteration ? (
              <p className="reflection__translit">{reflection.transliteration}</p>
            ) : null}
            <p className="reflection__translation">{reflection.translation}</p>
          </div>

          <div className="reflection__source">
            <span>
              Quran {reflection.reference} · Uthmani text · Sahih International
            </span>
            <button
              type="button"
              className="btn btn--quiet btn--sm"
              onClick={() =>
                navigate(`/quran?surah=${reflection.surahId}&ayah=${reflection.ayah}`)
              }
            >
              Read in context
            </button>
          </div>
        </>
      ) : null}

      {status === "error" ? (
        <div className="reflection__body">
          <Notice tone="sand">
            Today’s reflection needs a connection. The reader works the same way,
            so try again when you are back online.
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={onRetry}
              style={{ marginTop: "0.75rem" }}
            >
              <RefreshCw size={14} aria-hidden="true" />
              Try again
            </button>
          </Notice>
        </div>
      ) : null}
    </section>
  );
}

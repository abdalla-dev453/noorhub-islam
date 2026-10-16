import {
  Bookmark,
  BookmarkCheck,
  Highlighter,
  MessageSquareText,
  Pause,
  Play,
  Share2,
} from "lucide-react";
import IconButton from "./IconButton";

/**
 * A single ayah row: number, Arabic, translation, transliteration, note and
 * non-intrusive per-verse tools. State (bookmarked, highlighted, playing) is
 * also exposed through text alternatives, never colour alone.
 */
export default function VerseRow({
  verse,
  index,
  playing = false,
  saved = {},
  showTransliteration = false,
  showVerseNumbers = true,
  onPlay,
  onToggleBookmark,
  onAddNote,
  onToggleHighlight,
  onShare,
}) {
  const bookmarked = Boolean(saved.bookmarked);
  const highlighted = Boolean(saved.highlight);

  const classes = [
    "verse-row",
    playing ? "verse-row--playing" : "",
    bookmarked || highlighted ? "verse-row--saved" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={classes}
      id={`ayah-${verse.anchor}`}
      data-reference={verse.reference}
      aria-label={`Ayah ${verse.reference}`}
    >
      {showVerseNumbers ? (
        <p className="verse-row__number">{verse.number}</p>
      ) : (
        <span />
      )}

      <div className="verse-row__body">
        <p className="verse-row__arabic" lang="ar" dir="rtl">
          {verse.text}
        </p>

        {showTransliteration && verse.transliteration ? (
          <p className="verse-row__transliteration" lang="en">
            {verse.transliteration}
          </p>
        ) : null}

        <p className="verse-row__translation">{verse.translation}</p>

        {saved.note ? <p className="verse-row__note">{saved.note}</p> : null}
      </div>

      <div className="verse-row__tools">
        <button
          type="button"
          className="verse-row__play"
          data-playing={playing}
          onClick={() => onPlay?.(index)}
          aria-label={playing ? `Pause ${verse.reference}` : `Play ${verse.reference}`}
          title={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <Pause size={15} aria-hidden="true" />
          ) : (
            <Play size={15} aria-hidden="true" />
          )}
        </button>

        <IconButton
          icon={bookmarked ? BookmarkCheck : Bookmark}
          size={17}
          label={bookmarked ? `Remove bookmark from ${verse.reference}` : `Bookmark ${verse.reference}`}
          active={bookmarked}
          onClick={() => onToggleBookmark?.(verse, saved)}
        />

        <IconButton
          icon={Highlighter}
          size={17}
          label={highlighted ? `Remove highlight from ${verse.reference}` : `Highlight ${verse.reference}`}
          active={highlighted}
          className={highlighted ? "is-active" : ""}
          onClick={() => onToggleHighlight?.(verse, saved)}
        />

        <IconButton
          icon={MessageSquareText}
          size={17}
          label={saved.note ? `Edit note for ${verse.reference}` : `Add a private note to ${verse.reference}`}
          onClick={() => onAddNote?.(verse, saved)}
        />

        <IconButton
          icon={Share2}
          size={17}
          label={`Share ${verse.reference}`}
          onClick={() => onShare?.(verse)}
        />
      </div>
    </article>
  );
}

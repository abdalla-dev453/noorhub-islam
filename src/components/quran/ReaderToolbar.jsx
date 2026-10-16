import {
  ListMusic,
  Pause,
  Play,
  Settings2,
  SkipForward,
} from "lucide-react";
import IconButton from "../ui/IconButton";

/**
 * Reader toolbar: what is open, plus the controls you actually reach for while
 * reading. Everything else lives in the reading options sheet.
 */
export default function ReaderToolbar({
  surah,
  kind,
  verseCount,
  playing,
  loading,
  onPlayAll,
  onPause,
  onOpenOptions,
  onOpenNavigator,
  onJump,
  jumpValue,
  onJumpChange,
  jumpError,
}) {
  return (
    <div className="reader-toolbar">
      <div className="reader-toolbar__title">
        <h1 className="reader-toolbar__surah">{surah?.name ?? "Quran"}</h1>
        <div className="reader-toolbar__meta">
          {verseCount === 0 ? <span>Nothing open yet</span> : null}
          {surah?.arabic ? (
            <span className="arabic-text arabic-text--sm" lang="ar" dir="rtl">
              {surah.arabic}
            </span>
          ) : null}
          {surah?.meaning ? <span>{surah.meaning}</span> : null}
          {surah?.type ? <span>{surah.type}</span> : null}
          <span>
            {verseCount} {verseCount === 1 ? "ayah" : "ayahs"}
          </span>
          {kind !== "surah" ? <span>{kind} reading section</span> : null}
        </div>
      </div>

      <div className="reader-toolbar__group">
        <button
          type="button"
          className="btn btn--secondary btn--sm"
          onClick={playing ? onPause : onPlayAll}
          disabled={loading || verseCount === 0}
        >
          {playing ? (
            <Pause size={15} aria-hidden="true" />
          ) : (
            <Play size={15} aria-hidden="true" />
          )}
          {playing ? "Pause" : "Listen"}
        </button>

        <IconButton
          icon={ListMusic}
          label="Open chapter navigator"
          size={18}
          variant="bordered"
          className="mobile-menu-button"
          onClick={onOpenNavigator}
        />

        <IconButton
          icon={Settings2}
          label="Reading options"
          size={18}
          variant="bordered"
          onClick={onOpenOptions}
        />

        <form className="input-group" onSubmit={onJump}>
          <label className="sr-only" htmlFor="jump-reference">
            Jump to an ayah, for example 2:255
          </label>
          <input
            id="jump-reference"
            className="input reader-toolbar__jump"
            inputMode="numeric"
            placeholder="2:255"
            value={jumpValue}
            onChange={(event) => onJumpChange(event.target.value)}
            aria-invalid={jumpError ? "true" : undefined}
          />
          <button type="submit" className="btn btn--quiet btn--sm">
            <SkipForward size={15} aria-hidden="true" />
            Go
          </button>
        </form>
      </div>
    </div>
  );
}

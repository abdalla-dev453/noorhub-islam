import { Gauge, Palette, Type } from "lucide-react";
import Sheet from "../ui/Sheet";
import {
  APPEARANCES,
  FONT_SIZES,
  PLAYBACK_SPEEDS,
} from "../../data/quran";

/**
 * Reading options: everything that changes how the text is presented, in one
 * organised sheet instead of a row of competing controls.
 */
export default function ReadingOptionsSheet({
  open,
  onClose,
  options,
  onChange,
  appearance,
  onAppearanceChange,
  reciters,
}) {
  const update = (patch) => onChange({ ...options, ...patch });

  return (
    <Sheet open={open} onClose={onClose} title="Reading options">
      <div className="sheet__section">
        <p className="sheet__section-title">
          <Type size={13} aria-hidden="true" /> Arabic size
        </p>
        <div className="option-grid">
          {FONT_SIZES.map((size) => (
            <button
              key={size.id}
              type="button"
              className="option"
              aria-pressed={options.fontSize === size.id}
              onClick={() => update({ fontSize: size.id })}
            >
              {size.label}
              <span className="option__hint">{size.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sheet__section">
        <p className="sheet__section-title">Text</p>
        <div className="stack sheet__stack">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={options.showTranslation}
              onChange={(event) => update({ showTranslation: event.target.checked })}
            />
            <span>Show the Sahih International translation under each ayah</span>
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={options.showTransliteration}
              onChange={(event) =>
                update({ showTransliteration: event.target.checked })
              }
            />
            <span>Show romanised transliteration</span>
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={options.continuous}
              onChange={(event) => update({ continuous: event.target.checked })}
            />
            <span>Continue to the next ayah when audio ends</span>
          </label>
        </div>
      </div>

      <div className="sheet__section">
        <p className="sheet__section-title">Recitation</p>
        <div className="stack sheet__stack">
          <label className="field">
            <span className="field__label">Reciter</span>
            <select
              className="select"
              value={options.reciter}
              onChange={(event) => update({ reciter: event.target.value })}
            >
              {reciters.map((reciter) => (
                <option key={reciter.id} value={reciter.id}>
                  {reciter.name}
                </option>
              ))}
            </select>
          </label>

          <div>
            <p className="field__label">
              <Gauge size={13} aria-hidden="true" /> Playback speed
            </p>
            <div className="option-grid">
              {PLAYBACK_SPEEDS.map((speed) => (
                <button
                  key={speed}
                  type="button"
                  className="option"
                  aria-pressed={options.speed === speed}
                  onClick={() => update({ speed })}
                >
                  {speed}×
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="sheet__section">
        <p className="sheet__section-title">
          <Palette size={13} aria-hidden="true" /> Reading appearance
        </p>
        <div className="option-grid">
          {APPEARANCES.map((item) => (
            <button
              key={item.id}
              type="button"
              className="option"
              aria-pressed={appearance === item.id}
              onClick={() => onAppearanceChange(item.id)}
            >
              {item.label}
              <span className="option__hint">{item.hint}</span>
            </button>
          ))}
        </div>
        <p className="field__hint">
          Dark and sepia are reading appearances. They also apply to the rest of
          NoorHub so the interface stays consistent.
        </p>
      </div>
    </Sheet>
  );
}

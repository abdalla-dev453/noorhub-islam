/**
 * Functional Qibla compass. No decorative animation: the needle is rotated to
 * the computed bearing (or to bearing relative to the device sensor when it is
 * available) and the degrees are always stated in text.
 */
export default function QiblaCompass({ qibla, deviceBearing = null }) {
  const rotation = deviceBearing == null ? qibla : qibla - deviceBearing;

  return (
    <div className="qibla__dial">
      <span className="qibla__cardinal qibla__cardinal--n">N</span>
      <div
        className="qibla__needle"
        style={{ transform: `rotate(${rotation}deg)` }}
        data-testid="qibla-needle"
      >
        <span className="qibla__needle-line" />
        <span className="qibla__needle-head" />
      </div>
      <span className="qibla__center" />
    </div>
  );
}

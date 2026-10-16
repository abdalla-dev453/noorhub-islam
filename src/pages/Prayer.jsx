import { Compass, LocateFixed, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePrayerContext } from "../hooks/usePrayerContext";
import {
  ASR_METHODS,
  CALC_METHODS,
  PRAYER_LABELS,
  PRAYER_ORDER,
} from "../utils/prayerTimes";
import PrayerTimeList from "../components/ui/PrayerTimeList";
import QiblaCompass from "../components/ui/QiblaCompass";
import Notice from "../components/ui/Notice";
import SectionHeader from "../components/ui/SectionHeader";
import { Badge } from "../components/ui/Badge";

export default function Prayer() {
  const {
    now,
    profile,
    setSettings,
    formattedTimes,
    next,
    qibla,
    hijriLabel,
    dayLogs,
    markPrayer,
    setOffset,
  } = usePrayerContext();

  const [bearing, setBearing] = useState(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const handler = (event) => {
      const compass = event.webkitCompassHeading;
      setBearing(
        typeof compass === "number" ? compass : (360 - event.alpha + 360) % 360,
      );
    };
    window.addEventListener("deviceorientationabsolute", handler, true);
    window.addEventListener("deviceorientation", handler, true);
    return () => {
      window.removeEventListener("deviceorientationabsolute", handler, true);
      window.removeEventListener("deviceorientation", handler, true);
    };
  }, []);

  const locate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        setSettings((previous) => ({
          ...previous,
          lat: Number(coords.latitude.toFixed(4)),
          lng: Number(coords.longitude.toFixed(4)),
          label: `${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}`,
        }));
      },
      () => {
        setLocating(false);
        window.alert(
          "Location access was unavailable. You can keep using the saved location.",
        );
      },
      { timeout: 10000 },
    );
  };

  const marked = Object.values(dayLogs).filter(
    (value) => value === "on-time" || value === "late",
  ).length;

  const timetableTimes = useMemo(
    () =>
      Object.fromEntries(
        PRAYER_ORDER.map((key) => [key, formattedTimes[key]]),
      ),
    [formattedTimes],
  );

  const countdown = `${Math.floor(next.inMinutes / 60)}h ${next.inMinutes % 60}m`;

  return (
    <div className="page">
      <div className="container container--narrow">
        <header className="page-head">
          <span className="page-head__eyebrow">Daily</span>
          <h1 className="page-head__title">Prayer times and Qibla</h1>
          <div className="page-head__meta">
            <span>
              {now.toLocaleDateString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span aria-hidden="true">·</span>
            <span>{hijriLabel}</span>
          </div>
        </header>

        <div className="page-stack">
          <section className="prayer-hero" aria-labelledby="next-prayer-heading">
            <div className="prayer-next">
              <p className="prayer-next__label">
                <Compass size={14} aria-hidden="true" />
                Next prayer
              </p>
              <h2 className="prayer-next__name" id="next-prayer-heading">
                {PRAYER_LABELS[next.key]}
              </h2>
              <p className="prayer-next__time">
                <span className="numeric">{formattedTimes[next.key]}</span>
                <span className="prayer-next__count">
                  in {countdown}
                  {next.tomorrow ? " · tomorrow" : ""}
                </span>
              </p>

              <div className="prayer-next__meta">
                <span className="cluster">
                  <MapPin size={14} aria-hidden="true" />
                  {profile.label}
                </span>
                <span>{CALC_METHODS[profile.method].label}</span>
                <span>{ASR_METHODS[profile.asr].label}</span>
              </div>

              <button
                type="button"
                className="btn btn--secondary btn--sm prayer-next__locate"
                onClick={locate}
                disabled={locating}
              >
                <LocateFixed size={15} aria-hidden="true" />
                {locating ? "Finding you…" : "Use my location"}
              </button>
            </div>

            <div className="qibla">
              <div className="qibla__head">
                <h2 className="qibla__title">Qibla direction</h2>
                <Badge tone="outline">{Math.round(qibla)}° from north</Badge>
              </div>

              <QiblaCompass bearing={bearing} qibla={qibla} deviceBearing={bearing} />

              <p className="qibla__note">
                {bearing == null
                  ? "The compass sensor is unavailable on this device. The needle shows the Qibla relative to true north — compare it with a compass or a local landmark."
                  : "Rotate until the needle points straight up; that is the Qibla."}
              </p>
            </div>
          </section>

          <section aria-labelledby="timetable-heading">
            <SectionHeader
              eyebrow="Today’s timetable"
              title="Six times, calculated on this device"
            />

            <div className="card">
              <div className="card__toolbar">
                <div className="field">
                  <label className="field__label" htmlFor="calculation-method">
                    Calculation method
                  </label>
                  <select
                    id="calculation-method"
                    className="select"
                    value={profile.method}
                    onChange={(event) =>
                      setSettings((previous) => ({
                        ...previous,
                        method: event.target.value,
                      }))
                    }
                  >
                    {Object.entries(CALC_METHODS).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="asr-method">
                    Asr juristic method
                  </label>
                  <select
                    id="asr-method"
                    className="select"
                    value={profile.asr}
                    onChange={(event) =>
                      setSettings((previous) => ({
                        ...previous,
                        asr: event.target.value,
                      }))
                    }
                  >
                    {Object.entries(ASR_METHODS).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <PrayerTimeList
                order={PRAYER_ORDER}
                times={timetableTimes}
                nextKey={next.key}
                offsets={profile.offsets}
                dayLogs={dayLogs}
                onOffsetChange={setOffset}
                onMarkPrayer={markPrayer}
              />
            </div>

            <p className="meta timetable-note">
              {marked} of 5 prayers marked today. The log stays on this device.
            </p>
          </section>

          <Notice tone="sand">
            <strong>About these times.</strong> They are calculated from solar
            geometry for {profile.label} using the selected convention, and can
            differ from your mosque timetable. Apply a per-prayer adjustment
            above, or follow your mosque where one is available.
          </Notice>
        </div>
      </div>
    </div>
  );
}

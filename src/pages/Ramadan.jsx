import { CalendarDays, Check, Download, Moon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  gregorianToHijri,
  hijriMonthName,
  hijriToGregorian,
} from "../utils/hijri";
import { computePrayerTimes } from "../utils/prayerTimes";
import { readLocal, writeLocal } from "../utils/localData";
import { usePrayerContext } from "../hooks/usePrayerContext";
import Notice from "../components/ui/Notice";
import ProgressBar from "../components/ui/ProgressBar";

const KEY = "noorhub_ramadan_plan_v1";
const DEFAULTS = {
  fasts: {},
  reflections: {},
  qada: 0,
  household: 1,
  fitrPerPerson: 0,
  imsak: 10,
};

const pad = (value) => String(value).padStart(2, "0");
const dateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const dateLabel = (date) =>
  date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
const timeLabel = (part) =>
  Number.isFinite(part?.h) ? `${pad(part.h)}:${pad(part.m)}` : "Unavailable";

export default function Ramadan() {
  const [plan, setPlan] = useState(() => ({ ...DEFAULTS, ...readLocal(KEY, {}) }));
  const [year, setYear] = useState(() => {
    const hijri = gregorianToHijri(new Date());
    return hijri.y + (hijri.m > 9 ? 1 : 0);
  });
  const [tab, setTab] = useState("planner");
  const { profile } = usePrayerContext();

  useEffect(() => writeLocal(KEY, plan), [plan]);

  const dates = useMemo(
    () => Array.from({ length: 30 }, (_, index) => hijriToGregorian({ y: year, m: 9, d: index + 1 })),
    [year],
  );

  const today = new Date();
  const currentHijri = gregorianToHijri(today);
  const currentDay = currentHijri.m === 9 ? currentHijri.d : null;
  const timezone = -today.getTimezoneOffset() / 60;
  const times = computePrayerTimes(
    today,
    profile.lat,
    profile.lng,
    timezone,
    profile.method,
    profile.asr,
    profile.offsets,
  );

  const imsakMinutes =
    Number.isFinite(times.fajr?.h)
      ? (times.fajr.h * 60 + times.fajr.m - Number(plan.imsak || 0) + 1440) % 1440
      : null;
  const imsak = imsakMinutes == null ? "Unavailable" : `${pad(Math.floor(imsakMinutes / 60))}:${pad(imsakMinutes % 60)}`;

  const logged = Object.values(plan.fasts || {}).filter((status) => status === "completed").length;
  const totalFitr = Math.max(0, Number(plan.household) || 0) * Math.max(0, Number(plan.fitrPerPerson) || 0);
  const currency = "KES";

  const update = (changes) => setPlan((previous) => ({ ...previous, ...changes }));

  const toggleFast = (date) => {
    const key = dateKey(date);
    const status = plan.fasts?.[key] === "completed" ? "missed" : "completed";
    update({ fasts: { ...plan.fasts, [key]: status } });
  };

  const downloadCalendar = () => {
    const events = dates
      .map(
        (date, index) =>
          `BEGIN:VEVENT\nUID:noorhub-ramadan-${year}-${index + 1}@noorhub.local\nDTSTART;VALUE=DATE:${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}\nSUMMARY:Ramadan ${index + 1}\nDESCRIPTION:Estimated tabular Hijri date. Confirm local moon sighting and prayer times.\nEND:VEVENT`,
      )
      .join("\n");
    const blob = new Blob(
      [`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//NoorHub//Ramadan Planner//EN\n${events}\nEND:VCALENDAR`],
      { type: "text/calendar" },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ramadan-${year}.ics`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page">
      <div className="container container--narrow">
        <header className="page-head">
          <span className="page-head__eyebrow">Daily</span>
          <h1 className="page-head__title">Ramadan planner</h1>
          <div className="page-head__meta">
            <span>{currentHijri.d} {hijriMonthName(currentHijri.m)} {currentHijri.y} AH</span>
            <span aria-hidden="true">·</span>
            <span>Private planner stored on this device</span>
          </div>
          <p className="page__lede">
            A quiet planner for the month: mark fasts, track a khatm pace, keep
            the estimated suhoor and iftar times close, and prepare for the last
            ten nights.
          </p>
        </header>

        <div className="tabs" role="tablist" aria-label="Ramadan sections">
          <button
            type="button"
            role="tab"
            className="tabs__tab"
            aria-selected={tab === "planner"}
            onClick={() => setTab("planner")}
          >
            <CalendarDays size={15} aria-hidden="true" />
            Khatm and fasting
          </button>
          <button
            type="button"
            role="tab"
            className="tabs__tab"
            aria-selected={tab === "times"}
            onClick={() => setTab("times")}
          >
            <Moon size={15} aria-hidden="true" />
            Suhoor and iftar
          </button>
          <button
            type="button"
            role="tab"
            className="tabs__tab"
            aria-selected={tab === "last-ten"}
            onClick={() => setTab("last-ten")}
          >
            Last ten nights
          </button>
        </div>

        {tab === "planner" ? (
          <div className="split split--even">
            <section className="card" aria-labelledby="planner-heading">
              <div className="card__header">
                <div>
                  <h2 className="card__title" id="planner-heading">
                    30-day planner
                  </h2>
                  <p className="meta">
                    {logged} fasts marked complete · a full khatm is about 20
                    pages a day
                  </p>
                </div>
                <label className="field">
                  <span className="sr-only">Hijri year</span>
                  <select
                    className="select"
                    value={year}
                    onChange={(event) => setYear(Number(event.target.value))}
                  >
                    {[year - 1, year, year + 1].map((value) => (
                      <option key={value} value={value}>
                        {value} AH
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="stack">
                {dates.map((date, index) => {
                  const key = dateKey(date);
                  const done = plan.fasts?.[key] === "completed";
                  return (
                    <div className="ramadan-day" key={key}>
                      <button
                        type="button"
                        className="ramadan-day__mark"
                        data-done={done}
                        aria-label={`${done ? "Unmark" : "Mark"} Ramadan fast ${index + 1}`}
                        aria-pressed={done}
                        onClick={() => toggleFast(date)}
                      >
                        {done ? <Check size={15} aria-hidden="true" /> : index + 1}
                      </button>
                      <div className="ramadan-day__body">
                        <p className="ramadan-day__label">
                          Ramadan {index + 1} · {dateLabel(date)}
                        </p>
                        <p className="meta">
                          Quran pages {index * 20 + 1}–
                          {Math.min(604, (index + 1) * 20)}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn btn--quiet btn--sm"
                        onClick={() => toggleFast(date)}
                      >
                        {done ? "Completed" : "Mark fast"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="card" aria-labelledby="reflections-heading">
              <h2 className="card__title" id="reflections-heading">
                Reflections and qada
              </h2>

              <label className="field">
                <span className="field__label">Private reflection</span>
                <textarea
                  className="textarea"
                  rows={4}
                  value={plan.reflections?.[currentDay || "today"] || ""}
                  onChange={(event) =>
                    update({
                      reflections: {
                        ...plan.reflections,
                        [currentDay || "today"]: event.target.value,
                      },
                    })
                  }
                  placeholder="What would you like to remember today?"
                />
              </label>

              <label className="field ramadan-field">
                <span className="field__label">Qada fasts to track</span>
                <input
                  className="input"
                  type="number"
                  min="0"
                  max="365"
                  value={plan.qada || 0}
                  onChange={(event) =>
                    update({ qada: Math.max(0, Number(event.target.value)) })
                  }
                />
                <span className="field__hint">
                  A personal count only. For questions about exemptions or making
                  up fasts, consult a trusted scholar.
                </span>
              </label>

              <button type="button" className="btn btn--secondary" onClick={downloadCalendar}>
                <Download size={16} aria-hidden="true" />
                Download Ramadan calendar (.ics)
              </button>

              <ProgressBar
                value={logged}
                max={30}
                label="Fasts marked complete"
              />
            </section>
          </div>
        ) : null}

        {tab === "times" ? (
          <div className="split split--even">
            <section className="card" aria-labelledby="times-heading">
              <h2 className="card__title" id="times-heading">
                Today’s estimated times
              </h2>
              <p className="meta">
                {dateLabel(today)} · {profile.label} · {profile.method} · based
                on your saved prayer settings
              </p>

              <div className="ramadan-times">
                <div className="hifz-stat">
                  <p className="hifz-stat__label">Imsak estimate</p>
                  <p className="hifz-stat__value numeric">{imsak}</p>
                  <p className="hifz-stat__hint">Fajr minus {plan.imsak} minutes</p>
                </div>
                <div className="hifz-stat">
                  <p className="hifz-stat__label">Maghrib / iftar</p>
                  <p className="hifz-stat__value numeric">{timeLabel(times.maghrib)}</p>
                  <p className="hifz-stat__hint">Calculated local solar time</p>
                </div>
              </div>

              <label className="field ramadan-field">
                <span className="field__label">Imsak buffer before Fajr (minutes)</span>
                <input
                  className="input"
                  type="number"
                  min="0"
                  max="60"
                  value={plan.imsak}
                  onChange={(event) =>
                    update({ imsak: Math.max(0, Math.min(60, Number(event.target.value))) })
                  }
                />
              </label>

              <p className="meta">
                Not an official timetable. Confirm times with a local mosque;
                calculation method and high-latitude adjustments can vary.
              </p>
            </section>

            <section className="card" aria-labelledby="fitr-heading">
              <h2 className="card__title" id="fitr-heading">
                Zakat al-Fitr estimate
              </h2>
              <p className="meta">
                Enter the locally advised amount per person. Requirements and
                accepted forms can vary by community.
              </p>

              <label className="field">
                <span className="field__label">People in household</span>
                <input
                  className="input"
                  type="number"
                  min="1"
                  value={plan.household}
                  onChange={(event) =>
                    update({ household: Math.max(1, Number(event.target.value)) })
                  }
                />
              </label>

              <label className="field ramadan-field">
                <span className="field__label">Local amount per person ({currency})</span>
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="1"
                  value={plan.fitrPerPerson}
                  onChange={(event) =>
                    update({ fitrPerPerson: Math.max(0, Number(event.target.value)) })
                  }
                />
              </label>

              <div className="zakat-total">
                <p className="zakat-total__label">Planning total</p>
                <p className="zakat-total__value">
                  {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency,
                    maximumFractionDigits: 0,
                  }).format(totalFitr)}
                </p>
              </div>

              <p className="meta">
                This is arithmetic only, not a religious ruling or a payment.
              </p>
            </section>
          </div>
        ) : null}

        {tab === "last-ten" ? (
          <section className="card" aria-labelledby="last-ten-heading">
            <h2 className="card__title" id="last-ten-heading">
              The last ten nights
            </h2>
            <p className="page__lede">
              A gentle checklist for Ramadan’s final nights. Laylat al-Qadr is
              sought across the last ten nights, especially the odd-numbered
              nights; the exact night is not known.
            </p>

            <div className="grid grid--2">
              {[21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((day) => {
                const key = `night-${year}-${day}`;
                const done = Boolean(plan.fasts?.[key]);
                return (
                  <button
                    key={key}
                    type="button"
                    className="habit-row"
                    aria-pressed={done}
                    onClick={() => update({ fasts: { ...plan.fasts, [key]: !done } })}
                  >
                    <span className={`habit-row__check ${done ? "is-done" : ""}`}>
                      {done ? <Check size={14} aria-hidden="true" /> : null}
                    </span>
                    <span className="habit-row__label">
                      Night {day}
                      {day % 2 ? " · odd night" : ""}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="meta">
              The checklist is a personal reminder, not a prescribed ritual
              schedule.
            </p>
          </section>
        ) : null}

        <Notice tone="sand">
          Hijri dates here are tabular estimates. Local moon sighting may differ
          by a day, so confirm the start and end of Ramadan with your community.
        </Notice>
      </div>
    </div>
  );
}

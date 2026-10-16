import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  buildHijriMonthGrid,
  eventsForHijriDay,
  gregorianToHijri,
  hijriMonthName,
  upcomingEvents,
} from "../utils/hijri";
import { usePersistentState } from "../hooks/usePersistentState";
import Notice from "../components/ui/Notice";
import { DAILY_ADHKAR } from "../data/defaults";

const DAY_KEY = "noorhub_daily_practice";
const DUA_KEY = "noorhub_private_duas";

const HABITS = [
  "Prayed the five salah",
  "Read Quran",
  "Morning or evening adhkar",
  "Kindness or sadaqah",
  "Time with family",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Practice() {
  const [tab, setTab] = useState("today");
  const [state, setState] = usePersistentState(DAY_KEY, {});
  const [duas, setDuas] = usePersistentState(DUA_KEY, []);
  const [newDua, setNewDua] = useState("");
  const [month, setMonth] = useState(() => {
    const hijri = gregorianToHijri(new Date());
    return { y: hijri.y, m: hijri.m };
  });

  const today = new Date();
  const key = today.toLocaleDateString("en-CA");
  const todayData = state[key] || { habits: {}, counts: {}, target: 100 };

  const grid = useMemo(() => buildHijriMonthGrid(month.y, month.m), [month]);
  const events = upcomingEvents(today, 6, 180);
  const hijri = gregorianToHijri(today);
  const completed = HABITS.filter((habit) => todayData.habits[habit]).length;

  const updateToday = (fn) =>
    setState((previous) => {
      const current = previous[key] || { habits: {}, counts: {}, target: 100 };
      return { ...previous, [key]: fn(current) };
    });

  const shiftMonth = (delta) =>
    setMonth(({ y, m }) => {
      const next = m + delta;
      if (next < 1) return { y: y - 1, m: 12 };
      if (next > 12) return { y: y + 1, m: 1 };
      return { y, m: next };
    });

  const activeDhikr =
    DAILY_ADHKAR.find((item) => item.id === (todayData.activeDhikr || DAILY_ADHKAR[0].id)) ??
    DAILY_ADHKAR[0];
  const count = todayData.counts?.[activeDhikr.id] || 0;
  const target = todayData.target || activeDhikr.target;

  const setCount = (nextCount) =>
    updateToday((current) => ({
      ...current,
      activeDhikr: activeDhikr.id,
      counts: { ...current.counts, [activeDhikr.id]: Math.max(0, nextCount) },
    }));

  return (
    <div className="page">
      <div className="container container--narrow">
        <header className="page-head">
          <span className="page-head__eyebrow">Daily</span>
          <h1 className="page-head__title">Dhikr, habits and calendar</h1>
          <div className="page-head__meta">
            <span>{hijri.d} {hijriMonthName(hijri.m)} {hijri.y} AH</span>
            <span aria-hidden="true">·</span>
            <span>Private to this browser</span>
          </div>
        </header>

        <div className="cluster" role="tablist" aria-label="Daily sections">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "today"}
            className={`tabs__tab ${tab === "today" ? "tabs__tab--active" : ""}`}
            onClick={() => setTab("today")}
          >
            <Heart size={15} aria-hidden="true" />
            Today
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "calendar"}
            className={`tabs__tab ${tab === "calendar" ? "tabs__tab--active" : ""}`}
            onClick={() => setTab("calendar")}
          >
            <CalendarDays size={15} aria-hidden="true" />
            Hijri calendar
          </button>
        </div>

        <div className="practice-layout">
          {tab === "today" ? (
            <div className="stack practice-grid">
              <section className="card" aria-labelledby="intentions-heading">
                <div className="card__header">
                  <div>
                    <h2 className="card__title" id="intentions-heading">
                      Today’s intentions
                    </h2>
                    <p className="meta">
                      {completed} of {HABITS.length} checked · no streak pressure
                    </p>
                  </div>
                </div>

                <div className="stack">
                  {HABITS.map((habit) => {
                    const done = Boolean(todayData.habits[habit]);
                    return (
                      <button
                        key={habit}
                        type="button"
                        className="habit-row"
                        aria-pressed={done}
                        onClick={() =>
                          updateToday((current) => ({
                            ...current,
                            habits: {
                              ...current.habits,
                              [habit]: !current.habits[habit],
                            },
                          }))
                        }
                      >
                        <span className={`habit-row__check ${done ? "is-done" : ""}`}>
                          {done ? <Check size={14} aria-hidden="true" /> : null}
                        </span>
                        <span className="habit-row__label">{habit}</span>
                        {done ? <span className="sr-only">completed</span> : null}
                      </button>
                    );
                  })}
                </div>

                <label className="field practice-reflection">
                  <span className="field__label">Private reflection</span>
                  <textarea
                    className="textarea"
                    rows={3}
                    value={state[key]?.journal || ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      updateToday((current) => ({ ...current, journal: value }));
                    }}
                    placeholder="What are you grateful for today?"
                  />
                </label>
              </section>

              <section className="card" aria-labelledby="dhikr-heading">
                <div className="card__header">
                  <div>
                    <h2 className="card__title" id="dhikr-heading">
                      Tasbih counter
                    </h2>
                    <p className="meta">
                      Choose a remembrance, then count at your own pace.
                    </p>
                  </div>
                  <span className="badge badge--accent">
                    {count} of {target}
                  </span>
                </div>

                <div className="cluster dhikr-picker">
                  {DAILY_ADHKAR.map((dhikr) => (
                    <button
                      key={dhikr.id}
                      type="button"
                      className="tag"
                      aria-pressed={activeDhikr.id === dhikr.id}
                      onClick={() =>
                        updateToday((current) => ({
                          ...current,
                          activeDhikr: dhikr.id,
                        }))
                      }
                    >
                      {dhikr.roman}
                    </button>
                  ))}
                </div>

                <div className="counter">
                  <p className="counter__arabic" lang="ar" dir="rtl">
                    {activeDhikr.arabic}
                  </p>
                  <p className="counter__meaning">{activeDhikr.meaning}</p>
                  <p className="counter__value" aria-live="polite">
                    {count}
                  </p>
                  <p className="meta counter__goal">
                    daily goal {target}
                  </p>

                  <div className="counter__controls">
                    <button
                      type="button"
                      className="icon-btn icon-btn--bordered"
                      onClick={() => setCount(count - 1)}
                      aria-label="Decrease the count"
                      disabled={count === 0}
                    >
                      <Minus size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={() => setCount(count + 1)}
                    >
                      <Plus size={16} aria-hidden="true" />
                      Count
                    </button>
                    <button
                      type="button"
                      className="icon-btn icon-btn--bordered"
                      onClick={() => setCount(0)}
                      aria-label="Reset the count"
                    >
                      <RotateCcw size={16} aria-hidden="true" />
                    </button>
                  </div>

                  <label className="field counter__target">
                    <span className="field__label">Daily goal</span>
                    <input
                      className="input"
                      type="number"
                      min="1"
                      max="10000"
                      value={target}
                      onChange={(event) =>
                        updateToday((current) => ({
                          ...current,
                          activeDhikr: activeDhikr.id,
                          target: Math.max(1, Number(event.target.value) || 1),
                        }))
                      }
                    />
                  </label>
                </div>

                <p className="meta dhikr-source">Source: {activeDhikr.source}</p>
              </section>

              <section className="card" aria-labelledby="duas-heading">
                <h2 className="card__title" id="duas-heading">
                  My private duas
                </h2>
                <p className="meta">
                  Only you can see this list, and only in this browser.
                </p>

                <form
                  className="input-group duas-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const value = newDua.trim();
                    if (!value) return;
                    setDuas((current) => [
                      { id: crypto.randomUUID(), text: value },
                      ...current,
                    ]);
                    setNewDua("");
                  }}
                >
                  <label className="sr-only" htmlFor="new-dua">
                    Add a personal dua
                  </label>
                  <input
                    id="new-dua"
                    className="input"
                    value={newDua}
                    onChange={(event) => setNewDua(event.target.value)}
                    placeholder="Add a personal dua or reminder"
                  />
                  <button type="submit" className="btn btn--secondary">
                    Add
                  </button>
                </form>

                {duas.length ? (
                  <ul className="stack duas-list">
                    {duas.map((dua) => (
                      <li key={dua.id} className="dua-row">
                        <p>{dua.text}</p>
                        <button
                          type="button"
                          className="btn btn--quiet btn--sm"
                          onClick={() =>
                            setDuas((current) => current.filter((item) => item.id !== dua.id))
                          }
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="meta">
                    Nothing saved yet. Add the duas you want to keep close.
                  </p>
                )}
              </section>
            </div>
          ) : (
            <div className="split split--even">
              <section className="card" aria-labelledby="calendar-heading">
                <div className="card__header">
                  <h2 className="card__title" id="calendar-heading">
                    {hijriMonthName(month.m)} {month.y} AH
                  </h2>
                  <div className="cluster">
                    <button
                      type="button"
                      className="icon-btn icon-btn--bordered"
                      onClick={() => shiftMonth(-1)}
                      aria-label="Previous Hijri month"
                    >
                      <ChevronLeft size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="icon-btn icon-btn--bordered"
                      onClick={() => shiftMonth(1)}
                      aria-label="Next Hijri month"
                    >
                      <ChevronRight size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <p className="meta calendar-caption">
                  Tabular estimate. Local moon sighting may differ by a day.
                </p>

                <div className="hijri-grid">
                  {WEEKDAYS.map((day) => (
                    <div key={day} className="hijri-grid__weekday">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: grid.firstWeekday }, (_, index) => (
                    <div key={`empty-${index}`} />
                  ))}
                  {grid.days.map(({ d, gregorian }) => {
                    const dayEvents = eventsForHijriDay(month.m, d);
                    const isToday =
                      gregorian.toDateString() === today.toDateString();
                    return (
                      <div
                        key={d}
                        className={`hijri-grid__day ${isToday ? "is-today" : ""} ${
                          dayEvents.length ? "has-event" : ""
                        }`}
                      >
                        <span className="hijri-grid__hijri">{d}</span>
                        <span className="hijri-grid__gregorian">
                          {gregorian.getDate()}
                        </span>
                        {dayEvents.length ? (
                          <span className="sr-only">
                            {dayEvents.map((event) => event.label).join(", ")}
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="card" aria-labelledby="events-heading">
                <h2 className="card__title" id="events-heading">
                  Upcoming dates
                </h2>
                <p className="meta">Next six dates within the coming months.</p>

                <ul className="stack event-list">
                  {events.map((event) => (
                    <li
                      key={`${event.hijri.y}-${event.hijri.m}-${event.hijri.d}-${event.label}`}
                      className="event-row"
                    >
                      <div className="cluster cluster--between">
                        <h3 className="event-row__title">{event.label}</h3>
                        <span className="badge badge--outline">
                          {event.inDays === 0 ? "Today" : `In ${event.inDays} days`}
                        </span>
                      </div>
                      <p className="meta">
                        {event.gregorian.toLocaleDateString()} · {event.hijri.d}{" "}
                        {hijriMonthName(event.hijri.m)} {event.hijri.y} AH
                      </p>
                      {event.note ? (
                        <p className="event-row__note">{event.note}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}
        </div>

        <Notice tone="sand">
          Prayer times, the Quran reader, the Zakat calculator and the Hadith
          library each have their own place. From here you can go straight to{" "}
          <Link to="/prayer">prayer times and Qibla</Link>, the{" "}
          <Link to="/ramadan">Ramadan planner</Link>, or{" "}
          <Link to="/quran">the reader</Link>.
        </Notice>
      </div>
    </div>
  );
}

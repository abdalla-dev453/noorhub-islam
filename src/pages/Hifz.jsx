import {
  BookMarked,
  CalendarClock,
  Check,
  Eye,
  EyeOff,
  Plus,
  RotateCcw,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  buildPlan,
  CONFIDENCE_LABELS,
  isoDate,
  masteryScore,
  scheduleNext,
} from "../utils/hifzEngine";
import { readLocal, writeLocal } from "../utils/localData";
import ProgressBar from "../components/ui/ProgressBar";
import Notice from "../components/ui/Notice";
import EmptyState from "../components/ui/EmptyState";

const KEY = "noorhub_hifz_plan";

const CONFIDENCE_BUTTONS = [
  { score: 2, label: "Hard" },
  { score: 3, label: "Okay" },
  { score: 4, label: "Good" },
  { score: 5, label: "Easy" },
];

export default function Hifz() {
  const [plan, setPlan] = useState(() => readLocal(KEY, null));
  const [name, setName] = useState("My memorisation plan");
  const [ayahs, setAyahs] = useState(300);
  const [daily, setDaily] = useState(5);
  const [mask, setMask] = useState(0.35);
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState("");

  const today = isoDate(new Date());

  useEffect(() => writeLocal(KEY, plan), [plan]);

  const learned = plan?.items.filter((item) => item.reps > 0).length || 0;
  const due = useMemo(
    () => plan?.items.filter((item) => item.reps > 0 && item.dueDate <= today) || [],
    [plan, today],
  );
  const nextNew = plan?.items.find((item) => item.reps === 0);
  const completedSessions = plan?.history ? Object.keys(plan.history).length : 0;

  const makePlan = () => {
    const total = Number(ayahs);
    const perDay = Number(daily);
    if (!Number.isInteger(total) || total < 1 || total > 6236) {
      setError("Enter a portion between 1 and 6236 ayat.");
      return;
    }
    if (!Number.isInteger(perDay) || perDay < 1 || perDay > 100) {
      setError("Enter between 1 and 100 new ayat per day.");
      return;
    }
    setError("");
    const built = buildPlan({ totalAyahs: total, dailyAyahs: perDay, startDate: today });
    setPlan({
      ...built,
      name: name.trim() || "My memorisation plan",
      createdAt: today,
      history: {},
    });
  };

  const review = (item, confidence) =>
    setPlan((previous) => ({
      ...previous,
      items: previous.items.map((current) =>
        current.day === item.day ? scheduleNext(current, confidence, today) : current,
      ),
      history: {
        ...previous.history,
        [today]: [...(previous.history?.[today] || []), item.day],
      },
    }));

  const reset = () => {
    if (window.confirm("Delete this memorisation plan and its review history?")) {
      setPlan(null);
    }
  };

  return (
    <div className="page">
      <div className="container container--narrow">
        <header className="page-head">
          <span className="page-head__eyebrow">Quran</span>
          <h1 className="page-head__title">Memorisation studio</h1>
          <div className="page-head__meta">
            <span>Sabaq · new portion</span>
            <span aria-hidden="true">·</span>
            <span>Sabqi · recent review</span>
            <span aria-hidden="true">·</span>
            <span>Manzil · long review</span>
          </div>
          <p className="page-head__meta">
            <span>
              Confidence ratings are private estimates stored in this browser. A
              teacher remains essential for checking recitation.
            </span>
          </p>
        </header>

        <div className="page-stack">
          {!plan ? (
            <section className="card card--roomy" aria-labelledby="create-plan-heading">
              <h2 className="card__title" id="create-plan-heading">
                Create a memorisation plan
              </h2>
              <p className="page__lede">
                Set the size of the portion you want to memorise and how much new
                material you want each day. The planner schedules the quantities;
                you select and verify the actual ayah range in a trusted mushaf.
              </p>

              <form
                className="stack form-grid hifz-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  makePlan();
                }}
              >
                <label className="field">
                  <span className="field__label">Plan name</span>
                  <input
                    className="input"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </label>

                <div className="form-grid form-grid--two">
                  <label className="field">
                    <span className="field__label">Ayahs in your selected portion</span>
                    <input
                      className="input"
                      type="number"
                      min="1"
                      max="6236"
                      value={ayahs}
                      onChange={(event) => setAyahs(event.target.value)}
                    />
                    <span className="field__hint">
                      For example, Juz 30 is about 564 ayat.
                    </span>
                  </label>

                  <label className="field">
                    <span className="field__label">New ayat per day</span>
                    <input
                      className="input"
                      type="number"
                      min="1"
                      max="100"
                      value={daily}
                      onChange={(event) => setDaily(event.target.value)}
                    />
                    <span className="field__hint">
                      A smaller daily amount is easier to sustain.
                    </span>
                  </label>
                </div>

                {error ? (
                  <p className="field__error" role="alert">
                    {error}
                  </p>
                ) : null}

                <div>
                  <button type="submit" className="btn btn--primary">
                    <Plus size={16} aria-hidden="true" />
                    Create plan
                  </button>
                </div>
              </form>
            </section>
          ) : (
            <>
              <section aria-labelledby="plan-heading">
                <div className="card">
                  <div className="card__header">
                    <div>
                      <span className="section-header__eyebrow label">{plan.name}</span>
                      <h2 className="card__title" id="plan-heading">
                        Your daily cycle
                      </h2>
                    </div>
                    <button type="button" className="btn btn--quiet btn--sm" onClick={reset}>
                      <RotateCcw size={14} aria-hidden="true" />
                      Reset plan
                    </button>
                  </div>

                  <div className="hifz-overview">
                    <div className="hifz-stat">
                      <p className="hifz-stat__label">Portions memorised</p>
                      <p className="hifz-stat__value">
                        {learned}
                        <span className="hifz-stat__hint"> / {plan.items.length}</span>
                      </p>
                    </div>
                    <div className="hifz-stat">
                      <p className="hifz-stat__label">Due to review</p>
                      <p className="hifz-stat__value">{due.length}</p>
                    </div>
                    <div className="hifz-stat">
                      <p className="hifz-stat__label">Completed sessions</p>
                      <p className="hifz-stat__value">{completedSessions}</p>
                    </div>
                  </div>

                  <div className="hifz-progress">
                    <ProgressBar
                      value={learned}
                      max={plan.items.length}
                      label={`Plan length ${plan.totalDays} days · target finish ${plan.endDate}`}
                    />
                  </div>
                </div>
              </section>

              <div className="hifz-plan">
                <section className="card" aria-labelledby="sabaq-heading">
                  <div className="card__header">
                    <h2 className="card__title" id="sabaq-heading">
                      <BookMarked size={19} aria-hidden="true" /> New memorisation
                    </h2>
                    <span className="badge badge--outline">Sabaq</span>
                  </div>

                  {nextNew ? (
                    <>
                      <p className="hifz-portion">
                        Ayah {nextNew.fromAyah}–{nextNew.toAyah} · day{" "}
                        {nextNew.day + 1}
                      </p>

                      <div className="card card--quiet">
                        <div className="cluster cluster--between">
                          <span className="field__label">Self-test: progressive concealment</span>
                          <button
                            type="button"
                            className="btn btn--quiet btn--sm"
                            onClick={() => setRevealed((value) => !value)}
                          >
                            {revealed ? (
                              <EyeOff size={14} aria-hidden="true" />
                            ) : (
                              <Eye size={14} aria-hidden="true" />
                            )}
                            {revealed ? "Hide" : "Reveal"}
                          </button>
                        </div>

                        <div className="mask-strip">
                          {Array.from({ length: 10 }, (_, index) => (
                            <span
                              key={index}
                              className={`mask-strip__cell ${
                                !revealed && index < Math.round(mask * 10)
                                  ? "mask-strip__cell--masked"
                                  : "mask-strip__cell--revealed"
                              }`}
                            />
                          ))}
                        </div>

                        <label className="field" htmlFor="mask-level">
                          <span className="field__label">
                            Concealment {Math.round(mask * 100)}%
                          </span>
                          <input
                            id="mask-level"
                            type="range"
                            min="0"
                            max="0.9"
                            step="0.1"
                            value={mask}
                            onChange={(event) => setMask(Number(event.target.value))}
                          />
                        </label>
                      </div>

                      <p className="meta">
                        Study the passage from your mushaf or audio recitation.
                        This tool does not contain or verify the Quran text.
                      </p>

                      <div>
                        <button
                          type="button"
                          className="btn btn--primary"
                          onClick={() => review(nextNew, 4)}
                        >
                          <Check size={16} aria-hidden="true" />
                          Mark studied · review tomorrow
                        </button>
                      </div>
                    </>
                  ) : (
                    <EmptyState
                      icon={BookMarked}
                      title="All planned portions have been studied"
                      description="Create a new plan when you are ready to memorise another portion."
                      action="Start another plan"
                      onClick={() => setPlan(null)}
                    />
                  )}
                </section>

                <section className="card" aria-labelledby="review-heading">
                  <div className="card__header">
                    <h2 className="card__title" id="review-heading">
                      <CalendarClock size={19} aria-hidden="true" /> Today’s review
                    </h2>
                    <span className="badge badge--outline">
                      {due.length} due
                    </span>
                  </div>

                  {due.length ? (
                    <div className="stack review-list">
                      {due.slice(0, 8).map((item) => (
                        <article key={item.day} className="review-item">
                          <div className="cluster cluster--between">
                            <h3 className="review-item__title">
                              Ayah {item.fromAyah}–{item.toAyah}
                            </h3>
                            <span className="badge">
                              {item.dueDate < today ? "Overdue" : "Due today"}
                            </span>
                          </div>
                          <p className="meta">
                            Mastery estimate {masteryScore(item, today)}%
                          </p>
                          <div className="cluster">
                            {CONFIDENCE_BUTTONS.map((option) => (
                              <button
                                key={option.score}
                                type="button"
                                className="btn btn--secondary btn--sm"
                                title={CONFIDENCE_LABELS[option.score]}
                                onClick={() => review(item, option.score)}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={CalendarClock}
                      title="Nothing is due right now"
                      description="Study today’s new portion, or take a rest day."
                    />
                  )}
                </section>
              </div>

              <Notice tone="sand">
                Review spacing follows a simple estimate based on your confidence
                rating. It is a planning aid, not a substitute for a teacher or a
                fixed study schedule.
              </Notice>

              <p className="meta">
                Need the text?{" "}
                <Link to="/quran">Open the Quran reader</Link> alongside this
                plan.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

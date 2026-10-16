import { Download, Scale, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { usePersistentState } from "../hooks/usePersistentState";
import Notice from "../components/ui/Notice";
import { Tag } from "../components/ui/Badge";

const KEY = "noorhub_zakat_records";
const CURRENCY_KEY = "noorhub_zakat_currency";

const ASSET_GROUPS = [
  {
    title: "Cash and savings",
    hint: "Money you hold or can access: bank accounts, cash, money owed to you.",
    fields: [
      ["cash", "Cash and bank balances"],
    ],
  },
  {
    title: "Precious metal and investments",
    hint: "Values you consider zakatable under the guidance you follow.",
    fields: [
      ["gold", "Gold value"],
      ["silver", "Silver value"],
      ["investments", "Investments held for trade"],
    ],
  },
  {
    title: "Business and other assets",
    hint: "Trade goods, business assets, and anything else you include.",
    fields: [
      ["business", "Business assets"],
      ["other", "Other zakatable assets"],
    ],
  },
];

const DEBT_FIELDS = [["debts", "Short-term debts due"]];

const CURRENCIES = ["KES", "USD", "GBP", "EUR", "SAR", "AED"];

const NISAB_STANDARDS = [
  { value: "gold", label: "Gold", hint: "87.48 g of gold" },
  { value: "silver", label: "Silver", hint: "612.36 g of silver" },
];

const ZAKAT_RATE = 0.025;

export default function Zakat() {
  const [assets, setAssets] = useState(() =>
    Object.fromEntries([...ASSET_GROUPS.flatMap((group) => group.fields), ...DEBT_FIELDS].map(([key]) => [key, ""])),
  );
  const [prices, setPrices] = useState({ gold: "", silver: "" });
  const [standard, setStandard] = useState("gold");
  const [hawl, setHawl] = useState(false);
  const [records, setRecords] = usePersistentState(KEY, []);
  const [currency, setCurrency] = usePersistentState(CURRENCY_KEY, "KES");

  const gross = useMemo(
    () =>
      ASSET_GROUPS.flatMap((group) => group.fields).reduce(
        (total, [key]) => total + Number(assets[key] || 0),
        0,
      ),
    [assets],
  );
  const debts = Number(assets.debts || 0);
  const net = Math.max(0, gross - debts);
  const nisab = Number(prices[standard] || 0);
  const due = hawl && nisab > 0 && net >= nisab ? net * ZAKAT_RATE : 0;

  const money = (value) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value || 0);

  const save = () => {
    if (!due) return;
    setRecords((previous) => [
      { date: new Date().toISOString(), standard, net, due, currency },
      ...previous,
    ]);
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(records, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "noorhub-zakat-history.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const eligible = nisab > 0 && net >= nisab;

  return (
    <div className="page">
      <div className="container container--narrow">
        <header className="page-head">
          <span className="page-head__eyebrow">Library</span>
          <h1 className="page-head__title">Zakat calculator</h1>
          <div className="page-head__meta">
            <span>Private estimate · nothing leaves this browser</span>
          </div>
          <p className="page__lede">
            Enter the assets you consider zakatable, choose the nisab standard,
            and review the summary before the estimate is calculated. This is
            arithmetic, not a ruling.
          </p>
        </header>

        <div className="zakat">
          <div className="stack">
            <section className="card" aria-labelledby="assets-heading">
              <h2 className="card__title" id="assets-heading">
                Your zakatable assets
              </h2>
              <p className="meta">
                Enter annual values in {currency}. Leave anything you do not hold
                blank.
              </p>

              <div className="cluster zakat-currency">
                <span className="field__label">Currency</span>
                {CURRENCIES.map((code) => (
                  <Tag key={code} active={currency === code} onClick={() => setCurrency(code)}>
                    {code}
                  </Tag>
                ))}
              </div>

              {ASSET_GROUPS.map((group) => (
                <div className="asset-group" key={group.title}>
                  <h3 className="asset-group__title">{group.title}</h3>
                  <p className="asset-group__hint">{group.hint}</p>
                  <div className="stack asset-group__fields">
                    {group.fields.map(([key, label]) => (
                      <label className="field" key={key}>
                        <span className="field__label">{label}</span>
                        <div className="money-field">
                          <span className="money-field__prefix">{currency}</span>
                          <input
                            className="input money-field__input"
                            type="number"
                            min="0"
                            step="any"
                            inputMode="decimal"
                            value={assets[key]}
                            onChange={(event) =>
                              setAssets((previous) => ({
                                ...previous,
                                [key]: event.target.value,
                              }))
                            }
                            placeholder="0"
                          />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="asset-group">
                <h3 className="asset-group__title">Deductible debts</h3>
                <p className="asset-group__hint">
                  Only include debts you are due to repay within the year.
                </p>
                <div className="stack asset-group__fields">
                  {DEBT_FIELDS.map(([key, label]) => (
                    <label className="field" key={key}>
                      <span className="field__label">{label}</span>
                      <div className="money-field">
                        <span className="money-field__prefix">{currency}</span>
                        <input
                          className="input money-field__input"
                          type="number"
                          min="0"
                          step="any"
                          inputMode="decimal"
                          value={assets[key]}
                          onChange={(event) =>
                            setAssets((previous) => ({
                              ...previous,
                              [key]: event.target.value,
                            }))
                          }
                          placeholder="0"
                        />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </section>

            <section className="card" aria-labelledby="nisab-heading">
              <h2 className="card__title" id="nisab-heading">
                Nisab and hawl
              </h2>
              <p className="meta">
                Enter today’s local value for the standard you follow. NoorHub
                does not fetch metal prices.
              </p>

              <div className="cluster" style={{ marginTop: "var(--space-4)" }}>
                {NISAB_STANDARDS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className="option"
                    aria-pressed={standard === item.value}
                    onClick={() => setStandard(item.value)}
                  >
                    {item.label}
                    <span className="option__hint">{item.hint}</span>
                  </button>
                ))}
              </div>

              <div className="stack nisab-fields">
                {(["gold", "silver"]).map((key) => (
                  <label className="field" key={key}>
                    <span className="field__label">
                      {key === "gold" ? "Gold" : "Silver"} nisab value in {currency}
                    </span>
                    <div className="money-field">
                      <span className="money-field__prefix">{currency}</span>
                      <input
                        className="input money-field__input"
                        type="number"
                        min="0"
                        step="any"
                        inputMode="decimal"
                        value={prices[key]}
                        onChange={(event) =>
                          setPrices((previous) => ({ ...previous, [key]: event.target.value }))
                        }
                        placeholder="Enter the current reference value"
                      />
                    </div>
                  </label>
                ))}
              </div>

              <label className="checkbox nisab-hawl">
                <input
                  type="checkbox"
                  checked={hawl}
                  onChange={(event) => setHawl(event.target.checked)}
                />
                <span>
                  A lunar year (hawl) has passed while my zakatable wealth stayed
                  at or above the nisab threshold.
                </span>
              </label>
            </section>
          </div>

          <aside className="zakat-summary" aria-labelledby="summary-heading">
            <h2 className="card__title" id="summary-heading">
              <Scale size={19} aria-hidden="true" /> Review and estimate
            </h2>

            <dl className="detail-list">
              <div className="detail-list__row">
                <dt className="detail-list__key">Assets entered</dt>
                <dd className="detail-list__value">{money(gross)}</dd>
              </div>
              <div className="detail-list__row">
                <dt className="detail-list__key">Less debts due</dt>
                <dd className="detail-list__value">{money(debts)}</dd>
              </div>
              <div className="detail-list__row">
                <dt className="detail-list__key">Net zakatable assets</dt>
                <dd className="detail-list__value">{money(net)}</dd>
              </div>
              <div className="detail-list__row">
                <dt className="detail-list__key">
                  Nisab ({standard === "gold" ? "gold" : "silver"})
                </dt>
                <dd className="detail-list__value">
                  {nisab ? money(nisab) : "Not entered"}
                </dd>
              </div>
              <div className="detail-list__row">
                <dt className="detail-list__key">Above nisab</dt>
                <dd className="detail-list__value">
                  {nisab ? (eligible ? "Yes" : "No") : "Unknown"}
                </dd>
              </div>
              <div className="detail-list__row">
                <dt className="detail-list__key">Hawl confirmed</dt>
                <dd className="detail-list__value">{hawl ? "Yes" : "No"}</dd>
              </div>
            </dl>

            <div className="zakat-total">
              <p className="zakat-total__label">Estimated zakat due (2.5%)</p>
              <p className="zakat-total__value">{money(due)}</p>
            </div>

            <p className="meta zakat-summary__note">
              {!nisab
                ? "Enter a nisab value to check eligibility."
                : !hawl
                  ? "Confirm that a lunar year has passed to calculate the estimate."
                  : eligible
                    ? "Estimate shown above. Review the assumptions before acting on it."
                    : "Net assets are below the nisab threshold, so no zakat is estimated."}
            </p>

            <button
              type="button"
              className="btn btn--primary btn--block"
              onClick={save}
              disabled={!due}
            >
              Save this estimate
            </button>
          </aside>
        </div>

        <section className="card" aria-labelledby="records-heading">
          <div className="card__header">
            <div>
              <h2 className="card__title" id="records-heading">
                Saved estimates
              </h2>
              <p className="meta">Stored on this device only</p>
            </div>
            <div className="cluster">
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={exportData}
                disabled={!records.length}
              >
                <Download size={15} aria-hidden="true" />
                Export
              </button>
              <button
                type="button"
                className="btn btn--quiet btn--sm"
                onClick={() => {
                  if (window.confirm("Clear saved zakat estimates from this device?")) {
                    setRecords([]);
                  }
                }}
                disabled={!records.length}
              >
                <Trash2 size={15} aria-hidden="true" />
                Clear
              </button>
            </div>
          </div>

          {records.length ? (
            <ul className="stack zakat-records">
              {records.map((record, index) => (
                <li className="zakat-record" key={`${record.date}-${index}`}>
                  <span>
                    {new Date(record.date).toLocaleDateString()} ·{" "}
                    {record.standard === "gold" ? "gold" : "silver"} standard ·{" "}
                    {record.currency}
                  </span>
                  <span className="zakat-record__value">
                    {new Intl.NumberFormat(undefined, {
                      style: "currency",
                      currency: record.currency || "KES",
                      maximumFractionDigits: 0,
                    }).format(record.due)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="meta">No estimates saved yet.</p>
          )}
        </section>

        <Notice tone="sand">
          <strong>Assumptions.</strong> This calculator applies a flat 2.5% to
          the net assets you enter, using the nisab standard and reference value
          you provide. Asset categories, debts, gold use, investments, trade
          goods, livestock and timing can differ by scholarly view. Ask a
          qualified scholar about your circumstances. No financial values leave
          this browser.
        </Notice>
      </div>
    </div>
  );
}

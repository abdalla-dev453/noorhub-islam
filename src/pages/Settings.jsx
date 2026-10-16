import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Download,
  MapPin,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePrayerContext } from "../hooks/usePrayerContext";
import { ASR_METHODS, CALC_METHODS } from "../utils/prayerTimes";
import { writeLocal } from "../utils/localData";
import { useReadingProfile } from "../hooks/useReadingProfile";
import Notice from "../components/ui/Notice";
import ProgressBar from "../components/ui/ProgressBar";
import SectionHeader from "../components/ui/SectionHeader";

function readPrivateBrowserData() {
  return Object.fromEntries(
    Object.keys(localStorage)
      .filter((key) => key.startsWith("noorhub_"))
      .sort()
      .map((key) => {
        try {
          return [key, JSON.parse(localStorage.getItem(key))];
        } catch {
          return [key, localStorage.getItem(key)];
        }
      }),
  );
}

function clearPrivateBrowserData() {
  Object.keys(localStorage)
    .filter((key) => key.startsWith("noorhub_"))
    .forEach((key) => localStorage.removeItem(key));
}

function downloadJson(name, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function Settings() {
  const { user, isAuthenticated, authFetch, deleteAccount } = useAuth();
  const { profile, setSettings } = usePrayerContext();
  const { bookmarked, notes, hifz } = useReadingProfile();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const exportData = async () => {
    setBusy(true);
    setMessage("");
    let accountData = { user, progress: [] };
    if (isAuthenticated) {
      try {
        const response = await authFetch("/api/user/progress");
        if (response.ok) accountData.progress = response.data.progress || [];
        else {
          setMessage(
            "Some account data could not be reached. The export includes all local browser data and your profile.",
          );
        }
      } catch {
        setMessage(
          "The API is unavailable. The export includes all local browser data and your profile.",
        );
      }
    }
    downloadJson("noorhub-data-export.json", {
      exportedAt: new Date().toISOString(),
      format: "noorhub-data-export-v1",
      account: accountData,
      browserData: readPrivateBrowserData(),
    });
    setBusy(false);
  };

  const clearDeviceData = () => {
    if (
      !window.confirm(
        "Clear NoorHub activity and preferences stored in this browser? Your server account will remain.",
      )
    ) {
      return;
    }
    clearPrivateBrowserData();
    setMessage("NoorHub data on this device has been cleared.");
  };

  const eraseAccount = async () => {
    const confirmation = window.prompt(
      "This permanently deletes your NoorHub account and synced learning progress. Type DELETE to continue.",
    );
    if (confirmation !== "DELETE") return;
    setBusy(true);
    setMessage("");
    let result;
    try {
      result = await deleteAccount();
    } catch {
      result = {
        errors: [
          "The account service could not be reached. Your account has not been deleted.",
        ],
      };
    }
    if (result.errors) {
      setMessage(result.errors.join(" "));
      setBusy(false);
      return;
    }
    clearPrivateBrowserData();
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <div className="page">
      <div className="container">
        <header className="page-head">
          <span className="page-head__eyebrow">Profile</span>
          <h1 className="page-head__title">
            {isAuthenticated ? user?.name : "Your profile"}
          </h1>
          <div className="page-head__meta">
            <span>
              {isAuthenticated
                ? `Signed in as ${user?.email}`
                : "Guest mode — everything is stored on this device"}
            </span>
          </div>
        </header>

        <div className="settings-grid">
          <div className="stack settings-grid__main">
            <section className="card" aria-labelledby="prayer-preferences">
              <div className="card__header">
                <div>
                  <h2 className="card__title" id="prayer-preferences">
                    <MapPin size={19} aria-hidden="true" /> Prayer preferences
                  </h2>
                  <p className="meta">
                    Location and calculation choices are saved on this device only.
                  </p>
                </div>
              </div>

              <form
                className="form-grid"
                onSubmit={(event) => {
                  event.preventDefault();
                  writeLocal("noorhub_prayer_settings", profile);
                  setMessage("Prayer preferences saved.");
                }}
              >
                <label className="field">
                  <span className="field__label">Location label</span>
                  <input
                    className="input"
                    value={profile.label}
                    onChange={(event) =>
                      setSettings((previous) => ({
                        ...previous,
                        label: event.target.value,
                      }))
                    }
                  />
                </label>

                <div className="form-grid form-grid--two">
                  <label className="field">
                    <span className="field__label">Latitude</span>
                    <input
                      className="input"
                      type="number"
                      min="-90"
                      max="90"
                      step="any"
                      value={profile.lat}
                      onChange={(event) =>
                        setSettings((previous) => ({
                          ...previous,
                          lat: Number(event.target.value),
                        }))
                      }
                    />
                  </label>

                  <label className="field">
                    <span className="field__label">Longitude</span>
                    <input
                      className="input"
                      type="number"
                      min="-180"
                      max="180"
                      step="any"
                      value={profile.lng}
                      onChange={(event) =>
                        setSettings((previous) => ({
                          ...previous,
                          lng: Number(event.target.value),
                        }))
                      }
                    />
                  </label>
                </div>

                <label className="field">
                  <span className="field__label">Calculation convention</span>
                  <select
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
                </label>

                <label className="field">
                  <span className="field__label">Asr juristic method</span>
                  <select
                    className="select"
                    value={profile.asr}
                    onChange={(event) =>
                      setSettings((previous) => ({ ...previous, asr: event.target.value }))
                    }
                  >
                    {Object.entries(ASR_METHODS).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div>
                  <button type="submit" className="btn btn--secondary">
                    Save prayer preferences
                  </button>
                </div>
              </form>
            </section>

            <section className="card" aria-labelledby="data-export">
              <div className="card__header">
                <div>
                  <h2 className="card__title" id="data-export">
                    <ShieldCheck size={19} aria-hidden="true" /> Your data
                  </h2>
                  <p className="meta">
                    Download a JSON copy of this browser’s NoorHub data
                    {isAuthenticated ? " and your synced lesson progress" : ""}.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="btn btn--primary"
                disabled={busy}
                onClick={exportData}
              >
                <Download size={16} aria-hidden="true" />
                Export my data
              </button>
            </section>

            <section className="card" aria-labelledby="clear-device">
              <div className="card__header">
                <div>
                  <h2 className="card__title" id="clear-device">
                    <Trash2 size={19} aria-hidden="true" /> Clear this device
                  </h2>
                  <p className="meta">
                    Removes local practice activity, reading notes, Hifz plans and
                    preferences from this browser. Your account is not affected.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="btn btn--secondary"
                onClick={clearDeviceData}
              >
                Clear local NoorHub data
              </button>
            </section>

            {isAuthenticated ? (
              <section className="card card--selected" aria-labelledby="delete-account">
                <div className="card__header">
                  <div>
                    <h2 className="card__title" id="delete-account">
                      <AlertTriangle size={19} aria-hidden="true" /> Delete account
                    </h2>
                    <p className="meta">
                      Signed in as {user?.email}. This permanently deletes your
                      account and server learning progress. Local activity is
                      removed from this device too.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn--danger"
                  disabled={busy}
                  onClick={eraseAccount}
                >
                  Permanently delete my account
                </button>
              </section>
            ) : null}
          </div>

          <aside className="card settings-aside" aria-labelledby="activity-heading">
            <h2 className="card__title" id="activity-heading">
              Activity on this device
            </h2>

            <dl className="detail-list">
              <div className="detail-list__row">
                <dt className="detail-list__key">Bookmarked ayat</dt>
                <dd className="detail-list__value">{bookmarked}</dd>
              </div>
              <div className="detail-list__row">
                <dt className="detail-list__key">Private notes</dt>
                <dd className="detail-list__value">{notes}</dd>
              </div>
            </dl>

            {hifz ? (
              <div className="settings-aside__block">
                <h3 className="field__label">{hifz.name}</h3>
                <ProgressBar
                  value={hifz.learned}
                  max={hifz.total}
                  label={`${hifz.learned} of ${hifz.total} portions memorised`}
                  showValue={false}
                />
                <p className="meta">
                  {hifz.due} portions due for review · target finish {hifz.endDate}
                </p>
              </div>
            ) : (
              <p className="meta">
                No memorisation plan on this device yet. Start one in the{" "}
                <button
                  type="button"
                  className="btn btn--quiet btn--sm"
                  onClick={() => navigate("/hifz")}
                >
                  memorisation studio
                </button>
                .
              </p>
            )}

            <Notice tone="sand">
              Private browser data is not encrypted at rest. Avoid using shared
              devices for sensitive notes.
            </Notice>
          </aside>
        </div>

        {message ? (
          <p className="notice settings-message" role="status">
            {message}
          </p>
        ) : null}

        <SectionHeader
          eyebrow="More"
          title="Where your data lives"
          description="Reading position, bookmarks, notes, Hifz plans, prayer logs and duas are stored in this browser. Only lesson progress syncs to your account, and only when you are signed in."
        />
      </div>
    </div>
  );
}

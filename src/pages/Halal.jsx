import {
  Leaf,
  MapPin,
  QrCode,
  School,
  ShoppingBasket,
  UtensilsCrossed,
} from "lucide-react";
import { useState } from "react";
import Card from "../components/ui/Card";
import Notice from "../components/ui/Notice";
import SectionHeader from "../components/ui/SectionHeader";

const HALAL_RESTAURANTS = [
  {
    name: "Al-Bayt Family Restaurant",
    cuisine: "Middle Eastern · Somali",
    address: "123 Main St, Nairobi, Kenya",
    certified: "Jamia Hafsa",
    rating: 4.8,
  },
  {
    name: "Madinah Sweets & Grill",
    cuisine: "Pakistani · Halal BBQ",
    address: "Lavington, Nairobi, Kenya",
    certified: "HFAK",
    rating: 4.6,
  },
  {
    name: "Sahara Street Food",
    cuisine: "Turkish · Kebabs",
    address: "Westlands, Nairobi, Kenya",
    certified: "Self-declared",
    rating: 4.2,
  },
];

const DOUBTFUL_INGREDIENTS = [
  { name: "Gelatin (G)", desc: "Source undefined — may be porcine", status: "caution" },
  { name: "Enzyme (E1100)", desc: "Microbial or animal — verify source", status: "caution" },
  { name: "L-Cysteine (E920)", desc: "Often animal-derived", status: "avoid" },
  { name: "Stearic acid (E570)", desc: "Usually plant, but may be animal", status: "caution" },
];

const MEALS = [
  {
    name: "Sunnah breakfast",
    items: ["Oats with dates and honey", "Banana", "Green tea or water"],
    benefit: "Dates break the overnight fast; oats provide slow energy for Suhoor.",
  },
  {
    name: "Light iftar",
    items: ["Water", "Dates (3-7 pieces)", "Vegetable soup"],
    benefit: "Rehydrate gently before the main meal.",
  },
];

const E_NUMBER_FLAGS = [
  { code: "E441", label: "Gelatine", status: "check-source" },
  { code: "E904", label: "Carnauba wax", status: "halal" },
  { code: "E161b", label: "Lutein", status: "check-source" },
  { code: "E120", label: "Carmine / cochineal", status: "haram" },
  { code: "E542", label: "Bone phosphate", status: "haram" },
  { code: "E321", label: "Vitamin E (mixed source)", status: "check-source" },
];

export default function Halal() {
  const [tab, setTab] = useState("restaurants");
  const [search, setSearch] = useState("");
  const [barcode, setBarcode] = useState("");

  const filteredRestaurants = HALAL_RESTAURANTS.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.address.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="page">
      <div className="container">
        <header className="page-head">
          <span className="page-head__eyebrow">Halal lifestyle</span>
          <h1 className="page-head__title">Halal finder</h1>
          <div className="page-head__meta">
            <span>Halal · Travel-friendly · Verified</span>
          </div>
          <p className="page__lede">
            Find halal restaurants and verify ingredients by E-number. Use the
            barcode scanner tool when you shop, and always prefer certified
            establishments.
          </p>
        </header>

        <div className="tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "restaurants"}
            className={`tabs__tab ${tab === "restaurants" ? "is-active" : ""}`}
            onClick={() => setTab("restaurants")}
          >
            <UtensilsCrossed size={16} aria-hidden="true" />
            Restaurants
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "ingredients"}
            className={`tabs__tab ${tab === "ingredients" ? "is-active" : ""}`}
            onClick={() => setTab("ingredients")}
          >
            <ShoppingBasket size={16} aria-hidden="true" />
            Ingredients
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "scanner"}
            className={`tabs__tab ${tab === "scanner" ? "is-active" : ""}`}
            onClick={() => setTab("scanner")}
          >
            <QrCode size={16} aria-hidden="true" />
            Scanner
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "recipes"}
            className={`tabs__tab ${tab === "recipes" ? "is-active" : ""}`}
            onClick={() => setTab("recipes")}
          >
            <School size={16} aria-hidden="true" />
            Recipes
          </button>
        </div>

        {tab === "restaurants" && (
          <>
            <div className="search-field">
              <input
                type="search"
                placeholder="Search by name or location..."
                className="input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="collection-list">
              {filteredRestaurants.map((r) => (
                <Card key={r.name} tone="quiet">
                  <h3 className="card__title">{r.name}</h3>
                  <p className="meta">{r.cuisine}</p>
                  <p className="meta">{r.address}</p>
                  <div className="cluster">
                    <span className="badge badge--accent">{r.certified}</span>
                    <span className="badge numeric">★ {r.rating}</span>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {tab === "ingredients" && (
          <>
            <SectionHeader title="E-number guide" description="Halal / haram flags." />
            <div className="collection-list">
              {E_NUMBER_FLAGS.map((e) => {
                const isHalal = e.status === "halal";
                const isHaram = e.status === "haram";
                return (
                  <div key={e.code} className="detail-list">
                    <div className="detail-list__row">
                      <span className="detail-list__key">
                        {e.code} — {e.label}
                      </span>
                      <span
                        className={
                          isHalal
                            ? "text-accent font-bold"
                            : isHaram
                              ? "text-danger font-bold"
                              : "text-amber-600 font-bold"
                        }
                      >
                        {e.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <SectionHeader
              title="Doubtful ingredients"
              eyebrow="Caution"
            />
            <Notice tone="sand">
              <ShoppingBasket size={16} className="notice__icon" aria-hidden="true" />
              When a source is not stated, contact the manufacturer. When in doubt,
              leave it out.
            </Notice>
            <div className="stack">
              {DOUBTFUL_INGREDIENTS.map((ing) => (
                <div key={ing.name} className="detail-list__row">
                  <span className="detail-list__key">{ing.name}</span>
                  <span className="detail-list__value">{ing.status}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "scanner" && (
          <>
            <label className="field__label" htmlFor="barcode-input">
              Product barcode (EAN/UPC)
            </label>
            <div className="input-group">
              <input
                id="barcode-input"
                type="text"
                inputMode="numeric"
                placeholder="Scan or type barcode..."
                className="input"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value.replace(/\D/g, ""))}
              />
              <button
                type="button"
                className="btn btn--secondary btn--icon"
                onClick={() =>
                  barcode
                    ? alert(`Scanning ${barcode} — connect a camera/API to resolve this code.`)
                    : alert("Type or scan a barcode first.")
                }
              >
                <QrCode size={18} />
              </button>
            </div>
            <Notice tone="sand">
              <MapPin size={16} className="notice__icon" aria-hidden="true" />
              This is a stub. Connect the Open Food Facts API and an E-number
              database to resolve barcodes with certification status.
            </Notice>
          </>
        )}

        {tab === "recipes" && (
          <>
            <SectionHeader
              title="Sunnah-inspired meals"
              description="Simple, halal, and easy to prepare."
            />
            <div className="grid grid--2">
              {MEALS.map((meal) => (
                <Card key={meal.name} tone="quiet">
                  <h3 className="card__title">{meal.name}</h3>
                  <ul className="stack" style={{ gap: "var(--space-1)" }}>
                    {meal.items.map((item) => (
                      <li key={item} className="cluster gap-xs">
                        <Leaf size={12} className="text-accent shrink-0" />
                        <span className="meta">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="meta">{meal.benefit}</p>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

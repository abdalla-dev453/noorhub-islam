import {
  BookOpen,
  CheckCircle,
  Globe,
  Plane,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import Card from "../components/ui/Card";
import Notice from "../components/ui/Notice";
import SectionHeader from "../components/ui/SectionHeader";

const PILLARS = [
  {
    step: 1,
    title: "Ihram",
    desc: "Two white seamless garments, the intention (niyyah), and the opening talbiyah — 'Labbayk' — mark the start of Hajj from Meeqat.",
  },
  {
    step: 2,
    title: "Tawaf al-Qudum / Ifadhah",
    desc: "Circling the Ka'bah seven times (Tawaf al-Ifadhah or al-Qudum) followed by the standing at Arafat (Wuquf), the spiritual peak.",
  },
  {
    step: 3,
    title: "Stay at Arafat",
    desc: "The heart of Hajj: standing in sincere supplication from Dhuhr until sunset on the Day of Arafah (9th Dhul-Hijjah).",
  },
  {
    step: 4,
    title: "Muzdalifa",
    desc: "After sunset, travel to Muzdalifa to combine Maghrib and Isha, rest, and prepare for the stoning at Mina.",
  },
  {
    step: 5,
    title: "Mina & Stoning",
    desc: "Throw pebbles at the three Jamarat, beginning with the smallest, reciting the talbiyah, then sacrifice and celebrate Eid al-Adha.",
  },
];

const CHECKLIST = [
  "Passport and visa (apply early, Hajj is restricted to Muslims)",
  "Vaccinations: meningitis ACWY and seasonal flu (follow local health authority)",
  "Travel insurance that covers medical repatriation",
  "Book flights and accommodation near Mina/Makkah early",
  "Plan Ihram clothing and prayer mats from home",
  "Cash in local currency for sadaqah and taxis",
];

const TAWAF_STEPS = [
  "Niyyah (intention) for Tawaf al-Ifadhah",
  "Entering the Hijr area from the left side of the Black Stone",
  "Starting with Bismillah: 'BismillahirRahmanir Raheem'",
  "Seven circuits, reciting praise and Quranic verses",
  "Ending at the Black Stone (Hajr al-Aswad), kissing it if able",
];

const SAII_STEPS = [
  "Start at Safa, recite Quran 2:158",
  "Walk seven times between the hills of Safa and Marwah",
  "Praise Allah at each hill station, reflecting on Hajar's sacrifice",
  "End at Marwah, completing Sa'i",
];

const DUAS = [
  {
    label: "Talbiyah of Ihram",
    arabic: "لَبَّكَ اللَّهُمَّ لَبَّكَ، لَبَّكَ لَا شَرِيكَ لَكَ لَبَّكَ،",
    roman: "Labbayka llāhumma labbayk, labbayka lā sharīka laka labbayk",
    meaning: "Here I am, O Allah, here I am...",
  },
  {
    label: "At Arafat",
    arabic: "لَا إِلَهَ إِلَّا اللَّهُ، وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، قَدْ عَظُمَ الْأَجْرُ وَعَظُمَ الْمِيرَاثُ وَعَرَضَ بِكَرَمِ رَبِّكَ.",
    roman: "Lā ilāha illallāhu waḥdahu lā sharīka lah, lahul-mulku wa lahul-ḥamdu",
    meaning: "There is none worthy of worship but Allah, alone, ...",
  },
];

export default function Hajj() {
  const [openPillar, setOpenPillar] = useState(1);
  const [openStep, setOpenStep] = useState("tawaf");

  return (
    <div className="page">
      <div className="container">
        <header className="page-head">
          <span className="page-head__eyebrow">Pilgrimage guide</span>
          <h1 className="page-head__title">Hajj and Umrah</h1>
          <div className="page-head__meta">
            <span>5 pillars · step-by-step</span>
            <span aria-hidden="true">·</span>
            <span>Sources: Sahih Bukhari, Muslim, Fatwa institutions</span>
          </div>
          <p className="page__lede">
            A structured guide to the rites of Hajj and Umrah with duas,
            checklists, maps, and the postures of each stage. This is a
            learning aid — confirm details with a qualified scholar and your
            local hajj operator.
          </p>
        </header>

        <Notice tone="sand">
          <Globe size={17} className="notice__icon" aria-hidden="true" />
          Times and dates follow the Umm al-Qura calendar and local moon
          sighting. Always verify with official Saudi sources.
        </Notice>

        <section className="dashboard-section" aria-labelledby="pillars-heading">
          <SectionHeader
            eyebrow="The five pillars of Hajj"
            title="Step-by-step rites"
            description="Each pillar is a gateway to the next. Start with Ihram
              and finish at the sacrifice."
          />

          <div className="stack">
            {PILLARS.map((pillar) => (
              <div key={pillar.step} className="stack">
                <button
                  type="button"
                  aria-expanded={openPillar === pillar.step}
                  className="card card--interactive"
                  onClick={() =>
                    setOpenPillar(openPillar === pillar.step ? 0 : pillar.step)
                  }
                >
                  <div className="cluster">
                    <span className="badge badge--gold numeric">
                      Pillar {pillar.step}
                    </span>
                    <h3 className="card__title">{pillar.title}</h3>
                  </div>
                </button>

                {openPillar === pillar.step && (
                  <div className="card card--tight animate-fadeIn">
                    <p className="meta">{pillar.desc}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-section" aria-labelledby="tawaf-heading">
          <SectionHeader
            eyebrow="Detailed rites"
            title="Tawaf and Sa'i breakdown"
            description="Two core rites repeated across Hajj and Umrah."
          />
          <div className="split">
            <div className="stack">
              <button
                type="button"
                className={`card ${openStep === "tawaf" ? "card--selected" : "card--interactive"}`}
                onClick={() => setOpenStep("tawaf")}
              >
                <h3 className="card__title">Tawaf al-Ifadhah</h3>
                <p className="meta">Seven circuits around the Ka'bah</p>
              </button>
              <ul className="stack" style={{ gap: "var(--space-2)" }}>
                {TAWAF_STEPS.map((step, i) => (
                  <li key={i} className="cluster gap-xs">
                    <CheckCircle size={14} className="text-accent shrink-0" />
                    <span className="meta">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="stack">
              <button
                type="button"
                className={`card ${openStep === "sai" ? "card--selected" : "card--interactive"}`}
                onClick={() => setOpenStep("sai")}
              >
                <h3 className="card__title">Sa'i between Safa and Marwah</h3>
                <p className="meta">Seven walks, remembering Hajar's search</p>
              </button>
              <ul className="stack" style={{ gap: "var(--space-2)" }}>
                {SAII_STEPS.map((step, i) => (
                  <li key={i} className="cluster gap-xs">
                    <CheckCircle size={14} className="text-accent shrink-0" />
                    <span className="meta">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="dashboard-section" aria-labelledby="duas-heading">
          <SectionHeader
            eyebrow="Sacred invocations"
            title="Essential duas"
          />
          <div className="grid grid--2">
            {DUAS.map((dua) => (
              <div key={dua.label} className="card">
                <p className="label">{dua.label}</p>
                <p className="arabic-text" lang="ar" dir="rtl">
                  {dua.arabic}
                </p>
                <p className="meta">{dua.roman}</p>
                <p className="meta">{dua.meaning}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-section" aria-labelledby="checklist-heading">
          <SectionHeader
            eyebrow="Before you go"
            title="Pre-trip checklist"
          />
          <div className="card">
            <ul className="stack" style={{ gap: "var(--space-3)" }}>
              {CHECKLIST.map((item) => (
                <li key={item} className="cluster gap-sm">
                  <CheckCircle size={16} className="text-accent shrink-0" />
                  <span className="meta">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="dashboard-section" aria-labelledby="umrah-heading">
          <SectionHeader
            eyebrow="Umrah at a glance"
            title="The lesser pilgrimage"
            action={{ to: "/hajj", label: "Full Hajj guide" }}
          />
          <div className="collection-list">
            <Card to="/hajj" tone="quiet">
              <BookOpen size={20} className="explore-row__icon" />
              <h3 className="card__title">Ihram → Tawaf → Sa'i → Shave</h3>
              <p className="meta">
                Umrah can be performed any time of year. The talbiyah, the
                seven circuits, and the seven walks between Safa and Marwah are
                shared with Hajj.
              </p>
            </Card>
            <Card to="/hajj" tone="quiet">
              <Plane size={20} className="explore-row__icon" />
              <h3 className="card__title">Travel essentials</h3>
              <p className="meta">
                Pack light, white Ihram, prayer mat, miswak, and a pocket dua
                book. Ihram cannot be donned before the Meeqat boundary.
              </p>
            </Card>
          </div>
        </section>

        <section className="dashboard-section">
          <Card tone="sand">
            <Wallet size={18} className="notice__icon" aria-hidden="true" />
            <p className="meta">
              Budgeting tips: book accommodation through verified group
              operators, use local ATMs sparingly, give sadaqah in cash, and
              keep receipts for Qurbani. This guide provides structure, not
              financial or jurisprudential rulings.
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
}

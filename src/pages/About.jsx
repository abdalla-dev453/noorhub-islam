import { BookOpen, Code, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Notice from "../components/ui/Notice";
import SectionHeader from "../components/ui/SectionHeader";

const VALUES = [
  {
    icon: BookOpen,
    title: "Sources stay visible",
    text: "The reader names its Arabic edition, translation and reciter. Hadith entries name their collection. Anything without a verifiable source is labelled as missing.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    text: "Reading position, bookmarks, notes, Hifz plans, prayer logs and duas stay in this browser. Only lesson progress syncs to an account, and only when you sign in.",
  },
  {
    icon: Code,
    title: "Honest about what is missing",
    text: "Grading, narrator chains, tafsir and scholarly review are not finished. Where a feature is incomplete, the interface says so instead of implying otherwise.",
  },
];

export default function About() {
  return (
    <div className="page">
      <div className="container container--narrow">
        <header className="page-head">
          <span className="page-head__eyebrow">About</span>
          <h1 className="page-head__title">A quiet workspace for worship and learning</h1>
          <div className="page-head__meta">
            <span>Built as a work in progress, in the open</span>
          </div>
        </header>

        <div className="split">
          <div className="stack article-body">
            <p className="page__lede">
              NoorHub brings several useful Islamic tools into one place: reading
              the Quran with translation and recitation, keeping prayer times and
              the Qibla, a memorisation plan, a Hadith library, a Zakat estimate,
              and structured courses.
            </p>
            <p>
              The goal is not to add another screen to your day. It is to make
              each of these tasks quick to start, calm to use, and easy to return
              to. That is why the interface is light, why progress is shown only
              where it means something, and why the reader has a dedicated dark
              reading appearance rather than a decorative one.
            </p>
            <p>
              NoorHub is built by a small team and is still in progress. Content
              review, licensing and scholarly verification are ongoing. Nothing
              here replaces a teacher, a scholar, or your local masjid.
            </p>
          </div>

          <aside className="card">
            <h2 className="card__title">What NoorHub is not</h2>
            <ul className="stack about-list">
              <li>Not a fatwa service, and not a substitute for a qualified scholar.</li>
              <li>Not a social network. There is no public feed and no sharing of your activity.</li>
              <li>Not an advertisement-supported product.</li>
              <li>Not a machine-generated translation or summary of the Quran or Hadith.</li>
            </ul>
          </aside>
        </div>

        <section aria-labelledby="principles-heading">
          <SectionHeader
            eyebrow="Principles"
            title="How NoorHub is built"
            description="Three commitments that shape every screen."
          />
          <div className="grid grid--3" id="principles-heading">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <article className="card" key={value.title}>
                  <span className="explore-row__icon">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <h3 className="card__title about-card__title">{value.title}</h3>
                  <p className="about-card__text">{value.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="sources-heading">
          <SectionHeader
            eyebrow="Sources"
            title="Where the content comes from"
          />
          <div className="stack library-notices">
            <Notice tone="sand">
              <strong>Quran.</strong> Arabic text from the Uthmani edition and
              English translation from Sahih International, both served via
              AlQuran Cloud. Verse audio is streamed from five reciters.
            </Notice>
            <Notice tone="sand">
              <strong>Hadith.</strong> Narration text from the fawazahmed0
              hadith-api editions of Sahih al-Bukhari, Sahih Muslim and Sunan Abi
              Dawud. Licensing and content review are still being verified, and
              grading and narrator chains are not included.
            </Notice>
            <Notice tone="sand">
              <strong>Prayer times.</strong> Calculated on your device from solar
              geometry using the convention you choose. They can differ from your
              local mosque timetable.
            </Notice>
            <Notice tone="sand">
              <strong>Lectures and courses.</strong> Credited to the instructors
              and institutions named on each entry and embedded from their public
              channels. NoorHub does not host or modify them.
            </Notice>
          </div>
        </section>

        <section className="card card--roomy" aria-labelledby="contact-heading">
          <h2 className="card__title" id="contact-heading">
            Accessibility and contact
          </h2>
          <p className="about-card__text">
            NoorHub targets WCAG AA contrast, visible keyboard focus, semantic
            landmarks, and reduced-motion support. If something in the interface
            does not work with your assistive technology, that is a bug and it
            should be reported.
          </p>
          <p className="about-card__text">
            You can export or delete everything NoorHub stores about you from your{" "}
            <Link to="/settings">profile and privacy page</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}

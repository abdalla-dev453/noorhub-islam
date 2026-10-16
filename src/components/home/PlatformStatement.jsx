import { PLATFORM_PRINCIPLES } from "../../data/defaults";

/**
 * A quiet statement of how the product is built. No metrics, no testimonials,
 * no invented partnerships.
 */
export default function PlatformStatement() {
  return (
    <section aria-labelledby="statement-heading">
      <div className="statement">
        <div>
          <span className="section-header__eyebrow label">Our approach</span>
          <h2 className="statement__title" id="statement-heading">
            Built for a steadier practice
          </h2>
          <p className="statement__lede">
            NoorHub is built around three commitments that shape every screen.
          </p>
        </div>

        <div className="statement__principles">
          {PLATFORM_PRINCIPLES.map((principle) => (
            <article key={principle.title}>
              <h3 className="statement__principle-title">{principle.title}</h3>
              <p className="statement__principle-text">{principle.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

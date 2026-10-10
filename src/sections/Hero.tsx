import { Icon } from "../components/Icon";
import { brand } from "../content/site";
import { Dashboard } from "./Dashboard";

export function Hero() {
  const [lead, accent] = brand.headline.includes(brand.headlineAccent)
    ? [brand.headline.slice(0, brand.headline.indexOf(brand.headlineAccent)), brand.headlineAccent]
    : [brand.headline, ""];

  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true" />
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow">
            {brand.roles.map((r, i) => (
              <span key={r} className="eyebrow__role">
                {r}
                {i < brand.roles.length - 1 && (
                  <span className="eyebrow__sep" aria-hidden="true">
                    /
                  </span>
                )}
              </span>
            ))}
          </p>
          <h1 id="hero-title" className="hero__title">
            {lead}
            {accent && <em>{accent}</em>}
          </h1>
          <p className="hero__lead">{brand.lead}</p>
          <div className="hero__ctas">
            <a href="#contact" className="btn btn--primary">
              Work With Me <Icon name="arrow" size={16} />
            </a>
            <a href="#services" className="btn btn--ghost">
              Explore Services
            </a>
          </div>
          <p className="hero__audience">{brand.audience}</p>
        </div>
        <div className="hero__viz">
          <Dashboard />
          <p className="hero__hint">Switch metric or period · hover or tap the chart for exact values</p>
        </div>
      </div>
    </section>
  );
}

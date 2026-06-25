import { copy } from "@/content/copy";

export function HeroSection() {
  return (
    <section className="hero">
      <div className="hero__copy">
        <div className="hero__kicker">
          <span className="hero__kickerLine" />
          <p className="eyebrow">{copy.hero.eyebrow}</p>
        </div>
        <h1>{copy.hero.title}</h1>
        <p className="hero__lead">{copy.hero.lead}</p>
        <div className="hero__actions">
          <a className="button button--primary" href="#demos">
            {copy.hero.primaryCta}
          </a>
          <a className="button button--ghost" href="#demos">
            {copy.hero.secondaryCta}
          </a>
        </div>

        <dl className="hero__meta">
          {copy.hero.meta.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="hero__panel" aria-hidden="true">
        <div className="hero__panelHeader">
          <span className="hero__panelTag">{copy.hero.panel.tag}</span>
          <span className="hero__panelStatus">{copy.hero.panel.status}</span>
        </div>

        <div className="hero__track hero__track--primary">
          <span>{copy.hero.panel.primaryLabel}</span>
          <strong>{copy.hero.panel.primaryValue}</strong>
        </div>

        <div className="hero__wave" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="hero__panelGrid">
          <div className="hero__track">
            <span>{copy.hero.panel.sectorLabel}</span>
            <strong>{copy.hero.panel.sectorValue}</strong>
          </div>
          <div className="hero__track">
            <span>{copy.hero.panel.interactionLabel}</span>
            <strong>{copy.hero.panel.interactionValue}</strong>
          </div>
          <div className="hero__track hero__track--wide">
            <span>{copy.hero.panel.experienceLabel}</span>
            <strong>{copy.hero.panel.experienceValue}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

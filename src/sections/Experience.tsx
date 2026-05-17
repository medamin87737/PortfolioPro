import type { CSSProperties } from "react";
import { EDUCATION, EXPERIENCE, LANGUAGES } from "../data/portfolio";
import { SectionHeader } from "../components/SectionHeader";
import { SectionPanel } from "../components/SectionPanel";
import "./Experience.css";

export function Experience() {
  return (
    <SectionPanel id="experience" wide>
      <SectionHeader sectionId="experience" />

      <div className="journey reveal">
        <section
          className="journey-zone journey-zone--experience"
          aria-labelledby="journey-experience-heading"
        >
          <header className="journey-zone__header">
            <div className="journey-zone__icon mono" aria-hidden>
              ◈
            </div>
            <div>
              <h3 id="journey-experience-heading" className="journey-zone__title">
                Expérience professionnelle
              </h3>
              <p className="journey-zone__subtitle">
                Stages, leadership associatif et missions en entreprise
              </p>
            </div>
          </header>

          <div className="journey-cards">
            {EXPERIENCE.map((item, i) => (
              <article
                key={item.id}
                className="journey-card journey-card--exp stagger-item"
                style={{ "--card-accent": item.accent ?? "var(--accent)" } as CSSProperties}
              >
                <div className="journey-card__shine" aria-hidden />
                <header className="journey-card__head">
                  <span className="journey-card__index mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="journey-card__badge mono">{item.type}</span>
                </header>
                <h4 className="journey-card__role">{item.role}</h4>
                <p className="journey-card__org">{item.org}</p>
                {item.period && (
                  <p className="journey-card__period mono">{item.period}</p>
                )}
                <p className="journey-card__desc">{item.description}</p>
                <footer className="journey-card__footer">
                  <span className="journey-card__bar" aria-hidden />
                </footer>
              </article>
            ))}
          </div>
        </section>

        <div className="journey-separator" role="separator" aria-hidden>
          <span className="journey-separator__line" />
          <span className="journey-separator__label mono">formation</span>
          <span className="journey-separator__line" />
        </div>

        <section
          className="journey-zone journey-zone--education"
          aria-labelledby="journey-education-heading"
        >
          <header className="journey-zone__header">
            <div className="journey-zone__icon journey-zone__icon--edu mono" aria-hidden>
              ◎
            </div>
            <div>
              <h3 id="journey-education-heading" className="journey-zone__title">
                Formation
              </h3>
              <p className="journey-zone__subtitle">
                Parcours académique et diplômes obtenus
              </p>
            </div>
          </header>

          <div className="journey-cards journey-cards--edu">
            {EDUCATION.map((item, i) => (
              <article
                key={item.id}
                className="journey-card journey-card--edu stagger-item"
                style={{ "--card-accent": item.accent ?? "var(--accent-2)" } as CSSProperties}
              >
                <div className="journey-card__shine" aria-hidden />
                <header className="journey-card__head">
                  <span className="journey-card__index mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="journey-card__badge mono">{item.level}</span>
                </header>
                <h4 className="journey-card__role">{item.degree}</h4>
                <p className="journey-card__org">{item.school}</p>
                <p className="journey-card__period mono">{item.period}</p>
                <footer className="journey-card__footer">
                  <span className="journey-card__bar" aria-hidden />
                </footer>
              </article>
            ))}
          </div>

          <div className="journey-langs">
            <h4 className="journey-langs__title mono">Langues</h4>
            <div className="journey-langs__grid">
              {LANGUAGES.map((lang) => (
                <div key={lang.name} className="journey-lang-card stagger-item">
                  <span className="journey-lang-card__name">{lang.name}</span>
                  <span className="journey-lang-card__level mono">{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </SectionPanel>
  );
}

import { SKILLS } from "../data/portfolio";
import { SectionHeader } from "../components/SectionHeader";
import { SectionPanel } from "../components/SectionPanel";
import "./Skills.css";

const SKILL_GROUPS = [
  {
    key: "languages",
    title: "Langages",
    icon: "{ }",
    accent: "var(--accent)",
    items: SKILLS.languages,
  },
  {
    key: "frameworks",
    title: "Frameworks",
    icon: "⚡",
    accent: "var(--accent-2)",
    items: SKILLS.frameworks,
  },
  {
    key: "databases",
    title: "Bases de données",
    icon: "◉",
    accent: "var(--accent)",
    items: SKILLS.databases,
  },
  {
    key: "devops",
    title: "DevOps & Outils",
    icon: "⬡",
    accent: "var(--accent-2)",
    items: SKILLS.devops,
  },
  {
    key: "ai",
    title: "Intelligence Artificielle",
    icon: "◎",
    accent: "var(--accent-3)",
    items: SKILLS.ai,
  },
  {
    key: "security",
    title: "Sécurité",
    icon: "🔒",
    accent: "var(--accent)",
    items: SKILLS.security,
  },
  {
    key: "methodologies",
    title: "Méthodologies",
    icon: "▣",
    accent: "var(--accent-2)",
    items: SKILLS.methodologies,
  },
  {
    key: "soft",
    title: "Compétences personnelles",
    icon: "★",
    accent: "var(--accent-3)",
    items: SKILLS.soft,
  },
] as const;

export function Skills() {
  return (
    <SectionPanel id="skills" wide>
      <SectionHeader sectionId="skills" />

      <div className="skills-cards reveal">
        {SKILL_GROUPS.map((group) => (
          <article
            key={group.key}
            className="skill-card stagger-item"
            style={{ "--card-accent": group.accent } as React.CSSProperties}
          >
            <div className="skill-card__shine" aria-hidden />
            <header className="skill-card__header">
              <div className="skill-card__icon mono" aria-hidden>
                {group.icon}
              </div>
              <div className="skill-card__meta">
                <h3 className="skill-card__title">{group.title}</h3>
                <span className="skill-card__count mono">
                  {String(group.items.length).padStart(2, "0")} skills
                </span>
              </div>
            </header>

            <ul className="skill-card__list">
              {group.items.map((item) => (
                <li key={item}>
                  <span className="skill-card__tag">{item}</span>
                </li>
              ))}
            </ul>

            <footer className="skill-card__footer">
              <span className="skill-card__bar" aria-hidden />
              <span className="skill-card__index mono">{group.key}</span>
            </footer>
          </article>
        ))}
      </div>
    </SectionPanel>
  );
}

import type { CSSProperties } from "react";
import { PROJECTS } from "../data/portfolio";
import { SectionHeader } from "../components/SectionHeader";
import { SectionPanel } from "../components/SectionPanel";
import "./Projects.css";

export function Projects() {
  return (
    <SectionPanel id="projects" wide>
      <SectionHeader sectionId="projects" />

      <div className="projects-cards reveal">
        {PROJECTS.map((project) => (
          <article
            key={project.id}
            className={`project-card stagger-item ${project.featured ? "project-card--featured" : ""}`}
            style={{ "--card-accent": project.accent ?? "var(--accent)" } as CSSProperties}
          >
            <div className="project-card__shine" aria-hidden />

            <header className="project-card__header">
              <span className="project-card__index mono">{project.index}</span>
              <span className="project-card__category mono">{project.category}</span>
            </header>

            <div className="project-card__body">
              <h3 className="project-card__title">{project.title}</h3>
              {project.company && (
                <p className="project-card__company mono">{project.company}</p>
              )}
              <p className="project-card__desc">{project.description}</p>
            </div>

            <ul className="project-card__tech">
              {project.tech.map((t) => (
                <li key={t}>
                  <span className="project-card__tag">{t}</span>
                </li>
              ))}
            </ul>

            <footer className="project-card__footer">
              <span className="project-card__cta mono">
                <span aria-hidden>→</span> {project.cta}
              </span>
              <span className="project-card__bar" aria-hidden />
            </footer>
          </article>
        ))}
      </div>
    </SectionPanel>
  );
}

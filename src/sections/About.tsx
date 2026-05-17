import { PROFILE } from "../data/portfolio";
import { SectionHeader } from "../components/SectionHeader";
import { SectionPanel } from "../components/SectionPanel";

export function About() {
  return (
    <SectionPanel id="about">
      <SectionHeader sectionId="about" />

      <div className="prose reveal">
        <p>{PROFILE.bio}</p>
        <p>
          Je ne me limite pas à développer des applications — j'aime construire des solutions
          modernes, fiables et bien pensées, de l'architecture microservices au déploiement
          DevOps et à l'intégration IA.
        </p>
      </div>

      <div className="stat-row reveal">
        {[
          { value: "3+", label: "Années d'expérience" },
          { value: "10+", label: "Projets réalisés" },
          { value: "4+", label: "Stages professionnels" },
        ].map((stat) => (
          <div key={stat.label} className="stat-item stagger-item">
            <span className="stat-item__value">{stat.value}</span>
            <span className="stat-item__label">{stat.label}</span>
          </div>
        ))}
      </div>
    </SectionPanel>
  );
}

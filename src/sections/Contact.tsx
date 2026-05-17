import { ASSETS, PROFILE, SOCIAL_LINKS } from "../data/portfolio";
import { SectionHeader } from "../components/SectionHeader";
import { SectionPanel } from "../components/SectionPanel";
import "./Contact.css";

export function Contact() {
  return (
    <SectionPanel id="contact">
      <SectionHeader sectionId="contact" />

      <p className="prose reveal">
        Un projet, un stage ou une opportunité ? Contactez-moi directement.
      </p>

      <div className="contact-grid reveal">
        <a href={`mailto:${PROFILE.emailPersonal}`} className="contact-item">
          <span className="contact-item__label mono">
            <i className="fa-solid fa-envelope" aria-hidden /> gmail
          </span>
          <span className="contact-item__value">{PROFILE.emailPersonal}</span>
        </a>
        <a href={`mailto:${PROFILE.email}`} className="contact-item">
          <span className="contact-item__label mono">
            <i className="fa-brands fa-microsoft" aria-hidden /> outlook
          </span>
          <span className="contact-item__value">{PROFILE.email}</span>
        </a>
        <a href={`tel:${PROFILE.phone.replace(/\s/g, "")}`} className="contact-item">
          <span className="contact-item__label mono">
            <i className="fa-brands fa-whatsapp" aria-hidden /> téléphone
          </span>
          <span className="contact-item__value">{PROFILE.phone}</span>
        </a>
      </div>

      <div className="contact-actions reveal">
        <a href={`mailto:${PROFILE.emailPersonal}`} className="btn btn-primary">
          Me contacter
        </a>
        <a href={ASSETS.cv} download className="btn btn-secondary">
          Télécharger mon CV
        </a>
      </div>

      <nav className="social-links reveal" aria-label="Réseaux sociaux et contact">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.id}
            href={link.href}
            className="social-link"
            title={link.label}
            aria-label={link.label}
            {...(link.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            <i className={link.icon} aria-hidden="true" />
          </a>
        ))}
      </nav>

      <footer className="site-footer reveal">
        <p className="site-footer__text mono">
          © {new Date().getFullYear()} {PROFILE.name}
        </p>
      </footer>
    </SectionPanel>
  );
}

import { SECTION_META } from "../data/portfolio";
import "./SectionHeader.css";

type SectionHeaderProps = {
  sectionId: keyof typeof SECTION_META;
  className?: string;
};

export function SectionHeader({ sectionId, className = "" }: SectionHeaderProps) {
  const meta = SECTION_META[sectionId];

  return (
    <header className={`section-header reveal ${className}`.trim()}>
      <div className="section-header__top">
        <span className="section-header__index mono">{meta.index}</span>
        <span className="section-header__role mono">{meta.role}</span>
      </div>

      <h2 id={`section-heading-${sectionId}`} className="section-header__title">
        {meta.title}
        {meta.titleAccent && (
          <>
            {" "}
            <span>{meta.titleAccent}</span>
          </>
        )}
      </h2>

      <p className="section-header__subtitle">{meta.subtitle}</p>
      <div className="section-header__line" aria-hidden />
    </header>
  );
}

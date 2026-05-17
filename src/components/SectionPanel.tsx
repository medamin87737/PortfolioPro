import { useEffect, useState, type ReactNode } from "react";
import { SCROLL_SECTIONS } from "../data/portfolio";
import { sectionStateRef } from "../hooks/useScrollProgress";
import "./SectionPanel.css";

type SectionPanelProps = {
  id: string;
  children: ReactNode;
  className?: string;
  wide?: boolean;
  hideDivider?: boolean;
};

export function SectionPanel({
  id,
  children,
  className = "",
  wide = false,
  hideDivider = false,
}: SectionPanelProps) {
  const sectionIndex = SCROLL_SECTIONS.findIndex((s) => s.id === id);
  const [isActive, setIsActive] = useState(sectionIndex === 0);

  useEffect(() => {
    const tick = () => setIsActive(sectionStateRef.activeIndex === sectionIndex);
    tick();
    const timer = setInterval(tick, 60);
    return () => clearInterval(timer);
  }, [sectionIndex]);

  return (
    <section
      id={id}
      className={`section section--${id} ${wide ? "section--wide" : ""} ${isActive ? "section--active" : ""} ${className}`.trim()}
      data-section={id}
      aria-labelledby={`section-heading-${id}`}
    >
      {!hideDivider && id !== "home" && <div className="section__divider" aria-hidden />}

      <div className="section__frame">
        <div className="section__content layout-grid">{children}</div>
      </div>
    </section>
  );
}

import { useEffect, useState, type CSSProperties } from "react";
import { NAV_LINKS } from "../data/portfolio";
import { sectionStateRef } from "../hooks/useScrollProgress";
import "./SectionNav.css";

/** Décalage léger en zigzag (comme la maquette) */
/** Zigzag vers la droite */
const STAGGER = [0, 6, 12, 8, 14, 4];

export function SectionNav() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const tick = () => setActive(sectionStateRef.activeIndex);
    tick();
    const t = setInterval(tick, 80);
    return () => clearInterval(t);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="section-nav" aria-label="Navigation des sections">
      <ol className="section-nav__list">
        {NAV_LINKS.map((link, i) => {
          const isActive = i === active;
          return (
            <li
              key={link.id}
              className={`section-nav__item ${isActive ? "section-nav__item--active" : ""}`}
              style={{ "--nav-stagger": `${STAGGER[i] ?? 0}px` } as CSSProperties}
            >
              <button
                type="button"
                className="section-nav__btn"
                onClick={() => scrollTo(link.id)}
                aria-label={link.label}
                data-label={link.label}
                aria-current={isActive ? "true" : undefined}
              >
                {isActive && (
                  <span className="section-nav__label mono">{link.label}</span>
                )}
                <span className="section-nav__dot" />
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

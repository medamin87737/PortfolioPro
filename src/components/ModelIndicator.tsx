import { useEffect, useState } from "react";
import { SCROLL_SECTIONS } from "../data/portfolio";
import { sectionStateRef } from "../hooks/useScrollProgress";
import "./ModelIndicator.css";

export function ModelIndicator() {
  const [active, setActive] = useState(0);
  const [label, setLabel] = useState<string>(SCROLL_SECTIONS[0].label);

  useEffect(() => {
    const tick = () => {
      setActive(sectionStateRef.activeIndex);
      setLabel(sectionStateRef.activeLabel);
    };
    const id = setInterval(tick, 80);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="model-indicator" aria-live="polite">
      <p className="model-indicator__title mono">Modèle 3D actif</p>
      <p className="model-indicator__label">{label}</p>
      <div className="model-indicator__dots">
        {SCROLL_SECTIONS.map((s, i) => (
          <span
            key={s.id}
            className={`model-indicator__dot ${i === active ? "model-indicator__dot--active" : ""}`}
            title={s.label}
          />
        ))}
      </div>
    </div>
  );
}

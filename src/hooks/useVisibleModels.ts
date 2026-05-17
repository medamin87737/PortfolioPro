import { useEffect, useState } from "react";
import { ASSETS, SCROLL_SECTIONS } from "../data/portfolio";
import { sectionStateRef } from "./useScrollProgress";

export type ModelKey = keyof typeof ASSETS.models;

const ALL_KEYS = [...new Set(SCROLL_SECTIONS.map((s) => s.modelKey))] as ModelKey[];

/** Sections fond vidéo — pas de modèle 3D supplémentaire */
const VIDEO_SECTION_IDS = new Set(["experience", "contact"]);

/** Modèles réellement affichés (poids de section > seuil) */
export function useVisibleModels(enabled: boolean) {
  const [visible, setVisible] = useState<Set<ModelKey>>(() => new Set(["programmer"]));

  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      const weights = sectionStateRef.weights;
      const next = new Set<ModelKey>();

      SCROLL_SECTIONS.forEach((section, i) => {
        if (VIDEO_SECTION_IDS.has(section.id)) return;
        if (weights[i] > 0.06) next.add(section.modelKey);
      });

      const active = sectionStateRef.activeIndex;
      [active - 1, active, active + 1].forEach((idx) => {
        const section = SCROLL_SECTIONS[idx];
        if (section && !VIDEO_SECTION_IDS.has(section.id)) next.add(section.modelKey);
      });

      if (next.size === 0) next.add("programmer");

      setVisible((prev) => {
        if (prev.size === next.size && [...prev].every((k) => next.has(k))) return prev;
        return next;
      });
    };

    tick();
    const id = window.setInterval(tick, 120);
    return () => clearInterval(id);
  }, [enabled]);

  return visible;
}

export { ALL_KEYS as MODEL_KEYS };

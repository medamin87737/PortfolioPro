import { useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SCROLL_SECTIONS } from "../data/portfolio";

gsap.registerPlugin(ScrollTrigger);

export const scrollProgressRef = { current: 0 };

export const sectionStateRef = {
  weights: SCROLL_SECTIONS.map((_, i) => (i === 0 ? 1 : 0)) as number[],
  activeIndex: 0,
  activeLabel: SCROLL_SECTIONS[0].label as string,
};

function computeSectionWeights(): void {
  const vh = window.innerHeight;
  const focusY = vh * 0.42;
  const weights = SCROLL_SECTIONS.map((section) => {
    const el = document.getElementById(section.id);
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    if (rect.bottom < vh * 0.05 || rect.top > vh * 0.95) return 0;
    const center = rect.top + rect.height * 0.38;
    const dist = Math.abs(center - focusY);
    const sigma = vh * 0.38;
    return Math.exp(-(dist * dist) / (2 * sigma * sigma));
  });

  const sharpened = weights.map((w) => Math.pow(w, 2.2));
  const sum = sharpened.reduce((a, b) => a + b, 0) || 1;
  const normalized = sharpened.map((w) => w / sum);

  sectionStateRef.weights = normalized;

  let best = 0;
  let bestW = 0;
  normalized.forEach((w, i) => {
    if (w > bestW) {
      bestW = w;
      best = i;
    }
  });
  sectionStateRef.activeIndex = best;
  sectionStateRef.activeLabel = SCROLL_SECTIONS[best].label;
}

export function ScrollProgressProvider({
  children,
  enabled,
}: {
  children: ReactNode;
  enabled: boolean;
}) {
  useEffect(() => {
    if (!enabled) return;

    const globalTrigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
      },
    });

    const sectionTriggers = SCROLL_SECTIONS.map((section) =>
      ScrollTrigger.create({
        trigger: `#${section.id}`,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
          sectionStateRef.activeIndex = SCROLL_SECTIONS.findIndex((s) => s.id === section.id);
          sectionStateRef.activeLabel = section.label;
        },
        onEnterBack: () => {
          sectionStateRef.activeIndex = SCROLL_SECTIONS.findIndex((s) => s.id === section.id);
          sectionStateRef.activeLabel = section.label;
        },
      }),
    );

    const onScroll = () => computeSectionWeights();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const refresh = () => {
      computeSectionWeights();
      ScrollTrigger.refresh();
    };
    refresh();
    window.addEventListener("load", refresh);

    return () => {
      globalTrigger.kill();
      sectionTriggers.forEach((t) => t.kill());
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("load", refresh);
    };
  }, [enabled]);

  return children;
}

export function useScrollProgress() {
  return scrollProgressRef;
}

export function useSectionState() {
  return sectionStateRef;
}

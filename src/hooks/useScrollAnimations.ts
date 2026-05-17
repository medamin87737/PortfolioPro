import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimations(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
            onEnter: () => el.classList.add("revealed"),
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".stagger-item").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            delay: (i % 6) * 0.06,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      ScrollTrigger.refresh();
    });

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [enabled]);
}

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ASSETS, PROFILE } from "../data/portfolio";
import { sectionStateRef } from "../hooks/useScrollProgress";
import "../components/SectionPanel.css";
import "./Hero.css";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero__top", { opacity: 0, y: 16, duration: 0.7, delay: 0.15 });
      gsap.from(".hero__title", { opacity: 0, y: 36, duration: 0.9, delay: 0.3, ease: "power4.out" });
      gsap.from(".hero__desc", { opacity: 0, y: 16, duration: 0.7, delay: 0.55 });
      gsap.from(".hero__meta > *", {
        opacity: 0,
        y: 10,
        duration: 0.5,
        stagger: 0.06,
        delay: 0.7,
      });
      gsap.from(".hero__cta .btn", {
        opacity: 0,
        y: 12,
        duration: 0.6,
        stagger: 0.08,
        delay: 0.85,
      });
      gsap.from(".hero__media", { opacity: 0, scale: 0.97, duration: 0.9, delay: 0.4 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const tick = () => setIsActive(sectionStateRef.activeIndex === 0);
    const timer = setInterval(tick, 60);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="home"
      className={`hero section section--home ${isActive ? "section--active" : ""}`}
      ref={sectionRef}
      data-section="home"
      aria-label="Accueil"
    >
      <div className="hero__frame">
        <div className="hero__grid">
          <div className="hero__content">
            <header className="hero__top">
              <span className="hero__index mono">01</span>
              <span className="hero__badge mono">
                <span className="hero__status" aria-hidden />
                Disponible
              </span>
            </header>

            <h1 className="hero__title">
              <span className="hero__name">{PROFILE.name}</span>
              <span className="hero__role">
                {PROFILE.title}
                <span className="hero__role-sep">·</span>
                {PROFILE.subtitle}
              </span>
            </h1>

            <p className="hero__desc">{PROFILE.heroTagline}</p>

            <div className="hero__meta">
              <span className="hero__location mono">{PROFILE.location}</span>
              <ul className="hero__stack" aria-label="Technologies principales">
                {PROFILE.heroStack.map((tech) => (
                  <li key={tech}>
                    <span className="hero__stack-tag mono">{tech}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hero__cta">
              <a href="#projects" className="btn btn-primary">
                Projets
              </a>
              <a href={ASSETS.cv} download className="btn btn-outline">
                CV
              </a>
            </div>
          </div>

          <figure className="hero__media">
            <video
              className="hero__video"
              src={ASSETS.video}
              autoPlay
              muted
              loop
              playsInline
            />
          </figure>
        </div>
      </div>

      <div className="hero__scroll mono" aria-hidden>
        <span>scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}

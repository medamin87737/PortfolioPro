import { useEffect, useState } from "react";
import gsap from "gsap";
import { ASSETS } from "../data/portfolio";
import "./Preloader.css";

type PreloaderProps = {
  onComplete: () => void;
};

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(100, p + Math.random() * 14 + 6);
      });
    }, 70);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 100) return;

    const tl = gsap.timeline({ onComplete });

    tl.to(".preloader__content", { opacity: 0, y: 24, duration: 0.45, ease: "power2.in" })
      .to(".preloader__overlay", { opacity: 0.9, duration: 0.35 }, "-=0.25")
      .to(".preloader", { opacity: 0, duration: 0.55, ease: "power2.inOut" })
      .set(".preloader", { display: "none" });
  }, [progress, onComplete]);

  return (
    <div className="preloader" aria-busy="true" aria-label="Chargement">
      <img
        className="preloader__poster"
        src={ASSETS.poster}
        alt=""
        fetchPriority="high"
        decoding="async"
      />
      <div className="preloader__overlay" />
      <div className="preloader__vignette" />

      <div className="preloader__content">
        <p className="preloader__label mono">initializing portfolio.exe</p>
        <h2 className="preloader__name">
          Med Amin <span>Chniti</span>
        </h2>
        <div className="preloader__bar">
          <div
            className="preloader__bar-fill"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <p className="preloader__percent mono">{Math.min(Math.floor(progress), 100)}%</p>
      </div>
    </div>
  );
}

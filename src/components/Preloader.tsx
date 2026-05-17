import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ASSETS } from "../data/portfolio";
import "./Preloader.css";

type PreloaderProps = {
  onComplete: () => void;
};

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(100, p + Math.random() * 12 + 4);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 100) return;

    const tl = gsap.timeline({ onComplete });

    tl.to(".preloader__content", { opacity: 0, y: 24, duration: 0.5, ease: "power2.in" })
      .to(".preloader__overlay", { opacity: 0.9, duration: 0.4 }, "-=0.3")
      .to(".preloader", { opacity: 0, duration: 0.7, ease: "power2.inOut" })
      .set(".preloader", { display: "none" });
  }, [progress, onComplete]);

  return (
    <div className="preloader" aria-busy="true" aria-label="Chargement">
      <video
        ref={videoRef}
        className="preloader__video"
        src={ASSETS.video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
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

import { useEffect, useState } from "react";
import { NAV_LINKS } from "../data/portfolio";
import { sectionStateRef } from "../hooks/useScrollProgress";
import type { Theme } from "../hooks/useTheme";
import "./Navbar.css";

type NavbarProps = {
  theme: Theme;
  onToggleTheme: () => void;
};

export function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const tick = () => setActiveId(NAV_LINKS[sectionStateRef.activeIndex]?.id ?? "home");
    tick();
    const t = setInterval(tick, 80);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {menuOpen && (
        <button
          type="button"
          className="navbar__backdrop"
          aria-label="Fermer le menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar__inner">
          <button type="button" className="navbar__logo mono" onClick={() => scrollTo("home")}>
            <span className="navbar__logo-bracket">&lt;</span>
            CMA
            <span className="navbar__logo-bracket">/&gt;</span>
          </button>

          <nav className={`navbar__nav ${menuOpen ? "navbar__nav--open" : ""}`} aria-label="Sections">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                className={`navbar__link ${activeId === link.id ? "navbar__link--active" : ""}`}
                onClick={() => scrollTo(link.id)}
                aria-current={activeId === link.id ? "true" : undefined}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="navbar__actions">
            <button
              type="button"
              className="navbar__theme"
              onClick={onToggleTheme}
              aria-label={theme === "dark" ? "Mode clair" : "Mode sombre"}
            >
              {theme === "dark" ? "☀" : "☾"}
            </button>
            <button
              type="button"
              className="navbar__burger"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

import { lazy, Suspense, useState } from "react";
import { Navbar } from "./components/Navbar";
import { Preloader } from "./components/Preloader";
import { SectionNav } from "./components/SectionNav";
const ScrollBackground3D = lazy(() =>
  import("./components/ScrollBackground3D").then((m) => ({ default: m.ScrollBackground3D })),
);
import { About } from "./sections/About";
import { Contact } from "./sections/Contact";
import { Experience } from "./sections/Experience";
import { Hero } from "./sections/Hero";
import { Projects } from "./sections/Projects";
import { Skills } from "./sections/Skills";
import { ScrollProgressProvider } from "./hooks/useScrollProgress";
import { useDeviceType } from "./hooks/useDeviceType";
import { useScrollAnimations } from "./hooks/useScrollAnimations";
import { useTheme } from "./hooks/useTheme";
import { PortfolioChat } from "./components/PortfolioChat";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const { theme, toggle } = useTheme();
  useDeviceType();

  useScrollAnimations(loaded);

  return (
    <>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}

      {loaded && (
        <ScrollProgressProvider enabled>
          <Suspense fallback={null}>
            <ScrollBackground3D enabled />
          </Suspense>
          <Navbar theme={theme} onToggleTheme={toggle} />
          <SectionNav />
          <main className="site-main app-interface">
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Contact />
          </main>
          <PortfolioChat theme={theme} />
        </ScrollProgressProvider>
      )}
    </>
  );
}

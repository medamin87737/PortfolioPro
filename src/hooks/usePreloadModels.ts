import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { ASSETS } from "../data/portfolio";
import type { ModelKey } from "./useVisibleModels";

const DEFERRED: ModelKey[] = ["hack", "icon", "hackerRoom"];

/** Précharge d'abord l'accueil, puis les autres en différé */
export function usePreloadModels() {
  useEffect(() => {
    useGLTF.preload(ASSETS.models.programmer);

    const preloadRest = () => {
      DEFERRED.forEach((key) => useGLTF.preload(ASSETS.models[key]));
    };

    const ric = globalThis.requestIdleCallback;
    if (typeof ric === "function") {
      const id = ric(preloadRest, { timeout: 4000 });
      return () => globalThis.cancelIdleCallback(id);
    }

    const timer = globalThis.setTimeout(preloadRest, 2500);
    return () => globalThis.clearTimeout(timer);
  }, []);
}

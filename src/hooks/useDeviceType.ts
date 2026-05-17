import { useEffect, useState } from "react";

export type DeviceType = "mobile" | "tablet" | "laptop" | "desktop";

function getDeviceType(width: number): DeviceType {
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  if (width < 1280) return "laptop";
  return "desktop";
}

export function useDeviceType() {
  const [device, setDevice] = useState<DeviceType>(() =>
    typeof window !== "undefined" ? getDeviceType(window.innerWidth) : "desktop",
  );

  useEffect(() => {
    const update = () => {
      const next = getDeviceType(window.innerWidth);
      setDevice(next);
      document.documentElement.dataset.device = next;
    };

    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return device;
}

export function getAdaptiveDpr(width: number): number {
  if (width < 640) return 1;
  if (width < 1024) return 1.1;
  return Math.min(1.35, window.devicePixelRatio);
}

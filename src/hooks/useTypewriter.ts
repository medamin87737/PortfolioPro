import { useEffect, useState } from "react";

type Options = {
  /** ms entre chaque caractère */
  speed?: number;
  /** délai avant de commencer */
  delay?: number;
};

export function useTypewriter(text: string, enabled: boolean, options: Options = {}) {
  const { speed = 16, delay = 0 } = options;
  const [displayed, setDisplayed] = useState(enabled ? "" : text);
  const [done, setDone] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    setDisplayed("");
    setDone(false);
    let index = 0;
    let intervalId: number | undefined;
    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          if (intervalId) clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, enabled, speed, delay]);

  return { displayed, done };
}

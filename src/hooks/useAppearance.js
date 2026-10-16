import { useCallback, useEffect, useState } from "react";
import { readLocal, writeLocal } from "../utils/localData";

const APPEARANCE_KEY = "noorhub_appearance";
const APPEARANCES = ["light", "sepia", "dark"];

function isAppearance(value) {
  return APPEARANCES.includes(value);
}

/**
 * Reading appearance. Light (parchment) is the default; sepia and dark are the
 * deliberate reading appearances. Persisted on the device and mirrored onto
 * <html data-appearance> so the design tokens switch everywhere at once.
 */
export function useAppearance() {
  const [appearance, setAppearance] = useState(() => {
    const stored = readLocal(APPEARANCE_KEY, null);
    return isAppearance(stored) ? stored : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.appearance = appearance;
    writeLocal(APPEARANCE_KEY, appearance);

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute(
        "content",
        appearance === "dark" ? "#15221D" : appearance === "sepia" ? "#F4ECDD" : "#F7F5EF",
      );
    }
  }, [appearance]);

  const cycleDarkMode = useCallback(() => {
    setAppearance((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return { appearance, setAppearance, cycleDarkMode };
}

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../utils/api";
import { REFLECTION_REFS } from "../data/defaults";

const REFLECTION_CACHE_KEY = "noorhub_reflection_cache";

/** Reference for the current day, rotating through a fixed list. */
function referenceForDay(date = new Date()) {
  const dayIndex = Math.floor(date.getTime() / 86400000) % REFLECTION_REFS.length;
  return REFLECTION_REFS[dayIndex];
}

function readCache() {
  try {
    const raw = localStorage.getItem(REFLECTION_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeCache(cache) {
  try {
    const trimmed = Object.fromEntries(Object.entries(cache).slice(-12));
    localStorage.setItem(REFLECTION_CACHE_KEY, JSON.stringify(trimmed));
  } catch {
    /* the cache is an enhancement only */
  }
}

/**
 * Verse of the day. The reference comes from a fixed list; the Arabic text,
 * translation, transliteration and audio are always fetched from the Quran API
 * (with an offline cache) so the panel never shows an invented verse.
 */
export function useDailyReflection() {
  const [state, setState] = useState({ status: "loading", verse: null });
  const [nonce, setNonce] = useState(0);
  const cacheRef = useRef(readCache());
  const reference = referenceForDay();

  const load = useCallback(() => setNonce((value) => value + 1), []);

  useEffect(() => {
    let cancelled = false;

    const cached = cacheRef.current[reference];
    if (cached) {
      setState({ status: "ready", verse: cached });
      return () => {
        cancelled = true;
      };
    }

    api
      .getAyah(reference)
      .then((verse) => {
        if (cancelled) return;
        cacheRef.current = { ...cacheRef.current, [reference]: verse };
        writeCache(cacheRef.current);
        setState({ status: "ready", verse });
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Failed to load daily reflection:", error);
        setState({ status: "error", verse: null });
      });

    return () => {
      cancelled = true;
    };
  }, [reference, nonce]);

  return { ...state, retry: load, reference };
}

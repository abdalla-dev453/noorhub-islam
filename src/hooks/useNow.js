import { useEffect, useState } from "react";

/**
 * A clock that ticks on an interval. Used for prayer countdowns so the
 * interface stays honest about how much time is left.
 */
export function useNow(intervalMs = 30000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}

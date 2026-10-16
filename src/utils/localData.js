export function readLocal(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function writeLocal(key, value) {
  if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(value));
}

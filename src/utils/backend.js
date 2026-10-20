const configuredBase = import.meta.env.VITE_API_BASE?.trim().replace(/\/$/, "");
const backendBase = configuredBase || (import.meta.env.DEV
  ? "http://localhost:5000"
  : "https://noorhub-islam.onrender.com");

export function backendUrl(path) {
  return `${backendBase}${path}`;
}

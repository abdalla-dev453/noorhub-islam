export function getVideoSourceConfig(sourceUrl) {
  if (!sourceUrl) return null;

  const trimmed = sourceUrl.trim();
  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { type: "video", src: trimmed };
  }
  const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
  const isYouTube = ["youtube.com", "m.youtube.com", "youtube-nocookie.com", "youtu.be"].includes(host);
  if (isYouTube && parsed.pathname === "/results") {
    return { type: "youtube-search", src: trimmed };
  }

  let videoId = "";
  if (host === "youtu.be") videoId = parsed.pathname.slice(1).split("/")[0];
  else if (parsed.pathname === "/watch") videoId = parsed.searchParams.get("v") || "";
  else videoId = parsed.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] || "";

  if (isYouTube && /^[\w-]{11}$/.test(videoId)) {
    const origin = typeof window !== "undefined" ? `&origin=${encodeURIComponent(window.location.origin)}` : "";
    return {
      type: "youtube",
      videoId,
      watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0${origin}`,
    };
  }

  return {
    type: "video",
    src: trimmed,
  };
}

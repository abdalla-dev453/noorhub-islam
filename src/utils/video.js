export function getVideoSourceConfig(sourceUrl) {
  if (!sourceUrl) return null;

  const trimmed = sourceUrl.trim();
  const youtubeMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i,
  );

  if (youtubeMatch) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0&modestbranding=1`,
    };
  }

  return {
    type: "video",
    src: trimmed,
  };
}

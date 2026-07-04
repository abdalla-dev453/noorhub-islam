export function filterNarrations(narrations, search, limit) {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return narrations.slice(0, limit);
  }

  return narrations
    .filter((item) => {
      const text = item.text?.toLowerCase() ?? "";
      return (
        text.includes(normalizedSearch) ||
        item.id.toString() === normalizedSearch
      );
    })
    .slice(0, limit);
}

export function getNarrationMatchCount(narrations, search) {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return narrations.length;
  }

  return narrations.filter((item) => {
    const text = item.text?.toLowerCase() ?? "";
    return (
      text.includes(normalizedSearch) || item.id.toString() === normalizedSearch
    );
  }).length;
}

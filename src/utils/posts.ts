export const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// About 200 words per minute, never less than 1
export const readMinutes = (text: string) =>
  Math.max(1, Math.round(text.trim().split(/\s+/).length / 200));

// Short plain-text summary, e.g. for the meta description (search engines show ~155 chars)
export const excerpt = (text: string, max = 155) => {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
};

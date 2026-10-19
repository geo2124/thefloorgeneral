export const seo = (title: string, description: string) => ({
  meta: [
    { title: `${title} · The Floor Manager (TFG)` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} · The Floor Manager (TFG)` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});

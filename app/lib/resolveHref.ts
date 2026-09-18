import { slugConfigs } from "./categoryConfig";

export function resolveHref(catName: string): string {
  const name = catName?.trim();
  if (!name) return "/";

  if (
    name.toLowerCase().includes("سماعات") ||
    name.toLowerCase() === "speaker" ||
    name.toLowerCase() === "earbuds"
  )
    return "/audio";

  if (name === "اكسسورات") return "/games";
  if (name.includes("بطاريات")) return "/accessories/anker-batteries";

  for (const [slug, config] of Object.entries(slugConfigs)) {
    const parent = config.parentHref.replace(/^\//, "").split("/")[0];
    const path = `/${parent}/${slug}`;
    if (config.filters.category && config.filters.category === name) return path;
    if (
      config.filters.nameIncludes?.some((kw) =>
        name.toLowerCase().includes(kw.toLowerCase())
      )
    )
      return path;
  }

  return `/search?q=${encodeURIComponent(name)}`;
}

module.exports = function (eleventyConfig) {
  // Pass static assets through untouched
  eleventyConfig.addPassthroughCopy("static");

  // Serve skill.md at the root URL (/skill.md)
  eleventyConfig.addPassthroughCopy({ "static/skill.md": "skill.md" });

  // Task definitions are for agents only — never render them as pages
  eleventyConfig.ignores.add("content/_tasks");

  // Allow raw HTML inside markdown files
  const markdownIt = require("markdown-it");
  const md = markdownIt({ html: true, linkify: true, typographer: true });
  eleventyConfig.setLibrary("md", md);

  // ── Filters ──────────────────────────────────────────────────

  // Human-readable date: "Apr 27, 2026"
  eleventyConfig.addFilter("dateFormat", (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  });

  // ISO date for <time> elements: "2026-04-27"
  eleventyConfig.addFilter("dateISO", (date) => {
    return new Date(date).toISOString().split("T")[0];
  });

  // Plain-text excerpt: grabs first <p>, strips tags, truncates to 220 chars
  eleventyConfig.addFilter("excerpt", (content) => {
    if (!content) return "";
    const pMatch = content.match(/<p[^>]*>([\s\S]*?)<\/p>/);
    const raw = pMatch ? pMatch[1] : content;
    const text = raw
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text.length > 220 ? text.slice(0, 220).trimEnd() + "…" : text;
  });

  // Derive section name from a page URL: "/games/foo/" → "games"
  eleventyConfig.addFilter("section", (url) => {
    const parts = url.split("/").filter(Boolean);
    return parts.length > 1 ? parts[0] : null;
  });

  // ── Collections ───────────────────────────────────────────────

  // All content pages sorted newest first (excludes indexes + search)
  eleventyConfig.addCollection("recent", function (api) {
    return api
      .getAll()
      .filter((item) => {
        const slug = item.fileSlug;
        const path = item.inputPath;
        return (
          slug !== "index" && slug !== "search" && !path.includes("_tasks")
        );
      })
      .sort((a, b) => b.date - a.date);
  });

  // Featured items collection
  eleventyConfig.addCollection("featured", function (api) {
    return api
      .getAll()
      .filter((item) => {
        const slug = item.fileSlug;
        const path = item.inputPath;
        return (
          slug !== "index" &&
          slug !== "search" &&
          !path.includes("_tasks") &&
          item.data.featured
        );
      })
      .sort((a, b) => b.date - a.date);
  });

  // Non-featured items collection (excludes featured items)
  eleventyConfig.addCollection("nonFeatured", function (api) {
    return api
      .getAll()
      .filter((item) => {
        const slug = item.fileSlug;
        const path = item.inputPath;
        return (
          slug !== "index" &&
          slug !== "search" &&
          !path.includes("_tasks") &&
          !item.data.featured
        );
      })
      .sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: "content",
      includes: "../templates",
      output: "_site",
    },
    templateFormats: ["md", "html", "njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};

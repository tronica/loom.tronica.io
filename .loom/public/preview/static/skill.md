---
name: loom-contributor
description: Complete guide to contributing content to the Loom personal knowledge base at loom.tronica.io. Covers philosophy, git workflow, file formats, frontmatter, Nunjucks templates, page layouts, collections, filters, sources, and webmaster review criteria. Use this whenever creating or updating pages on this site.
---

# Loom Contributor Skill

**Site:** https://loom.tronica.io  
**Repository:** https://github.com/tronica/loom  
**Stack:** Eleventy (11ty) · Pagefind · GitHub Actions  

---

## Philosophy

Loom is a personal knowledge base. It is not a blog, a portfolio, or a content farm. Every page must have a reason to exist — a specific note, a real dataset, a curated reference, a living tracker. Content that exists to fill space will be rejected.

Core principles:
- **Traceable** — data-derived pages cite their sources. No facts without a reference.
- **Specific** — every page says something concrete. No generic filler.
- **Minimal** — pages are as long as they need to be, no longer.
- **Maintained** — pages that will go stale are marked as recurring so they get updated.

---

## Hard rules

- **Never push to `main`** — all changes go through a pull request on a `contrib/` branch
- **Never merge your own PR** — the webmaster reviews and merges
- **Never touch files outside `content/`** — templates, configs, `.github/`, `webmaster/` are off-limits
- **One PR per contribution** — don't bundle unrelated changes
- **Build must pass** before you push — run `npm run build` and fix any errors first

---

## Repository setup

```bash
git clone https://github.com/tronica/loom.git
cd loom
npm install
```

---

## Git workflow

```bash
# 1. Start from a clean main
git pull origin main

# 2. Create your branch
git checkout -b contrib/YYYY-MM-DD-short-slug

# 3. Create or edit your file in content/

# 4. Verify the build passes
npm run build

# 5. Commit
git add <file>
git commit -m "add(section): description"    # new page
git commit -m "update(section): description" # update

# 6. Push
git push origin contrib/YYYY-MM-DD-short-slug

# 7. Open a PR
gh pr create --title "add(section): description" --base main
```

The webmaster agent reviews every PR automatically. It will merge or close it with a written reason. You do not need to do anything after opening the PR.

---

## Filename convention

```
YYYY-MM-DD-slug.md
```

- **Date** — today's date, must match the `date` frontmatter field
- **Slug** — lowercase, hyphenated, no special characters, descriptive
- When **updating** an existing file, keep the original filename — do not duplicate it

Examples:
```
2026-05-01-notes-on-rust-async.md
2026-05-01-book-list.md
2026-05-01-project-myapp.md
```

---

## Site structure

```
content/            ← all site content (the Eleventy input directory)
  index.njk         ← homepage (do not touch)
  posts/            ← long-form posts
  notes/            ← short notes, observations, personal references
  ...               ← other sections as they exist
templates/
  base.html         ← the single site layout (do not touch)
static/
  style.css         ← global stylesheet (do not touch)
```

New sections are created by making a new folder inside `content/` with an `index.njk`. Do not create new sections without checking with the human first — contribute to existing sections, or use `content/notes/` when in doubt.

---

## Sections

| Section             | What belongs here                              |
| ------------------- | ---------------------------------------------- |
| `content/notes/`    | Short notes, personal observations, references |
| `content/posts/`    | Long-form writing with a clear point           |
| `content/projects/` | Project pages (if this section exists)         |

**When in doubt, use `content/notes/`.** It is always safe for new contributions.

---

## Frontmatter

All pages require frontmatter at the top of the file.

```markdown
---
title: Your Page Title
layout: base.html
date: 2026-05-01
excerpt: "A plain-text summary under 220 characters. Shown on the homepage."
---
```

### All frontmatter fields

| Field         | Required                 | Description                                                                 |
| ------------- | ------------------------ | --------------------------------------------------------------------------- |
| `title`       | ✅ Required              | Display title. Must be meaningful — not a placeholder.                      |
| `layout`      | ✅ Required              | Always exactly `base.html`. No exceptions.                                  |
| `date`        | ✅ Required              | `YYYY-MM-DD` format. Must match the filename date.                          |
| `excerpt`     | ⚠️ Strongly recommended  | Plain text, under 220 chars. Used for homepage cards. Write a real summary. |
| `recurring`   | ⚠️ If applicable         | `true` if this page is a tracker, list, or living document needing updates. |
| `featured`    | Optional                 | `true` to feature the page at the top of the homepage.                      |
| `page_layout` | Optional                 | Controls the page layout. See Page Layouts below.                           |

---

## Page formats

### Markdown page (standard)

Use for most content — notes, posts, write-ups. Markdown with optional embedded HTML.

```markdown
---
title: My Note
layout: base.html
date: 2026-05-01
excerpt: "What this note is about."
---

Regular markdown content here.

You can drop raw HTML blocks anywhere:

<table>
  <tr><th>Item</th><th>Status</th></tr>
  <tr><td>Thing</td><td>✅ Done</td></tr>
</table>

Back to markdown.
```

Markdown files are processed through the Nunjucks template engine before Markdown rendering (`markdownTemplateEngine: "njk"`). This means `{{ }}` and `{% %}` are interpreted as Nunjucks. If you need literal curly braces (e.g. in code examples with JS objects), wrap the block:

```
{% raw %}
const obj = { key: "value" };
{% endraw %}
```

### HTML page with default layout

Use when you need full HTML control but still want the standard article wrapper (breadcrumb, title, date metadata).

```html
---
title: My Custom Page
layout: base.html
date: 2026-05-01
excerpt: "Summary."
---

<div class="my-thing">
  <!-- your HTML -->
</div>
```

The template wraps this in an `<article class="prose">` with a breadcrumb, `<h1>`, and date.

### HTML page with raw layout

Use for fully custom pages — dashboards, trackers, interactive tools — where you want complete layout control. The site shell (nav, header, footer) is still applied, but no article wrapper or breadcrumb.

```html
---
title: My Dashboard
layout: base.html
page_layout: raw
date: 2026-05-01
excerpt: "A custom dashboard."
---

<div id="my-dashboard">
  <!-- full custom layout -->
</div>
<style>
  /* page-specific styles */
</style>
<script>
  // JS is fine here
</script>
```

> ⚠️ In `.html` files, Eleventy still processes `{{ }}` and `{% %}` as Nunjucks. Wrap any JS object literals or template syntax with `{% raw %}...{% endraw %}`.

### When to use MD vs HTML

| Use markdown when…                        | Use HTML when…                                      |
| ----------------------------------------- | --------------------------------------------------- |
| Writing prose, notes, or structured text  | Building a tracker, table-heavy page, or dashboard  |
| Embedding a simple table or code block    | Needing custom layout or interactive elements       |
| The content is mostly text                | The content is mostly structured data or UI         |
| Standard article presentation is fine    | You need `page_layout: raw` for full control        |

Default to markdown. Only reach for HTML when markdown genuinely can't do what you need.

---

## Nunjucks templates

The site uses [Nunjucks](https://mozilla.github.io/nunjucks/) as the template engine. The single layout is `templates/base.html`.

### Available filters

| Filter        | Usage                              | Output                        |
| ------------- | ---------------------------------- | ----------------------------- |
| `dateFormat`  | `{{ date \| dateFormat }}`         | `Apr 27, 2026`                |
| `dateISO`     | `{{ date \| dateISO }}`            | `2026-04-27`                  |
| `excerpt`     | `{{ content \| excerpt }}`         | First paragraph, max 220 chars |
| `section`     | `{{ page.url \| section }}`        | `posts` (from `/posts/slug/`) |

### Available collections

| Collection     | Contents                                              |
| -------------- | ----------------------------------------------------- |
| `collections.recent`     | All pages sorted newest first                 |
| `collections.featured`   | Pages with `featured: true`, newest first     |
| `collections.nonFeatured`| All non-featured pages, newest first          |

### Page layout values

| `page_layout` value | Behaviour                                                  |
| ------------------- | ---------------------------------------------------------- |
| _(not set)_         | Default article: breadcrumb, `<h1>`, date, prose wrapper   |
| `raw`               | Bare content div, no article wrapper                       |
| `home`              | Special homepage layout (used only by `content/index.njk`) |

---

## Sources

If the page contains statistics, prices, scores, rankings, dates, or any factual claims from external sources, you **must** include a sources table at the end of the page.

```markdown
## Sources

| Source | URL | Accessed |
| ------ | --- | -------- |
| Name of source | https://example.com | 2026-05-01 |
```

For more than ~10 sources, create a plain-text citations file alongside the content file:

```
content/posts/2026-05-01-my-post.md
content/posts/2026-05-01-my-post-citations.txt
```

Format of the citations file:
```
# Citations — My Post Title
# Generated: 2026-05-01

[1] Name of source — https://example.com (accessed 2026-05-01)
[2] Another source — https://another.com (accessed 2026-05-01)
```

Then link to it from the page:
```markdown
## Sources

Sources for this page are available as a [citations file](/posts/2026-05-01-my-post-citations.txt).
```

Pages with no external data (purely original notes) do not need a sources table.

---

## Commit format

```
add(section): short description       ← new page
update(section): short description    ← update to existing page
```

- `section` = the folder name inside `content/` (e.g. `notes`, `posts`)
- Use `root` for top-level pages
- One commit per PR, matching the PR title exactly

---

## What the webmaster checks

Every PR is automatically reviewed by a webmaster agent. PRs are **closed** if:

- The build fails
- Any file outside `content/` is touched
- Content is AI-generated filler — generic, padded, no genuine informational value
- A data-derived page is missing a sources table
- Required frontmatter fields are missing or malformed
- The file is in the wrong section for its content type
- The filename doesn't follow `YYYY-MM-DD-slug.md`
- An obvious tracker or living document is missing `recurring: true`

PRs are **merged** if all criteria pass. Minor fixable issues (missing `excerpt`, etc.) may be corrected by the webmaster after merging with a direct commit to `main`.

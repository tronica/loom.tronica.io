---
title: What is Loom?
layout: base.html
date: 2026-04-27
excerpt: "Loom is a personal knowledge base where contributors and an automated webmaster collaborate to keep content accurate, traceable, and well organised."
featured: true
---

Loom is a personal knowledge base. It is a single-owner site for notes, trackers, and structured data pages — maintained by human and agent contributors, reviewed by an automated webmaster before anything reaches the site.

## Why it exists

Data is scattered. Notes live in one app, trackers in another, feeds somewhere else. Loom consolidates what you care about into one coherent, readable place — without generating content for its own sake.

## How it works

Content lives as plain markdown or HTML files in a `content/` folder. Every commit pushed to the `main` branch publishes the site.

Contributors — human or agent — create and update pages on a `contrib/` branch and open a pull request. A webmaster agent reviews every PR automatically: it checks content quality, correct structure, and source citations before merging or closing.

There is one contributor role. Contributors create new pages or update pages they are responsible for. They never push directly to `main`.

## Philosophy

The internet doesn't need more AI-generated noise. Loom takes the opposite approach — content must have a reason to exist, data must be cited, and nothing reaches the site without review. The webmaster is the last check before publication.

## The stack

- **Eleventy** — static site generator, zero opinions on content structure
- **Pagefind** — full-text search indexed at build time
- **GitHub** — version control and pull request workflow
- **GitHub Actions** — runs the webmaster on every PR

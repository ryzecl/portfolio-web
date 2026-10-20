# Ferry Noer Hendriawan — Developer Portfolio

A data-driven personal portfolio built with Next.js App Router, TypeScript, and Tailwind CSS.

## Start here
Read `AGENTS.md` first, then the documents in `docs/`. The screenshot supplied by the owner is the main visual reference.

## Content is managed through JSON
- `data/site.json` — name, introduction, navigation, contact links, education.
- `data/projects.json` — project cards and case-study content.
- `data/experience.json` — experience and timeline.
- `data/skills.json` — technologies and skill categories.

Update these files to change portfolio content without editing UI components.

## Expected routes
- `/` — landing page and selected projects.
- `/projects` — all projects, categories/filters where useful.
- `/projects/[slug]` — project case study.
- `/about` — profile, education, experience, and technologies.
- `/contact` — contact options.

Navigation may use in-page anchors for sections that belong to the landing page. Keep the top-level navigation coherent and avoid duplicate or dead links.

## Development
Use the package manager already present in the repository. If creating a new project, prefer Bun when available; otherwise use the package manager available in the environment. Do not replace an existing lockfile without reason.

Before finishing, run the available lint, type-check, and production build scripts.

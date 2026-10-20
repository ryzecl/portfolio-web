# Content Schema

The JSON files are the source of truth for portfolio content. Keep these shapes typed in TypeScript.

## `data/site.json`
Contains identity, navigation, introduction, education, and contact links. Use empty strings or omit optional links when unknown. Never invent URLs.

## `data/projects.json`
Top-level object with a `projects` array. Each project supports:
- `slug`: unique URL-safe identifier.
- `title`, `summary`, `description`.
- `category`, `status`, `year`, `role`.
- `featured`: boolean.
- `technologies`: string array.
- `highlights`: string array of features that are actually implemented.
- `problem`, `solution`, `contribution`, `challenges`, `learnings`: strings or arrays as appropriate.
- `architecture`: optional explanatory text or diagram nodes/steps.
- `coverImage`: optional path/URL to 1 main cover image.
- `previewImages`: optional array of image paths for the interactive detail slider/carousel.
- `links`: optional `demo` (online live preview) and `repository` (source code repository). If populated, the UI renders the respective button; if empty/omitted, the UI hides it completely.
- `visual`: metadata such as `type` (for fallback wireframe preview) and `alt`.
- `gallery`: optional backward-compatible image array.

Unknown facts must remain blank or be marked with a TODO. Never generate fake statistics.

## `data/experience.json`
Top-level object with an `experiences` array. Each entry has organization, role, type, dates, summary, responsibilities, technologies, and optional URL. Use editable placeholders for unknown dates.

## `data/skills.json`
Top-level object with a `groups` array. Each group has a title and technologies. Optional `priority` can be used to order groups. Do not store percentage ratings.

## Editing rules
- Keep JSON valid.
- Use double quotes.
- Do not add comments or trailing commas.
- Keep project slugs stable once published.
- If a new project is added, make sure it appears on `/projects` and can open its detail page.
- Only feature projects with confirmed, useful content.

# Technical Guide

## Stack
- Next.js App Router.
- TypeScript with strict mode.
- Tailwind CSS (use the version and configuration appropriate to the existing repository; for a new app, Tailwind CSS v4 is preferred).
- Local JSON files as the single source of editable portfolio content.
- Use the existing package manager and lockfile. For a new repository, prefer Bun if installed.

Do not add a backend, database, CMS, Context7 dependency, or remote content API for this project.

## Architecture principles
- Keep route files thin; use reusable components.
- Read JSON through a small typed data-access layer.
- Define TypeScript types for site, project, experience, and skill data.
- Use stable project slugs for detail routes.
- Prefer Server Components by default. Add Client Components only where interaction requires them (mobile menu, filtering, etc.).
- Use semantic HTML and accessible controls.
- Avoid unnecessary dependencies.

## Suggested structure
Adapt to the current repository instead of forcing this exact tree if it already has a good structure.

```text
app/
  layout.tsx
  page.tsx
  globals.css
  about/page.tsx
  projects/page.tsx
  projects/[slug]/page.tsx
  contact/page.tsx
components/
  layout/
    site-header.tsx
    mobile-nav.tsx
    site-footer.tsx
  sections/
    hero-section.tsx
    featured-projects.tsx
    about-preview.tsx
    tech-stack.tsx
    contact-cta.tsx
  projects/
    project-card.tsx
    project-preview.tsx
    project-filters.tsx
    case-study-section.tsx
  ui/
    button.tsx
    section-heading.tsx
lib/
  data.ts
  types.ts
data/
  site.json
  projects.json
  experience.json
  skills.json
docs/
  ...
```

## JSON data
- Keep editable copy, links, navigation labels, project metadata, technology lists, experience entries, and skill categories in `data/*.json`.
- Do not duplicate project descriptions in multiple TSX files.
- Avoid importing JSON into many components directly. Centralize data access in `lib/data.ts`.
- Validate slugs and handle unknown project routes with `notFound()`.
- Optional links should be omitted from the UI if empty, invalid, or clearly marked as TODO.
- Use an explicit `featured` boolean and `status` field to control project presentation.
- Store project features as arrays, not comma-separated strings.
- Keep gallery items and links as arrays.
- No secrets or private client information in JSON.

## Routing and SEO
- Use Next.js metadata API for title, description, Open Graph basics, and per-project metadata.
- Generate metadata for project detail pages from JSON data.
- Add sitemap/robots only when appropriate and do not expose private CMS/admin pages or private client routes.
- Ensure unknown slugs show a proper 404.
- Avoid promising SEO results; implement technical fundamentals.

## Styling
- Define design tokens centrally in `app/globals.css` or the current Tailwind theme mechanism.
- Use Tailwind utilities for layout and responsive behavior.
- Prefer CSS for local visual effects rather than installing an animation library by default.
- Avoid giant one-off class strings when a reusable component is appropriate.
- Keep focus styles visible.

## Quality checks
Run the scripts available in package.json:
- lint
- type check, if defined
- production build

Fix errors caused by the implementation. Report commands that could not run and why.

# Technical Architecture Guide

## 1. Core Stack
- **Framework**: Next.js 16.4+ (App Router, Turbopack, React 19).
- **Runtime & Package Manager**: **Bun** strictly (`bun`, `bun run`, `bun add`).
- **Language**: TypeScript with strict mode (`strict: true`, zero build errors).
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`, CSS-first configuration via `@theme`) with daisyUI v5 plugin.
- **Typography**:
  - Primary Sans: `Plus Jakarta Sans` (`--font-sans` loaded via `next/font/google`).
  - Monospace: `JetBrains Mono` (`--font-mono`).
- **Animation & Motion**:
  - GSAP 3 with ScrollTrigger (`start: 'top 85%'`, `toggleActions: 'play none none reverse'`, `power3.out`).
  - React Bits creative UI components (VelocityScroll, GradualBlur).
  - Three.js / OGL WebGL simulations (3D Lanyard Card & LiquidEther background).
- **Content Storage**: Local JSON files (`data/*.json`) accessed via typed data layer (`lib/data.ts`).
  - No database, no headless CMS dependency, no external content APIs.

---

## 2. Architecture Principles
- **Server Components by Default**: Pages (`/`, `/about`, `/projects`, `/projects/[slug]`, `/contact`) are statically pre-rendered (SSG / Static).
- **Client Components for Interactivity**: Client-side boundaries (`'use client'`) are reserved strictly for interactive modules (Mobile Menu, Project Filters, Project Media Viewer Carousel, GSAP ScrollTrigger context, and GitHub calendar heatmap).
- **Single Source of Truth**: All editable text, projects, skills, education, and links live in `data/*.json`. Components never hardcode project descriptions or external URLs.
- **Resilient Data Fetching**:
  - GitHub calendar uses an internal Next.js Route Handler (`app/api/github-contributions/route.ts`) querying GitHub's public contribution graph with an in-memory 1-hour cache and an SVG heatmap renderer (`components/ui/github-calendar-card.tsx`), preventing third-party proxy downtime.
- **Scalable Media Showcase**:
  - `ProjectMediaViewer` component (`components/projects/project-media-viewer.tsx`) handles single covers, multi-screenshot galleries, contextual slide badges, keyboard arrow navigation, and mobile touch swiping.
- **Non-Cramped Architecture Pipeline**:
  - `Pipeline & Component Topology` uses a responsive horizontal architecture scroller (`overflow-x-auto` with fixed node widths `w-56 sm:w-64` and `--[ → ]--` connectors) to prevent card squeezing on desktop or mobile.

---

## 3. Directory Structure

```text
app/
  layout.tsx                     # Root layout, Google Fonts (Plus Jakarta Sans & JetBrains Mono), SEO meta
  page.tsx                       # Homepage (Hero, Velocity Scroll, About Me, Featured 4, Exp/Edu, TechStack)
  globals.css                    # Tailwind v4 theme tokens, color definitions, scrollbar behavior
  about/page.tsx                 # Detailed biography, timeline, education, and tooling matrix
  contact/page.tsx               # Direct contact channels and message form
  projects/page.tsx              # Filterable portfolio catalog with category tabs
  projects/[slug]/page.tsx       # In-depth case study, interactive media carousel, architecture scroller
  api/
    github-contributions/route.ts# Resilient route handler fetching GitHub contribution counts and SVG cells
components/
  layout/
    site-header.tsx              # Sticky navigation header with mobile drawer
    site-footer.tsx              # Minimalist footer with copyright & closing quote
  sections/
    hero-section.tsx             # Interactive hero banner with status badge and quick CTAs
    velocity-divider.tsx         # Marquee ticker divider between hero and about
    about-me-section.tsx         # 2-column editorial card with 3D Lanyard identity badge
    featured-projects.tsx        # 2x2 grid displaying top 4 featured projects
    experience-education-section.tsx # Timeline for work experience and university achievements
    tech-stack.tsx               # Bi-directional infinite marquee pill ribbons + GitHub calendar
    contact-cta.tsx              # LiquidEther backdrop call-to-action banner
  projects/
    project-card.tsx             # Standard 16:10 project preview card with hover effects
    project-filters.tsx          # Category filter buttons (All, Web App, Company Profile, Mobile App)
    project-media-viewer.tsx     # Multi-image screenshot viewer with thumbnail track and counters
    project-preview.tsx          # Architectural SVG schematics for fallback previews
  ui/
    button.tsx                   # Accessible button component with polymorphic variants
    badge.tsx                    # Outline, secondary, accent, and success badge pills
    card.tsx                     # Semantic card wrapper with header, title, and content slots
    tech-icon.tsx                # Centralized official SVG logo mapping for 25+ technologies
    github-calendar-card.tsx     # Native 53-week SVG contribution heatmap
    gradual-blur.tsx             # Viewport edge blur gradient
lib/
  data.ts                        # Typed data access layer with memoized filtering and slug resolution
  types.ts                       # Complete TypeScript interfaces for JSON schemas
  utils.ts                       # Classnames utility (clsx + twMerge)
data/
  site.json                      # Identity, hero, navigation, education, and contact
  projects.json                  # All 5 portfolio project case studies
  experience.json                # Professional experience timeline
  skills.json                    # Technology categorization matrix
public/
  images/
    projects/
      brava-compro/              # Brava company profile screenshots
      brava-cms/                 # Brava CMS dashboard, SEO, and login screenshots
      sm-sport-center/           # SM Sport Center booking screenshots
      point-of-sale/             # Point of Sale management platform screenshots
      donelock/                  # DoneLock mobile productivity screenshots
```

---

## 4. Quality & Build Commands

All operations must use **Bun**:

```bash
# Install dependencies
bun install

# Run development server with Turbopack
bun run dev

# Run TypeScript typecheck (zero tolerance for errors)
bun run type-check

# Run ESLint linting
bun run lint

# Build optimized production bundle
bun run build
```

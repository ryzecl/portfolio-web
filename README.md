# Ferry Noer Hendriawan — Developer Portfolio

A fast, accessible, data-driven personal developer portfolio engineered with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **daisyUI v5**.

Built with an editorial design direction: near-black canvas, crisp typography in **Plus Jakarta Sans**, cobalt-blue accents, and rich technical case studies powered entirely by local JSON files.

---

## ⚡ Quick Start

This project uses **[Bun](https://bun.sh/)** as the strict package manager and JavaScript runtime.

```bash
# 1. Install dependencies
bun install

# 2. Run local development server (with Turbopack)
bun run dev

# 3. Type-check TypeScript code
bun run type-check

# 4. Lint code with ESLint
bun run lint

# 5. Build for production (SSG static export)
bun run build
```

---

## 🚀 Projects Showcase

| Project | Category | Tech Stack | Highlights |
| :--- | :--- | :--- | :--- |
| **[Brava](https://brava.id)** | Company Profile | Next.js, TS, Tailwind CSS | Live corporate website, responsive layout, lead capture |
| **[Brava CMS](/projects/brava-cms)** | Web Application | Laravel 13, MySQL, Tailwind, Pest | Headless CMS, REST API, auto cache purging, dynamic SEO |
| **[SM Sport Center](/projects/sm-sport-center)** | Web Application | Laravel 13, Tailwind, Midtrans, Vite | Court booking, anti-double booking locks, Midtrans Snap & webhook |
| **[Point of Sale](/projects/point-of-sale)** | Web Application | Laravel 13, Inertia.js, React, Spatie | Full-stack POS, granular RBAC, real-time analytics dashboard, Excel export |
| **[DoneLock](/projects/donelock)** | Mobile App | Flutter, Dart, Firebase, Riverpod | Productivity journaling, 7×52 annual heatmap, calendar view, notifications |

---

## 🛠️ Tech Stack & Tooling

- **Languages & Runtimes**: TypeScript, JavaScript, PHP, Dart, Go, Node.js, Bun
- **Frontend & UI**: Next.js 16, React 19, Tailwind CSS v4, daisyUI v5, shadcn/ui, Bootstrap 5, Mazer Template, Vite, React Bits, GSAP
- **Mobile**: React Native, Expo, Flutter, Riverpod, GoRouter
- **Backend & APIs**: Laravel 13, Express.js, Inertia.js, REST API, Midtrans Payment Gateway, Firebase
- **Databases & DevOps**: MySQL, PostgreSQL, Supabase, Cloudflare, Docker, cPanel, Git, GitHub
- **Motion & Visuals**: GSAP 3 with ScrollTrigger, Three.js, OGL

---

## 📂 Content Management (JSON-Driven)

All portfolio data is separated cleanly from presentation logic and resides in `data/*.json`:

- `data/site.json`: Identity, hero copy, navigation, education history, contact channels.
- `data/projects.json`: Comprehensive case studies, architecture stages, 16:10 screenshots, and links.
- `data/experience.json`: Work and agency experience timeline.
- `data/skills.json`: Categorized technology tooling matrix.

For detailed structure and rules, see [`docs/CONTENT_SCHEMA.md`](docs/CONTENT_SCHEMA.md).

---

## 📖 Architecture & Guides

- [`docs/TECHNICAL_GUIDE.md`](docs/TECHNICAL_GUIDE.md) — Architecture principles, directory breakdown, and performance guidelines.
- [`docs/PRODUCT_BRIEF.md`](docs/PRODUCT_BRIEF.md) — Mission statement, persona journeys, and project roster.
- [`docs/CONTENT_SCHEMA.md`](docs/CONTENT_SCHEMA.md) — Schema definitions and data editing guidelines.
- [`AGENTS.md`](AGENTS.md) — Autonomous agent operational workflow and anti-slop guidelines.

---

## 📄 License

MIT © [Ferry Noer Hendriawan](https://github.com/ryzecl)

# Product Brief — Ferry Noer Hendriawan Portfolio

## 1. Vision & Identity
A high-performance personal developer portfolio for **Ferry Noer Hendriawan**, an Information Systems undergraduate student at Horizon University Indonesia, full-stack software engineer, and co-founder of JDNirwana software agency.

The portfolio is designed to showcase real-world client and personal engineering projects with depth, restraint, and editorial clarity—tailored for internship recruiters, potential clients, and engineering peers.

---

## 2. Positioning & Voice
> *"Building practical digital solutions by connecting software, systems, and real-world needs."*

- **Tone**: Quietly confident, technically precise, transparent, and human.
- **Editorial Design Direction**: Near-black canvas, crisp high-contrast typography, restrained cobalt-blue accents (`#2563eb`), 16:10 large project visuals, and zero generic AI filler.
- **Data-Driven**: 100% of portfolio text, case study metrics, and skills are stored in editable local JSON files.

---

## 3. Project Roster (Current Case Studies)

1. **Brava Corporate Website** (`/projects/brava`):
   - *Category*: Company Profile (Live at [brava.id](https://brava.id)).
   - *Scope*: Multi-page corporate web presence, responsive typography, and lead capture workflows.
   - *Stack*: Next.js, TypeScript, Tailwind CSS.

2. **Brava CMS : Headless Content Platform** (`/projects/brava-cms`):
   - *Category*: Web Application.
   - *Scope*: Standalone headless CMS and REST API with automated cache purging (`ClearsApiCache`), dynamic SEO meta generator, GA4 analytics reporting, and centralized media compression.
   - *Stack*: Laravel 13, PHP 8.3, MySQL, Tailwind CSS v4, Docker, Pest PHP.

3. **SM Sport Center : Court Reservation & Payment** (`/projects/sm-sport-center`):
   - *Category*: Web Application (Repository: [github.com/nirwana-tim/sm-sport-center.git](https://github.com/nirwana-tim/sm-sport-center.git)).
   - *Scope*: Futsal & Badminton court reservation with real-time slot concurrency locks (anti-double booking), continuous booking rules, and automated Midtrans Snap payment gateway integration with SHA-512 webhook verification.
   - *Stack*: Laravel 13, PHP 8.3, MySQL, Tailwind CSS, Vite, Midtrans Snap.

4. **Point of Sale : Retail & ERP Management** (`/projects/point-of-sale`):
   - *Category*: Web Application (Repository: [github.com/ryzecl/point-of-sale.git](https://github.com/ryzecl/point-of-sale.git)).
   - *Scope*: Enterprise-grade POS cashier terminal with reactive cart calculations, granular Role-Based Access Control (RBAC with Spatie Permission), Recharts dynamic analytics dashboard, and automated Excel financial export.
   - *Stack*: Laravel 13, Inertia.js React, TypeScript, Tailwind CSS, Radix UI, Midtrans, Maatwebsite Excel.

5. **DoneLock : Personal Productivity Journal** (`/projects/donelock`):
   - *Category*: Mobile App (Repository: [github.com/ryzecl/donelock_app.git](https://github.com/ryzecl/donelock_app.git) | Demo APK available).
   - *Scope*: Cross-platform mobile productivity journaling application featuring brutalist aesthetics, annual 7×52 GitHub-style contribution heatmaps, monthly calendar views, and timezone-aware scheduled local notifications.
   - *Stack*: Flutter, Dart, Firebase Auth, Cloud Firestore, Riverpod 3, GoRouter.

---

## 4. Key Pages & Routes
- **`/` (Homepage)**: Concise hero, velocity marquee ticker, editorial About Me card with 3D interactive badge, Top 4 Featured Projects (balanced 2x2 grid), Work Experience & Academic Education timeline, interactive dual-row Tech Stack marquee, and LiquidEther Contact CTA.
- **`/projects`**: Full catalog with category filtering tabs (`All`, `Web Application`, `Company Profile`, `Mobile App`).
- **`/projects/[slug]`**: Deep-dive technical case study featuring problem/solution cards, responsive horizontal architecture pipeline scroller, interactive screenshot media carousel with slide counters and dynamic badges, and sticky specification sidebar.
- **`/about`**: Comprehensive biography, extracurriculars, academic milestones (3.96 GPA), and full technical tooling matrix.
- **`/contact`**: Direct communication channels (Email, GitHub, LinkedIn, CV download).

---

## 5. Success Metrics
- Fast initial load and 100% static generation at build time (SSG / Turbopack).
- Complete keyboard accessibility, WCAG contrast compliance, and reduced-motion support.
- Fully typed data model preventing runtime exceptions or broken routes.

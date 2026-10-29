# Content Schema Reference

The local JSON files in `data/` serve as the single source of truth for all editable portfolio content. Keep these schemas strictly aligned with TypeScript definitions in `lib/types.ts`.

---

## 1. `data/site.json`
Contains personal identity, hero section copy, navigation, academic education, contact URLs, and velocity marquee text.
- `identity`:
  - `name`: Full personal name (`Ferry Noer Hendriawan`).
  - `wordmark`: Short brand mark (`FNH.`).
  - `domain`: Personal domain.
  - `title`: Primary professional subtitle.
  - `location`: Geographic location (`Indonesia`).
  - `statusLabel`: Current availability indicator.
- `hero`: Greetings array, headline, eyebrow, avatar path, description, and primary CTA.
- `navigation`: Array of `{ label, href }` top navigation items.
- `about`: Biographical narrative paragraphs, focus bullet points, and role summary.
- `education`: Array of academic credentials (`institution`, `program`, `startDate`, `endDate`, `gpa`, `achievements`, `note`).
- `contact`: Official links for `email`, `github`, `linkedin`, and `cv`.
- `velocityScroll`: Array of uppercase strings displayed in the hero velocity ticker marquee.

---

## 2. `data/projects.json`
Top-level object with a `projects` array. Each project item contains:
- `slug`: Unique URL-friendly string identifier (maps directly to `/projects/[slug]`).
- `title`: Full project name with subtitle (e.g. `SM Sport Center : Court Reservation & Payment`).
- `summary`: One-sentence executive summary.
- `description`: Detailed paragraph explaining purpose, tech stack, and scope.
- `category`: Classification (`Web Application`, `Company Profile`, or `Mobile App`).
- `status`: Lifecycle status (`Completed` or `In Progress`).
- `year`: Release or development year.
- `role`: Engineering role (e.g. `Full-Stack Developer`, `Mobile Developer`).
- `featured`: Boolean flag. If `true`, project is eligible for homepage display (homepage limits to top 4 for balanced 2x2 grid layout).
- `technologies`: Array of technology names used in the project. Automatically rendered with official branded SVG icons.
- `highlights`: Array of real, verified features implemented in the application.
- `problem`: Engineering context describing what bottleneck was solved.
- `solution`: Technical approach, architecture, and resolution.
- `contribution`: Personal ownership and engineering tasks delivered.
- `architecture`: Array of sequential stages (e.g. Stage 01 to Stage 05) displayed in the responsive horizontal architecture scroller.
- `coverImage`: Path to primary 16:10 showcase image (e.g. `/images/projects/.../cover.jpg`).
- `previewImages`: Array of image paths for the interactive project media viewer carousel with slide counters and dynamic badges.
- `links`: Object with optional `demo` (live website / APK download) and `repository` (GitHub repository). Buttons are rendered in the sticky sidebar only when non-empty.
- `visual`: Visual metadata object with `type` (`image` or schematic name) and `alt` accessibility text.

---

## 3. `data/skills.json`
Top-level object with a `groups` array categorized into distinct technical disciplines:
- `title`: Discipline title (`Programming Languages`, `Frontend & Mobile`, `Backend & Cloud`, `Data & DevOps`).
- `priority`: Numeric sort order (1 = highest).
- `technologies`: Array of specific technology names (e.g. `Next.js`, `React Native`, `Expo`, `Flutter`, `Laravel`, `Express.js`, `Node.js`, `Bootstrap`, `daisyUI`, `Mazer Template`, `Firebase`, `Riverpod`, `Docker`, `Bun`, `cPanel`).

---

## 4. `data/experience.json`
Top-level object with an `experiences` array documenting professional and agency roles:
- `organization`: Company or agency name.
- `role`: Job title.
- `type`: Employment type (`Freelance Agency`, `Internship`, `Contract`).
- `startDate` & `endDate`: Timeframe strings (or `Present`).
- `current`: Boolean indicating if currently active.
- `summary`: Overview of responsibilities.
- `responsibilities`: Array of specific achievements and technical tasks.
- `technologies`: Array of tools used during the engagement.
- `url`: Optional organization website URL.

---

## 5. Data Editing Rules
1. **Valid JSON**: Strict double quotes, no comments, and no trailing commas.
2. **Never Fabricate**: Keep unknown fields empty `""` or omit optional properties. Never invent fake statistics or private URLs.
3. **Slugs**: Keep slugs stable to avoid breaking routes or bookmarks.
4. **Images**: Store project images in `public/images/projects/[slug]/` using standard 16:10 aspect ratio (`1920x1200` or `1600x1000 px`).

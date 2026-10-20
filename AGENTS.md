# AGENTS.md — Ferry Portfolio

## Mission
Build and maintain a polished personal developer portfolio for Ferry Noer Hendriawan. Before making changes, read:
1. `README.md`
2. `docs/PRODUCT_BRIEF.md`
3. `docs/DESIGN_GUIDE.md`
4. `docs/TECHNICAL_GUIDE.md`
5. `docs/CONTENT_SCHEMA.md`
6. `data/site.json`
7. `data/projects.json`
8. `data/experience.json`
9. `data/skills.json`

Use the supplied reference screenshot as the primary visual direction. It is a reference for visual language and composition, not content to copy.

## Required workflow
- Inspect the existing repository before changing files.
- If this is an empty/new repository, scaffold the app using the stack specified in `docs/TECHNICAL_GUIDE.md`.
- Create a short implementation plan, then implement the actual website. Do not stop after explaining or producing mockups.
- Run available lint, type-check, and build commands. Fix errors introduced by your changes.
- If a dependency, command, or external asset cannot be used, choose a sensible fallback and explain it in the final summary.
- Do not ask for information that is already specified in the documentation. Use clearly marked placeholders for missing personal data and links.

## Non-negotiable requirements
- Next.js App Router, TypeScript, and Tailwind CSS.
- Website content must come from JSON files under `data/`, not be hardcoded throughout UI components.
- Keep content types and JSON structures aligned. Define TypeScript types for the JSON data.
- No CMS, database, Context7 requirement, or external content API. This portfolio is data-driven through local JSON files.
- Use reusable components and semantic HTML.
- Responsive from mobile to desktop; accessible keyboard navigation, visible focus, sensible contrast, and reduced-motion support.
- Never invent metrics, client outcomes, dates, URLs, credentials, or project features. Keep unknown values empty or use explicit TODO placeholders.
- Do not expose secrets or commit `.env` values.
- Do not claim a project is public, completed, or open-source unless the data explicitly says so.
- Keep copy natural and concise. Avoid generic AI-sounding filler.
- Prefer CSS/Tailwind for visual styling. Add dependencies only when they provide clear value.

## Design guardrails
- Match the reference's dark, restrained, editorial feeling: near-black canvas, fine borders, bright readable typography, large project imagery, and cobalt-blue accents.
- Make the result distinctive through layout, typography, project numbering, metadata, and deliberate spacing—not excessive glow, gradients, glassmorphism, or animation.
- The screenshot's example person, copy, website, avatars, and badges are not the user's content. Do not reproduce them.
- Use real project screenshots only if supplied. Otherwise create tasteful, locally implemented project preview compositions or neutral placeholders. Do not use random stock images as if they were actual project screenshots.
- Do not use fake skill percentage bars.
- Do not make every card identical if an editorial layout would communicate hierarchy better.

## Data editing
- For content changes, prefer editing the JSON files rather than JSX/TSX.
- Keep `data/CONTENT_SCHEMA.md` and `docs/CONTENT_SCHEMA.md` aligned if schema documentation changes.
- Use valid JSON (double quotes, no comments, no trailing commas).
- Ensure optional fields have graceful UI fallbacks.

## Completion report
At the end, report:
- What was implemented.
- Main routes and reusable components.
- Which JSON files control which content.
- Commands run and their results.
- Any remaining TODOs or missing assets.

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read `antislop.md` (core) and then the skill for the task:
- UI / visual: `skills/antislop-ui/SKILL.md`
- Copy & text: `skills/antislop-copywriting/SKILL.md`
- People: `skills/antislop-human/SKILL.md`
- Mobile / responsive: `skills/antislop-layoutmobile/SKILL.md`
- Code comments: `skills/antislop-code/SKILL.md`
Before starting, follow the core's "Two Usage Modes" section in strict order: explicit session instruction first, then global preference, then ask. A session instruction always wins. For a resolved mode, say `antislop active: <mode> (session override).` or `antislop active: <mode> (global preference).` once before presenting findings or making edits, using the actual mode and source. Acknowledging the user's request without naming the source does not replace this notice.
Only an explicit choice of antislop during or after selects a session mode. A request to review, audit, or avoid file edits does not select a mode; read the global preference in that case. Another skill's mode does not select antislop's mode.
If the mode is unresolved, ask during/after and end the response; wait for the answer before any UI review, planning, or concept. For read-only tasks, put the active-mode notice only at the start of the final answer, never in progress messages. For editing tasks, announce before the first edit and omit it from the final answer.
To update antislop later: download `antislop.md` again, or run `npx antislop-ai --update` if it was installed as skill folders.
<!-- antislop:end -->


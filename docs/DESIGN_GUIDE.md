# Design Guide

## Reference screenshot
Use the screenshot attached by the owner as the visual reference. It shows a dark portfolio concept with:
- Black/near-black background.
- Fine gray separators and thin borders.
- Compact header with a simple brand mark and a menu control.
- Small uppercase/numbered section label.
- Strong, condensed-in-feel but readable headline hierarchy.
- Large rounded-corner project preview framed inside the page.
- Minimal ornamentation and generous spacing.

Treat it as inspiration for visual language, not a pixel-perfect copy. The sample content and sample person's site must not appear in the finished portfolio.

## Art direction
**Dark Editorial Developer Portfolio** — technical, clean, confident, and a little unconventional. Prioritize content hierarchy and authentic work over decoration.

## Color tokens
Use CSS variables or Tailwind theme tokens so colors can be changed centrally:
- `--background`: `#08090B`
- `--surface`: `#101216`
- `--surface-raised`: `#171A20`
- `--foreground`: `#F4F5F7`
- `--muted`: `#A1A6B0`
- `--border`: `#292D35`
- `--accent`: `#6D83FF`
- `--accent-strong`: `#4058E8`
- `--success`: use sparingly and only for meaningful statuses.

Accent blue is a highlight, not a background for every element. Maintain strong contrast.

## Typography
- Use a clean sans-serif such as Geist/Inter for body and display text.
- Use a monospace face for small labels, indexes, dates, and technical metadata.
- Use a strong display scale for hero and project titles, but control line length and avoid clipping.
- Body text should be comfortable to read, ideally around 16–18px on desktop and no smaller than 14px for essential content.
- Use uppercase sparingly for section labels, not for long paragraphs.

## Layout
- Center the content in a responsive max-width container, roughly 1200–1360px on wide screens.
- Use a consistent spacing scale and a clear grid.
- Hero should feel spacious and intentional, with a short headline, short paragraph, and two clear actions.
- Featured projects should use a varied editorial composition: one or two larger feature entries and a responsive grid for the rest.
- Project previews should be large enough to understand what the project is.
- Use thin borders and restrained corner radii. Do not round every element excessively.
- Avoid generic dashboard layouts, unnecessary sidebars, and too many boxed cards.
- Keep decorative elements secondary to project content.

## Header and navigation
- Desktop: wordmark at left, links at right, visible CV action if a real CV URL exists.
- Mobile: compact wordmark and accessible menu button.
- Keep header height restrained, with a subtle bottom border.
- Active/hover/focus states should be clear.
- Do not render links that have no valid destination.

## Motion
- Use subtle hover/fade/translate effects only when helpful.
- Respect `prefers-reduced-motion`.
- Do not add continuous motion, excessive parallax, cursor-following effects, or long intro animations.
- Core content must be visible and usable if animation is disabled.

## Project visuals
- Prefer real screenshots supplied by the owner.
- Until real screenshots exist, create purposeful local HTML/CSS previews that represent the project's domain without falsely claiming they are screenshots of the live product.
- Brava: corporate website + CMS preview.
- SM Sport Center: booking schedule / court selection / booking summary preview.
- Donelock: mobile productivity app preview.
- Never use another person's portfolio screenshot as a project image.
- If using placeholder previews, label them as illustrative only when needed.

## Components to design
- Site header and responsive menu.
- Primary/secondary buttons and text links.
- Section heading with numbered eyebrow.
- Featured project showcase.
- Project card with title, short description, status, category, tech tags, and role.
- Project filter controls.
- Case study sections and image gallery.
- Experience timeline.
- Skill category groups.
- Contact CTA and footer.
- Empty/fallback states for optional data.

## Responsive behavior
- Mobile first.
- No horizontal overflow.
- Headline wraps naturally and does not collide with controls.
- Large project media becomes full width and stacks with text.
- Filter controls can wrap or scroll accessibly without hiding selected state.
- Buttons and navigation targets have touch-friendly hit areas.
- Test at approximately 360px, 768px, 1024px, and 1440px widths.

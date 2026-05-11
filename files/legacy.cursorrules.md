# .cursorrules — The Minnier Legacy

## Project context

This is **minnierfamily.com** — the Minnier Legacy site.
Built for **Uncle Jack Minnier** — Vietnam veteran, family historian, the man who decided the Minnier story would not be lost.

**This site already exists as v1.** It is currently a single self-contained HTML file (`index.html`, ~1538 lines). It works. It deploys to Cloudflare Pages as-is. The v1 earned a literal "I'm fucking crying, it's so beautiful" reaction from the owner. **Do not refactor it.** Extend it carefully.

## Stack — do not deviate

- **Single HTML file** (`index.html`) — no build step, no framework, no bundler
- **Vanilla JS** (inline `<script>` block) — no React, no jQuery, no module loader
- **Inline CSS** in `<style>` block with CSS variables — no preprocessor, no Tailwind
- **Google Fonts** via `<link>` — Playfair Display, Crimson Pro, Special Elite, Share Tech Mono
- **Hosting:** Cloudflare Pages (drag-and-drop or git connect)
- **Domain:** minnierfamily.com (Cloudflare DNS)
- **Image assets:** root-level (e.g. `/IMG_9075.jpeg`) — preserve this convention

## Design tokens (locked — do not change)

```css
--cream:       #F5F0E4;   /* page background */
--cream-dark:  #EDE4D0;
--cream-deep:  #DDD0B4;
--crimson:     #8B1A2A;   /* primary accent — quilt red */
--navy:        #1B3A5C;   /* secondary accent — quilt blue */
--gold:        #C8922A;   /* tertiary accent — quilt gold */
--ink:         #2C1810;   /* primary text */
--white:       #FDFAF4;
```

**Fonts:**
- `--display: 'Playfair Display'` — section titles, hero
- `--body: 'Crimson Pro'` — body copy
- `--stamp: 'Special Elite'` — typewriter-style labels
- `--mono: 'Share Tech Mono'` — eyebrow tags, captions

## Working style — Mike "Whitey" Minnier

- **Translate every concept to:** source of truth, schema, deterministic rule, definition of done
- **Present 2–3 options, not open questions**
- **Plain honesty on constraints** — if it can't be done, say so + offer the workaround
- **Do not invent structure.** If it's not in v1, ask before adding
- **No scope creep** — fine-tune what exists, don't expand without asking

## The FAMILY data array

The `FAMILY` array (around line 1195) is the source of truth for everyone on the site. Schema:

```js
{
  id: number,                  // unique, sequential
  name: string,                // full name
  born: string,                // "1945" or "c. 1680"
  died: string | null,         // null if living
  birthplace: string,
  generation: number,          // 1 (oldest) to 7 (youngest), I–VII in display
  relation: string,            // e.g. "Patriarch", "Family Historian"
  photo: string | null,        // absolute path like "/IMG_xxx.jpeg" or null
  photoCaption: string | null,
  notes: string,               // 1–3 sentences, dignified tone
  military: null | {
    branch: string,            // "U.S. Army", "U.S. Marines", etc.
    conflict: string,          // "Vietnam", "WWII", "Korea"
    years: string,             // "1965–1968"
    ribbons: string[]          // array of 3 hex colors for ribbon strip
  },
  accentColor: 'crimson' | 'navy' | 'gold'   // card accent color
}
```

**Rules:**
- Generation 1 = oldest known ancestor (Johann Heinrich is currently the patriarch)
- Use `accentColor: 'navy'` for military members
- Use `accentColor: 'gold'` sparingly — reserved for patriarchs / founders
- Notes should be reverent, never glib. Sentence fragments are fine. Avoid cliché ("loving father")
- If you don't have a photo, leave `photo: null` — the system renders a tasteful SVG placeholder

## Fine-tuning roadmap (in priority order)

Do these only when asked. Do not freelance.

1. **Deploy to minnierfamily.com via Cloudflare Pages** — top priority
2. **Print stylesheet** (`@media print`) — person cards print cleanly, one per page
3. **Meta tags + favicon + Open Graph image** — beautiful link previews when Jack shares
4. **Add real binder data** — replace 3 placeholder entries in FAMILY array
5. **Photo upload flow (no-code for Jack)** — Phase 2, deferred
6. **"Add a Memory" form** — Phase 2, deferred
7. **Zoomable quilt close-up** — Phase 2, deferred
8. **Timeline view (third view option)** — Phase 2, deferred

## Out of scope (do not touch unless asked)

- Refactoring index.html into multiple files
- Adding a build step
- Migrating to a framework
- Adding analytics, tracking, or any third-party scripts
- Changing the hero subtitle ("Uncle Jack's Royale Directory of Degenerates" is non-negotiable)
- Changing the color palette, fonts, or any locked design token
- Adding new sections beyond the four in the nav (Family / Quilt / Roll of Honor / About Jack)

## When in doubt

Ask. Mike will catch sloppy changes immediately. The v1 is a small, dignified thing — keep it that way.

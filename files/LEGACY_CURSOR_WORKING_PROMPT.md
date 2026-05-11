# Cursor Working Prompt — The Minnier Legacy

**Important:** Unlike a typical Cursor scaffold prompt, this project **already exists**. v1 is built. The job is **fine-tuning**, not scaffolding.

---

## Initial setup (one-time, do this first)

1. Drop the files from this pack into `~/projects/minnier-legacy`:
   - `index.html` (from `site/`)
   - `README.md` (from `site/`)
   - `.gitignore` (from `site/`)
   - `.cursorrules` (from `cursor/`)
2. Add the two image files locally: `IMG_9075.jpeg` and `IMG_9076.jpeg`
3. Open `index.html` in a browser to confirm v1 renders
4. Open the folder in Cursor

---

## What to tell Cursor when you start

Paste this into Composer once you're in the project:

---

You are working on **The Minnier Legacy** — a single-file HTML site for Uncle Jack Minnier, family historian.

**Read `.cursorrules` before doing anything.** Follow it strictly.

**This is v1 that already works.** Do not refactor. Do not modernize. Do not split files. Do not add frameworks. The job is targeted fine-tuning of an existing, beloved artifact.

**Your first task:** read `index.html` end to end so you understand:
- The CSS variable system in `:root`
- The four-font typography setup
- The `FAMILY` data array schema (around line 1195)
- How `renderCards()`, `renderTree()`, `renderHonor()`, and `openModal()` work together
- The view toggle, gen filter, and search wiring

After you've read it, tell me you've read it. Do not start making changes yet. Wait for the specific fine-tuning task I'll give you next.

---

## Fine-tuning tasks (give these to Cursor one at a time)

### Task 1: Print stylesheet

> Add a `@media print` block to the existing `<style>` section that:
> - Hides the nav, view controls, search input, and footer
> - Hides the modal overlay
> - Renders all person cards full-width, one per page (page-break-after: always)
> - Removes paper-texture background and quilt borders (keeps it clean for print)
> - Keeps the family color accents on cards but renders them with print-safe contrast
> - Keeps Crimson Pro for body text, Playfair for names
>
> Goal: Jack can print the FAMILY directory as a paper record. Each ancestor gets one dignified page.
>
> Do not touch anything outside the new `@media print` block. Show me the diff before applying.

### Task 2: Meta tags, favicon, Open Graph image

> In the `<head>` of `index.html`, add:
> - `<meta name="description">` — "Four hundred years of family, stitched together by the hands of those who came before us — and one man who refuses to let us forget. The Minnier Legacy."
> - `<meta property="og:title">` "The Minnier Legacy"
> - `<meta property="og:description">` (same as meta description)
> - `<meta property="og:image">` `/og-image.jpg`
> - `<meta property="og:url">` `https://minnierfamily.com`
> - `<meta property="og:type">` `website`
> - Twitter Card equivalents
> - `<link rel="icon">` pointing to `/favicon.ico`
>
> I'll provide `og-image.jpg` and `favicon.ico` separately.

### Task 3: Add real binder data

> Replace placeholder entries (id 4, 5, 6) in the `FAMILY` array with real ancestors from Jack's binder. I'll paste the data when ready. Follow the schema in `.cursorrules` strictly. Maintain id continuity.

---

## What NOT to ask Cursor to do (yet)

- Add a backend
- Add an admin / data-entry UI
- Add a zoomable quilt close-up
- Add a timeline view
- Migrate to a framework
- Add any new section to the nav
- Touch the hero subtitle ("Uncle Jack's Royale Directory of Degenerates")
- Change any color in `:root`
- Change any font

Those are Phase 2 conversations. We'll get there.

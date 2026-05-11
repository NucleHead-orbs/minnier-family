# The Minnier Legacy

`minnierfamily.com` — A digital archive of the Minnier family, built for **Jack Minnier**, the family historian.

## What this is

A single self-contained HTML file (`index.html`) that documents the Minnier family lineage from the 1600s to today. Built around Aunt Molly's family quilt — the artifact at the heart of the family record.

- **No build step.** Open `index.html` in a browser. That's it.
- **No framework.** Vanilla HTML, CSS, JavaScript.
- **No backend (Phase 1).** All family data lives in the `FAMILY` array inside the `<script>` block.
- **No tracking, no analytics, no third-party scripts.** This is a private family site.

## Local development

```
git clone <repo-url>
cd minnier-legacy
open index.html
```

Edit `index.html` in Cursor. Save. Refresh the browser. That's the loop.

## Deploying changes

Pushed to `main` branch → Cloudflare Pages auto-deploys to `minnierfamily.com` within ~30 seconds.

## File structure

```
minnier-legacy/
├── index.html              # The whole site
├── IMG_9075.jpeg           # The Minnier Family Quilt (full)
├── IMG_9076.jpeg           # Molly's panel detail
├── favicon.ico             # (to be added)
├── og-image.jpg            # (to be added — for link previews)
├── .gitignore
└── README.md
```

## Adding family members

Open `index.html`, find the `FAMILY` array (around line 1195). Append a new object following the schema documented in `.cursorrules`. Save. The card view, tree view, generation filter, search, and Roll of Honor (if military) will all pick it up automatically.

## Adding photos

1. Drop the image file in the repo root (e.g. `IMG_9077.jpeg`)
2. Reference it in the person's `photo` field as an absolute path: `"/IMG_9077.jpeg"`
3. Commit and push

## Phase status

- ✅ **v1 shipped** (March 16, 2026) — cards, tree, modal, Roll of Honor, Jack's section, quilt hero
- 🟡 **Fine-tuning in progress** — print stylesheet, meta tags, real binder data
- 🔵 **Phase 2 (deferred)** — Supabase backend, photo upload flow, "Add a Memory" form, zoomable quilt, timeline view

## About Jack

Jack Minnier is a Vietnam veteran, American Legion member, and the keeper of the Minnier family record. He built the source material — paper, photographs, Ancestry.com — through years of patient, devoted work. This site exists to make his work permanent.

Every year, he hikes the cemeteries of rural Pennsylvania alone, replacing the flags on the graves of his fellow soldiers. He does it because someone has to, and he is the someone.

This is for him.

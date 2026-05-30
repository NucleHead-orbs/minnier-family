# Minnier Legacy — Cursor Pack

Everything you need to bring v1 of `minnierfamily.com` into Cursor and ship it on Cloudflare Pages.

## What's in here

```
legacy-pack/
├── README.md                            ← you are here
├── site/
│   ├── index.html                       ← v1 of the legacy site (1538 lines, ready to deploy)
│   ├── README.md                        ← repo README — goes in the GitHub repo
│   └── .gitignore
├── cursor/
│   ├── .cursorrules                     ← drop in project root, locks Cursor to v1's character
│   ├── CURSOR_WORKING_PROMPT.md         ← paste into Composer to brief Cursor + first 3 tasks
│   └── CLOUDFLARE_PAGES_CONFIG.md       ← exact Pages settings
└── docs/
    └── SETUP_CHECKLIST.md               ← order of operations to ship
```

## Order of operations

1. **Read** `docs/SETUP_CHECKLIST.md` — that's the canonical path
2. **Drop files** into `~/projects/minnier-legacy` (or wherever you want the repo)
3. **Add image files** locally: `IMG_9075.jpeg` and `IMG_9076.jpeg`
4. **Open in Cursor**, paste `cursor/CURSOR_WORKING_PROMPT.md` into Composer
5. **Push to GitHub**, connect Cloudflare Pages
6. **Add custom domain** `minnierfamily.com`

## Key distinction from the album pack

The album was a Next.js scaffold from scratch. **The legacy site is the opposite — v1 already exists and is beloved.** The Cursor working prompt is for *fine-tuning*, not scaffolding. Do not let Cursor refactor.

## Parallel tracks (active)

| Track | State | Where |
|---|---|---|
| Family Album | Scaffolding | Cursor (separate repo, `photos.minnierfamily.com`) |
| **Legacy site** | **Deploying v1 → fine-tuning** | **Cursor (this pack), `minnierfamily.com`** |

## When v1 is live

Come back with the URL or a screenshot and we'll start Task 1 (print stylesheet).

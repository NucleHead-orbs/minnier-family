# Minnier Legacy — Setup & Deploy Checklist

**Goal:** Get v1 of the legacy site live at `minnierfamily.com`, then fine-tune in place.

---

## Phase 0 — Domain (DONE ✅)

- [x] `minnierfamily.com` purchased on Cloudflare Registrar (May 10, 2026)
- [x] Nameservers active: PAIGE + REX on Cloudflare

---

## Phase 1 — Cursor scaffold (10 min)

- [ ] Create local folder: `~/projects/minnier-legacy`
- [ ] Open it in Cursor
- [ ] Copy these files from this pack into the project root:
  - `site/index.html` (this is v1)
  - `site/README.md`
  - `site/.gitignore`
  - `cursor/.cursorrules`
- [ ] **Also copy in the two image files** Jack/Mike has locally:
  - `IMG_9075.jpeg` (the full quilt)
  - `IMG_9076.jpeg` (Molly's panel detail)
- [ ] Open `index.html` in browser → confirm it renders
  - Quilt should appear in the hero section
  - 6 person cards should render (3 real, 3 placeholders)
  - View toggle, gen filter, search should all work
  - Click a card → modal should open

> If the quilt images don't appear, the v1 has graceful fallbacks (a typewriter-styled placeholder), so the site is still functional without them.

---

## Phase 2 — Git + GitHub (10 min)

- [ ] In Cursor terminal:
  ```bash
  git init
  git add .
  git commit -m "v1 of The Minnier Legacy"
  ```
- [ ] Create a private GitHub repo: `minnier-legacy`
- [ ] `git remote add origin git@github.com:<your-username>/minnier-legacy.git`
- [ ] `git branch -M main`
- [ ] `git push -u origin main`

---

## Phase 3 — Cloudflare Pages deploy (10 min)

- [ ] Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
- [ ] Authorize GitHub → select `minnier-legacy` repo
- [ ] Configure build:
  - **Project name:** `minnier-legacy`
  - **Production branch:** `main`
  - **Framework preset:** None
  - **Build command:** *(leave empty)*
  - **Build output directory:** *(leave default)*
- [ ] Save and Deploy
- [ ] Wait ~30 seconds for first build to complete
- [ ] Visit the auto-generated `<random-name>.pages.dev` URL — confirm it works

---

## Phase 4 — Custom domain (5 min)

- [ ] Cloudflare Pages project → Custom domains → Set up a custom domain
- [ ] Enter: `minnierfamily.com`
- [ ] Activate (Cloudflare configures DNS automatically since you're already on their DNS)
- [ ] Repeat for: `www.minnierfamily.com`
- [ ] Wait 1-5 min for SSL provisioning
- [ ] Visit https://minnierfamily.com — should serve the site with valid SSL

---

## Phase 5 — Smoke test (5 min)

- [ ] Site loads on desktop Chrome
- [ ] Site loads on iPhone Safari
- [ ] Quilt image appears in hero
- [ ] All 4 nav links scroll to correct sections
- [ ] Card → modal interaction works
- [ ] View toggle (cards ↔ tree) works
- [ ] Search filters names live
- [ ] Generation filter buttons work
- [ ] Roll of Honor shows Jack + the placeholder military member

---

## Done ✅ = Phase 1 complete

When the above is checked, **v1 is live**.

Then we move into fine-tuning in priority order:

1. Print stylesheet (`@media print`) — person cards print one-per-page, dignified
2. Meta tags + favicon + Open Graph image — beautiful link previews
3. Real binder data — replace 3 placeholders with real ancestors when Jack provides them
4. Phase 2 planning — photo upload flow, "Add a Memory" form, Supabase backend

---

## When v1 is live

Come back with: "Legacy is live, what's next?"

We'll pick up at fine-tuning item #1 (print stylesheet) and work down the list.

# Cloudflare Pages Configuration

## Settings (when creating the Pages project)

| Setting | Value |
|---|---|
| **Project name** | `minnier-legacy` |
| **Production branch** | `main` |
| **Framework preset** | None |
| **Build command** | *(leave empty)* |
| **Build output directory** | `/` (or leave default — Pages serves from repo root) |
| **Root directory (advanced)** | *(leave empty)* |
| **Environment variables** | none |

## Custom domain

After first deploy succeeds, Cloudflare Pages → Custom domains → Set up custom domain:
- Domain: `minnierfamily.com`
- Also add: `www.minnierfamily.com` (Pages will auto-redirect www → apex or vice versa)

Because the DNS is already on Cloudflare for this domain, Pages will configure the CNAME / records automatically. No manual DNS work needed.

## .gitignore

```
.DS_Store
.vscode/
node_modules/
.env
.env.local
*.log
```

## Files Cloudflare Pages will serve

Only files in the repo root (or whatever you set as build output dir):
- `index.html`
- `IMG_9075.jpeg` (the quilt)
- `IMG_9076.jpeg` (Molly's panel)
- any future image assets
- `favicon.ico` (when added)

# Portfolio site

A one-page copywriter portfolio. Writing samples are plain Markdown files, and the
Work section builds itself from them.

## Add a new writing sample

1. In the `samples` folder, copy `_template.md` and rename it, e.g. `acme-summer-sale.md`.
   Use lowercase letters, numbers and dashes only. The file name becomes the page link.
2. Fill in the details at the top (title, client, brief, the best line, result).
3. Write the full piece underneath in normal Markdown.
4. Commit and push (or use **Add file → Upload files** on GitHub).

About a minute later the new piece shows up on the homepage and gets its own page.

**Optional fields**
- `order: 1` pins a piece near the top. Lower numbers come first. Without it, newest `date` comes first.
- `draft: true` hides a piece without deleting it.
- Files starting with `_` are ignored.

**Images:** put them in the `samples` folder and link them in the .md like `![alt text](photo.jpg)`.

## One-time setup on GitHub

1. Push this folder to a repo.
2. Go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
3. The **Publish site** workflow runs on every push to `main`. You can also run it by hand from the **Actions** tab.

## Preview on your own computer

The pages load files with `fetch`, so they need a small local server rather than double-clicking `index.html`:

```bash
node scripts/build-manifest.mjs   # rebuilds samples/index.json
npx serve .                        # or: python3 -m http.server
```

## Where things live

| File | What it does |
| --- | --- |
| `index.html` | Homepage, with the "Try another draft" headline list in the first script |
| `sample.html` | The page for a single sample (`sample.html?s=file-name`) |
| `assets/site.css` | All styles. Colors and fonts are at the top |
| `assets/frontmatter.js` | Reads the details block at the top of each .md |
| `scripts/build-manifest.mjs` | Builds `samples/index.json` from the .md files |
| `.github/workflows/pages.yml` | Runs the build and publishes on each push |
| `assets/vendor/` | Markdown renderer (marked) and sanitizer (DOMPurify), bundled so there's no CDN dependency |

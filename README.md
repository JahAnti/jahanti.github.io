# JahAnti — Gaming Community Hub (starter)

A free static website using HTML, CSS, and JavaScript. Designed for GitHub Pages.

## Publish on GitHub Pages

1. Sign into GitHub as **Royalregi007**.
2. Create a new **public** repository named `jahanti` (you can create it empty).
3. Open that repository → **Add file** → **Upload files**.
4. Upload the **contents** of this folder directly to the repository root (not a folder containing them). Commit changes to `main`.
5. Open **Settings** → **Pages** → **Build and deployment** → Source: **Deploy from a branch** → Branch: `main` → Folder: `/(root)` → **Save**.
6. Your site should appear at `https://royalregi007.github.io/jahanti/` after deployment. The repository owner must match the account. It may take several minutes.

## Update the website

- `index.html` — layout and text
- `styles.css` — colors, typography, mobile layout
- `data.js` — game names, players, sample standings, tournaments (edit this first)
- `script.js` — sorting, leaderboard logic, rendering and menu

**All names, scores, and games are fictional placeholders.** Replace them with your own; do not publish private information.

## Data limitations in this prototype

This is a *working visual prototype*, not yet a full tracking system. The player records and points are manually entered aggregate values. Total matches is a rough example metric computed from wins; for reliable match history, tournaments, and automated per-game standings we will later introduce a real match log and proper scoring rules. Cross-game points are added together only for demo purposes and may not be meaningful until a community-wide scoring model is defined.

## Later: Google Sheets

We can connect a read-only public/published spreadsheet to the website so you update scores in Sheets instead of editing `data.js`. Never publish private contact information or secret keys.

# JahAnti v10 — Leaderboards & Illustrated Game Pages (preview package)

This package builds on the JahAnti v9 homepage. It does NOT upload files to GitHub or access the private Google Sheets master.

## What changed
- `leaderboards.html`: All-Time top five across six cards; Domino switches between 1v1 / 2v2.
- `game.html?game=fortnite|cod|redsec|domino|fc|shooters`: illustrated hero banners and full leaderboard tables.
- `rankings.js`: all-time, weekly, monthly rankings; historical date navigation.
- `assets/game-heroes/*.webp`: six original custom cinematic background images.
- `styles.css`: additions to baseline v9 only.
- Homepage styling unchanged; navigation now opens central Leaderboards page.

## Data
When `data/jahanti-public.json` exists (created by your already installed `PublicSync.gs`), the new pages load public-safe rankings and profiles from that file. If it does not exist yet, the pages fall back to existing `leaderboards-data.js` All-Time data and show empty states for historical periods. No private sheet is read by visitors.

**Do not publish test accounts**. `PublicSync.gs` exports only members with Active + Public Profile=Yes.

## How to preview
1. Unzip package locally. For a full test, serve folder using `python -m http.server 8000` and open `http://localhost:8000/leaderboards.html` (JSON fetch is best tested over HTTP, not `file://`).
2. Review on phone and desktop before replacing the live site.
3. To publish: back up `JahAnti/jahanti.github.io` on GitHub, upload all package files to repo root (not ZIP itself), and replace matching files.
4. Confirm GitHub Pages deployment; only after reviewing the pages should you publish data from Google Sheets using your existing `publishJahAntiWebsiteSync` function.

## Important caveat
The package deliberately includes no sample player profiles. The player gallery stays empty until approved public data is published from Google Sheets.

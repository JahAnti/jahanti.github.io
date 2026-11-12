# JahAnti v4 — Brand & Homepage Redesign

**Website:** https://jahanti.github.io/
**Repository:** https://github.com/JahAnti/jahanti.github.io

A lightweight, free GitHub Pages website for JahAnti Gaming Community Antiano.

## What's new
- Your real gold-and-black JahAnti logo is used in the homepage and footer.
- Brighter cream/light-sand homepage, dark charcoal header and gold accents.
- Consistent main navigation: Home, Games, Tournaments, Community, About.
- All five game cards lead to functioning game-specific pages (no fake scores).
- Individual game pages have distinct accent themes, while keeping the JahAnti navigation and layout.
- Mobile-friendly navigation.
- Leaderboards and statistics are intentionally not shown yet.

## Update your GitHub site
1. Extract the ZIP on your computer.
2. Open https://github.com/JahAnti/jahanti.github.io
3. Click **Add file → Upload files**.
4. Upload **index.html**, **game.html**, **styles.css**, **script.js**, **README.md**, and the **assets** folder containing **jahanti-logo.png**. (Upload the contents of the ZIP, not the ZIP itself.)
5. If GitHub asks whether to replace existing files, confirm and commit to `main`.
6. The old `data.js` file can stay in the repo unused. You can delete it later. This version doesn't load it.
7. Visit https://jahanti.github.io/ and hard-refresh if the previous styles remain cached.

## Files
- `index.html`: community homepage and navigation
- `game.html`: reusable game page; e.g. `game.html?game=fc`
- `styles.css`: site colors, layout and individual game themes
- `script.js`: responsive navigation and content for each game page
- `assets/jahanti-logo.png`: user-provided JahAnti logo

## Game page URLs
- EA Sports FC: `/game.html?game=fc`
- Fortnite: `/game.html?game=fortnite`
- Call of Duty: `/game.html?game=cod`
- Battlefield REDSEC: `/game.html?game=redsec`
- Trupial Domino: `/game.html?game=domino`

## Important
This is a visual redesign, not a scoring system. Existing leaderboard UI from v3 is intentionally absent from v4, but your existing `data.js` can be retained for later development. Website remains static and needs no paid hosting service. Google Fonts are loaded from an external service; a system-font fallback is provided.

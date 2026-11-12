# JahAnti v7 — Homepage and navigation

This version keeps the existing JahAnti v6 design and updates the homepage:

- Navigation: Home, Games, Leaderboards, and three **non-clickable placeholders** for Instagram, Discord and YouTube. Provide your real social URLs before enabling links.
- Motto strip: COMPETE / CONNECT / REPRESENT (Repeat removed).
- Section 01: FIVE GAMES. ONE CREW. Five game cards in **one row on wide desktop screens**, three per row on medium screens, two per row on tablets, and one per row on mobile.
- Section 02: TOP PLAYERS. Five cards, one per game, with an honest empty state until you record results. Rankings automatically select a leader if rows are supplied in `leaderboards-data.js`.
- Existing community/about/game pages remain in place and use the same navigation.

## Upload

Extract the ZIP and upload `index.html`, `game.html`, `styles.css`, `script.js`, `leaderboards-data.js`, `README.md`, and the `assets` folder **to the root of the GitHub Pages repository** `JahAnti/jahanti.github.io`.

Do not upload the outer `JahAnti-v7-Homepage` folder: GitHub Pages serves files in the repository root.

After committing to `main`, check `https://jahanti.github.io/`. Use Ctrl+F5 if cached.

## Connecting real data later

`leaderboards-data.js` intentionally includes empty arrays. For Fortnite, Call of Duty and REDSEC, rows can contain `name`, `wins`, `kills`, `assists`; Domino uses `name`, `wins`, `losses`; FIFA uses `name`, `points`, `goalDifference`, `goalsFor`. The code does not invent player names or scores.

Do not publish private data. When you share the real social URLs, replace the social placeholders with accessible links.

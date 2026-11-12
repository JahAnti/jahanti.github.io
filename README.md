# JahAnti v8 — Homepage preview

## What’s included
- Updated navigation: Home, Games, Leaderboards, Community, TikTok and Instagram (working external links); Facebook is a non-clickable placeholder pending its URL.
- Hero: a single **Check Our Leaderboards** button, no large homepage logo.
- Section 01: Top Players; Section 02: Five Games. One Crew. Five cards in one row on large desktops and stacked on phones.
- Section 03: Meet Our Players — continuous scrolling gallery (pauses on hover/focus or pause button), swipeable on mobile, featuring games, bios, and achievements.
- `community.html`: searchable directory with game filters. `player.html`: player profile details. Both use the same `players-data.js` file as the homepage gallery.
- Sample profile cards are clearly labeled **SAMPLE PROFILE**, not real registered players. Leaderboards remain empty until real results arrive.

## Uploading to GitHub Pages
1. BACK UP your current `JahAnti/jahanti.github.io` repository (`Code → Download ZIP`).
2. Extract `JahAnti-v8-Preview.zip` and upload the *contents* (not the outer folder or zip) directly to the repo root.
3. Replace existing files with matching names. Confirm `index.html`, `styles.css`, `script.js`, `game.html`, `community.html`, `player.html`, `players.js`, `players-data.js`, `leaderboards-data.js` and `assets/jahanti-logo.png` are in the correct places.
4. Commit, verify the Pages deployment under Actions, then hard-refresh the site.
5. Remove any old duplicate version folders later, once the new site is verified.

## Using real players later
Change `players-data.js` to list real, approved public profiles, each with a permanent private-purpose `id` and stable public-facing `slug`. IDs are never shown on the visible site; because GitHub Pages serves public JavaScript, **IDs are not private secrets**. Actual Google Sheets integration is not implemented in this preview.

## Leaderboards
`leaderboards-data.js` remains empty. Once results are added, Top Players will display them, and if a row provides a matching `playerId`, its card can link directly to that player's profile.

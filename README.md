# JahAnti v9 — Homepage polish

This is a **complete replacement package** for the existing GitHub Pages site at https://jahanti.github.io/.

## Changes since v8
- Tighter homepage sections and more consistent vertical spacing across desktop, tablet, and mobile.
- Alternating backgrounds: warm cream hero → white Top Players → warm-grey Games → white Meet Our Players → existing About and dark footer.
- More intentional empty leaderboard states without fictional winners.
- Official inline SVG social icons for TikTok and Instagram. Facebook remains visibly disabled until its real link is supplied.
- Back to top in the footer on all pages.
- Reformatted stylesheet while preserving the previous rules and behavior. V9 refinements are grouped at the end.
- Retains player gallery, sample profiles, player directory, current navigation and all five themed game pages.

## Installation (GitHub Pages)
1. **Back up** the current repository via Code → Download ZIP.
2. Extract this ZIP locally. Open the folder `JahAnti-v9-Final-Homepage`.
3. Upload **its contents**, not the containing folder or ZIP, into the root of `JahAnti/jahanti.github.io` on branch `main`.
4. Replace files of the same name and commit changes.
5. Confirm Actions/Pages deployed successfully; reload https://jahanti.github.io/.
6. Only after verifying the site, delete old extra version folders from GitHub if desired. Preserve `assets/`.

## Data and privacy
- The player cards are **explicit sample/demo profiles**; not registered community members.
- `leaderboards-data.js` has no real results.
- Player IDs are internal join keys and not visibly shown, but public source data can be inspected by visitors.
- Google Sheets integration, automatic real-data results, and real achievement awarding are **not yet implemented**.

## Responsive behavior
- 5-column games and Top Players at large desktop widths, 3 or 2 columns for tablets, 1 column for narrow phones.
- Player gallery auto-scrolls and pauses on hover; mobile swipes; reduced-motion preference respected.
- Keyboard focus outlines and labeled social links.

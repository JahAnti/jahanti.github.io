# JahAnti v6 — Clean website release

This package contains the **complete published website** for the current design.

## Changes from v5
- Removed the large homepage logo image from the HTML completely (not hidden by CSS).
- Homepage headline, copy and buttons use the full content width.
- Reduced hero height/padding on mobile.
- Preserved the official logo in the header and footer.
- Preserved five themed game pages and mobile menu.
- Removed old CSS rules for the deleted hero artwork.
- Kept leaderboards off the site while the design is being finalized.

## Publish to GitHub Pages
1. Open `https://github.com/JahAnti/jahanti.github.io`.
2. **Back up first:** Code → Download ZIP, or use Git history if necessary.
3. Do **not** delete the repository or `.github` configuration.
4. Upload `index.html`, `game.html`, `styles.css`, `script.js`, `README.md` and the whole `assets/` folder to the **repository root**. Replace files with identical names.
5. Commit to `main`, then wait until the Pages deployment shows success.
6. Check `https://jahanti.github.io/` using hard refresh/private window.
7. Once confirmed, remove old duplicates such as `JahAnti-v4-Official-Logo-Fix/` and optionally the unused old `data.js` (this v6 site does not reference it). Avoid deleting unrelated files before verifying.

Expected paths:

```
jahanti.github.io/
  index.html
  game.html
  styles.css
  script.js
  README.md
  assets/
    jahanti-logo.png
```

Mobile-first conventions apply to all future edits.

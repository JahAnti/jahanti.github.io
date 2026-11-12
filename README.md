# JahAnti — Gaming Community Hub (v3)

Live website: https://jahanti.github.io
Repository: https://github.com/JahAnti/jahanti.github.io

## Included
- Separate Fortnite, Call of Duty, Battlefield REDSEC shooter leaderboards
- Combined shooter leaderboard aggregating wins, kills and assists across the 3 games
- Trupial Domino wins/losses leaderboard with calculated win percentage
- FIFA league/group standings calculated from match scores (3 points/win, 1/draw)
- FIFA knockout bracket displaying rounds, fixtures, scores and manually identified winners
- Community member list, homepage, and game cards

## Edit `data.js` to add real data

1. Add a record for each member under `players`, each with a unique ID and gamertag.
2. Add ONE TOTAL record per player per shooter game under `shooters`, with `player`, `game`, `wins`, `kills`, `assists`. Valid shooter game IDs are `fortnite`, `cod`, `redsec`.
3. Add domino totals under `domino` with `player`, `wins`, `losses`.
4. Add completed FIFA group/league games under `fifa.leagueMatches`, with `home`, `away`, `homeGoals`, `awayGoals`. FIFA standings calculate automatically.
5. Enter FIFA bracket rounds/games under `fifa.bracket`: `round`, `home`, `away`, `homeGoals`, `awayGoals`, `winner`. Scores may be `null` for unplayed fixtures. If tied and settled with penalties, set `winner` to the winning player ID. Advancing teams are currently entered manually.

No fictional player scores are included. There is no spreadsheet sync or score-submission system yet.

## Publish an update

Extract the ZIP, then upload its **five files**, not the ZIP itself, directly to your public `JahAnti/jahanti.github.io` GitHub repository using **Add file → Upload files**. GitHub will replace same-named files after committing. GitHub Pages will update at https://jahanti.github.io.

## Ranking rules
- Shooters: highest wins, then kills, then assists (no normalized cross-game scoring).
- Domino: highest wins, then fewest losses.
- FIFA: points, goal difference, goals scored.

These initial rankings can be customized later.

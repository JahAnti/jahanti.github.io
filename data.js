/* JAHANTI DATA — edit here until Google Sheets is connected.
   All records start empty. Use consistent player IDs in every section.
   Each shooter row is a player's TOTAL for that game. Do not mix match-level and total rows.
   Wins are credited according to your community rules. Do not duplicate rows for one player/game.
*/
window.JAHANTI_DATA = {
  games: [
    {id:'fc', name:'EA Sports FC / FIFA', icon:'⚽', subtitle:'Standings and tournament bracket', color:'#24d5f0'},
    {id:'fortnite', name:'Fortnite', icon:'🪂', subtitle:'Wins, kills and assists', color:'#a568ff'},
    {id:'cod', name:'Call of Duty', icon:'🎯', subtitle:'Wins, kills and assists', color:'#ff9d57'},
    {id:'redsec', name:'Battlefield REDSEC', icon:'🪖', subtitle:'Wins, kills and assists', color:'#ff647c'},
    {id:'domino', name:'Trupial Domino', icon:'🁫', subtitle:'Wins and losses', color:'#f5cd65'}
  ],
  players: [
    // {id:'player1', name:'Gamer tag'},
    // {id:'player2', name:'Another gamer'}
  ],
  shooters: [
    // {player:'player1', game:'fortnite', wins:4, kills:62, assists:18},
    // {player:'player1', game:'cod', wins:3, kills:75, assists:20},
    // {player:'player2', game:'redsec', wins:2, kills:34, assists:9}
  ],
  domino: [
    // {player:'player1', wins:6, losses:2}
  ],
  fifa: {
    // Standings are calculated from these completed league/group matches.
    // Do not enter knockout matches here. Draws are allowed in standings.
    leagueMatches: [
      // {home:'player1', away:'player2', homeGoals:2, awayGoals:1}
    ],
    // Bracket games are displayed by round and in entered order.
    // Score can be null until played. Set winner player ID for a tied score settled by penalties.
    // Rounds can be 'Quarterfinals', 'Semifinals', 'Final' or your own names.
    bracket: [
      // {round:'Semifinals', home:'player1', away:'player2', homeGoals:null, awayGoals:null, winner:null}
    ]
  }
};

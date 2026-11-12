/* DEMO DATA — replace all names, games, and scores with your real community data.
   Later, we can replace this file with a Google Sheets connection.
   Each result entry: player (matching an id), game (matching an id), wins, losses, points.
*/
window.JAHANTI_DATA = {
  games: [
    { id: 'fc', name: 'Football / FC', icon: '⚽', subtitle: 'Head-to-head glory', color: '#24d5f0' },
    { id: 'racing', name: 'Racing', icon: '🏎️', subtitle: 'Fastest takes the crown', color: '#ff63ad' },
    { id: 'shooter', name: 'Shooter', icon: '🎯', subtitle: 'Precision and rivalry', color: '#a568ff' }
  ],
  players: [
    { id: 'p1', name: 'Player One' },
    { id: 'p2', name: 'Player Two' },
    { id: 'p3', name: 'Player Three' },
    { id: 'p4', name: 'Player Four' }
  ],
  results: [
    { player: 'p1', game: 'fc', wins: 8, losses: 2, points: 24 },
    { player: 'p2', game: 'fc', wins: 6, losses: 4, points: 18 },
    { player: 'p3', game: 'fc', wins: 4, losses: 6, points: 12 },
    { player: 'p4', game: 'fc', wins: 3, losses: 7, points: 9 },
    { player: 'p2', game: 'racing', wins: 7, losses: 2, points: 21 },
    { player: 'p4', game: 'racing', wins: 5, losses: 4, points: 15 },
    { player: 'p1', game: 'shooter', wins: 4, losses: 3, points: 12 },
    { player: 'p3', game: 'shooter', wins: 6, losses: 2, points: 18 }
  ],
  tournaments: []
};

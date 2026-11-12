const data = window.JAHANTI_DATA;
const $ = selector => document.querySelector(selector);
const findName = id => data.players.find(p => p.id === id)?.name ?? 'Unknown player';

function renderGames() {
  const grid = $('#game-grid');
  data.games.forEach(game => {
    const card = document.createElement('article');
    card.className = 'game-card';
    card.style.setProperty('--glow', game.color || '#a568ff');
    const icon = document.createElement('span'); icon.className = 'icon'; icon.textContent = game.icon;
    const title = document.createElement('h3'); title.textContent = game.name;
    const subtitle = document.createElement('small'); subtitle.textContent = game.subtitle;
    card.append(icon, title, subtitle); grid.appendChild(card);
  });
}

function renderLeaderboard(gameId) {
  const body = $('#leaderboard-body');
  body.replaceChildren();
  const standings = data.results.filter(item => gameId === 'all' || item.game === gameId)
    .reduce((map, item) => {
      const row = map.get(item.player) || { player: item.player, wins: 0, losses: 0, points: 0 };
      row.wins += Number(item.wins) || 0;
      row.losses += Number(item.losses) || 0;
      row.points += Number(item.points) || 0;
      map.set(item.player, row);
      return map;
    }, new Map());
  const sorted = [...standings.values()].sort((a, b) => b.points - a.points || b.wins - a.wins || findName(a.player).localeCompare(findName(b.player)));
  if (!sorted.length) {
    const row = document.createElement('tr'); const cell = document.createElement('td');
    cell.colSpan = 5; cell.textContent = 'No results for this game yet.'; row.appendChild(cell); body.appendChild(row); return;
  }
  sorted.forEach((entry, index) => {
    const tr = document.createElement('tr');
    const addCell = (text, cls) => { const td = document.createElement('td'); td.textContent = String(text); if (cls) td.className = cls; tr.appendChild(td); };
    addCell(String(index + 1).padStart(2, '0'));
    addCell(findName(entry.player), 'player-cell');
    addCell(entry.wins); addCell(entry.losses); addCell(entry.points, 'points');
    body.appendChild(tr);
  });
}
function initialize() {
  renderGames();
  const filter = $('#game-filter');
  [{ id: 'all', name: 'All games' }, ...data.games].forEach(game => {
    const option = document.createElement('option'); option.value = game.id; option.textContent = game.name; filter.appendChild(option);
  });
  filter.addEventListener('change', () => renderLeaderboard(filter.value));
  renderLeaderboard('all');
  $('#total-players').textContent = data.players.length;
  $('#total-games').textContent = data.games.length;
  $('#total-matches').textContent = data.results.length; // Number of leaderboard result records, not distinct matches.
  $('#total-tournaments').textContent = data.tournaments.length;
  $('#year').textContent = new Date().getFullYear();
  const playerList = $('#player-list');
  data.players.forEach((player, index) => {
    const row = document.createElement('div'); row.className = 'player-row';
    const name = document.createElement('strong'); name.textContent = player.name;
    const status = document.createElement('span'); status.textContent = `CREW MEMBER ${String(index + 1).padStart(2, '0')}`;
    row.append(name, status); playerList.appendChild(row);
  });
  const toggle = $('.menu-toggle'); const nav = $('#navigation');
  toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}));
}
initialize();

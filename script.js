'use strict';
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  toggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.textContent = isOpen ? '✕' : '☰';
  });
  // Support keyboard dismissal and close a mobile menu after resizing.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav?.classList.contains('open')) {
      nav.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
      if (toggle) { toggle.textContent = '☰'; toggle.focus(); }
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 800 && nav?.classList.contains('open')) {
      nav.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
      if (toggle) toggle.textContent = '☰';
    }
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    if (toggle) toggle.textContent = '☰';
  }));
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  const games = {
    fc: { title:'EA SPORTS FC', tag:'01 / THE FOOTBALL ARENA', desc:'Matchday energy. Big rivalries. Every goal counts.', symbol:'⚽', overview:'The home for JahAnti football rivalries, matchdays and competition news.', competition:'FIFA standings and a tournament bracket will be added here when we set up the format.' },
    fortnite: { title:'FORTNITE', tag:'02 / THE DROP ZONE', desc:'Drop together. Fight hard. Chase the Victory Royale.', symbol:'✦', overview:'A colorful home for our Fortnite crew and community highlights.', competition:'Fortnite wins, kills and assists will be tracked here later.' },
    cod: { title:'CALL OF DUTY', tag:'03 / THE TACTICAL ARENA', desc:'Stay sharp. Work together. Own the match.', symbol:'⌖', overview:'Where our Call of Duty squad can follow community action and updates.', competition:'Call of Duty wins, kills and assists will be tracked here later.' },
    redsec: { title:'BATTLEFIELD REDSEC', tag:'04 / THE BATTLEFIELD', desc:'The squad moves together. Every battle leaves a mark.', symbol:'✕', overview:'Our REDSEC hub for the squad, the big moments and the next drop.', competition:'Battlefield REDSEC wins, kills and assists will be tracked here later.' },
    domino: { title:'TRUPIAL DOMINO', tag:'05 / THE DOMINO TABLE', desc:'Read the table. Respect the game. Take the win.', symbol:'⚄', overview:'A proper home for JahAnti domino nights, rivalries and results.', competition:'Domino wins and losses will be tracked here later.' }
  };
  if (document.body.dataset.page === 'game') {
    const requested = new URLSearchParams(location.search).get('game') || 'fc';
    const key = Object.hasOwn(games, requested) ? requested : 'fc';
    const g = games[key];
    document.body.dataset.game = key;
    document.title = `${g.title} — JahAnti`;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('game-tag',g.tag); set('game-title',g.title); set('game-description',g.desc); set('game-symbol',g.symbol); set('overview-text',g.overview); set('competition-text',g.competition);
  } else {
    const links = Array.from(nav?.querySelectorAll('a[data-nav]') || []);
    const mark = () => { const hash = (location.hash || '#home').slice(1); const page = document.body.dataset.page; links.forEach(l => l.classList.toggle('active', l.dataset.nav === (page === 'rankings-overview' || page === 'ranking-game' ? 'leaderboards' : hash))); };
    window.addEventListener('hashchange',mark); mark();
  }
})();


// Top players: use the first-ranked entry from each game's standings.
// These cards deliberately remain empty until actual results are provided.
(() => {
  const all = window.JAHANTI_LEADERBOARDS || {};
  document.querySelectorAll('[data-top-game]').forEach(card => {
    const key = card.dataset.topGame;
    const rows = Array.isArray(all[key]) ? all[key] : [];
    const valid = rows.filter(r => r && typeof r.name === 'string' && r.name.trim());
    if (!valid.length) return;
    const numeric = (r, field) => Number.isFinite(Number(r[field])) ? Number(r[field]) : 0;
    const ranking = [...valid].sort((a,b) => {
      if (key === 'fc') return numeric(b,'points')-numeric(a,'points') || numeric(b,'goalDifference')-numeric(a,'goalDifference') || numeric(b,'goalsFor')-numeric(a,'goalsFor');
      if (key === 'domino') return numeric(b,'wins')-numeric(a,'wins') || numeric(a,'losses')-numeric(b,'losses');
      return numeric(b,'wins')-numeric(a,'wins') || numeric(b,'kills')-numeric(a,'kills') || numeric(b,'assists')-numeric(a,'assists');
    });
    const leader = ranking[0];
    const result = card.querySelector('.top-player-result');
    if (!result) return;
    result.replaceChildren();
    const name = document.createElement('p'); name.className = 'top-name'; name.textContent = leader.name;
    const stats = document.createElement('span'); stats.className = 'top-stat';
    if (key === 'fc') stats.textContent = `${numeric(leader,'points')} pts`;
    else if (key === 'domino') stats.textContent = `${numeric(leader,'wins')} wins · ${numeric(leader,'losses')} losses`;
    else stats.textContent = `${numeric(leader,'wins')} wins · ${numeric(leader,'kills')} kills · ${numeric(leader,'assists')} assists`;
    result.append(name,stats);
    if (leader.playerId && Array.isArray(window.JAHANTI_PLAYERS)) {
      const p = window.JAHANTI_PLAYERS.find(item => item.id === leader.playerId && item.slug);
      if (p) { const a = card.querySelector('a'); if (a) { a.href = `player.html?p=${encodeURIComponent(p.slug)}`; a.textContent = 'View Player Profile ↗'; } }
    }
  });
})();

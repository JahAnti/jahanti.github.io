'use strict';
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  toggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.textContent = isOpen ? '✕' : '☰';
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
    const mark = () => { const hash = (location.hash || '#home').slice(1); links.forEach(l => l.classList.toggle('active', l.dataset.nav === hash)); };
    window.addEventListener('hashchange',mark); mark();
  }
})();

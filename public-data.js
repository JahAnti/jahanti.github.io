/* JahAnti v12 — fresh, public-only JSON loader.
 * Reads the GitHub-published public snapshot. Never connects to private Google Sheets.
 * Date-stamped request parameters bypass stale browser/CDN asset responses on page visit.
 */
(() => {
  'use strict';
  const PUBLIC_PATH = './data/jahanti-public.json';
  const cleanArray = v => Array.isArray(v) ? v : [];
  function normalizedPlayer(p) {
    const all = cleanArray(p.achievements);
    const featured = cleanArray(p.featuredAchievements);
    return {
      ...p,
      achievements: featured.length ? featured : all.slice(0, 3),
      allAchievements: all,
      featuredAchievements: featured,
      showInGallery: p.showInGallery === true
    };
  }
  function bindSnapshot(data) {
    if (!data || !Array.isArray(data.players) || !data.leaderboards || !data.leaderboards.allTime) {
      throw new Error('Invalid public JahAnti data format');
    }
    const at = data.leaderboards.allTime;
    // Compatibility with the existing homepage Top Players component.
    window.JAHANTI_PLAYERS = data.players.map(normalizedPlayer);
    window.JAHANTI_LEADERBOARDS = {
      fc: cleanArray(at.fifaFriendlies).map(r => ({...r, points: Number(r.wins) || 0})),
      fortnite: cleanArray(at.fortnite),
      cod: cleanArray(at.cod),
      redsec: cleanArray(at.redsec),
      domino: cleanArray(at.domino1v1)
    };
    window.JAHANTI_PUBLIC_DATA = data;
    return data;
  }
  // The timestamp is part of the URL, so a normal visit/reload doesn't reuse old JSON.
  // GitHub Pages can still need time to deploy a newly published commit.
  const freshUrl = PUBLIC_PATH + '?ts=' + encodeURIComponent(String(Date.now()));
  window.JAHANTI_PUBLIC_READY = fetch(freshUrl, { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error('JahAnti public data HTTP ' + response.status);
      return response.json();
    })
    .then(bindSnapshot)
    .catch(error => {
      console.warn('JahAnti public data unavailable:', error.message);
      // Never fall back to demo or private profiles, and never show stale results.
      window.JAHANTI_PLAYERS = [];
      window.JAHANTI_LEADERBOARDS = {};
      window.JAHANTI_PUBLIC_DATA = null;
      return null;
    });
})();

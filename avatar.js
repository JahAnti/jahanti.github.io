/* JahAnti v11 — universal avatar resolver. No external services or private data. */
(() => {
  'use strict';
  const FALLBACK = 'assets/players/placeholder.webp';
  // Public avatar images must be files in our own website's player-image directory.
  const VALID = /^assets\/players\/[a-z0-9][a-z0-9_.-]*\.(?:webp|png|jpe?g)$/i;
  function initials(name) {
    return String(name || 'JA').trim().split(/\s+/).map(w => w[0] || '').join('').slice(0,2).toUpperCase() || 'JA';
  }
  function create(player, cssClass = 'player-avatar') {
    const name = String(player?.name || 'JahAnti player');
    const src = typeof player?.avatarUrl === 'string' && VALID.test(player.avatarUrl)
      ? player.avatarUrl : FALLBACK;
    const img = document.createElement('img');
    img.className = cssClass;
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = src;
    img.dataset.fallback = String(src === FALLBACK);
    img.addEventListener('error', () => {
      if (img.dataset.fallback !== 'true') {
        img.dataset.fallback = 'true';
        img.src = FALLBACK;
      } else {
        // Even if the shared placeholder is missing, the layout stays useful.
        const span = document.createElement('span');
        span.className = cssClass;
        span.textContent = initials(name);
        img.replaceWith(span);
      }
    });
    return img;
  }
  window.JAHANTI_AVATAR = Object.freeze({ create, fallback: FALLBACK });
})();

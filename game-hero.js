/* Shared data-driven player hero selector; exported mostPlayedGame is authoritative. */
window.JA_HERO_GAME = p => {const k=String(p?.mostPlayedGame||'default');return ['fc','fortnite','cod','redsec','domino'].includes(k)?k:'default';};

/* JahAnti Last 5 Games v1.1 — read-only, accessible W/D/L form indicators. */
(() => {
  'use strict';
  const valid = new Set(['W','D','L']);
  const labels = {W:'Win', D:'Draw', L:'Loss'};
  const symbols = {W:'✓', D:'−', L:'×'};
  let dialog;
  let backFocus;
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = String(text);
    return node;
  };
  const dateText = value => {
    const date = /^\d{4}-\d{2}-\d{2}/.exec(String(value || ''));
    if (!date) return 'Date unavailable';
    const d = new Date(date[0] + 'T12:00:00Z');
    return Number.isNaN(+d) ? date[0] : d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
  };
  function ensureDialog() {
    if(dialog) return dialog;
    dialog = el('dialog','ja-form-dialog');
    dialog.setAttribute('aria-labelledby','ja-form-dialog-title');
    const heading = el('div','ja-form-dialog-heading');
    const h = el('h3','', 'Match details'); h.id='ja-form-dialog-title';
    const close = el('button','ja-form-close','Close');
    close.type='button'; close.setAttribute('aria-label','Close match details');
    close.addEventListener('click',()=>dialog.close());
    heading.append(h,close);
    const content = el('div','ja-form-dialog-body');content.id='ja-form-dialog-body';
    dialog.append(heading,content);
    dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
    dialog.addEventListener('close',()=>{if(backFocus?.isConnected)backFocus.focus();backFocus=null});
    document.body.append(dialog);
    return dialog;
  }
  function details(game,button) {
    const dlg=ensureDialog(),box=dlg.querySelector('#ja-form-dialog-body');box.replaceChildren();
    const result=valid.has(game.result)?game.result:'D';
    const headline=el('p','ja-form-detail-outcome ja-form-'+result,labels[result]+(game.admin?' · Administrative award':''));
    box.append(headline);
    if(game.player)box.append(el('p','ja-form-detail-player',game.player));
    box.append(el('p','ja-form-detail-opponent','vs '+(game.opponent||'Opponent unavailable')));
    if(game.score!==undefined && game.score!==null && game.score!=='')
      box.append(el('p','ja-form-detail-score','Score: '+game.score));
    box.append(el('p','ja-form-detail-date',dateText(game.date)));
    if(game.admin)box.append(el('p','ja-form-detail-note','Administrative 3–0 result: counts in tournament standings, not Official rankings.'));
    backFocus=button;
    if(typeof dlg.showModal==='function')dlg.showModal();
    else dlg.setAttribute('open','');
  }
  function render(entries,options={}) {
    const wrap=el('span','ja-form'+(options.compact?' ja-form-compact':''));
    wrap.setAttribute('aria-label','Last five completed results, oldest to newest');
    const games=Array.isArray(entries)?entries.filter(x=>x && valid.has(x.result)).slice(-5):[];
    // Reserve five positions even if this player has played fewer matches.
    // Oldest on the left; blank placeholders align at the beginning.
    for(let i=games.length;i<5;i++){
      const blank=el('span','ja-form-pip ja-form-placeholder');
      blank.setAttribute('aria-label','No recorded match');blank.title='No recorded match';
      wrap.append(blank);
    }
    games.forEach((game,i)=>{
      const title=labels[game.result]+(game.admin?' (administrative award)':'')+' · '+dateText(game.date)+
        (game.opponent?' · vs '+game.opponent:'')+(game.score?' · '+game.score:'');
      const button=el('button','ja-form-pip ja-form-'+game.result+(game.admin?' is-admin':''),symbols[game.result]);
      button.type='button';button.title=title;
      button.setAttribute('aria-label',title);
      button.setAttribute('data-result-index',String(i));
      button.addEventListener('click',()=>details({...game,player:game.player||options.player||''},button));
      wrap.append(button);
    });
    return wrap;
  }
  window.JAHANTI_LAST5 = Object.freeze({render,dateText});
})();

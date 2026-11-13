/* JahAnti v10 game rankings: public aggregate data only, no private Sheet API. */
(() => {
  'use strict';
  const CONFIG = {
    fc:       { title: 'EA SPORTS FC', tag: 'JAHANTI / FOOTBALL ARENA', description: 'From the first whistle to the final goal. Every friendly counts.', category: 'fifaFriendlies', subtitle: 'Friendly matches', symbol: '⚽' },
    fortnite: { title: 'FORTNITE', tag: 'JAHANTI / BATTLE ROYALE', description: 'Squad up. Drop in. Fight your way to the top.', category: 'fortnite', subtitle: 'Individual rankings', symbol: '✦' },
    cod:      { title: 'CALL OF DUTY', tag: 'JAHANTI / TACTICAL ARENA', description: 'Precision, teamwork and the wins that separate the crew.', category: 'cod', subtitle: 'Individual rankings', symbol: '⌖' },
    redsec:   { title: 'BATTLEFIELD REDSEC', tag: 'JAHANTI / THE BATTLEFIELD', description: 'Every squad has a story. Every victory leaves a mark.', category: 'redsec', subtitle: 'Individual rankings', symbol: '✕' },
    domino:   { title: 'TRUPIAL DOMINO', tag: 'JAHANTI / THE TABLE', description: 'Read the table. Play your tiles. Claim your place.', category: 'domino1v1', subtitle: '1v1 and 2v2 rankings', symbol: '⚄' },
    shooters: { title: 'COMBINED SHOOTERS', tag: 'JAHANTI / THREE BATTLEFIELDS', description: 'Fortnite. Call of Duty. REDSEC. One combined record.', category: 'combinedShooters', subtitle: 'All shooter games combined', symbol: '◎' }
  };
  const CARDS = ['fortnite', 'cod', 'redsec', 'domino', 'fc', 'shooters'];
  let publicData = null;
  let dominoCategory = 'domino1v1';
  let period = 'allTime';
  let anchor = todayISO();
  let category = 'fortnite';
  function todayISO() { const d = new Date(); return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-'); }
  function parseDay(iso) { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || '')); const d = m ? new Date(Date.UTC(+m[1], +m[2]-1, +m[3], 12)) : new Date(Date.UTC(2026,10,13,12)); return Number.isNaN(+d) ? new Date(Date.UTC(2026,10,13,12)) : d; }
  function dateISO(d) { return d.toISOString().slice(0,10); }
  function mondayKey(iso) { const d=parseDay(iso); d.setUTCDate(d.getUTCDate() - (d.getUTCDay()+6)%7); return dateISO(d); }
  function readable(d) { return d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}); }
  function periodRange() {
    if (period==='allTime') return 'All eligible confirmed results';
    const d=parseDay(anchor);
    if(period==='monthly') return d.toLocaleDateString('en-GB',{month:'long',year:'numeric',timeZone:'UTC'});
    const mon=parseDay(mondayKey(anchor)), end=parseDay(mondayKey(anchor));end.setUTCDate(end.getUTCDate()+6);
    return readable(mon) + ' – ' + readable(end);
  }
  function periodKey() { return period==='weekly' ? mondayKey(anchor) : anchor.slice(0,7); }
  function fromLegacy() {
    const old=window.JAHANTI_LEADERBOARDS||{};
    const allTime={
      fortnite:old.fortnite||[],cod:old.cod||[],redsec:old.redsec||[],fifaFriendlies:old.fc||[],
      domino1v1:old.domino||[],domino2v2:[],combinedShooters:[]
    };
    return {players:(window.JAHANTI_PLAYERS||[]).filter(p=>!p.demo),leaderboards:{allTime,monthly:{},weekly:{}}};
  }
  async function load() {
    try {
      const response=await fetch('./data/jahanti-public.json',{cache:'no-store'});
      if(!response.ok)throw new Error('No published public data file');
      const data=await response.json();
      if(!data || !data.leaderboards || !data.leaderboards.allTime || !Array.isArray(data.players))throw new Error('Invalid data');
      return data;
    } catch (_) { return fromLegacy(); }
  }
  function rowsFor(key) {
    const lbs=publicData?.leaderboards || {};
    const group=period==='allTime' ? lbs.allTime : (lbs[period]||{})[periodKey()];
    const rows=group && Array.isArray(group[key]) ? group[key] : [];
    const sorted=[...rows];
    const number=(r,f)=>Number(r[f])||0;
    sorted.sort((a,b)=>number(b,'wins')-number(a,'wins') ||
      (key.startsWith('domino') ? number(a,'losses')-number(b,'losses') :
       key==='fifaFriendlies' ? number(b,'goalDifference')-number(a,'goalDifference') :
       number(b,'kills')-number(a,'kills') || number(b,'assists')-number(a,'assists')) ||
       String(a.name||'').localeCompare(String(b.name||'')));
    let lastRank=0;
    return sorted.map((r,i)=>{
      const p=sorted[i-1];
      const tie=p && number(p,'wins')===number(r,'wins') &&
        (key.startsWith('domino') ? number(p,'losses')===number(r,'losses') :
         key==='fifaFriendlies' ? number(p,'goalDifference')===number(r,'goalDifference') :
         number(p,'kills')===number(r,'kills') && number(p,'assists')===number(r,'assists'));
      lastRank=tie?lastRank:i+1;
      return {...r,rank:lastRank};
    });
  }
  function el(tag, cls, label) { const n=document.createElement(tag);if(cls)n.className=cls;if(label!==undefined)n.textContent=String(label);return n; }
  function playerFor(r) { return (publicData?.players||[]).find(p=>p.id===r.playerId || p.name===r.name); }
  function avatarFor(r) {
    const p=playerFor(r), initials=(p?.avatar || (r.name||'?').split(/\s+/).map(x=>x[0]).join('').slice(0,2)).toUpperCase();
    const fallback=()=>el('span','rank-avatar',initials);
    if(!p?.avatarUrl || !/^assets\/players\/[a-z0-9_.-]+\.(webp|png|jpe?g)$/i.test(p.avatarUrl))return fallback();
    const img=el('img','rank-avatar');img.src=p.avatarUrl;img.alt='';img.loading='lazy';
    img.addEventListener('error',()=>img.replaceWith(fallback()),{once:true});return img;
  }
  function nameFor(r) {
    const item=el('span','rank-mini-player');item.append(avatarFor(r));
    const p=playerFor(r),text=el('span','name',r.name||'JahAnti Player');
    if(p?.slug){const a=el('a','');a.href='player.html?p='+encodeURIComponent(p.slug);a.append(text);item.append(a)}
    else item.append(text);
    return item;
  }
  function num(r,k){return String(Number(r[k])||0)}
  function statLabel(key) { if(key.startsWith('domino'))return 'W · L';if(key==='fifaFriendlies')return 'W · GD';return 'W · K · A'; }
  function stats(key,r) {if(key.startsWith('domino'))return num(r,'wins')+' · '+num(r,'losses');if(key==='fifaFriendlies')return num(r,'wins')+' · '+num(r,'goalDifference');return num(r,'wins')+' · '+num(r,'kills')+' · '+num(r,'assists');}
  function renderOverview() {
    const target=document.getElementById('alltime-overview');if(!target)return;
    period='allTime';target.replaceChildren();
    for(const id of CARDS){
      const game=CONFIG[id];const key=id==='domino'?dominoCategory:game.category;
      const card=el('article','rank-card'),head=el('div','rank-card-header');
      head.append(el('span','rank-icon',game.symbol));
      if(id==='domino'){
        const switcher=el('div','mode-selector');switcher.setAttribute('role','group');switcher.setAttribute('aria-label','Domino leaderboard mode');
        for(const [k,label] of [['domino1v1','1v1'],['domino2v2','2v2']]){
          const b=el('button','mode-button'+(k===dominoCategory?' is-selected':''),label);b.type='button';b.dataset.dominoSwitch=k;b.setAttribute('aria-pressed',String(k===dominoCategory));switcher.append(b);
        }head.append(switcher);
      }else head.append(el('small','', 'ALL-TIME'));
      head.append(el('h3','',game.title));head.append(el('p','',id==='domino'?(dominoCategory==='domino1v1'?'1v1 individual rankings':'2v2 individual rankings'):game.subtitle));card.append(head);
      const body=el('div','rank-card-body'),top=el('div','rank-card-columns');top.append(el('span','', '#'));top.append(el('span','', 'PLAYER'));top.append(el('span','',statLabel(key)));body.append(top);
      const rows=rowsFor(key).slice(0,5);
      if(!rows.length)body.append(el('p','rank-card-empty','No public results yet.'));
      else rows.forEach(r=>{const row=el('div','rank-card-row');row.append(el('span','rank-number',r.rank));row.append(nameFor(r));row.append(el('span','rank-mini-stats',stats(key,r)));body.append(row)});
      card.append(body);const footer=el('a','rank-card-footer');footer.href='game.html?game='+encodeURIComponent(id)+(id==='domino'?'&mode='+encodeURIComponent(dominoCategory==='domino2v2'?'2v2':'1v1'):'');footer.append(el('span','','VIEW FULL LEADERBOARD'));footer.append(el('span','','↗'));card.append(footer);target.append(card);
    }
  }
  function setColumns(key) {
    const head=document.getElementById('ranking-table-head');head.replaceChildren();const line=el('tr');
    const fields=key.startsWith('domino') ? [
      ['#',false],['PLAYER',false],['WINS',true],['LOSSES',true],['MATCHES',true,'hide-mobile'],['WIN %',true,'hide-mobile']
    ] : key==='fifaFriendlies' ? [
      ['#',false],['PLAYER',false],['WINS',true],['GD',true],['GOALS FOR',true],['LOSSES',true,'hide-mobile'],['DRAWS',true,'hide-mobile'],['MATCHES',true,'hide-mobile']
    ] : [
      ['#',false],['PLAYER',false],['WINS',true],['KILLS',true],['ASSISTS',true],['MATCHES',true,'hide-mobile']
    ];
    fields.forEach(([label,numeric,mobile])=>{const th=el('th',(numeric?'numeric ':'')+(mobile||''),label);th.scope='col';line.append(th)});head.append(line);
    return fields.length;
  }
  function tdNum(r,k,mobile){const td=el('td','numeric '+(mobile||''),num(r,k));return td}
  function renderDetail() {
    const game=Object.entries(CONFIG).find(([_,v])=>v.category===category)?.[1]||CONFIG.domino;
    const key=category;
    const label=document.getElementById('ranking-range'),nav=document.getElementById('period-navigation');
    label.textContent=periodRange();nav.hidden=period==='allTime';
    document.getElementById('period-label').textContent=periodRange();
    document.getElementById('period-date').value=anchor;
    document.querySelectorAll('[data-period]').forEach(b=>{const active=b.dataset.period===period;b.classList.toggle('is-selected',active);b.setAttribute('aria-pressed',String(active))});
    document.querySelectorAll('[data-mode]').forEach(b=>{const active=b.dataset.mode===category;b.classList.toggle('is-selected',active);b.setAttribute('aria-pressed',String(active))});
    const countCols=setColumns(key),tbody=document.getElementById('ranking-table-body');tbody.replaceChildren();
    const rows=rowsFor(key);
    if(!rows.length){const tr=el('tr'),td=el('td','empty-row','No confirmed public results for this period yet.');td.colSpan=countCols;tr.append(td);tbody.append(tr)}
    else rows.forEach(r=>{
      const tr=el('tr');const rank=el('td',Number(r.rank)===1?'first-rank':'',r.rank);tr.append(rank);const name=el('td','player-cell');name.append(nameFor(r));tr.append(name);
      if(key.startsWith('domino')){
        tr.append(tdNum(r,'wins'),tdNum(r,'losses'),tdNum(r,'matches','hide-mobile'));
        const m=Number(r.matches)||Number(r.wins)+Number(r.losses)||0;tr.append(el('td','numeric hide-mobile',m?((Number(r.wins)||0)/m*100).toFixed(1)+'%':'—'));
      }else if(key==='fifaFriendlies'){
        tr.append(tdNum(r,'wins'),tdNum(r,'goalDifference'),tdNum(r,'goalsFor'),tdNum(r,'losses','hide-mobile'),tdNum(r,'draws','hide-mobile'),tdNum(r,'matches','hide-mobile'));
      }else{tr.append(tdNum(r,'wins'),tdNum(r,'kills'),tdNum(r,'assists'),tdNum(r,'matches','hide-mobile'))}
      tbody.append(tr);
    });
    const matchMeta=document.getElementById('ranking-meta');if(matchMeta)matchMeta.textContent=rows.length+' publicly ranked player'+(rows.length===1?'':'s')+' · Only confirmed results.';
  }
  function shiftPeriod(direction){const d=parseDay(anchor);if(period==='weekly')d.setUTCDate(d.getUTCDate()+7*direction);else if(period==='monthly'){const day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+direction);const last=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0,12)).getUTCDate();d.setUTCDate(Math.min(day,last))}anchor=dateISO(d);renderDetail()}
  function initGame(){
    const params=new URLSearchParams(location.search),id=Object.prototype.hasOwnProperty.call(CONFIG,params.get('game'))?params.get('game'):'fortnite',g=CONFIG[id];category=g.category;
    if(id==='domino'&&params.get('mode')==='2v2')category='domino2v2';
    document.body.dataset.game=id;document.title=g.title+' Leaderboard — JahAnti';
    document.getElementById('arena-tag').textContent=g.tag;document.getElementById('arena-title').textContent=g.title;
    document.getElementById('arena-desc').textContent=g.description;document.getElementById('ranking-heading').textContent=g.title+' Rankings';
    if(id==='domino')document.getElementById('domino-selector').hidden=false;
    document.querySelectorAll('[data-period]').forEach(b=>b.addEventListener('click',()=>{period=b.dataset.period;renderDetail()}));
    document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.mode;renderDetail()}));
    document.getElementById('period-prev').addEventListener('click',()=>shiftPeriod(-1));
    document.getElementById('period-next').addEventListener('click',()=>shiftPeriod(1));
    document.getElementById('period-date').addEventListener('change',e=>{if(e.target.value){anchor=e.target.value;renderDetail()}});
    renderDetail();
  }
  document.addEventListener('DOMContentLoaded',async()=>{
    if(!['rankings-overview','ranking-game'].includes(document.body.dataset.page))return;
    publicData=await load();
    if(document.body.dataset.page==='rankings-overview'){
      const overview=document.getElementById('alltime-overview');
      overview.addEventListener('click',ev=>{const button=ev.target.closest('button[data-domino-switch]');if(!button)return;dominoCategory=button.dataset.dominoSwitch;renderOverview()});
      renderOverview();
    }else initGame();
  });
})();

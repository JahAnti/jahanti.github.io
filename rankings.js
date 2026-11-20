/* JahAnti v13: public aggregate rankings, global period filters and 20-player pagination. */
(() => {
  'use strict';
  const CONFIG = {
    fc:       { title: 'EA SPORTS FC', tag: 'JAHANTI / FOOTBALL ARENA', description: 'From the first whistle to the final goal. Tournaments and friendlies.', category: 'fifaOfficial', subtitle: 'Official tournament rankings', symbol: '⚽' },
    fortnite: { title: 'FORTNITE', tag: 'JAHANTI / BATTLE ROYALE', description: 'Squad up. Drop in. Fight your way to the top.', category: 'fortnite', subtitle: 'Individual rankings', symbol: '✦' },
    cod:      { title: 'CALL OF DUTY', tag: 'JAHANTI / TACTICAL ARENA', description: 'Precision, teamwork and the wins that separate the crew.', category: 'cod', subtitle: 'Individual rankings', symbol: '⌖' },
    redsec:   { title: 'BATTLEFIELD REDSEC', tag: 'JAHANTI / THE BATTLEFIELD', description: 'Every squad has a story. Every victory leaves a mark.', category: 'redsec', subtitle: 'Individual rankings', symbol: '✕' },
    domino:   { title: 'TRUPIAL DOMINO', tag: 'JAHANTI / THE TABLE', description: 'Read the table. Play your tiles. Claim your place.', category: 'domino1v1', subtitle: '1v1 and 2v2 rankings', symbol: '⚄' },
    shooters: { title: 'COMBINED SHOOTERS', tag: 'JAHANTI / THREE BATTLEFIELDS', description: 'Fortnite. Call of Duty. REDSEC. One combined record.', category: 'combinedShooters', subtitle: 'All shooter games combined', symbol: '◎' }
  };
  const CARDS = ['fortnite', 'cod', 'redsec', 'domino', 'fc', 'shooters'];
  const gameIcon = k => window.JAHANTI_GAME_UI?.icon(k) || el('span','rank-icon','◆');
  let publicData = null;
  let dominoCategory = 'domino1v1';
  let fcCategory = 'fifaOfficial';
  let period = 'allTime';
  let anchor = todayISO();
  let category = 'fortnite';
  const PAGE_SIZE = 20;
  let detailPage = 1;
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
      domino1v1:old.domino||[],domino2v2:[],combinedShooters:[],fifaOfficial:[]
    };
    return {players:(window.JAHANTI_PLAYERS||[]).filter(p=>!p.demo),leaderboards:{allTime,monthly:{},weekly:{}}};
  }
  async function load() {
    // public-data.js uses a cache-busting URL and resolves before rendering.
    if (window.JAHANTI_PUBLIC_READY) {
      const data = await window.JAHANTI_PUBLIC_READY;
      return data || { players: [], leaderboards: { allTime: {}, monthly: {}, weekly: {} } };
    }
    return fromLegacy();
  }
  function rowsFor(key) {
    const lbs=publicData?.leaderboards || {};
    const group=period==='allTime' ? lbs.allTime : (lbs[period]||{})[periodKey()];
    const rows=group && Array.isArray(group[key]) ? group[key] : [];
    const sorted=[...rows];
    const number=(r,f)=>Number(r[f])||0;
    sorted.sort((a,b)=>number(b,'wins')-number(a,'wins') ||
      (key.startsWith('domino') ? number(a,'losses')-number(b,'losses') :
       key.startsWith('fifa') ? number(b,'goalDifference')-number(a,'goalDifference') :
       number(b,'kills')-number(a,'kills') || number(b,'assists')-number(a,'assists')) ||
       String(a.name||'').localeCompare(String(b.name||'')));
    let lastRank=0;
    return sorted.map((r,i)=>{
      const p=sorted[i-1];
      const tie=p && number(p,'wins')===number(r,'wins') &&
        (key.startsWith('domino') ? number(p,'losses')===number(r,'losses') :
         key.startsWith('fifa') ? number(p,'goalDifference')===number(r,'goalDifference') :
         number(p,'kills')===number(r,'kills') && number(p,'assists')===number(r,'assists'));
      lastRank=tie?lastRank:i+1;
      return {...r,rank:lastRank};
    });
  }
  function el(tag, cls, label) { const n=document.createElement(tag);if(cls)n.className=cls;if(label!==undefined)n.textContent=String(label);return n; }
  function playerFor(r) { return (publicData?.players||[]).find(p=>p.id===r.playerId || p.name===r.name); }
  function avatarFor(r) {
    const p=playerFor(r) || {name:r.name||'JahAnti player'};
    return window.JAHANTI_AVATAR?.create(p,'rank-avatar') || el('span','rank-avatar',(r.name||'JA').slice(0,2).toUpperCase());
  }

  function nameFor(r) {
    const item=el('span','rank-mini-player');item.append(avatarFor(r));
    const p=playerFor(r),text=el('span','name',r.name||'JahAnti Player');
    if(p?.slug){const a=el('a','');a.href='/players/'+encodeURIComponent(p.slug)+'/';a.append(text);item.append(a)}
    else item.append(text);
    return item;
  }
  function num(r,k){return String(Number(r[k])||0)}
  function statLabel(key) { if(key.startsWith('domino'))return 'W · L';if(key.startsWith('fifa'))return 'W · GD';return 'W · K · A'; }
  function stats(key,r) {if(key.startsWith('domino'))return num(r,'wins')+' · '+num(r,'losses');if(key.startsWith('fifa'))return num(r,'wins')+' · '+num(r,'goalDifference');return num(r,'wins')+' · '+num(r,'kills')+' · '+num(r,'assists');}
  function detailedStats(key,r){if(key.startsWith('domino'))return num(r,'wins')+' W · '+num(r,'losses')+' L';if(key.startsWith('fifa'))return num(r,'wins')+' W · '+num(r,'goalDifference')+' GD';return num(r,'wins')+' W · '+num(r,'kills')+' K · '+num(r,'assists')+' A'}
  function hasForm(key){return key.startsWith('fifa')||key.startsWith('domino');}
  function formForRow(key,r,compact=false){
    if(!hasForm(key))return null;
    if(window.JAHANTI_LAST5)return window.JAHANTI_LAST5.render(r.lastFive,{player:r.name,compact});
    return el('span','ja-form-empty','—');
  }
  function periodTitle(){return period==='allTime'?'ALL-TIME':period==='monthly'?'MONTHLY':'WEEKLY';}
  function overviewLink(id){
    const params=new URLSearchParams();
    if(id==='domino')params.set('mode',dominoCategory==='domino2v2'?'2v2':'1v1');
    if(period!=='allTime'){
      params.set('period',period);
      params.set('anchor',anchor);
    }
    return '/games/'+id+'/'+(params.size?'?'+params.toString():'');
  }
  function renderOverview() {
    const target=document.getElementById('alltime-overview');if(!target)return;
    target.replaceChildren();
    const nav=document.getElementById('overview-period-navigation');
    nav.hidden=period==='allTime';
    document.getElementById('overview-period-label').textContent=periodRange();
    document.getElementById('overview-period-date').value=anchor;
    document.getElementById('overview-period').value=period;
    document.getElementById('overview-period-status').textContent=period==='allTime'?'All-Time Top 5 per game':periodTitle()+' Top 5 per game · '+periodRange();
    // The hero is intentionally free of redundant period badges.
    for(const id of CARDS){
      const game=CONFIG[id];const key=id==='domino'?dominoCategory:id==='fc'?fcCategory:game.category;
      const card=el('article','rank-card'),head=el('div','rank-card-header');
      card.dataset.jaHero=id;
      const topRow=el('div','rank-card-top');
      const iconWrap=el('span','rank-icon');iconWrap.append(gameIcon(id));topRow.append(iconWrap);
      topRow.append(el('small','rank-card-period',periodTitle()));
      head.append(topRow);
      head.append(el('h3','',game.title));
      head.append(el('p','',id==='domino'?(dominoCategory==='domino1v1'?'1v1 individual rankings':'2v2 individual rankings'):game.subtitle));
      if(id==='domino'){
        const switcher=el('div','mode-selector');switcher.setAttribute('role','group');switcher.setAttribute('aria-label','Domino leaderboard mode');
        for(const [k,label] of [['domino1v1','1v1'],['domino2v2','2v2']]){
          const b=el('button','mode-button'+(k===dominoCategory?' is-selected':''),label);
          b.type='button';b.dataset.dominoSwitch=k;b.setAttribute('aria-pressed',String(k===dominoCategory));switcher.append(b);
        }
        head.append(switcher);
      }
      card.append(head);
      const body=el('div','rank-card-body'),top=el('div','rank-card-columns');
      top.append(el('span','', '#'));top.append(el('span','', 'PLAYER'));top.append(el('span','',statLabel(key)));body.append(top);
      const rows=rowsFor(key).slice(0,5);
      if(!rows.length)body.append(el('p','rank-card-empty','No rankings yet for this period.'));
      else rows.forEach(r=>{
        const podium=Number(r.rank)>=1&&Number(r.rank)<=3;
        const row=el('div',podium?'rank-card-row rank-top-three rank-tier-'+r.rank:'rank-card-row');
        row.append(el('span','rank-number',r.rank));row.append(nameFor(r));row.append(el('span','rank-mini-stats',stats(key,r)));body.append(row);
      });
      card.append(body);
      const footer=el('a','rank-card-footer');footer.href=overviewLink(id);
      footer.append(el('span','','VIEW FULL LEADERBOARD'));footer.append(el('span','','↗'));card.append(footer);target.append(card);
    }
  }
  function setColumns(key) {
    const head=document.getElementById('ranking-table-head');head.replaceChildren();const line=el('tr');
    const fields=key.startsWith('domino') ? [
      ['#',false],['PLAYER',false],['WINS',true],['LOSSES',true],['LAST 5',true,'ja-form-heading']
    ] : key.startsWith('fifa') ? [
      ['#',false],['PLAYER',false],['WINS',true],['GF',true],['GA',true],['GD',true],['LOSSES',true,'hide-mobile'],['DRAWS',true,'hide-mobile'],['MATCHES',true,'hide-mobile'],['LAST 5',true,'ja-form-heading']
    ] : [
      ['#',false],['PLAYER',false],['WINS',true],['KILLS',true],['ASSISTS',true],['MATCHES',true,'hide-mobile']
    ];
    fields.forEach(([label,numeric,mobile])=>{const th=el('th',(numeric?'numeric ':'')+(mobile||''),label);th.scope='col';line.append(th)});head.append(line);
    return fields.length;
  }
  function tdNum(r,k,mobile){const td=el('td','numeric '+(mobile||''),num(r,k));td.dataset.stat=({wins:'W',losses:'L',draws:'D',goalsFor:'GF',goalsAgainst:'GA',goalDifference:'GD',matches:'P',kills:'K',assists:'A'})[k]||k;return td}
  function renderPagination(total) {
    const nav=document.getElementById('ranking-pagination');
    const summary=document.getElementById('ranking-page-summary');
    const prev=document.getElementById('ranking-page-prev');
    const next=document.getElementById('ranking-page-next');
    const numbers=document.getElementById('ranking-page-numbers');
    const pageCount=Math.max(1,Math.ceil(total/PAGE_SIZE));
    detailPage=Math.min(Math.max(1,detailPage),pageCount);
    nav.hidden=total<=PAGE_SIZE;
    summary.textContent=total?'Showing '+((detailPage-1)*PAGE_SIZE+1)+'–'+Math.min(detailPage*PAGE_SIZE,total)+' of '+total+' players':'No rankings yet for this period';
    prev.disabled=detailPage<=1;next.disabled=detailPage>=pageCount;
    numbers.replaceChildren();
    if(total<=PAGE_SIZE)return;
    // Keep mobile navigation compact when many pages are present.
    const pages=new Set([1,pageCount,detailPage-1,detailPage,detailPage+1]);
    const visible=[...pages].filter(n=>n>=1&&n<=pageCount).sort((a,b)=>a-b);
    let last=0;
    for(const n of visible){
      if(last&&n>last+1)numbers.append(el('span','ranking-page-ellipsis','…'));
      const b=el('button','ranking-page-button'+(n===detailPage?' is-selected':''),n);
      b.type='button';b.dataset.page=String(n);b.setAttribute('aria-label','Page '+n);
      if(n===detailPage)b.setAttribute('aria-current','page');
      numbers.append(b);last=n;
    }
  }
  function changeDetailPage(nextPage){
    const total=rowsFor(category).length;
    const pages=Math.max(1,Math.ceil(total/PAGE_SIZE));
    const newPage=Math.max(1,Math.min(pages,nextPage));
    if(newPage===detailPage)return;
    detailPage=newPage;
    renderDetail();
    const table=document.querySelector('.rank-table-wrap');
    if(table){
      const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      table.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
    }
  }
  function renderDetail() {
    const game=category.startsWith('fifa')?CONFIG.fc:(Object.entries(CONFIG).find(([_,v])=>v.category===category)?.[1]||CONFIG.domino);
    const key=category;
    const label=document.getElementById('ranking-range'),nav=document.getElementById('period-navigation');
    const backParams=new URLSearchParams();
    if(period!=='allTime'){backParams.set('period',period);backParams.set('anchor',anchor)}
    if(key==='domino2v2')backParams.set('mode','2v2');
    const backUrl='/leaderboards/'+(backParams.size?'?'+backParams.toString():'');
    document.querySelector('.arena-back').href=backUrl;
    document.querySelector('.ranking-under a').href=backUrl;
    label.textContent=periodRange();nav.hidden=period==='allTime';
    document.getElementById('period-label').textContent=periodRange();
    document.getElementById('period-date').value=anchor;
    document.querySelectorAll('[data-period]').forEach(b=>{const active=b.dataset.period===period;b.classList.toggle('is-selected',active);b.setAttribute('aria-pressed',String(active))});
    document.querySelectorAll('[data-mode]').forEach(b=>{const active=b.dataset.mode===category;b.classList.toggle('is-selected',active);b.setAttribute('aria-pressed',String(active))});
    document.querySelectorAll('[data-fc-category]').forEach(b=>{const active=b.dataset.fcCategory===category;b.classList.toggle('is-selected',active);b.setAttribute('aria-pressed',String(active))});
    const countCols=setColumns(key),tbody=document.getElementById('ranking-table-body');tbody.replaceChildren();
    const podium=document.getElementById('ranking-podium');podium.replaceChildren();
    const table=document.querySelector('.rank-table-wrap');
    const rows=rowsFor(key);
    const windowRows=rows.slice((detailPage-1)*PAGE_SIZE,detailPage*PAGE_SIZE);
    for(const r of windowRows){
      if(Number(r.rank)>=1&&Number(r.rank)<=3){
        const item=el('div','rank-detail-top-three rank-tier-'+r.rank);
        item.append(el('span','rank-number',r.rank),nameFor(r));
        if(hasForm(key)){
          // Keep the statistics prominent and the recent-form circles after them,
          // on ONE line. The strip scrolls horizontally on smaller screens.
          const strip=el('div','ja-form-podium');
          strip.setAttribute('aria-label','Player statistics and last five matches');
          const metrics=el('div','ja-form-podium-stats');
          const columns=key.startsWith('fifa')
            ? [['wins','W'],['draws','D'],['losses','L'],['goalsFor','GF'],['goalsAgainst','GA'],['goalDifference','GD']]
            : [['wins','W'],['losses','L']];
          columns.forEach(([field,label])=>{
            const stat=el('span','ja-podium-stat');
            const raw=Number(r[field])||0;
            const value=field==='goalDifference'&&raw>0?'+'+raw:String(raw);
            stat.append(el('strong','ja-podium-stat-value',value),el('small','ja-podium-stat-label',label));
            metrics.append(stat);
          });
          const recent=el('div','ja-podium-recent');
          recent.append(el('span','ja-podium-recent-label','LAST 5'),formForRow(key,r,true));
          strip.append(metrics,recent);item.append(strip);
        }else item.append(el('span','rank-mini-stats',detailedStats(key,r)));
        podium.append(item);
      }else{
        const tr=el('tr');tr.append(el('td','',r.rank));const name=el('td','player-cell');name.append(nameFor(r));tr.append(name);
        if(key.startsWith('domino')){
          tr.append(tdNum(r,'wins'),tdNum(r,'losses'));
        }else if(key.startsWith('fifa')){
          tr.append(tdNum(r,'wins'),tdNum(r,'goalsFor'),tdNum(r,'goalsAgainst'),tdNum(r,'goalDifference'),tdNum(r,'losses','hide-mobile'),tdNum(r,'draws','hide-mobile'),tdNum(r,'matches','hide-mobile'));
        }else tr.append(tdNum(r,'wins'),tdNum(r,'kills'),tdNum(r,'assists'),tdNum(r,'matches','hide-mobile'));
        if(hasForm(key)){
          const td=el('td','ja-form-cell');td.dataset.stat='LAST 5';td.append(formForRow(key,r));tr.append(td);
        }
        tbody.append(tr);
      }
    }
    if(!rows.length){const item=el('p','rank-detail-empty','No rankings yet for this period.');podium.append(item)}
    podium.hidden=!podium.children.length;
    table.hidden=!tbody.children.length;
    renderPagination(rows.length);
  }
  function shiftPeriod(direction){const d=parseDay(anchor);if(period==='weekly')d.setUTCDate(d.getUTCDate()+7*direction);else if(period==='monthly'){const day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+direction);const last=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0,12)).getUTCDate();d.setUTCDate(Math.min(day,last))}anchor=dateISO(d);detailPage=1;renderDetail()}
  function isDateString(s){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(s||''))return false;
    const d=parseDay(s);return dateISO(d)===s;
  }
  function initGame(){
    const params=new URLSearchParams(location.search);
    const pathGame=location.pathname.match(/^\/games\/([a-z0-9-]+)\/?$/i)?.[1];
    const requested=pathGame||params.get('game');
    const id=Object.prototype.hasOwnProperty.call(CONFIG,requested)?requested:'fortnite';
    const g=CONFIG[id];category=g.category;
    if(id==='fc'&&params.get('mode')==='friendlies')category='fifaFriendlies';
    if(id==='domino'&&params.get('mode')==='2v2')category='domino2v2';
    if(['monthly','weekly','allTime'].includes(params.get('period')))period=params.get('period');
    if(isDateString(params.get('anchor')))anchor=params.get('anchor');
    document.body.dataset.game=id;document.title=g.title+' Leaderboard — JahAnti';
    document.getElementById('arena-tag').textContent=g.tag;document.getElementById('arena-title').textContent=g.title;
    document.getElementById('arena-desc').textContent=g.description;
    document.getElementById('ranking-heading').textContent=g.title+' Rankings';
    const title=document.getElementById('game-rankings-title');title.replaceChildren(document.createTextNode(g.title+' '));
    title.append(el('em','', 'RANKINGS.'));
    if(id==='domino')document.getElementById('domino-selector').hidden=false;
    if(id==='fc')document.getElementById('fc-selector').hidden=false;
    document.querySelectorAll('[data-fc-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.fcCategory;detailPage=1;renderDetail();}));
    document.querySelectorAll('[data-period]').forEach(b=>b.addEventListener('click',()=>{
      period=b.dataset.period;detailPage=1;renderDetail();
    }));
    document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{
      category=b.dataset.mode;detailPage=1;renderDetail();
    }));
    document.getElementById('period-prev').addEventListener('click',()=>shiftPeriod(-1));
    document.getElementById('period-next').addEventListener('click',()=>shiftPeriod(1));
    document.getElementById('period-date').addEventListener('change',e=>{
      if(isDateString(e.target.value)){anchor=e.target.value;detailPage=1;renderDetail()}
    });
    document.getElementById('ranking-page-prev').addEventListener('click',()=>changeDetailPage(detailPage-1));
    document.getElementById('ranking-page-next').addEventListener('click',()=>changeDetailPage(detailPage+1));
    document.getElementById('ranking-page-numbers').addEventListener('click',e=>{
      const b=e.target.closest('button[data-page]');if(b)changeDetailPage(Number(b.dataset.page));
    });
    renderDetail();
  }
  function initOverview(){
    const params=new URLSearchParams(location.search);
    if(['monthly','weekly','allTime'].includes(params.get('period')))period=params.get('period');
    if(isDateString(params.get('anchor')))anchor=params.get('anchor');
    if(params.get('mode')==='2v2')dominoCategory='domino2v2';
    const overview=document.getElementById('alltime-overview');
    overview.addEventListener('click',ev=>{
      const button=ev.target.closest('button[data-domino-switch]');
      if(!button)return;dominoCategory=button.dataset.dominoSwitch;renderOverview();
    });
    document.getElementById('overview-period').addEventListener('change',event=>{
      period=event.target.value;renderOverview();
    });
    document.getElementById('overview-period-prev').addEventListener('click',()=>{
      shiftOverview(-1);
    });
    document.getElementById('overview-period-next').addEventListener('click',()=>{
      shiftOverview(1);
    });
    document.getElementById('overview-period-date').addEventListener('change',event=>{
      if(isDateString(event.target.value)){anchor=event.target.value;renderOverview()}
    });
    renderOverview();
  }
  function shiftOverview(direction){
    const d=parseDay(anchor);
    if(period==='weekly')d.setUTCDate(d.getUTCDate()+7*direction);
    else if(period==='monthly'){
      const day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+direction);
      const last=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0,12)).getUTCDate();
      d.setUTCDate(Math.min(day,last));
    }
    anchor=dateISO(d);renderOverview();
  }
  document.addEventListener('DOMContentLoaded',async()=>{
    if(!['rankings-overview','ranking-game'].includes(document.body.dataset.page))return;
    publicData=await load();
    if(document.body.dataset.page==='rankings-overview')initOverview();
    else initGame();
  });
})();

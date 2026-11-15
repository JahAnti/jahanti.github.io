/* JahAnti EA FC Tournament Arena — read-only public viewer. No private admin API. */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const h=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=String(txt);return e;};
const empty=node=>node?.replaceChildren();
const titleDate=iso=>{if(!iso)return 'Date to be confirmed';const d=new Date(iso+'T12:00:00Z');return isNaN(d)?iso:d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});};
const name=p=>p?.name||'To be determined';
const selected=(a,v)=>{a.dataset.active=String(a.textContent===v);};
function winnerLine(f){const games=f.games||[];
 if(f.admin&&f.result)return f.result.aGoals+'–'+f.result.bGoals+' (AWD)';
 if(!games.length)return '—';
 if(f.format?.startsWith('Best of')){const a=games.filter(g=>g.aGoals>g.bGoals).length,b=games.filter(g=>g.bGoals>g.aGoals).length;return a+'–'+b+' series';}
 if(f.format==='Two legs'){const firstTwo=games.slice(0,2);if(firstTwo.length<2)return 'Leg 1: '+games[0].aGoals+'–'+games[0].bGoals;const a=firstTwo.reduce((s,g)=>s+g.aGoals,0),b=firstTwo.reduce((s,g)=>s+g.bGoals,0);return a+'–'+b+' agg.'+(games.length>2?' · replay':'');}
 return (games[games.length-1].aGoals)+'–'+(games[games.length-1].bGoals);
}
function tournamentTop(t){const x=h('div','ja-t-intro'),head=h('div','ja-t-intro-copy');head.append(h('span','ja-t-kicker',t.status==='Completed'?'COMPLETED TOURNAMENT':'FEATURED TOURNAMENT'),h('h3','',t.name));
 const meta=h('p','ja-t-meta',(t.format||'EA Sports FC')+' · '+t.players+' participants');head.append(meta);
 const stamp=h('span','ja-t-status '+(t.status==='Completed'?'ja-t-completed':'ja-t-active'),t.status==='Completed'?'Completed':t.phase==='League'?'League Phase':'Knockout Phase');x.append(head,stamp);
 if(t.champion){const champion=h('p','ja-t-champion');champion.append(h('span','','🏆 CHAMPION  '),h('strong','',name(t.champion)));x.append(champion);}
 return x;
}
/** League form uses the last five completed tournament LEAGUE fixtures only.
 * A walkover/simulation is visibly marked as an admin result and never enters
 * the main Official or Friendlies form stream. One fixture = one standing result.
 */
function leagueForm(t){
 const history={};
 (t.fixtures||[]).filter(f=>f.phase==='League'&&f.status==='Complete').forEach(f=>{
   if(!f.a?.playerId&&!f.b?.playerId)return;
   const admin=!!f.admin&&!!f.result,game=(f.games||[])[0];
   const score=admin?f.result:game;
   if(!score||!Number.isFinite(Number(score.aGoals))||!Number.isFinite(Number(score.bGoals)))return;
   const a=Number(score.aGoals),b=Number(score.bGoals);
   const at=admin?f.result.date||'':game.date||'',sort=String(at)+'|'+String(f.id||'');
   const add=(person,other,own,against)=>{
     if(!person?.playerId)return;
     const arr=history[person.playerId]||(history[person.playerId]=[]);
     arr.push({result:own>against?'W':own<against?'L':'D',opponent:name(other),score:own+'–'+against,
       date:at,admin,sort});
   };
   add(f.a,f.b,a,b);add(f.b,f.a,b,a);
 });
 Object.values(history).forEach(rows=>rows.sort((a,b)=>a.sort.localeCompare(b.sort)));
 return history;
}
function standings(t){
 const wrapper=h('div','ja-t-boards'),history=leagueForm(t);
 (t.groups||[]).forEach(g=>{
   const panel=h('section','ja-t-group'),hd=h('h4','','Group '+g.group);panel.append(hd);
   const scroll=h('div','ja-t-standings-scroll');
   const table=h('table','ja-t-table ja-t-form-table'),thead=h('thead'),th=h('tr');
   ['#','PLAYER','P','W','D','L','GF','GA','GD','PTS','LAST 5'].forEach(l=>th.append(h('th','',l)));
   thead.append(th);table.append(thead);
   const body=h('tbody');
   (g.rows||[]).forEach(r=>{
     const tr=h('tr');
     [r.position,r.name,r.played,r.wins,r.draws,r.losses,r.gf,r.ga,(r.gd>0?'+':'')+r.gd,r.points]
       .forEach(v=>tr.append(h('td','',v)));
     const td=h('td','ja-form-t-cell');
     const form=history[r.playerId]||[];
     td.append(window.JAHANTI_LAST5?.render(form,{player:r.name,compact:true})||h('span','ja-form-empty','—'));
     tr.append(td);body.append(tr);
   });
   table.append(body);scroll.append(table);panel.append(scroll);
   wrapper.append(panel);
 });
 return wrapper;
}
function bracket(t){const fs=(t.fixtures||[]).filter(f=>f.phase==='Knockout'),wrap=h('div','ja-t-bracket');if(!fs.length){wrap.append(h('p','ja-t-note','The bracket will appear after the League Phase has been finalized.'));return wrap;}
 const rounds=new Map();fs.forEach(f=>{const k=(f.bracket||'Knockout')+' · '+(f.round==='Grand Final'?'Grand Final':'Round '+f.round);if(!rounds.has(k))rounds.set(k,[]);rounds.get(k).push(f);});
 rounds.forEach((fixtures,label)=>{const col=h('div','ja-t-round'),hd=h('h4','',label);col.append(hd);fixtures.forEach(f=>{const match=h('article','ja-t-match'),row=h('div','ja-t-match-players');row.append(h('span','',name(f.a)),h('strong','',winnerLine(f)),h('span','',name(f.b)));match.append(row);
 const st=h('small','',f.admin?'Awarded · 3–0':f.status);match.append(st);col.append(match);});wrap.append(col);});return wrap;}
function results(t){
 const items=[];
 (t.fixtures||[]).forEach((f,order)=>{
   (f.games||[]).forEach((g,i)=>items.push({f,order,game:g,index:i+1,when:g.date||'',award:false}));
   if(f.admin&&f.resolution)items.push({f,order,when:f.resolution.at||'',award:true});
   else if(f.admin&&f.result)items.push({f,order,when:f.result.date||'',award:true});
 });
 items.sort((a,b)=>b.when.localeCompare(a.when)||b.order-a.order||b.index-a.index);
 const holder=h('div','ja-t-results');if(!items.length){holder.append(h('p','ja-t-note','No results yet.'));return holder;}
 items.slice(0,5).forEach(({f,game,index,award})=>{
   const line=h('div','ja-t-result-line');let label=f.phase==='League'?'League · Group '+f.group:(f.bracket||'Knockout')+' · '+f.round;
   if(award)label+=' · Awarded';else if(f.format?.startsWith('Best of')||f.format==='Two legs')label+=' · Game '+index;
   const lbl=h('small','',label),middle=h('span','',name(f.a)+' vs '+name(f.b));
   const score=h('strong','',award?(f.result?.aGoals??(f.winner?.playerId===f.a?.playerId?3:0))+'–'+(f.result?.bGoals??0):game.aGoals+'–'+game.bGoals);
   line.append(lbl,middle,score);holder.append(line);
 });
 // Latest Results is intentionally limited to five actual games/administrative awards.
 return holder;
}
/** Vertical, five-visible-fixture ticker. All remaining fixtures are in the DOM
 * and can be explored manually. Pauses for hover, keyboard interaction, touch,
 * reduced-motion preference, and background tabs. Stops itself when removed. */
function fixtureTicker(list, rows, summary, button){
 if(rows.length<=5)return;
 const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 let paused=!!reduced, hovering=false, touching=false, focusing=false;
 const step=()=>rows.length>1?rows[1].offsetTop-rows[0].offsetTop:rows[0].offsetHeight;
 const index=()=>Math.min(rows.length-5,Math.max(0,Math.round(list.scrollTop/Math.max(1,step()))));
 const update=()=>{const first=index()+1;summary.textContent=first+'–'+Math.min(first+4,rows.length)+' of '+rows.length+' matches';};
 const toggle=()=>{
   paused=!paused;button.textContent=paused?'Resume scroll':'Pause scroll';
   button.setAttribute('aria-pressed',String(paused));
 };
 button.addEventListener('click',toggle);
 list.addEventListener('scroll',update,{passive:true});
 list.addEventListener('mouseenter',()=>hovering=true);
 list.addEventListener('mouseleave',()=>hovering=false);
 list.addEventListener('focusin',()=>focusing=true);
 list.addEventListener('focusout',()=>focusing=list.contains(document.activeElement));
 list.addEventListener('touchstart',()=>touching=true,{passive:true});
 list.addEventListener('touchend',()=>touching=false,{passive:true});
 list.addEventListener('touchcancel',()=>touching=false,{passive:true});
 if(reduced){button.textContent='Resume scroll';button.setAttribute('aria-pressed','true');}
 const timer=window.setInterval(()=>{
   if(!list.isConnected){window.clearInterval(timer);return;}
   if(paused||hovering||touching||focusing||document.hidden)return;
   const next=index()>=rows.length-5?0:index()+1;
   list.scrollTo({top:next===0?0:rows[next].offsetTop-rows[0].offsetTop,behavior:'smooth'});
 },4300);
 update();
}
function available(t){
 // No scheduled clock times are inferred: 'upcoming' means unplayed fixtures.
 const fs=(t.fixtures||[]).filter(f=>f.phase==='League'&&['Ready','Waiting'].includes(f.status));
 if(!fs.length)return null;
 const wrap=h('section','ja-t-available');
 const header=h('div','ja-t-fixtures-head');header.append(h('h4','','Upcoming Matches'));
 const controls=h('div','ja-t-fixtures-controls');
 const summary=h('span','ja-t-fixtures-summary','');
 const pause=h('button','ja-t-fixtures-toggle','Pause scroll');pause.type='button';
 pause.setAttribute('aria-pressed','false');
 controls.append(summary);if(fs.length>5)controls.append(pause);
 header.append(controls);wrap.append(header);
 const list=h('div','ja-t-available-list');list.setAttribute('role','region');
 list.setAttribute('aria-label','Upcoming league matches, scroll for more');list.tabIndex=0;
 const rows=fs.map(f=>{
   const item=h('div','ja-t-upcoming-fixture');
   const group=h('span','ja-t-fixture-group','Group '+(f.group||'—'));
   const matchup=h('span','ja-t-fixture-players',name(f.a)+' vs '+name(f.b));
   matchup.title=matchup.textContent;
   item.append(group,matchup);list.append(item);return item;
 });
 wrap.append(list);
 if(fs.length>5)fixtureTicker(list,rows,summary,pause);
 else summary.textContent=fs.length+' upcoming '+(fs.length===1?'match':'matches');
 return wrap;
}
function featured(t){const out=h('article','ja-t-featured'),top=tournamentTop(t);out.append(top);
 const tabs=h('div','ja-t-tabs'),body=h('div','ja-t-contents'),options=[];
 if(t.groups?.length)options.push(['standings','Standings']);if((t.fixtures||[]).some(f=>f.phase==='Knockout')||t.format?.includes('Elimination')||t.format?.includes('Gauntlet'))options.push(['bracket','Bracket']);
 if(!options.length)options.push(['overview','Overview']);
 const display=key=>{empty(body);if(key==='standings')body.append(standings(t));else if(key==='bracket')body.append(bracket(t));else body.append(h('p','ja-t-note','Tournament details are being prepared.'));
   [...tabs.children].forEach(b=>{const active=b.dataset.tab===key;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});};
 options.forEach(([key,label])=>{const b=h('button','ja-t-tab',label);b.type='button';b.dataset.tab=key;b.addEventListener('click',()=>display(key));tabs.append(b);});out.append(tabs,body);display(t.phase==='Knockout'||t.status==='Completed'?options.find(v=>v[0]==='bracket')?.[0]||options[0][0]:options[0][0]);
 const resultsHeading=h('h4','ja-t-subheading','Latest Results');out.append(resultsHeading,results(t));
 if(t.phase==='League'&&t.status==='In Progress'){const av=available(t);if(av)out.append(av);}return out;
}
function upcomingCard(t){const div=h('article','ja-t-upcoming-card'),header=h('div','ja-t-upcoming-head');header.append(h('h4','','NEXT TOURNAMENT'),h('span','ja-t-registration',t.registrationStatus==='Open'?'Registration Open':'Registration '+(t.registrationStatus||'Closed')));
 div.append(header,h('h3','',t.name),h('p','',titleDate(t.startDate)));const small=h('p','ja-t-note',t.players+' registered · '+t.format);div.append(small);return div;}
function openArchive(completed){const dialog=$('ja-t-archive-dialog'),select=$('ja-t-archive-select'),detail=$('ja-t-archive-detail');empty(select);
 completed.forEach(t=>{const opt=h('option','',t.name+' · '+titleDate(t.startDate));opt.value=t.id;select.append(opt);});
 const show=()=>{empty(detail);const t=completed.find(t=>t.id===select.value)||completed[0];detail.append(featured(t));};
 select.onchange=show;show();if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');}
async function init(){if(new URLSearchParams(location.search).get('game')!=='fc')return;
 const section=$('fc-tournaments');if(!section)return;section.hidden=false;
 let data={};try{data=await (window.JAHANTI_PUBLIC_READY||Promise.resolve({tournaments:[]}));}catch(e){data={tournaments:[]};}
 const tournaments=Array.isArray(data?.tournaments)?data.tournaments:[],active=tournaments.filter(t=>t.status==='In Progress'),completed=tournaments.filter(t=>t.status==='Completed').sort((a,b)=>(b.startDate||'').localeCompare(a.startDate||'')),upcoming=tournaments.filter(t=>t.status==='Upcoming').sort((a,b)=>(a.startDate||'').localeCompare(b.startDate||''));
 const featuredArea=$('ja-t-featured'),next=$('ja-t-upcoming');
 if(active.length){if(active.length>1){const wrap=h('div','ja-t-picker'),sel=h('select','');sel.setAttribute('aria-label','Choose active tournament');active.forEach(t=>{const opt=h('option','',t.name);opt.value=t.id;sel.append(opt);});wrap.append(h('label','','Active tournament  '),sel);featuredArea.append(wrap);sel.addEventListener('change',()=>{featuredArea.querySelector('.ja-t-featured')?.remove();featuredArea.append(featured(active.find(t=>t.id===sel.value)));});}featuredArea.append(featured(active[0]));}
 else if(completed.length)featuredArea.append(featured(completed[0]));
 else if(!upcoming.length)featuredArea.append(h('div','ja-t-empty','No tournaments planned yet. Check back soon for the next JahAnti competition!'));
 if(upcoming.length)next.append(upcomingCard(upcoming[0]));
 const archiveLink=$('ja-t-archive-link');if(completed.length){archiveLink.hidden=false;$('ja-t-show-archive').addEventListener('click',()=>openArchive(completed));}
 $('ja-t-close-archive')?.addEventListener('click',()=>{const d=$('ja-t-archive-dialog');if(d.close)d.close();else d.removeAttribute('open');});
}
document.addEventListener('DOMContentLoaded',init);
})();

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
function standings(t){const wrapper=h('div','ja-t-boards');(t.groups||[]).forEach(g=>{const panel=h('section','ja-t-group'),hd=h('h4','','Group '+g.group);panel.append(hd);
 const table=h('table','ja-t-table'),thead=h('thead'),th=h('tr');['#','PLAYER','P','W','GD','PTS'].forEach(l=>th.append(h('th','',l)));thead.append(th);table.append(thead);
 const body=h('tbody');(g.rows||[]).forEach(r=>{const tr=h('tr');[r.position,r.name,r.played,r.wins,(r.gd>0?'+':'')+r.gd,r.points].forEach(v=>tr.append(h('td','',v)));body.append(tr);});table.append(body);panel.append(table);wrapper.append(panel);});return wrapper;}
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
 items.forEach(({f,game,index,award})=>{
   const line=h('div','ja-t-result-line');let label=f.phase==='League'?'League · Group '+f.group:(f.bracket||'Knockout')+' · '+f.round;
   if(award)label+=' · Awarded';else if(f.format?.startsWith('Best of')||f.format==='Two legs')label+=' · Game '+index;
   const lbl=h('small','',label),middle=h('span','',name(f.a)+' vs '+name(f.b));
   const score=h('strong','',award?(f.result?.aGoals??(f.winner?.playerId===f.a?.playerId?3:0))+'–'+(f.result?.bGoals??0):game.aGoals+'–'+game.bGoals);
   line.append(lbl,middle,score);holder.append(line);
 });
 if(items.length>5)enableTicker(holder);return holder;
}
function enableTicker(el){const pref=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;if(pref)return;
 let paused=false;el.addEventListener('mouseenter',()=>paused=true);el.addEventListener('mouseleave',()=>paused=false);
 el.addEventListener('touchstart',()=>paused=true,{passive:true});el.addEventListener('touchend',()=>paused=false,{passive:true});
 window.setInterval(()=>{if(paused||!el.isConnected||document.hidden)return;const rows=[...el.children];if(rows.length<6)return;
 const next=rows.find(x=>x.offsetTop>el.scrollTop+4)||rows[0];if(next===rows[0])el.scrollTo({top:0,behavior:'smooth'});else el.scrollTo({top:next.offsetTop-rows[0].offsetTop,behavior:'smooth'});
 },4500);
}
function available(t){const fs=(t.fixtures||[]).filter(f=>f.phase==='League'&&f.status==='Ready');if(!fs.length)return null;
 const wrap=h('div','ja-t-available');wrap.append(h('h4','','Available League Fixtures'));const list=h('div','ja-t-available-list');fs.slice(0,12).forEach(f=>list.append(h('div','','Group '+f.group+'  ·  '+name(f.a)+' vs '+name(f.b))));wrap.append(list);if(fs.length>12)wrap.append(h('small','ja-t-note','+'+(fs.length-12)+' more fixtures'));return wrap;}
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

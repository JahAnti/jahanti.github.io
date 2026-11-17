/* JahAnti v1.2.0: live climbers across paired game modes; no new client tracking. */
(()=>{
  'use strict';
  const root=document.getElementById('jahanti-climbers');
  if(!root)return;
  const params=new URLSearchParams(location.search),game=params.get('game');
  const gameKey=['fc','domino','fortnite','cod','redsec','shooters'].includes(game)?game:null;
  if(!gameKey)return;
  const select=document.getElementById('ja-climbers-week'),list=document.getElementById('ja-climbers-list');
  const live=document.getElementById('ja-climbers-live'),subtitle=document.getElementById('ja-climbers-period-note');
  const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=String(text);return node;};
  const monday=iso=>{const d=new Date(iso+'T12:00:00Z');return d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});};
  const end=iso=>{const d=new Date(iso+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+6);return d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});};
  const category=k=>({domino1v1:'1v1',domino2v2:'2v2',fifaOfficial:'Official',fifaFriendlies:'Friendlies',combinedShooters:'Combined Shooters',fortnite:'Fortnite',cod:'Call of Duty',redsec:'REDSEC'})[k]||k;
  function render(data,week){
    const isCurrent=week===data.currentWeek;
    live.hidden=!isCurrent;live.textContent='LIVE';
    subtitle.textContent=(isCurrent?'Current week · ':'Historical week · ')+monday(week)+' – '+end(week)+' · All-Time rank movement';
    list.replaceChildren();
    const players=data.byWeek?.[week]?.[gameKey]||[];
    if(!players.length){list.append(el('p','ja-climbers-empty','No eligible climbers for this week yet.'));return;}
    players.slice(0,3).forEach(person=>{
      const card=el('article','ja-climber-card');
      const identity=el('div','ja-climber-identity');
      const img=el('span','ja-climber-avatar',(person.name||'JA').slice(0,2).toUpperCase());
      const details=el('div','ja-climber-details');
      const player=el('strong','ja-climber-name',person.name||'JahAnti player');
      const meta=el('div','ja-climber-meta');
      meta.append(el('span','ja-climber-category',category(person.category)));
      meta.append(el('span','ja-climber-ranks',person.newPlayer?'New on the leaderboard':'#'+person.from+' → #'+person.to));
      details.append(player,meta);identity.append(img,details);
      const delta=el('div','ja-climber-delta');
      if(person.newPlayer)delta.append(el('strong','ja-climber-new','NEW'));
      else delta.append(el('strong','', '+'+person.change),el('small','','positions'));
      card.append(identity,delta);list.append(card);
    });
  }
  Promise.resolve(window.JAHANTI_PUBLIC_READY||window.JAHANTI_PUBLIC_DATA).then(data=>{
    const climbers=data?.biggestClimbers;
    root.hidden=false;
    if(!climbers||!Array.isArray(climbers.availableWeeks)){
      list.append(el('p','ja-climbers-empty','Biggest Climbers will appear after the public rankings are refreshed.'));
      return;
    }
    const weeks=[...climbers.availableWeeks].sort().reverse();
    if(!weeks.length){list.append(el('p','ja-climbers-empty','No ranked match history yet.'));return;}
    select.replaceChildren();
    weeks.forEach(w=>{const opt=el('option','',monday(w)+' – '+end(w));opt.value=w;select.append(opt);});
    select.value=climbers.currentWeek;
    select.addEventListener('change',()=>render(climbers,select.value));
    render(climbers,select.value);
  }).catch(()=>{root.hidden=false;list.append(el('p','ja-climbers-empty','Climber data is temporarily unavailable.'));});
})();

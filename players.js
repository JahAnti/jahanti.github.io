/* JahAnti v14 — directory, gallery and profile; public records only. */
(async()=>{
  'use strict';
  if(window.JAHANTI_PUBLIC_READY)await window.JAHANTI_PUBLIC_READY;
  const players=Array.isArray(window.JAHANTI_PLAYERS)?window.JAHANTI_PLAYERS:[];
  const G=window.JAHANTI_GAME_UI;
  const names=G?.names||{fc:'EA Sports FC',fortnite:'Fortnite',cod:'Call of Duty',redsec:'Battlefield REDSEC',domino:'Trupial Domino'};
  const el=(tag,cls='',value)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(value!==undefined)x.textContent=String(value);return x};
  const avatar=(p,cls)=>window.JAHANTI_AVATAR?.create(p,cls)||el('span',cls,(p.name||'JA').slice(0,2).toUpperCase());
  const gameIcon=k=>G?.icon(k)||el('span','shared-game-icon','◆');
  function badge(a,cls='achievement-icon'){
    const n=el('span',cls);n.title=a.name||'Achievement';
    if(typeof a.iconUrl==='string'&&a.iconUrl.startsWith('assets/achievements/') && /\.(webp|png|jpe?g)$/i.test(a.iconUrl)){
      const img=el('img','achievement-art');img.src=a.iconUrl;img.alt='';img.addEventListener('error',()=>img.replaceWith(document.createTextNode(a.icon||'🏅')),{once:true});n.append(img);
    }else n.textContent=a.icon||'🏅';return n;
  }
  function tag(k){const t=el('span','player-game-tag');t.append(gameIcon(k),document.createTextNode(' '+(names[k]||k)));return t}
  function card(p){
    const link=el('a','player-card');link.href='player.html?p='+encodeURIComponent(p.slug);link.setAttribute('aria-label','View '+p.name+' profile');
    const banner=el('div','player-card-banner');banner.append(avatar(p,'player-avatar'));
    const content=el('div','player-card-content');content.append(el('h3','',p.name));
    const tags=el('div','player-game-tags');(p.games||[]).forEach(k=>tags.append(tag(k)));content.append(tags);
    if(p.bio)content.append(el('p','player-bio',p.bio));content.append(el('span','achievement-label','✦ ACHIEVEMENTS'));
    const badges=el('div','achievement-row'),ach=(p.featuredAchievements?.length?p.featuredAchievements:p.achievements)||[];
    ach.slice(0,3).forEach(a=>badges.append(badge(a)));
    if(!badges.children.length)badges.append(el('span','achievement-none','No achievements yet'));
    content.append(badges,el('div','player-card-link','View profile ↗'));link.append(banner,content);return link;
  }
  const gallery=document.getElementById('player-gallery');
  if(gallery){
    const shown=players.filter(p=>p.showInGallery===true);
    if(shown.length){const one=el('div','gallery-group');shown.forEach(p=>one.append(card(p)));gallery.append(one);
      if(shown.length>=3){const two=el('div','gallery-group');two.setAttribute('aria-hidden','true');shown.forEach(p=>{const copy=card(p);copy.tabIndex=-1;two.append(copy)});gallery.append(two)}else gallery.classList.add('gallery-short');
    }else gallery.append(el('p','gallery-empty','Player profiles will appear here when registered.'));
    document.querySelector('.gallery-pause')?.addEventListener('click',e=>{const paused=gallery.classList.toggle('is-paused');e.currentTarget.setAttribute('aria-pressed',String(paused));e.currentTarget.textContent=paused?'Resume scrolling ▶':'Pause scrolling ❚❚'});
  }
  const grid=document.getElementById('player-directory');
  if(grid){
    const search=document.getElementById('player-search'),filter=document.getElementById('player-filter'),count=document.getElementById('directory-count'),nav=document.getElementById('directory-pagination');
    let page=1;const PAGE=10;
    function render(){
      const q=String(search?.value||'').toLowerCase().trim(),f=filter?.value||'all';
      const list=players.filter(p=>(p.name||'').toLowerCase().includes(q)&&(f==='all'||(p.games||[]).includes(f)));
      const pages=Math.max(1,Math.ceil(list.length/PAGE));page=Math.max(1,Math.min(page,pages));
      grid.replaceChildren();list.slice((page-1)*PAGE,page*PAGE).forEach(p=>grid.append(card(p)));
      if(!list.length)grid.append(el('p','directory-empty','No players found.'));
      count.textContent=list.length?`${list.length} player${list.length===1?'':'s'} shown`: 'No players found';
      nav.replaceChildren();nav.hidden=pages<=1;
      if(pages>1){const b=(label,to,disabled,selected=false)=>{const x=el('button',selected?'is-current':'',label);x.type='button';x.disabled=disabled;if(selected)x.setAttribute('aria-current','page');x.addEventListener('click',()=>{page=to;render();nav.scrollIntoView({block:'nearest'})});return x};
        nav.append(b('←',page-1,page===1));for(let i=1;i<=pages;i++)nav.append(b(i,i,false,i===page));nav.append(b('→',page+1,page===pages));}
    }
    search?.addEventListener('input',()=>{page=1;render()});filter?.addEventListener('change',()=>{page=1;render()});render();
  }
  const profile=document.getElementById('player-profile');
  if(!profile)return;
  const slug=new URLSearchParams(location.search).get('p'),p=players.find(x=>x.slug===slug);
  if(!p){profile.append(el('h1','','Player not found'),el('p','','Explore JahAnti Community to find an active public player profile.'));return}
  document.title=p.name+' — JahAnti';
  const header=el('div','profile-header');header.append(avatar(p,'profile-avatar'));const details=el('div','profile-identity');details.append(el('h1','',p.name));header.append(details);profile.append(header);
  const bio=el('section','profile-bio-section');bio.append(el('h2','','Bio'),el('p','',p.bio||'No bio added yet.'));profile.append(bio);
  const handles=Object.entries(p.handles||{}).filter(([k,val])=>names[k]&&String(val||'').trim());
  const socials=Object.entries(p.socials||{}).filter(([k,url])=>String(url).startsWith('https://')&&['instagram','tiktok','facebook','twitch','youtube'].includes(k));
  if(handles.length||socials.length){const row=el('div','profile-info-grid');
    if(handles.length){const part=el('section','profile-info-box');part.append(el('h2','','Gaming Handles'));handles.forEach(([k,h])=>{const line=el('div','profile-handle-row');const label=el('span','game-handle-name');label.setAttribute('aria-label',names[k]);label.append(gameIcon(k),el('span','game-handle-name-text',names[k]));line.append(label,el('strong','',h));part.append(line)});row.append(part)}
    if(socials.length){const part=el('section','profile-info-box');part.append(el('h2','','Social Media'));
      socials.forEach(([key,url])=>{let username=G?.socialUsername(key,url)||key;const a=el('a','social-handle-row');a.setAttribute('aria-label',key+' '+username+' (opens in new tab)');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.append(G?.socialIcon(key)||el('span','social-mark',key[0]),el('strong','',username));a.append(el('span','social-external','↗'));part.append(a)});row.append(part)}
    profile.append(row);
  }
  const awards=p.allAchievements||p.achievements||[];
  const section=el('section','profile-achievements-section');section.append(el('h2','','Achievements'));
  if(awards.length){
    const viewport=el('div','achievement-carousel');viewport.setAttribute('aria-label','Earned achievements. Swipe or scroll to browse.');viewport.tabIndex=0;
    const track=el('div','achievement-track');
    awards.forEach(a=>{const button=el('button','achievement-badge');button.type='button';button.append(badge(a),el('span','',a.name));button.addEventListener('click',()=>openAchievement(a));track.append(button)});
    viewport.append(track);section.append(viewport);
    // Autoscroll only when items overflow. Pause on hover/focus or popup; mobile stays swipeable.
    requestAnimationFrame(()=>{
      if(track.scrollWidth<=viewport.clientWidth+2||window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 700px)').matches)return;
      const group=el('div','achievement-track-duplicate');[...track.children].forEach((child,i)=>{const copy=child.cloneNode(true);copy.addEventListener('click',()=>openAchievement(awards[i]));group.append(copy)});
      const first=el('div','achievement-track-group');while(track.firstChild)first.append(track.firstChild);track.append(first,group);track.classList.add('is-moving');
    });
  }else section.append(el('p','directory-empty','No achievements yet.'));
  profile.append(section);
  let dialog=null;
  function openAchievement(a){
    if(!dialog){dialog=el('dialog','achievement-dialog');dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});document.body.append(dialog)}
    dialog.replaceChildren();const box=el('div','achievement-dialog-box');const hero=el('div','achievement-dialog-hero');const close=el('button','achievement-dialog-close','×');close.type='button';close.setAttribute('aria-label','Close achievement details');close.addEventListener('click',()=>dialog.close());hero.append(close);
    hero.append(badge(a,'achievement-dialog-icon'),el('h2','',a.name));if(a.category)hero.append(el('span','achievement-category',a.category));
    const content=el('div','achievement-dialog-content');content.append(el('h3','','Description'),el('p','',a.description||'JahAnti achievement'));
    if(a.earnedAt){const dt=new Date(a.earnedAt);if(!Number.isNaN(dt.getTime())){const date=el('div','achievement-earned');date.append(el('span','','Earned on'),el('strong','',dt.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})));content.append(date)}}
    box.append(hero,content);dialog.append(box);dialog.showModal();
  }
  profile.append(el('h2','profile-stat-heading','All-Time game statistics'));
  const stats=el('div','profile-statistics');stats.append(el('p','directory-empty','Loading public rankings…'));profile.append(stats);
  const cats=[['fortnite','Fortnite','fortnite'],['cod','Call of Duty','cod'],['redsec','Battlefield REDSEC','redsec'],['combinedShooters','Combined Shooters','shooters'],['domino1v1','Domino 1v1','domino&mode=1v1'],['domino2v2','Domino 2v2','domino&mode=2v2'],['fifaFriendlies','EA Sports FC · Friendlies','fc']];
  Promise.resolve(window.JAHANTI_PUBLIC_DATA).then(data=>{
    stats.replaceChildren();let found=0;
    for(const [key,label,route] of cats){const r=(data?.leaderboards?.allTime?.[key]||[]).find(x=>x.playerId===p.id);if(!r)continue;found++;
      const link=el('a','profile-stat-link');link.href='game.html?game='+route;const art=el('div','stat-mini-hero');art.dataset.hero=route.split('&')[0];art.append(el('strong','',label));
      const metric=key.startsWith('domino')?`${r.wins||0} wins · ${r.losses||0} losses`:key==='fifaFriendlies'?`${r.wins||0} wins · ${r.goalDifference||0} goal difference`:`${r.wins||0} wins · ${r.kills||0} kills · ${r.assists||0} assists`;
      const body=el('div','stat-mini-body');body.append(el('span','',metric),el('span','stat-link-arrow','↗'));link.append(art,body);stats.append(link);
    }if(!found)stats.append(el('p','directory-empty','No published results yet.'));
  }).catch(()=>stats.replaceChildren(el('p','directory-empty','Game statistics will appear once public rankings are published.')));
})();

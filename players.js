(() => {
  'use strict';
  const players = Array.isArray(window.JAHANTI_PLAYERS) ? window.JAHANTI_PLAYERS : [];
  const names = {fc:'EA Sports FC',fortnite:'Fortnite',cod:'Call of Duty',redsec:'Battlefield REDSEC',domino:'Trupial Domino'};
  const icon = {fc:'⚽',fortnite:'✦',cod:'⌖',redsec:'✕',domino:'⚄'};
  const el=(tag,cls,txt)=>{const x=document.createElement(tag); if(cls)x.className=cls;if(txt!==undefined)x.textContent=txt;return x;};
  function card(p){
    const a=el('a','player-card');a.href='player.html?p='+encodeURIComponent(p.slug);a.setAttribute('aria-label','View '+p.name+' profile');
    const banner=el('div','player-card-banner');banner.append(el('span','player-avatar',p.avatar||p.name.slice(0,2).toUpperCase()));
    if(p.demo)banner.append(el('span','demo-chip','SAMPLE PROFILE'));
    a.append(banner);
    const content=el('div','player-card-content');content.append(el('h3','',p.name));
    const tags=el('div','player-game-tags');(p.games||[]).forEach(g=>{const b=el('span','player-game-tag',(icon[g]||'◆')+' '+(names[g]||g));tags.append(b);});content.append(tags);
    if(p.bio)content.append(el('p','player-bio',p.bio));
    const title=el('span','achievement-label','✦ ACHIEVEMENTS');content.append(title);
    const achievements=el('div','achievement-row');(p.achievements||[]).slice(0,3).forEach(item=>{const b=el('span','achievement-icon',item.icon||'🏅');b.title=item.name;b.setAttribute('aria-label',item.name);achievements.append(b);});
    if(!achievements.children.length) achievements.append(el('span','achievement-none','No achievements yet'));
    content.append(achievements);
    content.append(el('div','player-card-link','View profile ↗'));a.append(content);return a;
  }
  const gallery=document.getElementById('player-gallery');
  if(gallery){
    if(players.length){const first=el('div','gallery-group');players.forEach(p=>first.append(card(p)));gallery.append(first);
      const second=first.cloneNode(true);second.setAttribute('aria-hidden','true');second.querySelectorAll('a').forEach(a=>{a.tabIndex=-1;});gallery.append(second);
      if(players.length<3)gallery.classList.add('gallery-short');
    } else { gallery.append(el('p','gallery-empty','Player profiles will appear here when registered.')); }
    const button=document.querySelector('.gallery-pause');
    button?.addEventListener('click',()=>{const paused=gallery.classList.toggle('is-paused');button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'Resume scrolling ▶':'Pause scrolling ❚❚';});
  }
  const grid=document.getElementById('player-directory');
  if(grid){const search=document.getElementById('player-search'),game=document.getElementById('player-filter'),count=document.getElementById('directory-count');
    function render(){const q=(search?.value||'').toLowerCase().trim(),f=game?.value||'all';const filtered=players.filter(p=>p.name.toLowerCase().includes(q)&&(f==='all'||p.games.includes(f)));
      grid.replaceChildren();filtered.forEach(p=>grid.append(card(p)));if(!filtered.length)grid.append(el('p','directory-empty','No players found.'));if(count)count.textContent=`${filtered.length} player${filtered.length===1?'':'s'} shown`;
    }
    search?.addEventListener('input',render);game?.addEventListener('change',render);render();
  }
  const profile=document.getElementById('player-profile');
  if(profile){const slug=new URLSearchParams(location.search).get('p');const p=players.find(x=>x.slug===slug);
    if(!p){profile.append(el('h1','','Player not found'));profile.append(el('p','','Return to the Player Directory to explore registered players.'));return;}
    document.title=p.name+' — JahAnti';const header=el('div','profile-header');header.append(el('div','profile-avatar',p.avatar||p.name.slice(0,2)));
    const detail=el('div','');if(p.demo)detail.append(el('span','demo-chip demo-chip-inline','SAMPLE PROFILE'));detail.append(el('h1','',p.name));detail.append(el('p','',p.bio||'JahAnti community player'));header.append(detail);profile.append(header);
    const h=el('h2','','Games played');profile.append(h);const list=el('div','profile-games');(p.games||[]).forEach(g=>list.append(el('span','player-game-tag',(icon[g]||'◆')+' '+(names[g]||g))));profile.append(list);
    profile.append(el('h2','','Achievements'));const ach=el('div','profile-achievements');(p.achievements||[]).forEach(x=>ach.append(el('span','achievement-badge',(x.icon||'🏅')+' '+x.name)));if(!ach.children.length)ach.append(el('p','','No achievements yet.'));profile.append(ach);
    const socials=Object.entries(p.socials||{}).filter(([key,url])=>/^https:\/\//.test(url));if(socials.length){profile.append(el('h2','','Social media'));const row=el('div','profile-socials');socials.forEach(([key,url])=>{const a=el('a','social-profile-link',key);a.href=url;a.target='_blank';a.rel='noopener noreferrer';row.append(a);});profile.append(row);}
  }
})();

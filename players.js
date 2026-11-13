/* JahAnti v11 player directory, home gallery and profiles. Public records only. */
(() => {
  'use strict';
  const players = Array.isArray(window.JAHANTI_PLAYERS) ? window.JAHANTI_PLAYERS : [];
  const names = { fc:'EA Sports FC', fortnite:'Fortnite', cod:'Call of Duty', redsec:'Battlefield REDSEC', domino:'Trupial Domino' };
  const icon = { fc:'⚽', fortnite:'✦', cod:'⌖', redsec:'✕', domino:'⚄' };
  const el = (tag, cls, label) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (label !== undefined) node.textContent = label;
    return node;
  };
  const avatar = (p, cls) => window.JAHANTI_AVATAR?.create(p, cls) || el('span',cls,(p.name||'JA').slice(0,2).toUpperCase());
  function badge(item, cls = 'achievement-icon') {
    const node=el('span',cls);
    node.title=item.name||'Achievement';
    node.setAttribute('aria-label',item.name||'Achievement');
    if (typeof item.iconUrl==='string' && /^assets\/achievements\/[a-z0-9_.-]+\.(webp|png|jpe?g)$/i.test(item.iconUrl)) {
      const image=el('img','achievement-art');image.src=item.iconUrl;image.alt='';image.loading='lazy';
      image.addEventListener('error',()=>image.replaceWith(document.createTextNode(item.icon||'🏅')),{once:true});
      node.append(image);
    } else node.textContent=item.icon||'🏅';
    return node;
  }
  function card(p) {
    const link=el('a','player-card');link.href='player.html?p='+encodeURIComponent(p.slug);
    link.setAttribute('aria-label','View '+p.name+' profile');
    const banner=el('div','player-card-banner');banner.append(avatar(p,'player-avatar'));link.append(banner);
    const content=el('div','player-card-content');content.append(el('h3','',p.name));
    const tags=el('div','player-game-tags');(p.games||[]).forEach(g=>tags.append(el('span','player-game-tag',(icon[g]||'◆')+' '+(names[g]||g))));content.append(tags);
    if(p.bio)content.append(el('p','player-bio',p.bio));
    content.append(el('span','achievement-label','✦ ACHIEVEMENTS'));
    const achievements=el('div','achievement-row');
    // Gallery: exactly the featured three, falling back to the most recent achievements.
    const items=Array.isArray(p.featuredAchievements) && p.featuredAchievements.length
      ? p.featuredAchievements : (p.achievements||[]);
    items.slice(0,3).forEach(item=>achievements.append(badge(item)));
    if(!achievements.children.length)achievements.append(el('span','achievement-none','No achievements yet'));
    content.append(achievements,el('div','player-card-link','View profile ↗'));link.append(content);
    return link;
  }
  const gallery=document.getElementById('player-gallery');
  if(gallery) {
    // Directory includes all public players; home gallery respects separate consent.
    const shown=players.filter(p=>p.showInGallery===true);
    if(shown.length) {
      const first=el('div','gallery-group');shown.forEach(p=>first.append(card(p)));gallery.append(first);
      if(shown.length>=3) {
        const second=el('div','gallery-group');second.setAttribute('aria-hidden','true');
        shown.forEach(p=>{const a=card(p);a.tabIndex=-1;second.append(a);});gallery.append(second);
      } else gallery.classList.add('gallery-short');
    } else gallery.append(el('p','gallery-empty','Player profiles will appear here when registered.'));
    const button=document.querySelector('.gallery-pause');
    button?.addEventListener('click',()=>{
      const paused=gallery.classList.toggle('is-paused');
      button.setAttribute('aria-pressed',String(paused));
      button.textContent=paused?'Resume scrolling ▶':'Pause scrolling ❚❚';
    });
  }
  const grid=document.getElementById('player-directory');
  if(grid) {
    const search=document.getElementById('player-search'),game=document.getElementById('player-filter'),count=document.getElementById('directory-count');
    function render() {
      const q=(search?.value||'').toLowerCase().trim(),f=game?.value||'all';
      const filtered=players.filter(p=>p.name.toLowerCase().includes(q)&&(f==='all'||(p.games||[]).includes(f)));
      grid.replaceChildren();filtered.forEach(p=>grid.append(card(p)));
      if(!filtered.length)grid.append(el('p','directory-empty','No players found.'));
      if(count)count.textContent=`${filtered.length} player${filtered.length===1?'':'s'} shown`;
    }
    search?.addEventListener('input',render);game?.addEventListener('change',render);render();
  }
  const profile=document.getElementById('player-profile');
  if(profile) {
    const slug=new URLSearchParams(location.search).get('p');
    const p=players.find(x=>x.slug===slug);
    if(!p) {
      profile.append(el('h1','','Player not found'),el('p','','Return to the Player Directory to explore registered players.'));
      return;
    }
    document.title=p.name+' — JahAnti';
    const header=el('div','profile-header');header.append(avatar(p,'profile-avatar'));
    const detail=el('div','');detail.append(el('h1','',p.name),el('p','',p.bio||'JahAnti community player'));
    header.append(detail);profile.append(header);
    profile.append(el('h2','','Games played'));
    const list=el('div','profile-games');(p.games||[]).forEach(g=>list.append(el('span','player-game-tag',(icon[g]||'◆')+' '+(names[g]||g))));
    if(!list.children.length)list.append(el('p','','No gaming handles have been added yet.'));
    profile.append(list);
    const handles=Object.entries(p.handles||{}).filter(([g,h])=>h && names[g]);
    if(handles.length){profile.append(el('h2','','Gaming handles'));
      const wrap=el('div','profile-handles');handles.forEach(([g,h])=>{
        const item=el('div','profile-handle');item.append(el('strong','',names[g]),el('span','',String(h)));wrap.append(item);
      });profile.append(wrap);
    }
    profile.append(el('h2','','Achievements'));
    const ach=el('div','profile-achievements');const awards=p.allAchievements||p.achievements||[];
    awards.forEach(x=>{const item=el('span','achievement-badge');item.append(badge(x,'achievement-icon'),document.createTextNode(' '+x.name));ach.append(item)});
    if(!ach.children.length)ach.append(el('p','','No achievements yet.'));profile.append(ach);
    const socials=Object.entries(p.socials||{}).filter(([key,url])=>/^https:\/\//i.test(url));
    if(socials.length) {
      profile.append(el('h2','','Social media'));
      const row=el('div','profile-socials');socials.forEach(([key,url])=>{
        const a=el('a','social-profile-link',key);a.href=url;a.target='_blank';a.rel='noopener noreferrer';row.append(a);
      });profile.append(row);
    }
    profile.append(el('h2','','All-Time game statistics'));
    const stats=el('div','profile-statistics');stats.append(el('p','directory-empty','Loading public rankings…'));profile.append(stats);
    const categories=[
      ['fortnite','Fortnite','fortnite'],['cod','Call of Duty','cod'],['redsec','Battlefield REDSEC','redsec'],
      ['combinedShooters','Combined Shooters','shooters'],['domino1v1','Domino 1v1','domino&mode=1v1'],
      ['domino2v2','Domino 2v2','domino&mode=2v2'],['fifaFriendlies','EA Sports FC · Friendlies','fc']
    ];
    fetch('./data/jahanti-public.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Not yet published');return r.json()})
      .then(data=>{
        stats.replaceChildren();let found=0;
        for(const [key,label,game] of categories) {
          const record=(data.leaderboards?.allTime?.[key]||[]).find(x=>x.playerId===p.id);
          if(!record)continue;found++;
          const a=el('a','profile-stat-link');a.href='game.html?game='+game;
          const metric=key.startsWith('domino')?`${record.wins||0} wins · ${record.losses||0} losses`:
            key==='fifaFriendlies'?`${record.wins||0} wins · ${record.goalDifference||0} goal difference`:
              `${record.wins||0} wins · ${record.kills||0} kills · ${record.assists||0} assists`;
          a.append(el('strong','',label),el('span','',metric+' ↗'));stats.append(a);
        }
        if(!found)stats.append(el('p','directory-empty','No published results yet.'));
      }).catch(()=>{stats.replaceChildren(el('p','directory-empty','Game statistics will appear once public rankings are published.'))});
  }
})();

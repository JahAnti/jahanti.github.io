/* JahAnti website UI v14. Change facebookUrl when official JahAnti page URL is available. */
(()=>{'use strict';
  const settings={facebookUrl:''};
  const names={fc:'EA Sports FC',fortnite:'Fortnite',cod:'Call of Duty',redsec:'Battlefield REDSEC',domino:'Trupial Domino',shooters:'Combined Shooters'};
  function icon(code){const image=document.createElement('img');image.className='shared-game-icon';image.alt='';image.src='assets/game-icons/'+(Object.hasOwn(names,code)?code:'shooters')+'.svg';return image}
  const socialPaths={instagram:'instagram.com',tiktok:'tiktok.com',facebook:'facebook.com',twitch:'twitch.tv',youtube:'youtube.com'};
  function socialUsername(platform,url){try{const u=new URL(url);let name=decodeURIComponent(u.pathname.split('/').filter(Boolean).pop()||'');if(!name||['profile.php','watch','channel'].includes(name.toLowerCase()))return platform[0].toUpperCase()+platform.slice(1);name=name.replace(/^@/,'');return '@'+name}catch{return platform}}
  function socialIcon(kind){const x=document.createElement('span');x.className='social-mark social-'+kind;x.setAttribute('aria-hidden','true');
    if(kind==='instagram')x.innerHTML='<svg class="icon-outline" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".9" fill="currentColor" stroke="none"/></svg>';
    else if(kind==='tiktok')x.textContent='♪';else if(kind==='facebook')x.textContent='f';else if(kind==='youtube')x.textContent='▶';else x.textContent='♛';return x}
  window.JAHANTI_GAME_UI=Object.freeze({names,icon,socialIcon,socialUsername});
  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('[data-jahanti-facebook]').forEach(link=>{const active=settings.facebookUrl.startsWith('https://');if(active)link.href=settings.facebookUrl;link.hidden=!active});document.querySelectorAll('[data-facebook-pending]').forEach(span=>{span.hidden=settings.facebookUrl.startsWith('https://')});
    const b=document.querySelector('.nav-games-toggle'),menu=document.getElementById('nav-game-links');
    const close=()=>{if(!b||!menu)return;menu.hidden=true;b.setAttribute('aria-expanded','false')};
    b?.addEventListener('click',e=>{e.stopPropagation();const next=menu.hidden;menu.hidden=!next;b.setAttribute('aria-expanded',String(next))});
    document.addEventListener('click',e=>{if(!e.target.closest('.nav-games-wrap'))close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){close()}});
    window.addEventListener('resize',()=>{if(window.innerWidth<=800)close()});
    const key=document.body.dataset.page;
    document.querySelectorAll('.main-nav a[data-nav]').forEach(a=>a.classList.toggle('active',a.dataset.nav===(key==='games'?'games':key==='community'||key==='player'?'community':key==='rankings-game'||key==='ranking-game'||key==='rankings-overview'?'leaderboards':key==='home'?'home':'')));
  });
})();

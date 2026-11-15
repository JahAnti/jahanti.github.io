/* JahAnti website UI v14. Change facebookUrl when official JahAnti page URL is available. */
(()=>{'use strict';
  const settings={facebookUrl:''};
  const names={fc:'EA Sports FC',fortnite:'Fortnite',cod:'Call of Duty',redsec:'Battlefield REDSEC',domino:'Trupial Domino',shooters:'Combined Shooters'};
  function icon(code){const image=document.createElement('img');image.className='shared-game-icon';image.alt='';image.src='assets/game-icons/'+(Object.hasOwn(names,code)?code:'shooters')+'.svg';return image}
  const socialPaths={instagram:'instagram.com',tiktok:'tiktok.com',facebook:'facebook.com',twitch:'twitch.tv',youtube:'youtube.com'};
  function socialUsername(platform,url){try{const u=new URL(url);let name=decodeURIComponent(u.pathname.split('/').filter(Boolean).pop()||'');if(!name||['profile.php','watch','channel'].includes(name.toLowerCase()))return platform[0].toUpperCase()+platform.slice(1);name=name.replace(/^@/,'');return '@'+name}catch{return platform}}
  function socialIcon(kind){const x=document.createElement('span');x.className='social-mark social-'+kind;x.setAttribute('aria-hidden','true');
    if(kind==='instagram')x.innerHTML='<svg class="icon-outline" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".9" fill="currentColor" stroke="none"/></svg>';
    else if(kind==='tiktok')x.innerHTML='<svg class="tiktok-mark" viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.23 1.79v4.03c-1.44-.05-2.9-.35-4.21-.97 -.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94 -1.31 1.92-3.59 3.17-5.92 3.21-1.43.08-2.86-.31-4.08-1.03 -2.02-1.19-3.44-3.37-3.65-5.7-.03-.5-.04-1-.01-1.49.18-2.29 1.31-4.48 3.07-5.98 2-1.73 4.8-2.42 7.36-1.94v4.28c-1.17-.38-2.52-.27-3.55.43 -.74.49-1.31 1.25-1.53 2.11-.18.62-.13 1.32.1 1.92.41 1.3 1.8 2.14 3.14 2.01 .89-.04 1.73-.53 2.2-1.28.31-.49.48-1.09.48-1.68.02-5.92-.01-11.83.03-17.74z"/></svg>';else if(kind==='facebook')x.textContent='f';else if(kind==='youtube')x.textContent='▶';else x.textContent='♛';return x}
  window.JAHANTI_GAME_UI=Object.freeze({names,icon,socialIcon,socialUsername});
  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('[data-jahanti-facebook]').forEach(link=>{if(settings.facebookUrl.startsWith('https://')){link.href=settings.facebookUrl;link.hidden=false}else link.hidden=true});
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


(function(){
  var cards=document.querySelectorAll('.social,.game-link');
  cards.forEach(function(card){card.addEventListener('pointerdown',function(){card.classList.remove('card-clicked');void card.offsetWidth;card.classList.add('card-clicked');clearTimeout(card._pulse);card._pulse=setTimeout(function(){card.classList.remove('card-clicked')},380)},{passive:true})});
})();

(function(){
  var btn=document.getElementById('global-color-toggle'); if(!btn)return;
  var icon=btn.querySelector('.date-color-toggle-icon'), text=btn.querySelector('.date-color-toggle-text');
  var frozen=false;
  btn.addEventListener('click',function(){frozen=!frozen;document.body.classList.toggle('motion-paused',frozen);btn.classList.toggle('frozen',frozen);if(icon)icon.textContent=frozen?'▶':'⏸';if(text)text.textContent=frozen?'متحرک کردن رنگ':'توقف رنگ';});
})();

(function(){
  var body=document.body, btn=document.getElementById('theme-toggle'); if(!btn)return;
  var icon=btn.querySelector('.theme-toggle-icon'), label=btn.querySelector('.theme-toggle-text'), meta=document.querySelector('meta[name="theme-color"]');
  function apply(t){body.classList.toggle('light',t==='light');if(icon)icon.textContent=t==='light'?'🌙':'☀️';if(label)label.textContent=t==='light'?'حالت شب':'حالت روز';if(meta)meta.setAttribute('content',t==='light'?'#f6f5f9':'#08090d');try{localStorage.setItem('mrash-theme',t)}catch(e){}}
  var saved=null;try{saved=localStorage.getItem('mrash-theme')}catch(e){}apply(saved==='light'?'light':'dark');
  btn.addEventListener('click',function(){apply(body.classList.contains('light')?'dark':'light')});
})();

(function(){
  var gate=document.getElementById('start-gate'), start=document.getElementById('start-btn'), intro=document.getElementById('intro-screen'), menu=document.getElementById('profile-menu-wrap'), audio=document.getElementById('intro-audio'), fill=document.getElementById('start-progress-fill'), count=document.querySelector('.start-loading-count'), clickText=document.querySelector('.start-click-text');
  if(!start||!intro)return;
  document.body.classList.add('intro-lock');
  function play(){if(!audio)return;audio.currentTime=0;audio.volume=1;var p=audio.play();if(p&&p.catch)p.catch(function(){});}
  function showMenu(){intro.classList.add('menu-ready');if(menu)menu.setAttribute('aria-hidden','false');}
  start.addEventListener('click',function(){if(clickText)clickText.hidden=true;if(count)count.hidden=false;var t0=null,dur=1400;function step(ts){if(t0===null)t0=ts;var p=Math.min(1,(ts-t0)/dur),v=Math.round(p*100);if(count)count.firstChild.textContent=v;if(fill)fill.style.width=v+'%';if(p<1)requestAnimationFrame(step);else{play();setTimeout(showMenu,3300)}}requestAnimationFrame(step)},{once:true});
  function closePanels(){document.querySelectorAll('.extra-panel').forEach(function(p){p.hidden=true});var main=document.getElementById('main-panel');if(main)main.hidden=true}
  function openPanel(id){closePanels();var panel=document.getElementById(id);if(panel){panel.hidden=false;intro.classList.add('hide');document.body.classList.remove('intro-lock');window.scrollTo(0,0);panel.querySelectorAll('.reveal-item').forEach(function(x){x.classList.add('in-view')})}}
  document.querySelectorAll('.menu-choice').forEach(function(c){c.addEventListener('click',function(){openPanel(c.getAttribute('data-panel'))})});
  document.querySelectorAll('.panel-back').forEach(function(b){b.addEventListener('click',function(){closePanels();intro.classList.remove('hide');intro.classList.add('menu-ready');intro.setAttribute('aria-hidden','false');document.body.classList.add('intro-lock');window.scrollTo(0,0)})});
})();

(function(){
  document.querySelectorAll('.tag-copy').forEach(function(btn){var el=btn.querySelector('.tag-copy-text'),original=el.textContent,value=btn.getAttribute('data-copy')||original,timer;btn.addEventListener('click',function(){function done(){btn.classList.add('copied');el.textContent='کپی شد ✓';clearTimeout(timer);timer=setTimeout(function(){btn.classList.remove('copied');el.textContent=original},1600)}if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(value).then(done).catch(function(){fallback(value);done()});else{fallback(value);done()}});function fallback(text){var ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch(e){}document.body.removeChild(ta)}});
})();

(function(){
  var groups=document.querySelectorAll('.reveal-group'); if(!groups.length)return;
  function reveal(g){g.querySelectorAll('.reveal-item').forEach(function(x,i){setTimeout(function(){x.classList.add('in-view')},Math.min(i,8)*80)})}
  if('IntersectionObserver' in window){var o=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){reveal(e.target);o.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -60px 0px'});groups.forEach(function(g){o.observe(g)})}else groups.forEach(reveal);
})();
(function(){var b=document.getElementById('back-to-top');if(!b)return;function t(){b.classList.toggle('show',window.scrollY>420)}window.addEventListener('scroll',t,{passive:true});t();b.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})})})();

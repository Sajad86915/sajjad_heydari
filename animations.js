/* ==========================================================
   animations.js — click animation for every link
   Pure CSS keyframes (transform / opacity / box-shadow), so it runs
   in every current browser. Choose the style with the home-screen
   "Animation" button; the choice is remembered.
   ========================================================== */
(function(){
  var KEY = "site-anim";
  var DEFAULT = "off";
  var LIST = [
    { id:"off",      ms:0   },
    { id:"launch",   ms:500 },
    { id:"ripple",   ms:620 },
    { id:"pulse",    ms:620 },
    { id:"flip",     ms:640 },
    { id:"burst",    ms:640 },
    { id:"jelly",    ms:620 },
    { id:"shake",    ms:520 },
    { id:"glow",     ms:640 },
    { id:"swing",    ms:700 },
    { id:"pop",      ms:480 },
    { id:"confetti", ms:760 },
    { id:"hearts",   ms:800 }
  ];
  var BY = {}; LIST.forEach(function(a){ BY[a.id] = a; });

  var explicit = false, current = DEFAULT;
  try{
    var saved = localStorage.getItem(KEY);
    if(saved && BY[saved]){ current = saved; explicit = true; }
  }catch(e){}

  var mq = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  function reduced(){ return !explicit && mq && mq.matches; } /* an explicit choice always plays */

  function get(){ return current; }
  function set(id){
    if(!BY[id]) return;
    current = id; explicit = true;
    try{ localStorage.setItem(KEY, id); }catch(e){}
  }

  function clean(el, cls, extra, ms){
    setTimeout(function(){
      el.classList.remove(cls, "la-host");
      el._la = false;
      (extra || []).forEach(function(n){ if(n && n.parentNode) n.parentNode.removeChild(n); });
    }, (ms || 500) + 250);
  }

  /* play the animation on `el`; returns how long (ms) to wait before following the link */
  function play(el, ev){
    var id = current;
    var a = BY[id];
    if(!a || id === "off" || reduced() || el._la) return 0;
    el._la = true;

    var r = el.getBoundingClientRect();
    var x = ev && ev.clientX ? ev.clientX - r.left : r.width / 2;
    var y = ev && ev.clientY ? ev.clientY - r.top  : r.height / 2;
    var nodes = [];

    if(id === "launch"){
      el.classList.remove("link-launch"); void el.offsetWidth; el.classList.add("link-launch");
      setTimeout(function(){ el.classList.remove("link-launch"); el._la = false; }, 600);
      return a.ms - 80;
    }

    el.classList.add("la-host", "la-h-" + id);
    void el.offsetWidth;

    if(id === "ripple"){
      var size = Math.max(r.width, r.height) * 2.2;
      var rp = document.createElement("span");
      rp.className = "la-ripple";
      rp.style.width = rp.style.height = size + "px";
      rp.style.left = (x - size / 2) + "px";
      rp.style.top  = (y - size / 2) + "px";
      el.appendChild(rp); nodes.push(rp);
    }
    if(id === "burst"){
      var N = 16;
      for(var i = 0; i < N; i++){
        var p = document.createElement("span");
        p.className = "la-spark";
        var ang = (Math.PI * 2 * i / N) + Math.random() * .3;
        var dist = 46 + Math.random() * 46;
        p.style.left = x + "px"; p.style.top = y + "px";
        p.style.setProperty("--dx", Math.round(Math.cos(ang) * dist) + "px");
        p.style.setProperty("--dy", Math.round(Math.sin(ang) * dist) + "px");
        p.style.animationDelay = (Math.random() * 60) + "ms";
        p.style.background = i % 2 ? "var(--ring-b,#d8b25b)" : "var(--ring-a,#b56cff)";
        el.appendChild(p); nodes.push(p);
      }
    }
    if(id === "confetti"){
      var COL = ["#b56cff","#d8b25b","#ff6b9d","#4fd1c5","#6aa7ff","#ffffff","#ff9f5a"];
      for(var c = 0; c < 26; c++){
        var q = document.createElement("span");
        q.className = "la-piece";
        q.style.left = x + "px"; q.style.top = y + "px";
        q.style.background = COL[c % COL.length];
        q.style.setProperty("--dx", Math.round((Math.random() - .5) * 170) + "px");
        q.style.setProperty("--dy", Math.round(40 + Math.random() * 110) + "px");
        q.style.setProperty("--up", Math.round(30 + Math.random() * 40) + "px");
        q.style.setProperty("--rot", Math.round((Math.random() - .5) * 900) + "deg");
        q.style.animationDelay = (Math.random() * 80) + "ms";
        el.appendChild(q); nodes.push(q);
      }
    }
    if(id === "hearts"){
      var EM = ["❤️","💖","💜","💛","✨"];
      for(var k = 0; k < 9; k++){
        var hh = document.createElement("span");
        hh.className = "la-heart";
        hh.textContent = EM[k % EM.length];
        hh.style.left = (x + (Math.random() - .5) * 70) + "px"; hh.style.top = y + "px";
        hh.style.setProperty("--dx", Math.round((Math.random() - .5) * 60) + "px");
        hh.style.setProperty("--dy", "-" + Math.round(60 + Math.random() * 60) + "px");
        hh.style.fontSize = (14 + Math.random() * 12) + "px";
        hh.style.animationDelay = (Math.random() * 160) + "ms";
        el.appendChild(hh); nodes.push(hh);
      }
    }
    clean(el, "la-h-" + id, nodes, a.ms);
    return a.ms - 140;
  }

  /* ---------- every link on the page ---------- */
  document.addEventListener("click", function(e){
    if(e.defaultPrevented) return;
    var link = e.target.closest ? e.target.closest("a[href]") : null;
    if(!link) return;
    if(e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return; /* new-tab shortcuts stay normal */
    var href = link.getAttribute("href") || "";
    if(!href || href.charAt(0) === "#" || /^javascript:/i.test(href)) return;
    if(link.hasAttribute("download")) return;

    var host = link.closest(".social, .game-link") || link;
    var wait = play(host, e);
    if(!wait) return; /* animation off: normal browser behaviour */

    e.preventDefault();
    var target = link.getAttribute("target");
    var url = link.href;
    setTimeout(function(){
      if(target === "_blank"){
        var w = window.open(url, "_blank");
        if(w){ try{ w.opener = null; }catch(err){} }
        else{ window.location.href = url; } /* pop-up blocked: still open the link */
      }else{
        window.location.href = url;
      }
    }, wait);
  });

  window.SiteAnim = { list:LIST, get:get, set:set, play:function(el, ev){ var w = play(el, ev); return w; } };
})();

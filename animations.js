/* ==========================================================
   animations.js — click animation for every link
   Pure CSS keyframes (transform / opacity / box-shadow), so it runs
   in every current browser. Choose the style with the home-screen
   "Animation" button; the choice is remembered.
   ========================================================== */
(function(){
  var KEY = "site-anim";
  var DEFAULT = "launch";
  var LIST = [
    { id:"launch", ms:500 },
    { id:"ripple", ms:620 },
    { id:"pulse",  ms:620 },
    { id:"flip",   ms:640 },
    { id:"burst",  ms:640 },
    { id:"jelly",  ms:620 },
    { id:"off",    ms:0   }
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

  function clean(el, cls, extra){
    setTimeout(function(){
      el.classList.remove(cls, "la-host");
      el._la = false;
      (extra || []).forEach(function(n){ if(n && n.parentNode) n.parentNode.removeChild(n); });
    }, 700);
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
    clean(el, "la-h-" + id, nodes);
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

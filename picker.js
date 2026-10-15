/* ==========================================================
   picker.js — "Language" and "Font" pickers on the home hub
   • Language: every site language, Persian first, then English
   • Font: nine fonts, chosen with the numbers 1–9
     (each number is drawn in its own font; keys 1–9 also work)
   Every font stack pairs a Latin/Cyrillic family with an Arabic-script
   family, so it changes English, Russian, Persian and Arabic together.
   ========================================================== */
(function(){
  var KEY = "site-font";
  var root = document.documentElement;
  var body = document.body;
  var picker = document.getElementById("picker");
  if(!picker) return;
  var titleEl = document.getElementById("picker-title");
  var bodyEl = picker.querySelector(".picker-body");

  var FONTS = [
    { n:1, name:"Vazirmatn",            stack:null, gf:[] },
    { n:2, name:"Rubik",                stack:'"Rubik","Vazirmatn",sans-serif', gf:["Rubik:wght@400;600;700"] },
    { n:3, name:"Cairo",                stack:'"Cairo","Noto Sans","Vazirmatn",sans-serif', gf:["Cairo:wght@400;600;700"] },
    { n:4, name:"Tajawal",              stack:'"Tajawal","Noto Sans","Vazirmatn",sans-serif', gf:["Tajawal:wght@400;500;700"] },
    { n:5, name:"IBM Plex",             stack:'"IBM Plex Sans","IBM Plex Sans Arabic","Vazirmatn",sans-serif', gf:["IBM+Plex+Sans:wght@400;600;700","IBM+Plex+Sans+Arabic:wght@400;600;700"] },
    { n:6, name:"Noto Serif & Naskh",   stack:'"Noto Serif","Noto Naskh Arabic","Vazirmatn",serif', gf:["Noto+Serif:wght@400;600;700","Noto+Naskh+Arabic:wght@400;600;700"] },
    { n:7, name:"Playfair & Amiri",     stack:'"Playfair Display","Amiri","Vazirmatn",serif', gf:["Playfair+Display:wght@400;600;700","Amiri:wght@400;700"] },
    { n:8, name:"Oswald & Lalezar",     stack:'"Oswald","Lalezar","Vazirmatn",sans-serif', gf:["Oswald:wght@400;600;700","Lalezar"] },
    { n:9, name:"Comfortaa & Lemonada", stack:'"Comfortaa","Lemonada","Vazirmatn",sans-serif', gf:["Comfortaa:wght@400;600;700","Lemonada:wght@400;600;700"] }
  ];

  function lang(){ return (window.getSiteLang && window.getSiteLang()) || "en"; }
  function tr(k){ return window.t ? window.t(k) : k; }
  function digit(n){
    var l = lang();
    if(l === "fa" || l === "ur") return n.toLocaleString("fa-IR");
    if(l === "ar" || l === "ckb") return n.toLocaleString("ar-EG");
    return String(n);
  }

  /* ---------- load Google Fonts lazily, one request per family ---------- */
  var loaded = {};
  function load(list){
    list.forEach(function(fam){
      if(loaded[fam]) return;
      loaded[fam] = true;
      var l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=" + fam + "&display=swap";
      document.head.appendChild(l);
    });
  }
  function loadAll(){ FONTS.forEach(function(f){ load(f.gf); }); }

  /* ---------- current font ---------- */
  var current = 1;
  try{ var saved = parseInt(localStorage.getItem(KEY), 10); if(saved >= 1 && saved <= 9) current = saved; }catch(e){}

  function applyFont(n, persist){
    var f = FONTS[n - 1];
    current = n;
    if(f.stack){
      load(f.gf);
      root.style.setProperty("--user-font", f.stack);
      body.classList.add("font-custom");
    }else{
      root.style.removeProperty("--user-font");
      body.classList.remove("font-custom");
    }
    if(persist){ try{ localStorage.setItem(KEY, String(n)); }catch(e){} }
  }
  applyFont(current, false);

  /* ---------- open / close ---------- */
  var kind = null, lastFocus = null;

  function styleIn(el, stack){
    el.style.setProperty("font-family", stack || '"Vazirmatn","Noto Sans",sans-serif', "important");
  }

  function renderFont(){
    titleEl.textContent = tr("pickFont");
    bodyEl.innerHTML = "";
    var grid = document.createElement("div");
    grid.className = "font-grid";
    var sample = document.createElement("div");
    sample.className = "font-sample";
    function setSample(n){
      var f = FONTS[n - 1];
      styleIn(sample, f.stack);
      sample.innerHTML = "";
      var a = document.createElement("div"); a.className = "font-sample-main";
      a.textContent = tr("fontSample") + " — " + f.name;
      var b = document.createElement("div"); b.className = "font-sample-langs";
      b.textContent = "Hello World · سلام دنیا · مرحبا بالعالم · Привет, мир";
      sample.appendChild(a); sample.appendChild(b);
    }
    FONTS.forEach(function(f){
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "font-opt";
      btn.setAttribute("data-n", f.n);
      btn.setAttribute("aria-pressed", f.n === current ? "true" : "false");
      btn.setAttribute("aria-label", f.n + " — " + f.name);
      var num = document.createElement("span"); num.className = "font-num"; num.textContent = digit(f.n);
      var nm = document.createElement("span"); nm.className = "font-name"; nm.textContent = f.name;
      styleIn(num, f.stack); styleIn(nm, f.stack);
      btn.appendChild(num); btn.appendChild(nm);
      btn.addEventListener("click", function(){ choose(f.n); });
      btn.addEventListener("mouseenter", function(){ setSample(f.n); });
      btn.addEventListener("focus", function(){ setSample(f.n); });
      btn.addEventListener("mouseleave", function(){ setSample(current); });
      grid.appendChild(btn);
    });
    bodyEl.appendChild(grid);
    bodyEl.appendChild(sample);
    setSample(current);
  }

  function choose(n){
    applyFont(n, true);
    bodyEl.querySelectorAll(".font-opt").forEach(function(b){
      b.setAttribute("aria-pressed", String(b.getAttribute("data-n")) === String(n) ? "true" : "false");
    });
    var s = bodyEl.querySelector(".font-sample");
    if(s){
      var f = FONTS[n - 1];
      styleIn(s, f.stack);
      s.querySelector(".font-sample-main").textContent = tr("fontSample") + " — " + f.name;
    }
  }

  var ANIM_ICON = { launch:"🚀", ripple:"💧", pulse:"💗", flip:"🔄", burst:"✨", jelly:"🍮", off:"⛔" };
  var ANIM_KEY  = { launch:"animLaunch", ripple:"animRipple", pulse:"animPulse", flip:"animFlip", burst:"animBurst", jelly:"animJelly", off:"animOff" };

  function renderAnim(){
    titleEl.textContent = tr("pickAnim");
    bodyEl.innerHTML = "";
    var A = window.SiteAnim;
    if(!A) return;
    var grid = document.createElement("div");
    grid.className = "anim-grid";
    var demo = document.createElement("button");
    demo.type = "button";
    demo.className = "anim-demo";
    demo.innerHTML = "<span>↗</span><span>" + tr("animDemo") + "</span>";
    demo.addEventListener("click", function(ev){ A.play(demo, ev); });
    A.list.forEach(function(a){
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "anim-opt";
      btn.setAttribute("data-id", a.id);
      btn.setAttribute("aria-pressed", a.id === A.get() ? "true" : "false");
      var ic = document.createElement("span"); ic.className = "anim-ico"; ic.setAttribute("aria-hidden", "true"); ic.textContent = ANIM_ICON[a.id];
      var nm = document.createElement("span"); nm.textContent = tr(ANIM_KEY[a.id]);
      btn.appendChild(ic); btn.appendChild(nm);
      btn.addEventListener("click", function(ev){
        A.set(a.id);
        grid.querySelectorAll(".anim-opt").forEach(function(b){ b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
        A.play(demo, null);
      });
      grid.appendChild(btn);
    });
    bodyEl.appendChild(grid);
    bodyEl.appendChild(demo);
  }

  function renderLang(){
    titleEl.textContent = tr("pickLang");
    bodyEl.innerHTML = "";
    var grid = document.createElement("div");
    grid.className = "lang-grid";
    (window.SITE_LANGS || []).forEach(function(L){
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lang-opt";
      btn.lang = L.code;
      btn.setAttribute("dir", "auto");
      btn.setAttribute("aria-pressed", L.code === lang() ? "true" : "false");
      btn.textContent = L.name;
      btn.addEventListener("click", function(){
        if(window.setSiteLang) window.setSiteLang(L.code);
        setTimeout(close, 220);
      });
      grid.appendChild(btn);
    });
    bodyEl.appendChild(grid);
  }

  function open(which){
    kind = which;
    lastFocus = document.activeElement;
    if(which === "font"){ loadAll(); renderFont(); } else if(which === "anim"){ renderAnim(); } else { renderLang(); }
    picker.hidden = false;
    body.classList.add("picker-lock");
    void picker.offsetWidth;
    picker.classList.add("show");
    var target = bodyEl.querySelector('[aria-pressed="true"]') || picker.querySelector(".picker-close");
    if(target) try{ target.focus({preventScroll:true}); }catch(e){}
  }
  function close(){
    if(picker.hidden) return;
    picker.classList.remove("show");
    body.classList.remove("picker-lock");
    kind = null;
    setTimeout(function(){ if(!picker.classList.contains("show")) picker.hidden = true; }, 220);
    if(lastFocus && lastFocus.focus) try{ lastFocus.focus({preventScroll:true}); }catch(e){}
  }

  var langBtn = document.getElementById("lang-open");
  var fontBtn = document.getElementById("font-open");
  if(langBtn) langBtn.addEventListener("click", function(){ open("lang"); });
  if(fontBtn) fontBtn.addEventListener("click", function(){ open("font"); });
  var animBtn = document.getElementById("anim-open");
  if(animBtn) animBtn.addEventListener("click", function(){ open("anim"); });
  picker.querySelectorAll("[data-picker-close]").forEach(function(el){ el.addEventListener("click", close); });

  /* keyboard: Esc closes, 1–9 picks a font (Latin, Persian and Arabic digits), Tab stays inside */
  var DIGITS = { "۱":1,"۲":2,"۳":3,"۴":4,"۵":5,"۶":6,"۷":7,"۸":8,"۹":9, "١":1,"٢":2,"٣":3,"٤":4,"٥":5,"٦":6,"٧":7,"٨":8,"٩":9 };
  document.addEventListener("keydown", function(e){
    if(picker.hidden) return;
    if(e.key === "Escape"){ e.preventDefault(); close(); return; }
    if(kind === "font" && !e.ctrlKey && !e.metaKey && !e.altKey){
      var n = /^[1-9]$/.test(e.key) ? +e.key : DIGITS[e.key];
      if(n){ e.preventDefault(); choose(n); var b = bodyEl.querySelector('.font-opt[data-n="' + n + '"]'); if(b) b.focus({preventScroll:true}); return; }
    }
    if(e.key === "Tab"){
      var f = picker.querySelectorAll("button");
      if(!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  });

  /* keep an open picker in sync when the language changes */
  document.addEventListener("sitelangchange", function(){
    if(picker.hidden) return;
    if(kind === "font") renderFont(); else if(kind === "anim") renderAnim(); else if(kind === "lang") renderLang();
  });
})();

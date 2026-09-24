
(function(){
  var cards = document.querySelectorAll(".social, .game-link");
  if(!cards.length) return;

  cards.forEach(function(card){
    card.addEventListener("pointerdown", function(){
      card.classList.remove("card-clicked");
      void card.offsetWidth; // restart the short animation
      card.classList.add("card-clicked");

      clearTimeout(card._clickPulseTimer);
      card._clickPulseTimer = setTimeout(function(){
        card.classList.remove("card-clicked");
      }, 560);
    }, {passive:true});
  });
})();

document.querySelectorAll("a[target='_blank']").forEach(a=>{
  a.addEventListener("click",()=>{});
});


(function(){
  var startGate = document.getElementById("start-gate");
  var startBtn = document.getElementById("start-btn");
  var intro = document.getElementById("intro-screen");
  var hub = document.getElementById("profile-hub");
  var audio = document.getElementById("intro-audio");
  if(!intro) return;

  document.body.classList.add("intro-lock");
  var finished = false;

  function showHub(){
    if(finished) return;
    finished = true;
    intro.classList.add("hide");
    document.body.classList.remove("intro-lock");
    if(startGate) startGate.classList.add("hide");
    if(hub) {
      hub.hidden = false;
      hub.classList.add("hub-visible");
    }
  }

  function beginIntro(){
    intro.classList.add("show");

    if(audio){
      audio.currentTime = 0;
      audio.volume = 1;

      var playAttempt = audio.play();
      if(playAttempt && playAttempt.catch){
        playAttempt.catch(function(){});
      }

      audio.addEventListener("ended", function(){
        setTimeout(showHub, 350);
      }, {once:true});
    }

    /* Fallback: if the browser cannot report audio duration/ended,
       the hub still appears after the intro animation. */
    setTimeout(function(){
      if(!finished) showHub();
    }, 5200);
  }

  if(startBtn){
    var clickText = startBtn.querySelector(".start-click-text");
    var counterEl = startBtn.querySelector(".start-loading-count");

    startBtn.addEventListener("click", function(){
      if(clickText) clickText.hidden = true;
      if(counterEl) counterEl.hidden = false;

      var duration = 1600;
      var startTime = null;

      function step(ts){
        if(startTime === null) startTime = ts;
        var progress = Math.min(1, (ts - startTime) / duration);
        var value = Math.round(progress * 100);

        if(counterEl) counterEl.firstChild.textContent = value;

        if(progress < 1){
          requestAnimationFrame(step);
        }else{
          /* The counter stays visibly at 100% before the intro starts. */
          setTimeout(function(){
            if(startGate) startGate.classList.add("hide");
            beginIntro();
          }, 300);
        }
      }

      requestAnimationFrame(step);
    }, {once:true});
  }else{
    beginIntro();
  }
})();

(function(){
  var hub = document.getElementById("profile-hub");
  var views = {
    "2007": document.getElementById("view-2007"),
    "1386": document.getElementById("view-1386"),
    "info": document.getElementById("view-info"),
    "games": document.getElementById("view-games")
  };

  if(!hub) return;

  /* Never show a content page underneath the home screen on first load. */
  Object.keys(views).forEach(function(key){
    if(views[key]) views[key].hidden = true;
  });

  function replay(el, cls){
    if(!el) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
    setTimeout(function(){ el.classList.remove(cls); }, 760);
  }

  var NAV_DELAY = 280;   /* lets the button press + page-out animation be seen */
  var navBusy = false;

  function openView(name, trigger){
    if(navBusy) return;
    navBusy = true;
    replay(trigger, "card-open");
    hub.classList.add("hub-leaving");
    setTimeout(function(){
      hub.classList.remove("hub-leaving");
      showView(name);
      navBusy = false;
    }, NAV_DELAY);
  }

  function showView(name){
    Object.keys(views).forEach(function(key){
      if(views[key]) views[key].hidden = key !== name;
    });

    hub.hidden = true;
    window.scrollTo({top:0, behavior:"instant"});

    var selected = views[name];
    if(selected){
      selected.classList.remove("view-enter");
      void selected.offsetWidth;
      selected.classList.add("view-enter");
      setTimeout(function(){ selected.classList.remove("view-enter"); }, 800);
    }
  }

  function goBack(event){
    if(navBusy) return;
    navBusy = true;
    var trigger = event && event.currentTarget;
    replay(trigger, "card-open");
    var current = null;
    Object.keys(views).forEach(function(key){
      if(views[key] && !views[key].hidden) current = views[key];
    });
    if(current) current.classList.add("view-leaving");
    setTimeout(function(){
      if(current) current.classList.remove("view-leaving");
      showHub();
      navBusy = false;
    }, NAV_DELAY);
  }

  function showHub(){
    Object.keys(views).forEach(function(key){
      if(views[key]) views[key].hidden = true;
    });
    hub.hidden = false;
    hub.classList.remove("hub-visible");
    void hub.offsetWidth;
    hub.classList.add("hub-visible");
    window.scrollTo({top:0, behavior:"instant"});
  }

  hub.querySelectorAll("[data-view]").forEach(function(btn){
    btn.addEventListener("click", function(){
      openView(btn.getAttribute("data-view"), btn);
    });
  });

  document.querySelectorAll("[data-back]").forEach(function(btn){
    btn.addEventListener("click", goBack);
  });
})();

/* ---------- clipboard helper + copy buttons ---------- */
function copyText(text){
  function fallbackCopy(){
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try{ document.execCommand("copy"); }catch(e){}
    document.body.removeChild(ta);
  }
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).catch(fallbackCopy);
  }else{
    fallbackCopy();
  }
}

/* Game cards: copy bar (tag / ID / name) */
(function(){
  var buttons = document.querySelectorAll(".tag-copy");
  function render(btn){
    var textEl = btn.querySelector(".tag-copy-text");
    if(!textEl) return;
    textEl.textContent = btn.classList.contains("copied")
      ? t("copied")
      : t(btn.getAttribute("data-label"), { v: btn.getAttribute("data-copy") });
  }

  buttons.forEach(function(btn){
    var timer = null;
    btn.addEventListener("click", function(){
      copyText(btn.getAttribute("data-copy"));
      btn.classList.add("copied");
      render(btn);
      clearTimeout(timer);
      timer = setTimeout(function(){
        btn.classList.remove("copied");
        render(btn);
      }, 1600);
    });
    render(btn);
  });

  document.addEventListener("sitelangchange", function(){ buttons.forEach(render); });
})();

/* Link cards: copy-ID chip + toast ("Instagram @sajjad_heydari2007  Copied ✓") */
(function(){
  var ICONS =
    '<svg class="ic-copy" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2.6"/><path d="M5 15V6.6A2.6 2.6 0 0 1 7.6 4H15"/></svg>' +
    '<svg class="ic-check" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  var toast = document.getElementById("toast");
  var toastStatus = toast && toast.querySelector(".toast-status");
  var toastText = toast && toast.querySelector(".toast-text");
  var toastTimer = null;

  function showToast(text){
    if(!toast) return;
    toastStatus.textContent = t("copied");
    toastText.textContent = text;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toast.classList.remove("show"); }, 2200);
  }

  document.querySelectorAll(".id-copy").forEach(function(btn){
    var timer = null;
    btn.innerHTML = ICONS;
    btn.addEventListener("click", function(){
      var id = btn.getAttribute("data-id");
      copyText(id);
      btn.classList.add("copied");
      clearTimeout(timer);
      timer = setTimeout(function(){ btn.classList.remove("copied"); }, 1600);
      showToast(btn.getAttribute("data-platform") + " " + id);
    });
  });
})();


/* Scroll reveal — works in both directions:
   scrolling down, items rise in from below; scrolling up, they drop in from above.
   Items that leave the screen reset, so they animate again next time. */
(function(){
  var items = document.querySelectorAll(".reveal-item");
  if(!items.length) return;

  var dir = 1, lastY = window.scrollY;
  window.addEventListener("scroll", function(){
    var y = window.scrollY;
    if(Math.abs(y - lastY) > 1){ dir = y > lastY ? 1 : -1; lastY = y; }
  }, {passive:true});

  if(!("IntersectionObserver" in window)){
    items.forEach(function(item){ item.classList.add("in-view"); });
    return;
  }

  var observer = new IntersectionObserver(function(entries){
    var order = 0;
    entries.forEach(function(entry){
      var el = entry.target;
      var shown = el.classList.contains("in-view");
      if(entry.isIntersecting && entry.intersectionRatio >= 0.12){
        if(!shown){
          var d = window.scrollY < 8 ? 1 : dir;
          el.style.setProperty("--ry", (d > 0 ? 34 : -34) + "px");
          el.style.setProperty("--rd", Math.min(order++, 8) * 70 + "ms");
          el.classList.add("in-view");
        }
      }else if(!entry.isIntersecting && shown){
        el.style.setProperty("--rd", "0ms");
        el.style.setProperty("--ry", (dir > 0 ? -24 : 24) + "px");
        el.classList.remove("in-view");
      }
    });
  }, { threshold:[0, 0.12], rootMargin:"0px 0px -40px 0px" });

  items.forEach(function(el){ observer.observe(el); });
})();

/* Scroll progress bar + values used by the scroll-linked hero (--sy) */
(function(){
  var bar = document.getElementById("scroll-progress");
  var root = document.documentElement;
  var ticking = false;

  function update(){
    ticking = false;
    var y = window.scrollY;
    var max = Math.max(1, root.scrollHeight - window.innerHeight);
    if(bar) bar.style.setProperty("--p", Math.min(1, Math.max(0, y / max)).toFixed(4));
    root.style.setProperty("--sy", Math.round(y));
  }
  function request(){
    if(!ticking){ ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener("scroll", request, {passive:true});
  window.addEventListener("resize", request);
  document.addEventListener("sitelangchange", request);
  update();
})();

(function(){
  var btn = document.getElementById("back-to-top");
  if(!btn) return;
  function toggleVisibility(){
    if(window.scrollY > 420){
      btn.classList.add("show");
    }else{
      btn.classList.remove("show");
    }
  }
  window.addEventListener("scroll", toggleVisibility, { passive:true });
  toggleVisibility();
  btn.addEventListener("click", function(){
    window.scrollTo({ top:0, behavior:"smooth" });
  });
})();

/* GLOBAL THEME/COLOR CONTROLLER */
(function(){
  var body=document.body;
  var theme=document.getElementById("theme-toggle");
  var color=document.getElementById("color-toggle");

  function sync(){
    var light=localStorage.getItem("site-theme")==="light";
    var off=localStorage.getItem("site-color")==="off";
    body.classList.toggle("light-theme",light);
    body.classList.toggle("color-off",off);

    if(theme){
      theme.querySelector(".hub-control-icon").textContent=light?"☾":"☼";
      theme.querySelector(".hub-control-text").textContent=light?t("night"):t("day");
    }
    if(color){
      color.querySelector(".hub-control-icon").textContent=off?"○":"◉";
      color.querySelector(".hub-control-text").textContent=off?t("colorOff"):t("colorOn");
    }
  }
  sync();
  document.addEventListener("sitelangchange", sync);

  if(theme) theme.addEventListener("click",function(){
    localStorage.setItem("site-theme",
      body.classList.contains("light-theme")?"dark":"light");
    sync();
  });
  if(color) color.addEventListener("click",function(){
    localStorage.setItem("site-color",
      body.classList.contains("color-off")?"on":"off");
    sync();
  });
})();


/* ==========================================================
   Click feedback — only on real buttons and links
   (the press happens on the element itself, nothing is drawn elsewhere)
   ========================================================== */
(function(){
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduce) return;

  var TARGETS = 'a[href], button, [role="button"]';
  var NO_POP  = ".social, .game-link, .hub-card, .view-back"; /* these already have their own press animation */
  var canAnimate = typeof Element.prototype.animate === "function";

  function press(el){
    if(!canAnimate || el.matches(NO_POP)) return;
    el.animate([
      { scale:"1",    boxShadow:"0 0 0 0 rgba(216,178,91,.55)" },
      { scale:".92",  boxShadow:"0 0 0 4px rgba(216,178,91,.35)", offset:.35 },
      { scale:"1.03", boxShadow:"0 0 0 9px rgba(216,178,91,.10)", offset:.7 },
      { scale:"1",    boxShadow:"0 0 0 12px rgba(216,178,91,0)" }
    ], { duration:420, easing:"cubic-bezier(.2,.8,.2,1)" });
  }

  function findTarget(node){
    var el = node && node.closest ? node.closest(TARGETS) : null;
    if(!el || el.disabled || el.getAttribute("aria-disabled") === "true") return null;
    return el;
  }

  document.addEventListener("pointerdown", function(e){
    if(!e.isPrimary || (e.pointerType === "mouse" && e.button !== 0)) return;
    var el = findTarget(e.target);
    if(el) press(el);
  }, {passive:true, capture:true});

  /* keyboard (Enter / Space) fires click with detail 0 */
  document.addEventListener("click", function(e){
    if(e.detail !== 0) return;
    var el = findTarget(e.target);
    if(el) press(el);
  }, {capture:true});

  /* extras: theme / color icons, back-to-top launch */
  function icon(id){ var b = document.getElementById(id); return b && b.querySelector(".hub-control-icon"); }
  var themeBtn = document.getElementById("theme-toggle");
  var colorBtn = document.getElementById("color-toggle");
  var topBtn   = document.getElementById("back-to-top");

  if(canAnimate){
    if(themeBtn) themeBtn.addEventListener("click", function(){
      var i = icon("theme-toggle");
      if(i) i.animate([{ rotate:"0deg", scale:"1" },{ rotate:"180deg", scale:"1.35", offset:.5 },{ rotate:"360deg", scale:"1" }],
                      { duration:620, easing:"cubic-bezier(.2,.8,.2,1)" });
    });
    if(colorBtn) colorBtn.addEventListener("click", function(){
      var i = icon("color-toggle");
      if(i) i.animate([{ scale:"1", rotate:"0deg" },{ scale:"1.5", rotate:"120deg", offset:.45 },{ scale:"1", rotate:"360deg" }],
                      { duration:620, easing:"cubic-bezier(.2,.8,.2,1)" });
    });
    if(topBtn) topBtn.addEventListener("click", function(){
      topBtn.animate([
        { translate:"0 0", opacity:1 },
        { translate:"0 -22px", opacity:0, offset:.45 },
        { translate:"0 18px", opacity:0, offset:.46 },
        { translate:"0 0", opacity:1 }
      ], { duration:600, easing:"cubic-bezier(.2,.8,.2,1)" });
    });

    /* language change: visible texts ripple in */
    document.addEventListener("sitelangchange", function(){
      var vh = window.innerHeight, n = 0;
      document.querySelectorAll("[data-i18n]").forEach(function(el){
        var r = el.getBoundingClientRect();
        if(!r.width || r.bottom < 0 || r.top > vh) return;
        el.animate([
          { opacity:0, translate:"0 10px" },
          { opacity:1, translate:"0 0" }
        ], { duration:420, delay:Math.min(n++, 14) * 28, easing:"cubic-bezier(.2,.8,.2,1)", fill:"backwards" });
      });
    });
  }
})();

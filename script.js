
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
      }, 380);
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

  function openView(name, trigger){
    replay(trigger, "card-open");

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
    var trigger = event && event.currentTarget;
    replay(trigger, "card-open");

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


(function(){
  var groups = document.querySelectorAll(".reveal-group");
  if(!groups.length) return;

  function revealGroup(group){
    var items = group.querySelectorAll(".reveal-item");
    items.forEach(function(item, i){
      setTimeout(function(){
        item.classList.add("in-view");
      }, Math.min(i, 8) * 80);
    });
  }

  if("IntersectionObserver" in window){
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          revealGroup(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    groups.forEach(function(el){ observer.observe(el); });
  }else{
    groups.forEach(function(el){
      el.querySelectorAll(".reveal-item").forEach(function(item){ item.classList.add("in-view"); });
    });
  }
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

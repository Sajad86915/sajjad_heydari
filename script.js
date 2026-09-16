
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
  var btn = document.getElementById("date-color-toggle");
  var info = document.getElementById("birthdate-info");
  if(!btn || !info) return;
  var icon = btn.querySelector(".date-color-toggle-icon");
  var text = btn.querySelector(".date-color-toggle-text");
  var frozen = false;
  btn.addEventListener("click", function(){
    frozen = !frozen;
    info.classList.toggle("color-frozen", frozen);
    btn.classList.toggle("frozen", frozen);
    document.body.classList.toggle("motion-paused", frozen);
    icon.textContent = frozen ? "▶" : "⏸";
    text.textContent = frozen ? "متحرک کردن رنگ" : "توقف رنگ";
  });
})();

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
    "wallet": document.getElementById("view-wallet")
  };

  if(!hub) return;

  function openView(name){
    Object.keys(views).forEach(function(key){
      if(views[key]) views[key].hidden = key !== name;
    });

    hub.hidden = true;
    window.scrollTo({top:0, behavior:"instant"});

    var selected = views[name];
    if(selected){
      selected.classList.add("view-enter");
      setTimeout(function(){ selected.classList.remove("view-enter"); }, 550);
    }
  }

  function goBack(){
    Object.keys(views).forEach(function(key){
      if(views[key]) views[key].hidden = true;
    });
    hub.hidden = false;
    hub.classList.add("hub-visible");
    window.scrollTo({top:0, behavior:"instant"});
  }

  hub.querySelectorAll("[data-view]").forEach(function(btn){
    btn.addEventListener("click", function(){
      openView(btn.getAttribute("data-view"));
    });
  });

  document.querySelectorAll("[data-back]").forEach(function(btn){
    btn.addEventListener("click", goBack);
  });
})();

(function(){
  var body = document.body;
  var btn = document.getElementById("theme-toggle");
  if(!btn) return;
  var icon = btn.querySelector(".theme-toggle-icon");
  var label = btn.querySelector(".theme-toggle-text");
  var metaTheme = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme){
    if(theme === "light"){
      body.classList.add("light");
      icon.textContent = "🌙";
      label.textContent = "حالت شب";
      if(metaTheme) metaTheme.setAttribute("content", "#f6f5f9");
    }else{
      body.classList.remove("light");
      icon.textContent = "☀️";
      label.textContent = "حالت روز";
      if(metaTheme) metaTheme.setAttribute("content", "#08090d");
    }
  }

  var saved = null;
  try{ saved = localStorage.getItem("mrash-theme"); }catch(e){}
  applyTheme(saved === "light" ? "light" : "dark");

  btn.addEventListener("click", function(){
    var next = body.classList.contains("light") ? "dark" : "light";
    applyTheme(next);
    try{ localStorage.setItem("mrash-theme", next); }catch(e){}
  });
})();

(function(){
  document.querySelectorAll(".tag-copy").forEach(function(btn){
    var textEl = btn.querySelector(".tag-copy-text");
    var original = textEl.textContent;
    var value = btn.getAttribute("data-copy") || original;
    var timer = null;

    function fallbackCopy(text){
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try{ document.execCommand("copy"); }catch(e){}
      document.body.removeChild(ta);
    }

    btn.addEventListener("click", function(){
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(value).catch(function(){ fallbackCopy(value); });
      }else{
        fallbackCopy(value);
      }
      btn.classList.add("copied");
      textEl.textContent = "کپی شد ✓";
      clearTimeout(timer);
      timer = setTimeout(function(){
        btn.classList.remove("copied");
        textEl.textContent = original;
      }, 1600);
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



(function(){
  var body = document.body;
  var themeBtn = document.getElementById("theme-toggle");
  var colorBtn = document.getElementById("color-toggle");
  if(!themeBtn && !colorBtn) return;

  function applyTheme(){
    var light = localStorage.getItem("site-theme") === "light";
    body.classList.toggle("light-theme", light);
    if(themeBtn){
      themeBtn.querySelector(".hub-control-icon").textContent = light ? "☾" : "☼";
      themeBtn.querySelector(".hub-control-text").textContent = light ? "NIGHT" : "DAY";
    }
  }

  function applyColor(){
    var off = localStorage.getItem("site-color") === "off";
    body.classList.toggle("color-off", off);
    if(colorBtn){
      colorBtn.querySelector(".hub-control-icon").textContent = off ? "○" : "◉";
      colorBtn.querySelector(".hub-control-text").textContent = off ? "COLOR OFF" : "COLOR";
    }
  }

  applyTheme();
  applyColor();

  if(themeBtn){
    themeBtn.addEventListener("click", function(){
      var next = body.classList.contains("light-theme") ? "dark" : "light";
      localStorage.setItem("site-theme", next);
      applyTheme();
    });
  }
  if(colorBtn){
    colorBtn.addEventListener("click", function(){
      var next = body.classList.contains("color-off") ? "on" : "off";
      localStorage.setItem("site-color", next);
      applyColor();
    });
  }
})();

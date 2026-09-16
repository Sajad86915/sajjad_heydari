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
  if(!intro){ if(startGate) startGate.remove(); return; }

  document.body.classList.add("intro-lock");
  var audio = document.getElementById("intro-audio");
  var done = false;

  function hideIntro(){
    if(done) return;
    done = true;
    intro.classList.add("hide");
    document.body.classList.remove("intro-lock");
  }

  function beginIntro(){
    intro.classList.add("show");
    if(audio){
      audio.currentTime = 0;
      audio.volume = 1;
      var playAttempt = audio.play();
      if(playAttempt && playAttempt.catch){ playAttempt.catch(function(){}); }
      audio.addEventListener("ended", function(){ setTimeout(hideIntro, 250); });
    }
    setTimeout(hideIntro, 4700);
  }

  if(startBtn){
    var clickText = startBtn.querySelector(".start-click-text");
    var counterEl = startBtn.querySelector(".start-loading-count");
    startBtn.addEventListener("click", function(){
      if(clickText) clickText.hidden = true;
      if(counterEl) counterEl.hidden = false;

      var duration = 1200;
      var startTime = null;

      function step(ts){
        if(startTime === null) startTime = ts;
        var progress = Math.min(1, (ts - startTime) / duration);
        var value = Math.round(progress * 100);
        if(counterEl) counterEl.firstChild.textContent = value;
        if(progress < 1){
          requestAnimationFrame(step);
        }else{
          setTimeout(function(){
            if(startGate) startGate.classList.add("hide");
            beginIntro();
          }, 220);
        }
      }
      requestAnimationFrame(step);
    }, { once:true });
  }else{
    beginIntro();
  }
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


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
    icon.textContent = frozen ? "▶" : "⏸";
    text.textContent = frozen ? "متحرک کردن رنگ" : "توقف رنگ";
  });
})();

(function(){
  var intro = document.getElementById("intro-screen");
  if(!intro) return;
  document.body.classList.add("intro-lock");
  var audio = document.getElementById("intro-audio");
  var done = false;
  function hideIntro(){
    if(done) return;
    done = true;
    intro.classList.add("hide");
    document.body.classList.remove("intro-lock");
  }
  if(audio){
    audio.volume = 1;
    var playAttempt = audio.play();
    if(playAttempt && playAttempt.catch){ playAttempt.catch(function(){}); }
    audio.addEventListener("ended", function(){ setTimeout(hideIntro, 250); });
  }
  window.addEventListener("load", function(){
    setTimeout(hideIntro, 4200);
  });
  setTimeout(hideIntro, 4700);
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


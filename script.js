document.querySelectorAll("a[target='_blank']").forEach(a=>{
  a.addEventListener("click",()=>{});
});

(function(){
  var body = document.body;
  var btn = document.getElementById("theme-toggle");
  if(!btn) return;
  var icon = btn.querySelector(".theme-toggle-icon");
  var label = btn.querySelector(".theme-toggle-text");

  function applyTheme(theme){
    if(theme === "light"){
      body.classList.add("light");
      icon.textContent = "🌙";
      label.textContent = "حالت شب";
    }else{
      body.classList.remove("light");
      icon.textContent = "☀️";
      label.textContent = "حالت روز";
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



// Copy gaming IDs
document.querySelectorAll("[data-copy]").forEach(function(btn){
  btn.addEventListener("click", async function(){
    var value = btn.getAttribute("data-copy");
    try{
      await navigator.clipboard.writeText(value);
    }catch(e){
      var area=document.createElement("textarea");
      area.value=value; area.style.position="fixed"; area.style.opacity="0";
      document.body.appendChild(area); area.select();
      try{document.execCommand("copy");}catch(err){}
      area.remove();
    }
    var old=btn.querySelector("span:last-child").textContent;
    btn.classList.add("copied");
    btn.querySelector("span:last-child").textContent="کپی شد ✓";
    setTimeout(function(){
      btn.classList.remove("copied");
      btn.querySelector("span:last-child").textContent=old;
    },1400);
  });
});

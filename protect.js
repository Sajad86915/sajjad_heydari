/* ==========================================================
   protect.js — screenshot / copy deterrents
   A web page can NOT fully stop screenshots: the operating system takes
   them outside the browser (and a phone camera always works). These
   measures make casual capturing hard:
   • the page is covered while the window/tab loses focus or is hidden
     (snipping tools and app switchers usually take focus first)
   • PrintScreen / Cmd+Shift+3-4-5 / Win+Shift+S cover the page and clear the clipboard
   • printing and "save as PDF" are blank
   • no text selection, no right-click menu, no dragging images
   ========================================================== */
(function(){
  var shield = document.getElementById("shield");
  if(!shield) return;
  var timer = null, held = false;

  function cover(ms){
    shield.classList.add("show");
    clearTimeout(timer);
    if(ms){
      timer = setTimeout(function(){
        if(!held && document.hasFocus() && !document.hidden) shield.classList.remove("show");
      }, ms);
    }
  }
  function uncover(){
    if(document.hidden) return;
    clearTimeout(timer);
    shield.classList.remove("show");
  }

  function wipeClipboard(){
    try{ if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(" ").catch(function(){}); }catch(e){}
  }

  /* focus / visibility */
  window.addEventListener("blur", function(){ held = true; cover(); });
  window.addEventListener("focus", function(){ held = false; uncover(); });
  document.addEventListener("visibilitychange", function(){
    if(document.hidden){ held = true; cover(); }
    else{ held = false; uncover(); }
  });
  window.addEventListener("pagehide", function(){ cover(); });
  window.addEventListener("pageshow", function(){ if(document.hasFocus()){ held = false; uncover(); } });

  /* capture keys */
  document.addEventListener("keyup", function(e){
    if(e.key === "PrintScreen" || e.keyCode === 44){ cover(2500); wipeClipboard(); }
  });
  document.addEventListener("keydown", function(e){
    var k = (e.key || "").toLowerCase();
    if(e.key === "PrintScreen" || e.keyCode === 44){ cover(2500); wipeClipboard(); return; }
    /* macOS: Cmd+Shift+3 / 4 / 5 / 6 */
    if(e.metaKey && e.shiftKey && /^[3-6]$/.test(k)){ cover(3000); return; }
    /* Windows: Win+Shift+S (snipping) */
    if(e.metaKey && e.shiftKey && k === "s"){ cover(3000); wipeClipboard(); return; }
    /* print / save page / view source */
    if((e.ctrlKey || e.metaKey) && (k === "p" || k === "s" || k === "u")){ e.preventDefault(); cover(1200); }
  }, true);

  /* no context menu, no dragging, no copy/cut of page content */
  document.addEventListener("contextmenu", function(e){ e.preventDefault(); });
  document.addEventListener("dragstart", function(e){ e.preventDefault(); });
  document.addEventListener("selectstart", function(e){
    var t = e.target && e.target.nodeType === 1 ? e.target : (e.target && e.target.parentNode);
    if(t && t.closest && t.closest("textarea,input")) return;
    e.preventDefault();
  });
  document.addEventListener("copy", function(e){
    var t = e.target, a = document.activeElement;
    if(t && /^(TEXTAREA|INPUT)$/.test(t.tagName)) return; /* the site's own "copy ID" fallback uses a hidden textarea */
    if(a && /^(TEXTAREA|INPUT)$/.test(a.tagName)) return;
    e.preventDefault();
  });
  window.addEventListener("beforeprint", function(){ cover(); });
  window.addEventListener("afterprint", function(){ uncover(); });
})();

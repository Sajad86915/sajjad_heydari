/* ==========================================================
   birthday.js
   1) Date block on the home hub (Gregorian + Persian + Hijri)
   2) Birthday greeting screen shown on 16 October, before the hub
   Preview any day:  index.html?birthday=1
   ========================================================== */
(function(){
  var BIRTH = { year:2007, month:9, day:16 }; /* month is 0-based: 9 = October */

  /* ---------- date helpers ---------- */
  var LOCALE = { en:"en-US", fa:"fa-IR", ar:"ar-SA", ru:"ru-RU", tr:"tr-TR", az:"az-Latn-AZ", ur:"ur-PK", ckb:"ckb-IQ",
                 es:"es-ES", fr:"fr-FR", de:"de-DE", it:"it-IT", pt:"pt-BR", zh:"zh-CN", ja:"ja-JP", ko:"ko-KR", hi:"hi-IN", id:"id-ID" };
  var LATIN_DIGITS = { en:1, ru:1, tr:1, az:1, es:1, fr:1, de:1, it:1, pt:1, id:1 };
  var MANUAL_ORDER = { en:1, fa:1, ckb:1 }; /* the browser's own pattern is odd for these */
  var CAL = { greg:"gregory", solar:"persian", lunar:"islamic-umalqura" };

  function lang(){ return (window.getSiteLang && window.getSiteLang()) || "en"; }

  function fmt(date, cal, withWeekday){
    var l = lang();
    var loc = (LOCALE[l] || "en-US") + "-u-ca-" + CAL[cal] + (LATIN_DIGITS[l] ? "-nu-latn" : "");
    var opts = { day:"numeric", month:"long", year:"numeric" };
    if(withWeekday) opts.weekday = "long";
    var parts;
    try{ parts = new Intl.DateTimeFormat(loc, opts).formatToParts(date); }
    catch(e){ return date.toDateString(); }
    if(MANUAL_ORDER[l]){
      var p = {};
      parts.forEach(function(x){ if(x.type !== "literal" && x.type !== "era") p[x.type] = x.value; });
      return l === "en"
        ? (withWeekday ? p.weekday + ", " : "") + p.month + " " + p.day + ", " + p.year
        : (withWeekday ? p.weekday + "\u060C " : "") + p.day + " " + p.month + " " + p.year;
    }
    /* native pattern of the language, minus the era tag (AP / AH ...) */
    return parts.filter(function(x){ return x.type !== "era"; })
      .map(function(x){ return x.value; }).join("")
      .replace(/\s+/g, " ").replace(/^[\s,\u060C.]+|[\s,\u060C]+$/g, "");
  }

  var lastKey = "";
  function renderDate(){
    var box = document.getElementById("hub-date");
    if(!box) return;
    var now = new Date();
    var key = now.toDateString() + lang();
    if(key === lastKey) return;
    lastKey = key;
    box.querySelector(".hub-date-main").textContent = fmt(now, "greg", true);
    box.querySelector(".hub-date-solar b").textContent = fmt(now, "solar", false);
    box.querySelector(".hub-date-lunar b").textContent = fmt(now, "lunar", false);
  }
  renderDate();
  document.addEventListener("sitelangchange", function(){ lastKey = ""; renderDate(); renderBirthday(); });
  setInterval(renderDate, 30000); /* rolls over at midnight */

  /* ---------- birthday screen ---------- */
  var screen = document.getElementById("birthday-screen");
  var numEl = document.getElementById("bday-num");
  var canvas = document.getElementById("bday-canvas");
  var btn = document.getElementById("bday-continue");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var onDone = null, raf = 0, running = false;

  function isBirthday(){
    try{ if(/[?&]birthday(=1|&|$)/.test(location.search)) return true; }catch(e){}
    var n = new Date();
    return n.getMonth() === BIRTH.month && n.getDate() === BIRTH.day;
  }
  function age(){
    var n = new Date();
    var a = n.getFullYear() - BIRTH.year;
    return a < 1 ? 1 : a;
  }
  function digits(n){
    var l = lang();
    if(l === "fa" || l === "ur") return n.toLocaleString("fa-IR", {useGrouping:false});
    if(l === "ar" || l === "ckb") return n.toLocaleString("ar-EG", {useGrouping:false});
    return String(n);
  }
  function renderBirthday(){
    if(numEl && !counting) numEl.textContent = digits(age());
  }

  var counting = false;
  function countUp(){
    var target = age(), start = Math.max(0, target - 8);
    if(reduce){ numEl.textContent = digits(target); return; }
    counting = true;
    var i = start;
    numEl.textContent = digits(i);
    var iv = setInterval(function(){
      i++;
      numEl.textContent = digits(i);
      numEl.classList.remove("tick"); void numEl.offsetWidth; numEl.classList.add("tick");
      if(i >= target){ clearInterval(iv); counting = false; }
    }, 140);
  }

  /* balloons */
  function makeBalloons(){
    var wrap = screen.querySelector(".bday-balloons");
    if(!wrap || wrap.childNodes.length) return;
    var colors = ["#b56cff","#d8b25b","#ff6b9d","#4fd1c5","#6aa7ff","#ff9f5a"];
    for(var i = 0; i < 14; i++){
      var b = document.createElement("span");
      b.className = "bday-balloon";
      b.style.setProperty("--x", (4 + Math.random() * 92).toFixed(1) + "%");
      b.style.setProperty("--c", colors[i % colors.length]);
      b.style.setProperty("--s", (0.7 + Math.random() * 0.7).toFixed(2));
      b.style.setProperty("--d", (7 + Math.random() * 7).toFixed(1) + "s");
      b.style.setProperty("--w", (-Math.random() * 12).toFixed(1) + "s");
      wrap.appendChild(b);
    }
  }

  /* confetti + fireworks */
  var parts = [], ctx, W = 0, H = 0, dpr = 1, lastBurst = 0;
  var PAL = ["#b56cff","#d8b25b","#ff6b9d","#4fd1c5","#6aa7ff","#ffffff","#ff9f5a"];
  function resize(){
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function confetti(n, x, y){
    for(var i = 0; i < n; i++){
      parts.push({
        t:"c", x:x != null ? x : Math.random() * W, y:y != null ? y : -10,
        vx:(Math.random() - .5) * (x != null ? 9 : 2.4), vy:x != null ? -Math.random() * 8 - 2 : Math.random() * 2 + 1.5,
        g:.09, w:6 + Math.random() * 6, h:3 + Math.random() * 4,
        r:Math.random() * 6, vr:(Math.random() - .5) * .3,
        col:PAL[(Math.random() * PAL.length) | 0], life:1, decay:.0045 + Math.random() * .004
      });
    }
  }
  function firework(){
    var x = W * (.15 + Math.random() * .7), y = H * (.12 + Math.random() * .35);
    var col = PAL[(Math.random() * 5) | 0], n = 46;
    for(var i = 0; i < n; i++){
      var a = Math.PI * 2 * i / n, sp = 2 + Math.random() * 2.6;
      parts.push({ t:"s", x:x, y:y, vx:Math.cos(a) * sp, vy:Math.sin(a) * sp, g:.045, col:col, life:1, decay:.014 + Math.random() * .008 });
    }
  }
  function frame(ts){
    if(!running) return;
    ctx.clearRect(0, 0, W, H);
    if(ts - lastBurst > 1100){ lastBurst = ts; firework(); confetti(10); }
    for(var i = parts.length - 1; i >= 0; i--){
      var p = parts[i];
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.life -= p.decay;
      if(p.t === "s"){ p.vx *= .985; }
      else { p.vx *= .995; p.r += p.vr; }
      if(p.life <= 0 || p.y > H + 20){ parts.splice(i, 1); continue; }
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.4));
      ctx.fillStyle = p.col;
      if(p.t === "s"){ ctx.beginPath(); ctx.arc(p.x, p.y, 2.2, 0, 6.283); ctx.fill(); }
      else { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore(); }
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  }
  function startFx(){
    if(reduce || !canvas) return;
    ctx = canvas.getContext("2d");
    resize();
    window.addEventListener("resize", resize);
    running = true;
    confetti(90, W / 2, H * .55); firework();
    raf = requestAnimationFrame(frame);
  }
  function stopFx(){
    running = false; cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
  }

  function close(){
    if(screen.classList.contains("bye")) return;
    screen.classList.add("bye");
    document.body.classList.remove("bday-lock");
    setTimeout(function(){
      screen.hidden = true; stopFx();
      var cb = onDone; onDone = null;
      if(cb) cb();
    }, 650);
  }

  window.siteBirthday = {
    shouldShow: function(){ return !!screen && isBirthday(); },
    open: function(done){
      onDone = done;
      screen.hidden = false;
      screen.classList.remove("bye");
      document.body.classList.add("bday-lock");
      makeBalloons();
      renderBirthday();
      void screen.offsetWidth;
      screen.classList.add("show");
      countUp();
      startFx();
      if(btn) setTimeout(function(){ try{ btn.focus({preventScroll:true}); }catch(e){} }, 900);
    }
  };

  if(btn) btn.addEventListener("click", close);
})();

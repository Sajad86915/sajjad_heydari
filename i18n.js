/* ==========================================================
   i18n.js — site languages: English (default), فارسی, العربية, Русский
   Usage in HTML:
     data-i18n="key"        -> replaces the element's text
     data-i18n-aria="key"   -> replaces the aria-label
     data-v="value"         -> fills {v} inside the translation
   To add or edit a text, change it in DICT below.
   ========================================================== */
(function(){
  var DEFAULT_LANG = "en";
  var STORAGE_KEY  = "site-lang";

  var DIR = { en:"ltr", fa:"rtl", ar:"rtl", ru:"ltr" };

  var DICT = {
    en:{
      clickToEnter:"click to enter...",
      hubAria:"Select a page", controlsAria:"Site controls", langAria:"Language",
      hubSubtitle:"SELECT YOUR SPACE",
      day:"DAY", night:"NIGHT", colorOn:"COLOR", colorOff:"COLOR OFF",
      hubFamily:"FAMILY", hubFriend:"FRIEND",
      hubInfo:"INFO", hubInfoSub:"ABOUT ME",
      hubGames:"Games", hubGamesSub:"ID GAMES",
      back:"← BACK",
      gamesBrand:"GAMES", infoBrand:"INFO",
      gamesHeading:"🎮 Gaming",
      openAccount:"Open Account ↗",
      copyTag:"Copy Tag: {v}", copyId:"Copy ID: {v}", copyName:"Copy name: {v}",
      ign:"In-game name: {v}",
      moreGames:"🎯 More games", moreGamesSmall:"— I'll add them later",
      friendsSocial:"👥 Friends & Social",
      infoHeading:"✦ My info",
      birthGreg:"🐖 Birth date (Gregorian)",
      birthSolar:"🐷 Birth date (Persian calendar)",
      birthLunar:"🐽 Birth date (Hijri lunar)",
      degree:"🎓 Education",
      degreeValue:"Technical & Vocational Accounting Diploma",
      secForeign:"🌐 International networks",
      secCode:"💻 Programming",
      secIran:"📱 Iranian messengers",
      secIranMedia:"🎬 Iranian video & music",
      toTop:"Back to top",
      copyAria:"Copy {v} ID",
      copied:"Copied ✓"
    },
    fa:{
      clickToEnter:"برای ورود کلیک کنید...",
      hubAria:"انتخاب صفحه", controlsAria:"کنترل‌های سایت", langAria:"زبان",
      hubSubtitle:"فضای خودت را انتخاب کن",
      day:"روز", night:"شب", colorOn:"رنگ", colorOff:"بدون رنگ",
      hubFamily:"خانواده", hubFriend:"دوستان",
      hubInfo:"اطلاعات", hubInfoSub:"درباره من",
      hubGames:"بازی‌ها", hubGamesSub:"آیدی بازی‌ها",
      back:"بازگشت →",
      gamesBrand:"بازی‌ها", infoBrand:"اطلاعات",
      gamesHeading:"🎮 گیمینگ",
      openAccount:"باز کردن حساب ↗",
      copyTag:"کپی تگ: {v}", copyId:"کپی ID: {v}", copyName:"کپی اسم: {v}",
      ign:"نام داخل بازی: {v}",
      moreGames:"🎯 سایر بازی‌ها", moreGamesSmall:"— بعداً اضافه می‌کنم",
      friendsSocial:"👥 دوستان و شبکه‌ها",
      infoHeading:"✦ اطلاعات من",
      birthGreg:"🐖 تاریخ تولد میلادی",
      birthSolar:"🐷 تاریخ تولد شمسی",
      birthLunar:"🐽 تاریخ تولد قمری",
      degree:"🎓 مدرک",
      degreeValue:"دیپلم حسابداری فنی و حرفه‌ای",
      secForeign:"🌐 شبکه‌های خارجی",
      secCode:"💻 برنامه‌نویسی",
      secIran:"📱 پیام‌رسان‌های ایرانی",
      secIranMedia:"🎬 ویدیو و موزیک ایرانی",
      toTop:"برو بالا",
      copyAria:"کپی آیدی {v}",
      copied:"کپی شد ✓"
    },
    ar:{
      clickToEnter:"انقر للدخول...",
      hubAria:"اختيار الصفحة", controlsAria:"عناصر التحكم في الموقع", langAria:"اللغة",
      hubSubtitle:"اختر مساحتك",
      day:"نهار", night:"ليل", colorOn:"ألوان", colorOff:"بدون ألوان",
      hubFamily:"العائلة", hubFriend:"الأصدقاء",
      hubInfo:"معلومات", hubInfoSub:"عنّي",
      hubGames:"الألعاب", hubGamesSub:"معرّفات الألعاب",
      back:"رجوع →",
      gamesBrand:"الألعاب", infoBrand:"معلومات",
      gamesHeading:"🎮 الألعاب",
      openAccount:"فتح الحساب ↗",
      copyTag:"نسخ الوسم: {v}", copyId:"نسخ المعرّف: {v}", copyName:"نسخ الاسم: {v}",
      ign:"الاسم داخل اللعبة: {v}",
      moreGames:"🎯 ألعاب أخرى", moreGamesSmall:"— سأضيفها لاحقًا",
      friendsSocial:"👥 الأصدقاء والشبكات",
      infoHeading:"✦ معلوماتي",
      birthGreg:"🐖 تاريخ الميلاد (ميلادي)",
      birthSolar:"🐷 تاريخ الميلاد (هجري شمسي)",
      birthLunar:"🐽 تاريخ الميلاد (هجري قمري)",
      degree:"🎓 المؤهل",
      degreeValue:"دبلوم محاسبة (تقني ومهني)",
      secForeign:"🌐 الشبكات العالمية",
      secCode:"💻 البرمجة",
      secIran:"📱 تطبيقات المراسلة الإيرانية",
      secIranMedia:"🎬 فيديو وموسيقى إيرانية",
      toTop:"إلى الأعلى",
      copyAria:"نسخ معرّف {v}",
      copied:"تم النسخ ✓"
    },
    ru:{
      clickToEnter:"нажмите, чтобы войти...",
      hubAria:"Выбор страницы", controlsAria:"Настройки сайта", langAria:"Язык",
      hubSubtitle:"ВЫБЕРИТЕ СВОЁ ПРОСТРАНСТВО",
      day:"ДЕНЬ", night:"НОЧЬ", colorOn:"ЦВЕТ", colorOff:"БЕЗ ЦВЕТА",
      hubFamily:"СЕМЬЯ", hubFriend:"ДРУЗЬЯ",
      hubInfo:"ИНФО", hubInfoSub:"ОБО МНЕ",
      hubGames:"Игры", hubGamesSub:"ID ИГР",
      back:"← НАЗАД",
      gamesBrand:"ИГРЫ", infoBrand:"ИНФО",
      gamesHeading:"🎮 Игры",
      openAccount:"Открыть аккаунт ↗",
      copyTag:"Копировать тег: {v}", copyId:"Копировать ID: {v}", copyName:"Копировать имя: {v}",
      ign:"Ник в игре: {v}",
      moreGames:"🎯 Другие игры", moreGamesSmall:"— добавлю позже",
      friendsSocial:"👥 Друзья и соцсети",
      infoHeading:"✦ Обо мне",
      birthGreg:"🐖 Дата рождения (григорианский)",
      birthSolar:"🐷 Дата рождения (персидский)",
      birthLunar:"🐽 Дата рождения (лунный, хиджра)",
      degree:"🎓 Образование",
      degreeValue:"Диплом бухгалтера (техническое и профессиональное образование)",
      secForeign:"🌐 Международные сети",
      secCode:"💻 Программирование",
      secIran:"📱 Иранские мессенджеры",
      secIranMedia:"🎬 Иранские видео и музыка",
      toTop:"Наверх",
      copyAria:"Копировать ID: {v}",
      copied:"Скопировано ✓"
    }
  };

  var current = DEFAULT_LANG;

  function t(key, vars){
    var table = DICT[current] || DICT[DEFAULT_LANG];
    var text = table[key];
    if(text == null) text = DICT[DEFAULT_LANG][key];
    if(text == null) return key;
    if(vars){
      Object.keys(vars).forEach(function(k){
        if(vars[k] != null) text = text.split("{" + k + "}").join(vars[k]);
      });
    }
    return text;
  }

  function applyLang(){
    var root = document.documentElement;
    root.lang = current;
    root.dir  = DIR[current];

    document.querySelectorAll("[data-i18n]").forEach(function(el){
      el.textContent = t(el.getAttribute("data-i18n"), { v: el.getAttribute("data-v") });
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function(el){
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"), { v: el.getAttribute("data-v") }));
    });
    document.querySelectorAll(".lang-btn").forEach(function(btn){
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang") === current ? "true" : "false");
    });

    /* script.js re-renders the dynamic texts (theme buttons, copy buttons) */
    document.dispatchEvent(new CustomEvent("sitelangchange", { detail:{ lang: current } }));
  }

  function setLang(lang){
    if(!DICT[lang]) lang = DEFAULT_LANG;
    current = lang;
    try{ localStorage.setItem(STORAGE_KEY, lang); }catch(e){}
    applyLang();
  }

  try{
    var saved = localStorage.getItem(STORAGE_KEY);
    if(saved && DICT[saved]) current = saved;
  }catch(e){}

  document.querySelectorAll(".lang-btn").forEach(function(btn){
    btn.addEventListener("click", function(){ setLang(btn.getAttribute("data-lang")); });
  });

  window.t = t;
  window.getSiteLang = function(){ return current; };
  window.setSiteLang = setLang;

  applyLang();
})();

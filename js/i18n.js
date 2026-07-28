(function () {
  var LANG_KEY = 'playwm_lang';
  var currentLang = localStorage.getItem(LANG_KEY) || 'en';

  function getNested(obj, path) {
    return path.split('.').reduce(function (o, k) { return o && o[k]; }, obj);
  }

  function applyTranslations(data) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = getNested(data, el.getAttribute('data-i18n'));
      if (val && el.tagName !== 'TITLE') el.textContent = val;
    });
    var titleEl = document.querySelector('title[data-i18n]');
    if (titleEl) {
      var titleVal = getNested(data, titleEl.getAttribute('data-i18n'));
      if (titleVal) document.title = titleVal;
    }
    document.querySelectorAll('[data-i18n-container]').forEach(function (el) {
      el.style.display = el.getAttribute('lang') === currentLang ? 'block' : 'none';
    });
    document.querySelectorAll('.lang-btn').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang') === currentLang);
    });
    document.documentElement.lang = currentLang;
  }

  function loadLang(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    fetch('/locales/' + lang + '.json')
      .then(function (r) { return r.json(); })
      .then(function (data) { applyTranslations(data); });
  }

  fetch('/locales/' + currentLang + '.json')
    .then(function (r) { return r.json(); })
    .then(function (data) { applyTranslations(data); });

  window.switchLang = loadLang;
})();

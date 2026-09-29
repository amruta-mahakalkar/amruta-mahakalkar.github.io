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
      var isVisible = el.getAttribute('lang') === currentLang;
      el.style.display = isVisible ? 'block' : 'none';
      if (isVisible) {
        el.querySelectorAll('iframe').forEach(function (f) {
          f.src = f.src;
        });
      }
    });
    document.querySelectorAll('.lang-btn').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang') === currentLang);
    });
    document.documentElement.lang = currentLang;
  }

  /* GitHub Pages serves the locale files with Cache-Control: max-age=600, and
     applyTranslations() overwrites every [data-i18n] element's textContent. A
     cached copy of the JSON therefore wins over the text already in the HTML,
     so visitors can see a stale page for up to ten minutes after a deploy.
     'no-cache' still allows a 304, it just forces revalidation first. */
  function fetchLocale(lang) {
    return fetch('/locales/' + lang + '.json', { cache: 'no-cache' })
      .then(function (r) { return r.json(); });
  }

  function loadLang(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    fetchLocale(lang)
      .then(function (data) { applyTranslations(data); });
  }

  fetchLocale(currentLang)
    .then(function (data) { applyTranslations(data); });

  window.switchLang = loadLang;
})();

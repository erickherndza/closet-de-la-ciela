/* El Closet de la Ciela — Shopify theme
   Modules: header (nav, search, sticky) · announcement bar · hero slider · product rail · product page · collection filters */

(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---------- header ---------- */
  function initHeader() {
    var header = $('.site-header');
    var toggle = $('.nav-toggle');
    var search = $('.search-bar');
    var searchBtn = $('.search-toggle');

    function setNavTop() {
      if (!header) return;
      document.documentElement.style.setProperty('--nav-top', header.getBoundingClientRect().bottom + 'px');
    }
    function closeNav() {
      document.body.classList.remove('nav-open');
      if (toggle) { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', toggle.getAttribute('data-open-label')); }
    }
    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = !document.body.classList.contains('nav-open');
        setNavTop();
        document.body.classList.toggle('nav-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', toggle.getAttribute(open ? 'data-close-label' : 'data-open-label'));
      });
    }
    $$('.main-nav a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeNav();
        if (search && search.classList.contains('is-open')) { search.classList.remove('is-open'); searchBtn.setAttribute('aria-expanded', 'false'); searchBtn.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 960) closeNav(); setNavTop(); });

    if (searchBtn && search) {
      searchBtn.addEventListener('click', function () {
        var open = search.classList.toggle('is-open');
        searchBtn.setAttribute('aria-expanded', String(open));
        if (open) $('input[type="search"]', search).focus();
        setNavTop();
      });
    }

    function onScroll() { if (header) header.classList.toggle('is-stuck', window.scrollY > 8); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- announcement bar ---------- */
  function initAnnounce() {
    var bar = $('.announce'); if (!bar) return;
    var items = $$('p', bar); if (items.length < 2 || reduce) return;
    var i = 0, paused = false;
    bar.addEventListener('mouseenter', function () { paused = true; });
    bar.addEventListener('mouseleave', function () { paused = false; });
    setInterval(function () {
      if (paused || document.hidden) return;
      items[i].classList.remove('is-active');
      i = (i + 1) % items.length;
      items[i].classList.add('is-active');
    }, 4500);
  }

  /* ---------- hero slider (delegated: survives theme-editor re-renders) ---------- */
  function initSlider() {
    var INTERVAL = 6500;
    function all() { return $$('.hs'); }
    function slidesOf(r) { return $$('.hs-slide', r); }
    function cur(r) {
      var s = slidesOf(r);
      for (var k = 0; k < s.length; k++) if (s[k].classList.contains('is-active')) return k;
      return 0;
    }
    function go(r, n) {
      var s = slidesOf(r), d = $$('.hs-dot', r), i = (n + s.length) % s.length;
      s.forEach(function (x, k) {
        x.classList.toggle('is-active', k === i);
        x.setAttribute('aria-hidden', k === i ? 'false' : 'true');
        $$('a,button', x).forEach(function (a) { a.tabIndex = k === i ? 0 : -1; });
      });
      d.forEach(function (x, k) { if (k === i) x.setAttribute('aria-current', 'true'); else x.removeAttribute('aria-current'); });
      var im = $('img', s[i]); if (im) im.loading = 'eager';
      r.__t = Date.now();
    }
    if (!all().length) return;
    all().forEach(function (r) { go(r, 0); });

    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.hs-dot,.hs-prev,.hs-next');
      if (!b) return;
      var r = b.closest('.hs'); if (!r) return;
      if (b.classList.contains('hs-prev')) go(r, cur(r) - 1);
      else if (b.classList.contains('hs-next')) go(r, cur(r) + 1);
      else go(r, $$('.hs-dot', r).indexOf(b));
    });
    document.addEventListener('keydown', function (e) {
      var r = e.target.closest && e.target.closest('.hs'); if (!r) return;
      if (e.key === 'ArrowLeft') go(r, cur(r) - 1); else if (e.key === 'ArrowRight') go(r, cur(r) + 1);
    });
    document.addEventListener('mouseover', function (e) {
      var r = e.target.closest && e.target.closest('.hs');
      all().forEach(function (x) { x.__p = (x === r); });
    });
    document.addEventListener('mouseout', function (e) { if (!e.relatedTarget) all().forEach(function (x) { x.__p = false; }); });
    document.addEventListener('focusin', function (e) {
      var r = e.target.closest && e.target.closest('.hs');
      all().forEach(function (x) { x.__f = (x === r); });
    });
    document.addEventListener('focusout', function () { all().forEach(function (x) { x.__f = false; }); });

    var x0 = null;
    document.addEventListener('touchstart', function (e) {
      var r = e.target.closest && e.target.closest('.hs');
      x0 = r ? e.touches[0].clientX : null;
    }, { passive: true });
    document.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var r = e.target.closest && e.target.closest('.hs');
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (r && Math.abs(dx) > 40) go(r, cur(r) + (dx < 0 ? 1 : -1));
    });
    if (!reduce) {
      setInterval(function () {
        if (document.hidden) return;
        all().forEach(function (r) {
          if (r.__p || r.__f) return;
          if (!r.__t) r.__t = Date.now();
          if (Date.now() - r.__t >= INTERVAL) go(r, cur(r) + 1);
        });
      }, 500);
    }

    // Theme editor: show the slide being edited
    document.addEventListener('shopify:block:select', function (e) {
      var r = e.target.closest && e.target.closest('.hs'); if (!r) return;
      go(r, slidesOf(r).indexOf(e.target)); r.__t = Date.now() + 60000;
    });
  }

  /* ---------- product rail (arrows + progress) ---------- */
  function initRails() {
    $$('.rail-wrap').forEach(function (w) {
      if (w.__init) return; w.__init = true;
      var rail = $('.rail', w), bar = $('.rail-progress span', w);
      var prev = $('[data-rail="prev"]', w), next = $('[data-rail="next"]', w);
      function sync() {
        var max = rail.scrollWidth - rail.clientWidth;
        if (bar) {
          var vis = rail.scrollWidth ? rail.clientWidth / rail.scrollWidth : 1;
          bar.style.width = Math.min(100, vis * 100) + '%';
          bar.style.left = (max > 0 ? (rail.scrollLeft / max) * (100 - vis * 100) : 0) + '%';
        }
        if (prev) prev.disabled = rail.scrollLeft <= 2;
        if (next) next.disabled = rail.scrollLeft >= max - 2;
      }
      rail.addEventListener('scroll', sync, { passive: true });
      window.addEventListener('resize', sync);
      sync();
      $$('[data-rail]', w).forEach(function (b) {
        b.addEventListener('click', function () {
          var step = rail.clientWidth * 0.8 * (b.getAttribute('data-rail') === 'next' ? 1 : -1);
          rail.scrollBy({ left: step, behavior: 'smooth' });
        });
      });
    });
  }

  /* ---------- collection filters ---------- */
  function initCollection() {
    $$('[data-auto-submit]').forEach(function (el) {
      el.addEventListener('change', function () { el.form.submit(); });
    });
  }

  /* ---------- product page ---------- */
  function initProductPage() {
    var root = $('[data-product-section]');
    var dataEl = $('#product-json');
    if (!root || !dataEl) return;
    var data = JSON.parse(dataEl.textContent);
    var form = $('#product-form', root);
    var idInput = $('[data-variant-id]', form);
    var price = $('#pdp-price', root), add = $('#pdp-add', root), msg = $('#pdp-msg', root);
    var imgEl = $('#pdp-img', root);
    var optionEls = $$('#pdp-options .opt', root);
    var sel = optionEls.map(function (fs) {
      var on = $('.chip[aria-pressed="true"]', fs);
      return on ? on.getAttribute('data-value') : null;
    });

    function find() {
      if (!optionEls.length) return data.variants[0];
      return data.variants.filter(function (v) { return v.options.join('|') === sel.join('|'); })[0] || null;
    }
    function optionAvailable(oi, val) {
      return data.variants.some(function (v) {
        if (v.options[oi] !== val || !v.available) return false;
        return sel.every(function (s, k) { return k === oi || !s || v.options[k] === s; });
      });
    }
    function setImage(id) {
      var t = $$('.thumb', root).filter(function (x) { return x.getAttribute('data-id') === String(id); })[0];
      if (t) show(t);
    }
    function show(t) {
      if (imgEl) { imgEl.src = t.getAttribute('data-src'); imgEl.srcset = t.getAttribute('data-srcset'); }
      $$('.thumb', root).forEach(function (o) { o.setAttribute('aria-current', String(o === t)); });
    }
    function update(changedImage) {
      optionEls.forEach(function (fs, oi) {
        var legend = $('legend strong', fs); if (legend) legend.textContent = sel[oi] || '';
        $$('.chip', fs).forEach(function (b) {
          var v = b.getAttribute('data-value');
          b.setAttribute('aria-pressed', String(sel[oi] === v));
          b.classList.toggle('is-out', !optionAvailable(oi, v));
        });
      });
      var v = find();
      msg.className = 'form-msg'; msg.textContent = '';
      if (v) {
        idInput.value = v.id;
        price.innerHTML = (v.compare ? '<s>' + v.compare + '</s> ' : '') + v.price;
        if (changedImage && v.image) setImage(v.image);
        var u = new URL(window.location.href); u.searchParams.set('variant', v.id); history.replaceState(null, '', u);
      }
      if (v && !v.available) { add.textContent = data.soldOut; add.disabled = true; add.setAttribute('aria-disabled', 'true'); msg.textContent = data.optionSoldOut; }
      else if (!v) { add.textContent = data.selectOptions; add.disabled = true; add.setAttribute('aria-disabled', 'true'); }
      else { add.textContent = data.addToBag; add.disabled = false; add.removeAttribute('aria-disabled'); }
      var notify = $('#pdp-notify', root);
      if (notify) {
        notify.hidden = !(v && !v.available);
        var nb = $('[data-notify-body]', notify);
        if (nb && v) nb.value = 'Back in stock request: ' + nb.getAttribute('data-product') + ' (' + v.options.join(' / ') + ') ' + nb.getAttribute('data-url');
      }
    }
    optionEls.forEach(function (fs, oi) {
      $$('.chip', fs).forEach(function (b) {
        b.addEventListener('click', function () { sel[oi] = b.getAttribute('data-value'); update(true); });
      });
    });
    $$('.thumb', root).forEach(function (t) { t.addEventListener('click', function () { show(t); }); });
    update(false);
    rememberProduct(data.product);

    var share = $('[data-share]', root);
    if (share) share.addEventListener('click', function () {
      var url = share.getAttribute('data-url'), label = share.textContent;
      function done() { share.textContent = 'Link copied'; setTimeout(function () { share.textContent = label; }, 2200); }
      if (navigator.share) { navigator.share({ title: data.product.title, url: url }).catch(function () {}); return; }
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () {});
    });

    // Add to bag without leaving the page, then go to the bag
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (add.disabled) return;
      add.disabled = true;
      fetch(window.Shopify && Shopify.routes ? Shopify.routes.root + 'cart/add.js' : '/cart/add.js', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error(res.j.description || res.j.message || 'Could not add this piece.');
          window.location.href = (window.Shopify && Shopify.routes ? Shopify.routes.root : '/') + 'cart';
        })
        .catch(function (err) {
          add.disabled = false;
          msg.className = 'form-msg err'; msg.textContent = err.message;
        });
    });
  }

  /* ---------- recently viewed (kept in this browser only) ---------- */
  var RECENT_KEY = 'closet-recent';
  function readRecent() { try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; } catch (e) { return []; } }
  function rememberProduct(p) {
    if (!p) return;
    try {
      var list = readRecent().filter(function (x) { return x.url !== p.url; });
      list.unshift(p);
      localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 10)));
    } catch (e) { /* storage unavailable: skip */ }
  }
  function esc(str) { return String(str).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function initRecent() {
    $$('[data-recent]').forEach(function (el) {
      var here = location.pathname;
      var items = readRecent().filter(function (x) { return x.url.split('?')[0] !== here; }).slice(0, 4);
      if (!items.length) { el.hidden = true; return; }
      $('[data-recent-grid]', el).innerHTML = items.map(function (p) {
        return '<a class="card" href="' + esc(p.url) + '"><div class="card-media">' +
          (p.available ? '' : '<div class="card-badges"><span class="badge sold">Sold out</span></div>') +
          '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy" width="500" height="625">' +
          (p.image2 ? '<img class="alt" src="' + esc(p.image2) + '" alt="" loading="lazy" width="500" height="625">' : '') +
          '</div><div class="card-info"><span class="card-title">' + esc(p.title) + '</span><span class="card-price">' + esc(p.price) + '</span></div></a>';
      }).join('');
      el.hidden = false;
    });
  }

  /* ---------- related products (Shopify recommendations) ---------- */
  function initRelated() {
    $$('[data-related]').forEach(function (el) {
      var url = el.getAttribute('data-url');
      if (!url || el.__loaded) return; el.__loaded = true;
      fetch(url).then(function (r) { return r.text(); }).then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var fresh = $('[data-related]', doc);
        if (fresh && fresh.innerHTML.trim()) el.innerHTML = fresh.innerHTML;
        else el.hidden = true;
      }).catch(function () { el.hidden = true; });
    });
  }

  function init() {
    initHeader(); initAnnounce(); initSlider(); initRails(); initCollection(); initProductPage(); initRelated(); initRecent();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  // Theme editor: re-init rails when a section is re-rendered
  document.addEventListener('shopify:section:load', function () { initRails(); initRelated(); });
})();

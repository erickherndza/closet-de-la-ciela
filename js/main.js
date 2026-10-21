/* El Closet de la Ciela — demo redesign
   Modules: header (nav, search, sticky) · hero slider · product lists · forms */

(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

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
      if (toggle) { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open menu'); }
    }
    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = !document.body.classList.contains('nav-open');
        setNavTop();
        document.body.classList.toggle('nav-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
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
        if (open) $('input', search).focus();
        setNavTop();
      });
      $('form', search).addEventListener('submit', function (e) {
        e.preventDefault();
        var q = $('input', search).value.trim();
        window.location.href = 'shop.html' + (q ? '?q=' + encodeURIComponent(q) : '');
      });
    }

    function onScroll() { if (header) header.classList.toggle('is-stuck', window.scrollY > 8); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- hero slider (delegated: survives re-renders) ---------- */
  function initSlider() {
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
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
  }

  /* ---------- products ---------- */
  var CATEGORY_LABEL = { necklaces: 'Necklaces', earrings: 'Earrings', bracelets: 'Bracelets', rings: 'Rings' };
  var COLLECTION_LABEL = { silver: '925 Sterling Silver', gold: '14K–18K Gold', new: 'New Arrivals' };

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(n) { return '$' + n.toFixed(2) + ' USD'; }

  function cardHTML(p) {
    var badges = '';
    if (!p.available) badges += '<span class="badge sold">Sold out</span>';
    else if (p.collections.indexOf('new') > -1) badges += '<span class="badge">New</span>';
    return '<a class="card" href="product.html?p=' + p.handle + '">' +
      '<div class="card-media">' +
      (badges ? '<div class="card-badges">' + badges + '</div>' : '') +
      '<img src="' + p.img + '" alt="' + esc(p.title) + '" loading="lazy" width="800" height="1000">' +
      '<img class="alt" src="' + p.img2 + '" alt="" loading="lazy" width="800" height="1000">' +
      '</div>' +
      '<div class="card-info"><span class="card-title">' + esc(p.title) + '</span><span class="card-price">' + money(p.price) + '</span></div>' +
      '</a>';
  }

  function initProducts() {
    var P = window.PRODUCTS || [];

    // Static lists: <div data-products data-category="rings" data-collection="new" data-limit="8">
    $$('[data-products]').forEach(function (el) {
      var cat = el.getAttribute('data-category'), col = el.getAttribute('data-collection'), lim = parseInt(el.getAttribute('data-limit'), 10) || 999;
      var list = P.filter(function (p) {
        return (!cat || p.category === cat) && (!col || p.collections.indexOf(col) > -1);
      }).slice(0, lim);
      el.innerHTML = list.map(cardHTML).join('') || '<p class="empty">No products yet.</p>';
    });

    // Collection card counts
    $$('[data-count]').forEach(function (el) {
      var k = el.getAttribute('data-count');
      var n = P.filter(function (p) { return k === 'all' || p.collections.indexOf(k) > -1; }).length;
      el.textContent = n + ' piece' + (n === 1 ? '' : 's');
    });

    // Rail arrows
    $$('.rail-wrap').forEach(function (w) {
      var rail = $('.rail', w);
      $$('[data-rail]', w).forEach(function (b) {
        b.addEventListener('click', function () {
          var step = rail.clientWidth * 0.8 * (b.getAttribute('data-rail') === 'next' ? 1 : -1);
          rail.scrollBy({ left: step, behavior: 'smooth' });
        });
      });
    });

    // Shop page with filters
    var shop = $('#shop-grid');
    if (!shop) return;
    var params = new URLSearchParams(window.location.search);
    var state = {
      category: params.get('category') || 'all',
      collection: params.get('collection') || 'all',
      q: (params.get('q') || '').trim(),
      sort: 'featured',
      stock: false,
      shown: 24
    };
    var STEP = 24;
    var qInput = $('#shop-q');
    if (qInput) qInput.value = state.q;

    function sync() {
      $$('[data-filter="category"]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-value') === state.category)); });
      $$('[data-filter="collection"]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-value') === state.collection)); });
    }
    function render() {
      var q = state.q.toLowerCase();
      var list = P.filter(function (p) {
        return (state.category === 'all' || p.category === state.category) &&
          (state.collection === 'all' || p.collections.indexOf(state.collection) > -1) &&
          (!state.stock || p.available) &&
          (!q || (p.title + ' ' + p.category + ' ' + p.desc).toLowerCase().indexOf(q) > -1);
      });
      if (state.sort === 'low') list.sort(function (a, b) { return a.price - b.price; });
      else if (state.sort === 'high') list.sort(function (a, b) { return b.price - a.price; });
      else if (state.sort === 'az') list.sort(function (a, b) { return a.title.localeCompare(b.title); });
      var total = list.length;
      shop.innerHTML = list.slice(0, state.shown).map(cardHTML).join('') || '<p class="empty">No pieces match your filters. Try clearing them.</p>';
      var more = $('#shop-more');
      if (more) more.hidden = total <= state.shown;
      var c = $('#shop-count');
      var label = [];
      if (state.category !== 'all') label.push(CATEGORY_LABEL[state.category]);
      if (state.collection !== 'all') label.push(COLLECTION_LABEL[state.collection]);
      if (state.q) label.push('“' + state.q + '”');
      if (c) c.textContent = total + ' piece' + (total === 1 ? '' : 's') + (label.length ? ' · ' + label.join(' · ') : '');
      sync();
    }
    $$('[data-filter]').forEach(function (b) {
      b.addEventListener('click', function () {
        state[b.getAttribute('data-filter')] = b.getAttribute('data-value');
        state.shown = STEP; render();
      });
    });
    var sort = $('#shop-sort'); if (sort) sort.addEventListener('change', function () { state.sort = sort.value; render(); });
    var stock = $('#shop-stock'); if (stock) stock.addEventListener('change', function () { state.stock = stock.checked; state.shown = STEP; render(); });
    if (qInput) qInput.addEventListener('input', function () { state.q = qInput.value.trim(); state.shown = STEP; render(); });
    var more = $('#shop-more button'); if (more) more.addEventListener('click', function () { state.shown += STEP; render(); });
    render();
  }


  /* ---------- product detail ---------- */
  function initProductPage() {
    var root = $('#product');
    if (!root) return;
    var P = window.PRODUCTS || [];
    var handle = new URLSearchParams(window.location.search).get('p');
    var p = P.filter(function (x) { return x.handle === handle; })[0];
    if (!p) {
      root.innerHTML = '<div class="wrap"><p class="empty">We could not find that piece. <a href="shop.html" style="text-decoration:underline">Back to the shop</a></p></div>';
      return;
    }
    document.title = p.title + ' | El Closet de la Ciela';
    var meta = $('meta[name="description"]'); if (meta) meta.setAttribute('content', p.desc || p.title);
    var sel = {};
    p.options.forEach(function (o) { sel[o.name] = null; });
    function variant() {
      if (!p.options.length) return p.variants[0];
      var names = p.options.map(function (o) { return sel[o.name]; });
      if (names.some(function (n) { return !n; })) return null;
      return p.variants.filter(function (v) { return v.options.join('|') === names.join('|'); })[0] || null;
    }
    function optionAvailable(oi, val) {
      return p.variants.some(function (v) {
        if (v.options[oi] !== val || !v.available) return false;
        return p.options.every(function (o, k) { return k === oi || !sel[o.name] || v.options[k] === sel[o.name]; });
      });
    }
    var crumbCat = CATEGORY_LABEL[p.category];
    var thumbs = p.images.map(function (src, k) {
      return '<button type="button" class="thumb" data-i="' + k + '" aria-label="Show photo ' + (k + 1) + '" aria-current="' + (k === 0) + '"><img src="' + src + '" alt="" width="120" height="150" loading="lazy"></button>';
    }).join('');
    root.innerHTML =
      '<div class="wrap"><p class="crumbs" style="margin:0 0 24px"><a href="index.html">Home</a> / <a href="shop.html">Shop</a> / <a href="' + p.category + '.html">' + crumbCat + '</a> / ' + esc(p.title) + '</p>' +
      '<div class="pdp">' +
      '<div class="pdp-gallery"><div class="pdp-main"><img id="pdp-img" src="' + p.images[0] + '" alt="' + esc(p.title) + '" width="800" height="1000"></div>' +
      (p.images.length > 1 ? '<div class="thumbs">' + thumbs + '</div>' : '') + '</div>' +
      '<div class="pdp-info">' +
      '<span class="eyebrow">' + crumbCat + '</span>' +
      '<h1 class="h2" style="margin:0">' + esc(p.title) + '</h1>' +
      '<p class="pdp-price" id="pdp-price"></p>' +
      '<div id="pdp-options"></div>' +
      '<div class="pdp-buy"><label class="sr-only" for="pdp-qty">Quantity</label><input id="pdp-qty" class="qty" type="number" min="1" max="10" value="1"><a class="btn" id="pdp-add" href="#">Add to bag</a></div>' +
      '<p class="form-msg" id="pdp-msg" role="status" aria-live="polite"></p>' +
      '<div class="pdp-desc">' + p.html + '</div>' +
      '<details class="policy"><summary>Shipping</summary><p>International shipments from USA. Free shipping on selected orders; taxes and customs fees are not included.</p></details>' +
      '</div></div></div>';

    var imgEl = $('#pdp-img');
    $$('.thumb', root).forEach(function (t) {
      t.addEventListener('click', function () {
        imgEl.src = p.images[+t.getAttribute('data-i')];
        $$('.thumb', root).forEach(function (o) { o.setAttribute('aria-current', String(o === t)); });
      });
    });

    function renderOptions() {
      $('#pdp-options').innerHTML = p.options.map(function (o, oi) {
        return '<fieldset class="opt"><legend class="label">' + esc(o.name) + (sel[o.name] ? ': <strong>' + esc(sel[o.name]) + '</strong>' : '') + '</legend><div class="chips">' +
          o.values.map(function (val) {
            var ok = optionAvailable(oi, val);
            return '<button type="button" class="chip' + (ok ? '' : ' is-out') + '" data-o="' + esc(o.name) + '" data-v="' + esc(val) + '" aria-pressed="' + (sel[o.name] === val) + '">' + esc(val) + '</button>';
          }).join('') + '</div></fieldset>';
      }).join('');
      $$('#pdp-options .chip').forEach(function (b) {
        b.addEventListener('click', function () { sel[b.getAttribute('data-o')] = b.getAttribute('data-v'); update(); });
      });
    }
    function update() {
      renderOptions();
      var v = variant(), price = $('#pdp-price'), add = $('#pdp-add'), msg = $('#pdp-msg');
      var lo = Math.min.apply(null, p.variants.map(function (x) { return x.price; }));
      if (v) price.innerHTML = (v.compare ? '<s>' + money(v.compare) + '</s> ' : '') + money(v.price);
      else price.textContent = (p.variants.length > 1 ? 'From ' : '') + money(lo);
      msg.className = 'form-msg';
      if (v && !v.available) { add.textContent = 'Sold out'; add.setAttribute('aria-disabled', 'true'); msg.textContent = 'This option is currently sold out.'; }
      else if (!v) { add.textContent = 'Select options'; add.setAttribute('aria-disabled', 'true'); msg.textContent = ''; }
      else { add.textContent = 'Add to bag'; add.removeAttribute('aria-disabled'); msg.textContent = ''; }
    }
    $('#pdp-add').addEventListener('click', function (e) {
      e.preventDefault();
      var v = variant();
      if (!v || !v.available) return;
      var q = Math.max(1, Math.min(10, parseInt($('#pdp-qty').value, 10) || 1));
      window.open(window.STORE_URL + '/cart/' + v.id + ':' + q, '_blank', 'noopener');
      var msg = $('#pdp-msg'); msg.className = 'form-msg ok'; msg.textContent = 'Opening your bag in the store to complete checkout…';
    });
    update();

    var rel = P.filter(function (x) { return x.category === p.category && x.handle !== p.handle && x.available; }).slice(0, 4);
    var relEl = $('#related');
    if (relEl && rel.length) relEl.innerHTML = rel.map(cardHTML).join('');
    else if (relEl) relEl.closest('section').hidden = true;
  }

  /* ---------- forms (demo: validated client-side, no backend) ---------- */
  function initForms() {
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    $$('form[data-demo-form]').forEach(function (f) {
      var msg = $('.form-msg', f.parentElement) || $('.form-msg', f);
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = $('input[type="email"]', f), name = $('input[name="name"]', f), text = $('textarea', f);
        function fail(t) { msg.className = 'form-msg err'; msg.textContent = t; }
        if (name && !name.value.trim()) return fail('Please enter your name.');
        if (!email.value.trim() || !emailRe.test(email.value.trim())) return fail('Please enter a valid email address.');
        if (text && !text.value.trim()) return fail('Please write a message.');
        msg.className = 'form-msg ok';
        msg.textContent = f.getAttribute('data-success') || 'Thank you!';
        f.reset();
      });
    });
  }

  function initYear() { $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); }); }

  document.addEventListener('DOMContentLoaded', function () {
    initHeader(); initSlider(); initProducts(); initProductPage(); initForms(); initYear();
  });
})();

/* ============================================================
   BRN Yazılım — arayüz davranışları
   Bağımlılık yok. Tümü progressive enhancement olarak çalışır.
   ============================================================ */
(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const store = {
    get(k, d) { try { return localStorage.getItem(k) ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- 1. Dil ---------- */
  const DEFAULT_LANG = 'tr';

  function applyLang(lang) {
    const dict = (window.I18N && window.I18N[lang]) || {};
    document.documentElement.lang = lang;

    $$('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const val = dict[key];
      if (val === undefined) return;
      const attr = el.dataset.i18nAttr;
      if (attr) el.setAttribute(attr, val);
      else el.textContent = val;
    });

    // Sayfa başlığı, o sayfanın kendi <title data-i18n="..."> anahtarından gelir
    $$('.lang-btn').forEach(b => b.classList.toggle('is-active', b.dataset.lang === lang));
    store.set('brn-lang', lang);
  }

  $$('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });

  applyLang(store.get('brn-lang', DEFAULT_LANG));

  /* ---------- 2. Tema ---------- */
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = store.get('brn-theme', null);
  setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    store.set('brn-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#060c22' : '#091847');
  }

  const themeToggle = $('#themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------- 3. Header durumu + scroll ilerlemesi ---------- */
  const header = $('#header');
  const progress = $('#scrollProgress');

  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-stuck', y > 8);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 4. Mobil menü ---------- */
  const burger = $('#burger');
  const nav = $('#nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open && window.innerWidth <= 900 ? 'hidden' : '';
    });

    // Mobilde mega menüyü aç/kapa, masaüstünde hover ile zaten açılıyor
    $$('.has-mega > .nav-link').forEach(link => {
      link.addEventListener('click', e => {
        if (window.innerWidth > 900) return;
        const parent = link.parentElement;
        if (!parent.classList.contains('is-open')) {
          e.preventDefault();
          parent.classList.add('is-open');
        }
      });
    });

    nav.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || window.innerWidth > 900) return;
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ---------- 5. Görünürlük animasyonu ---------- */
  const reveals = $$('.reveal');

  // Ilk ekranda olan bloklar gozlemciyi beklemeden hemen gorunur olsun.
  // (IntersectionObserver'in ilk tetiklenmesi gecikebiliyor; o sirada icerik bos gorunuyordu.)
  const inView = el => {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  };
  reveals.forEach(el => { if (inView(el)) el.classList.add('is-in'); });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => el.classList.add('is-in'), delay);
        obs.unobserve(el);
      });
      // Not: oransal esik (orn. 0.12) viewport'tan uzun bloklarda hic saglanmayabilir;
      // bu yuzden threshold 0 + negatif alt kenar kullaniliyor: blogun ust kenari
      // ekrana 80px girdiginde tetiklenir, blogun boyu ne olursa olsun.
    }, { threshold: 0, rootMargin: '0px 0px -80px 0px' });
    reveals.forEach(el => { if (!el.classList.contains('is-in')) io.observe(el); });
  } else {
    reveals.forEach(el => el.classList.add('is-in'));
  }

  /* ---------- 6. Sayaçlar ---------- */
  function runCounter(el) {
    const target = parseFloat(el.dataset.count || '0');
    const dur = 1400;
    const start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString(document.documentElement.lang);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const counters = $$('.count');

  // Ilk ekranda olan sayaclar gozlemciyi beklemeden baslasin; aksi halde
  // gozlemci gecikirse kullanici "0 gun" / "%0" gibi bozuk degerler gorur.
  const basladi = new WeakSet();
  const baslat = el => { if (!basladi.has(el)) { basladi.add(el); runCounter(el); } };
  counters.forEach(el => { if (inView(el)) baslat(el); });

  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        baslat(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });
    counters.forEach(el => { if (!basladi.has(el)) cio.observe(el); });
  } else {
    counters.forEach(el => { el.textContent = el.dataset.count; });
  }

  /* ---------- 7. Çözüm sekmeleri ---------- */
  // Not: cozum sekmeleri kart izgarasiyla degistirildi; sekme mantigi kaldirildi.

  // Mega menüden bir çözüme tıklandığında menü kapansın
  $$('.mega a').forEach(a => {
    a.addEventListener('click', () => {
      const openMega = a.closest('.has-mega');
      if (openMega) openMega.classList.remove('is-open');
    });
  });

  /* ---------- 8. Aktif menü bağlantısı ---------- */
  const sections = $$('main section[id]');
  const navLinks = $$('.nav-link[href^="#"]');
  if (sections.length && 'IntersectionObserver' in window) {
    const sio = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = '#' + entry.target.id;
        navLinks.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => sio.observe(s));
  }

  /* ---------- 9. Hero panelinde hafif 3B eğim ---------- */
  const shots = $('.shots');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (shots && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    const wrap = shots.parentElement;
    wrap.addEventListener('mousemove', e => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      shots.style.transform = `perspective(1200px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
    });
    wrap.addEventListener('mouseleave', () => { shots.style.transform = ''; });
  }

  /* ---------- 10. Form doğrulama ---------- */
  const form = $('#gorusmeForm');
  const note = $('#formNote');

  function t(key) {
    const lang = document.documentElement.lang || DEFAULT_LANG;
    return (window.I18N[lang] && window.I18N[lang][key]) || '';
  }

  if (form) {
    const mark = (input, invalid) => {
      const field = input.closest('.field');
      if (field) field.classList.toggle('is-invalid', invalid);
    };

    form.addEventListener('input', e => {
      if (e.target.matches('input, textarea')) mark(e.target, false);
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;

      $$('input[required], textarea[required]', form).forEach(input => {
        if (input.type === 'checkbox') return;
        const empty = !input.value.trim();
        const badMail = input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value);
        const invalid = empty || badMail;
        mark(input, invalid);
        if (invalid) ok = false;
      });

      const kvkk = $('#kvkk');
      if (ok && kvkk && !kvkk.checked) {
        note.textContent = t('form.kvkkNo');
        note.className = 'form-note no';
        return;
      }

      if (!ok) {
        note.textContent = t('form.no');
        note.className = 'form-note no';
        const firstBad = $('.field.is-invalid input, .field.is-invalid textarea', form);
        if (firstBad) firstBad.focus();
        return;
      }

      // Not: Gerçek gönderim için buraya kendi uç noktanızı bağlayın.
      note.textContent = t('form.ok');
      note.className = 'form-note ok';
      form.reset();
    });
  }

  /* ---------- 11. Çerez onayı ---------- */
  const CONSENT_KEY = 'brn-consent';
  const CONSENT_MONTHS = 12;
  const banner = $('#cookieBanner');

  function readConsent() {
    try {
      const raw = store.get(CONSENT_KEY, null);
      if (!raw) return null;
      const data = JSON.parse(raw);
      const age = Date.now() - (data.ts || 0);
      // 12 aydan eski onay geçersiz sayılır, tekrar sorulur
      if (age > CONSENT_MONTHS * 30 * 24 * 60 * 60 * 1000) return null;
      return data;
    } catch (e) { return null; }
  }

  function applyConsent(level) {
    if (level !== 'all') return;
    // Analitik / pazarlama kodlarınızı yalnızca burada başlatın.
    // Örnek: loadAnalytics();
  }

  function setConsent(level) {
    store.set(CONSENT_KEY, JSON.stringify({ level: level, ts: Date.now() }));
    if (banner) banner.classList.remove('is-open');
    applyConsent(level);
  }

  function openBanner() {
    if (banner) banner.classList.add('is-open');
  }

  if (banner) {
    const saved = readConsent();
    if (saved) applyConsent(saved.level);
    else setTimeout(openBanner, 900);

    $$('[data-consent]', banner).forEach(btn => {
      btn.addEventListener('click', () => setConsent(btn.dataset.consent));
    });
  }

  // "Çerez tercihlerimi değiştir" düğmeleri (footer ve çerez politikası sayfası)
  ['#cookiePrefs', '#cookiePrefsFooter'].forEach(sel => {
    const el = $(sel);
    if (el) el.addEventListener('click', openBanner);
  });

  /* ---------- 12. Küçük detaylar ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  const toTop = $('#toTop');
  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }
})();

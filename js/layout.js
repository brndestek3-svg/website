/* ============================================================
   Ortak yerleşim — üst çubuk, header ve footer
   Tüm sayfalar bu dosyadan beslenir; menüyü tek yerden yönetirsiniz.
   Kullanım: <div data-layout="header"></div> ve <div data-layout="footer"></div>
   ============================================================ */
(function () {
  'use strict';

  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const isHome = page === '' || page === 'index.html';

  // Ana sayfadayken bölümlere, diğer sayfalarda ilgili sayfaya git
  const home = (hash) => (isHome ? hash : 'index.html' + hash);

  const NAV = [
    { key: 'nav.home',      label: 'Anasayfa',      href: isHome ? '#hero' : 'index.html', match: 'index.html' },
    { key: 'nav.about',     label: 'Kurumsal',      href: 'hakkimizda.html',  match: 'hakkimizda.html' },
    { key: 'nav.services',  label: 'Hizmetlerimiz', href: 'hizmetler.html',   match: 'hizmetler.html' },
    { key: 'nav.solutions', label: 'Çözümlerimiz',  href: 'cozumler.html',    match: 'cozumler.html', mega: true },
    { key: 'nav.blog',      label: 'Blog',          href: 'blog.html',        match: 'blog.html' },
    { key: 'nav.contact',   label: 'İletişim',      href: 'iletisim.html',    match: 'iletisim.html' }
  ];

  const MEGA = [
    {
      key: 'mega.c1', label: 'SAP Finansal Çözümler', anchor: 'fi',
      items: [
        { label: 'SAP FI' }, { label: 'SAP CO' }, { key: 'mega.ufrs', label: 'UFRS Raporlama' }
      ]
    },
    {
      key: 'mega.c2', label: 'Nakit Yönetimi ve Planlama', anchor: 'cash',
      items: [{ label: 'SAP Liquidity Planner' }, { key: 'mega.treasury', label: 'Treasury Entegrasyonları' }]
    },
    {
      key: 'mega.c3', label: 'Araç ve Poliçe Yönetimi', anchor: 'fleet',
      items: [{ label: 'SAP Claims Management' }, { label: 'SAP Fleet Management / VMS' }]
    },
    {
      key: 'mega.c4', label: 'Süreç ve Veri Danışmanlığı', anchor: 'data',
      items: [{ label: 'SAP Data Migration' }, { key: 'mega.lsmw', label: 'LSMW & IDoc Uyarlamaları' }]
    },
    {
      key: 'mega.c6', label: 'e-Fatura Otomasyonu', anchor: 'efatura',
      items: [{ label: 'e-Fatura / e-Arşiv' }, { key: 'mega.einvoice', label: 'Gelen Fatura Eşleştirme' }]
    },
    {
      key: 'mega.c7', label: 'Enflasyon Muhasebesi', anchor: 'enflasyon',
      items: [{ label: 'VUK mük. 298 / TFRS 29' }, { key: 'mega.inflation', label: 'Paralel Defter Kurgusu' }]
    },
    {
      key: 'mega.c8', label: 'SAP Geçiş Projeleri', anchor: 'gecis',
      items: [{ label: 'Brownfield / Greenfield' }, { key: 'mega.cutover', label: 'Hazırlık Analizi ve Canlı Geçiş' }]
    },
    {
      key: 'mega.c9', label: 'Modül Uyarlama ve Entegrasyon', anchor: 'entegrasyon',
      items: [{ label: 'ABAP / IDoc / OData' }, { key: 'mega.interface', label: 'Arayüz ve İş Akışı Tasarımı' }]
    }
  ];

  // Orijinal BRN logosu (koyu zeminlerde beyaz surumu kullanilir)
  const BRAND = `
    <img class="brand-img brand-img-light" src="assets/logo.png" width="480" height="295" alt="BRN Yazılım — Business Reinvention Network">
    <img class="brand-img brand-img-dark" src="assets/logo-white.png" width="480" height="295" alt="" aria-hidden="true">`;

  const BRAND_ON_DARK = `
    <img class="brand-img" src="assets/logo-white.png" width="480" height="295" alt="BRN Yazılım — Business Reinvention Network">`;

  const i18n = (key, label) => `data-i18n="${key}">${label}`;

  /* ---------- Header ---------- */
  function headerHTML() {
    const navItems = NAV.map(item => {
      const active = item.match === page || (isHome && item.match === 'index.html') ? ' is-active' : '';
      if (!item.mega) {
        return `<li><a class="nav-link${active}" href="${item.href}" ${i18n(item.key, item.label)}</a></li>`;
      }
      const cols = MEGA.map(col => `
            <div class="mega-col">
              <h4 ${i18n(col.key, col.label)}</h4>
              ${col.items.map(it => `<a href="cozumler.html#${col.anchor}"${it.key ? ` data-i18n="${it.key}"` : ''}>${it.label}</a>`).join('\n              ')}
            </div>`).join('');
      return `<li class="has-mega">
          <a class="nav-link${active}" href="${item.href}" ${i18n(item.key, item.label)}</a>
          <div class="mega">
            <div class="mega-inner">${cols}
              <div class="mega-col mega-feature">
                <h4 ${i18n('mega.c5', 'Fiori &amp; Kullanıcı Deneyimi')}</h4>
                <p ${i18n('mega.featureDesc', 'Finansal süreçler için modern, mobil uyumlu Fiori ekranları.')}</p>
                <a class="mega-cta" href="cozumler.html#fiori" ${i18n('mega.featureCta', 'İncele →')}</a>
              </div>
            </div>
          </div>
        </li>`;
    }).join('\n        ');

    return `
<div class="topbar">
  <div class="container topbar-inner">
    <div class="topbar-links">
      <a href="mailto:info@brnyazilim.com" class="topbar-link">
        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>
        info@brnyazilim.com
      </a>
      <span class="topbar-sep"></span>
      <a href="tel:+905427714023" class="topbar-link">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.2a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z"/></svg>
        +90 542 771 40 23
      </a>
      <span class="topbar-sep"></span>
      <a href="https://www.linkedin.com/" class="topbar-link" aria-label="LinkedIn" rel="noopener">
        <svg class="li-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-11h4v1.5A6 6 0 0116 8z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
      </a>
    </div>
  </div>
</div>

<header class="header" id="header">
  <div class="container header-inner">
    <a href="${isHome ? '#hero' : 'index.html'}" class="brand" aria-label="BRN Yazılım">${BRAND}</a>

    <nav class="nav" id="nav" aria-label="Ana menü">
      <ul class="nav-list">
        ${navItems}
      </ul>
    </nav>

    <div class="header-actions">
      <div class="lang" role="group" aria-label="Dil / Language">
        <button type="button" class="lang-btn is-active" data-lang="tr">TR</button>
        <button type="button" class="lang-btn" data-lang="en">EN</button>
      </div>
      <button class="icon-btn theme-toggle" id="themeToggle" aria-label="Tema değiştir">
        <svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/></svg>
        <svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 13A9 9 0 1111 3a7 7 0 0010 10z"/></svg>
      </button>
      <a href="${isHome ? '#contact' : 'iletisim.html'}" class="btn btn-primary btn-sm" ${i18n('nav.cta', 'Görüşme Planla')}</a>
      <button class="burger" id="burger" aria-label="Menü" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>`;
  }

  /* ---------- Footer ---------- */
  function footerHTML() {
    return `
<footer class="footer">
  <div class="container footer-top">
    <div class="footer-brand">
      <a href="${isHome ? '#hero' : 'index.html'}" class="brand brand-lg" aria-label="BRN Yazılım">${BRAND_ON_DARK}</a>
      <p class="footer-lead" ${i18n('footer.lead', 'Birlikte çalışmaya başlayalım')}</p>
      <a class="footer-mail" href="mailto:info@brnyazilim.com">info@brnyazilim.com</a>
      <a class="footer-tel" href="tel:+905427714023">+90 542 771 40 23</a>
      <p class="footer-addr" ${i18n('footer.addr', 'Cevizli Mah. Zuhal Cd. Ritim İstanbul A1 Blok Daire 102, 34846 Maltepe / İstanbul')}</p>
    </div>

    <div class="footer-col">
      <h4 ${i18n('footer.menu', 'Menü')}</h4>
      <ul>
        <li><a href="${isHome ? '#hero' : 'index.html'}" ${i18n('nav.home', 'Anasayfa')}</a></li>
        <li><a href="hakkimizda.html" ${i18n('nav.about', 'Kurumsal')}</a></li>
        <li><a href="hizmetler.html" ${i18n('nav.services', 'Hizmetlerimiz')}</a></li>
        <li><a href="cozumler.html" ${i18n('nav.solutions', 'Çözümlerimiz')}</a></li>
        <li><a href="blog.html" ${i18n('nav.blog', 'Blog')}</a></li>
        <li><a href="iletisim.html" ${i18n('nav.contact', 'İletişim')}</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h4 ${i18n('nav.services', 'Hizmetlerimiz')}</h4>
      <ul>
        <li><a href="hizmetler.html#surec" ${i18n('svc.1.t', 'İş ve Süreç Yönetim Danışmanlığı')}</a></li>
        <li><a href="hizmetler.html#fonksiyonel" ${i18n('svc.2.t', 'Fonksiyonel Danışmanlık')}</a></li>
        <li><a href="hizmetler.html#destek" ${i18n('svc.3.t', 'Destek Hizmetleri')}</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h4 ${i18n('nav.solutions', 'Çözümlerimiz')}</h4>
      <ul>
        <li><a href="cozumler.html#fi">SAP FI / CO</a></li>
        <li><a href="cozumler.html#cash">SAP Liquidity Planner</a></li>
        <li><a href="cozumler.html#fleet">Claims &amp; Fleet Management</a></li>
        <li><a href="cozumler.html#data">SAP Data Migration</a></li>
        <li><a href="cozumler.html#fiori">Fiori &amp; UX</a></li>
      </ul>
    </div>
  </div>

  <div class="container footer-trademark">
    <p ${i18n("footer.trademark", "SAP ve SAP ürün adları SAP SE'nin tescilli markalarıdır. BRN Yazılım bağımsız bir danışmanlık firmasıdır; SAP SE ile resmi bir iş ortaklığı ilişkisi bulunmamaktadır.")}</p>
  </div>

  <div class="container footer-bottom">
    <p>© <span id="year">2026</span> BRN Yazılım. <span ${i18n('footer.rights', 'Tüm hakları saklıdır.')}</span></p>
    <nav class="footer-legal" aria-label="Yasal">
      <a href="aydinlatma-metni.html" ${i18n('footer.notice', 'Aydınlatma Metni')}</a>
      <span class="footer-dot" aria-hidden="true">·</span>
      <a href="cerez-politikasi.html" ${i18n('footer.cookies', 'Çerez Politikası')}</a>
      <span class="footer-dot" aria-hidden="true">·</span>
      <button type="button" class="link-btn" id="cookiePrefsFooter" ${i18n('footer.cookiePrefs', 'Çerez Tercihleri')}</button>
    </nav>
    <button class="to-top" id="toTop" aria-label="Yukarı çık"><svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>
  </div>
</footer>

<div class="cookie-banner" id="cookieBanner" role="dialog" aria-live="polite" aria-labelledby="cookieTitle">
  <div class="cookie-copy">
    <strong id="cookieTitle" ${i18n('cb.title', 'Çerez tercihleriniz')}</strong>
    <p>
      <span ${i18n('cb.body', 'Sitenin çalışması ve dil/tema tercihlerinizin hatırlanması için zorunlu çerezleri kullanıyoruz. İsteğe bağlı analitik çerezler yalnızca onayınızla çalışır.')}</span>
      <a href="cerez-politikasi.html" ${i18n('cb.link', 'Çerez Politikası')}</a>
    </p>
  </div>
  <div class="cookie-actions">
    <button type="button" class="btn btn-outline" data-consent="necessary" ${i18n('cb.necessary', 'Yalnızca zorunlu')}</button>
    <button type="button" class="btn btn-primary" data-consent="all" ${i18n('cb.all', 'Tümünü kabul et')}</button>
  </div>
</div>

<div class="scroll-progress" id="scrollProgress" aria-hidden="true"></div>`;
  }

  const headerSlot = document.querySelector('[data-layout="header"]');
  const footerSlot = document.querySelector('[data-layout="footer"]');
  if (headerSlot) headerSlot.outerHTML = headerHTML();
  if (footerSlot) footerSlot.outerHTML = footerHTML();
})();

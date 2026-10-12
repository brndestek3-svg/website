# Canlıya alma rehberi — www.brnyazilim.com

## 1. Mevcut sitede ne var?

Canlı siteden tespit edilen teknik yapı:

| Konu | Tespit |
|---|---|
| Uygulama | **ASP.NET Web Forms 4.0.30319** (`__VIEWSTATE`, `WebResource.axd`, `.aspx`) |
| Sunucu | **Microsoft-IIS/10.0** (Windows) |
| Panel | **Plesk for Windows** (`X-Powered-By-Plesk: PleskWin`) |
| Arayüz | Satın alınmış bir Bootstrap + jQuery teması (`/site_files/vendors/...`) |
| İçerik | Veritabanı destekli CMS — adresler `/tr/menu/hakkimizda/3` gibi kimlik numaralı |
| Yönetim | `/management` (robots.txt'te engellenmiş) |
| Dizin | sitemap.xml'de 39 adres, tamamı Türkçe |

Yani mevcut site **düz HTML değil**, veritabanına bağlı bir .NET uygulaması.

## 2. Yeni site ne gerektiriyor?

Hiçbir şey. Yeni site tamamen **statik** HTML/CSS/JS: veritabanı yok, .NET yok,
derleme adımı yok. Mevcut Plesk/IIS hosting'e olduğu gibi kopyalanabilir;
daha ucuz bir statik barındırmaya da taşınabilir.

## 3. Yükleme dosyaları

Sunucuya çıkacak içerik (bu klasörün tamamı):

```
*.html  (12 sayfa + 404.html)
css/    js/    assets/
web.config   robots.txt   sitemap.xml
```

Yüklenmeyecekler: `README.md`, `YAYINA-ALMA.md`, `.claude/`

## 4. Yol A — Mevcut Plesk/IIS hosting üzerinde (önerilen)

1. **Yedek al.** Plesk > Dosya Yöneticisi > `httpdocs` klasörünü zip'le ve indir.
   Veritabanı varsa Plesk > Veritabanları > Dışa Aktar. Bu yedeği saklayın;
   eski içeriğe bir daha erişemeyeceksiniz.
2. **Önce alt alanda test edin.** Plesk > Alt Alan Adı Ekle > `yeni.brnyazilim.com`.
   Dosyaları oraya yükleyip tüm sayfaları, formu ve mobil görünümü kontrol edin.
   (Test alanına `<meta name="robots" content="noindex">` eklemeyi unutmayın ki
   Google test kopyasını dizine almasın.)
3. **Yayına alın.** `httpdocs` içeriğini silin, yeni dosyaları yükleyin.
4. **Varsayılan belge.** `web.config` bunu `index.html` olarak ayarlar. Plesk'te
   ayrıca IIS > Varsayılan Belge listesinden de doğrulayın.
5. **URL Rewrite modülü.** `web.config`'deki 301 yönlendirmeleri için gerekli;
   Plesk Windows'ta kurulu gelir. Site 500 hatası verirse modül yoktur:
   `<rewrite>` bloğunu silin, site çalışır (yalnızca eski adres yönlendirmeleri gider).
6. **SSL.** Plesk > SSL/TLS Sertifikaları > Let's Encrypt. `www` ve köku birlikte seçin.
   Sertifika çalıştıktan sonra `web.config`'deki HSTS satırını yorumdan çıkarın.

## 5. Yol B — Statik barındırma (Netlify / Cloudflare Pages)

Daha hızlı ve çoğu durumda ücretsiz; ancak alan adının DNS'i taşınır, bu yüzden
**e-posta kayıtlarına (MX) dokunulmadığından emin olun.**

1. Klasörü Netlify'a sürükle-bırak ya da GitHub deposuna bağlayın.
2. Alan adını ekleyin, sağlayıcının verdiği DNS kayıtlarını girin.
3. `web.config` burada çalışmaz; yönlendirmeler için `_redirects` dosyası gerekir
   (istenirse hazırlanabilir).

## 6. Eski adreslerin yönlendirilmesi (SEO)

`web.config` içindeki `EskiAdresler` haritası, sitemap'teki 39 adresin tamamını
karşılar. Örnekler:

| Eski | Yeni |
|---|---|
| `/tr/menu/hakkimizda/3` | `/hakkimizda.html` |
| `/tr/kategoriler/hizmetlerimiz/5` | `/hizmetler.html` |
| `/tr/menu/sap-fi/11` | `/cozumler.html#fi` |
| `/tr/menu/sap-liquidity-planner/15` | `/cozumler.html#cash` |
| `/tr/iletisim` | `/iletisim.html` |
| `/tr/blog` | `/blog.html` |
| haritada olmayan `/tr/...` | `/` |

Hepsi **301 (kalıcı)** yönlendirmedir; arama sıralaması yeni adrese aktarılır.

## 7. Yayından önce tamamlanması gerekenler

- [ ] **İletişim formu** bir uç noktaya bağlı değil. Statik sitede sunucu kodu
      yok; Formspree, Web3Forms ya da Plesk üzerinde küçük bir PHP/ASP.NET
      betiği gerekir. Şu an form gönderimde yalnızca doğrulama yapıyor.
- [ ] **KVKK metinlerindeki köşeli parantezler** (ticaret unvanı, MERSİS, KEP,
      VERBİS, saklama süreleri) doldurulmalı ve hukuki onaydan geçmeli.
- [ ] **LinkedIn adresi** `js/layout.js` içinde yer tutucu.
- [ ] **20+/150+/9 sayıları** örnek değerlerdir; gerçek referanslarla doğrulayın.
- [ ] Google Search Console'a yeni `sitemap.xml` gönderin, eski sitemap'i kaldırın.
- [ ] Analytics kullanılacaksa `js/main.js` içindeki `applyConsent()` fonksiyonuna
      bağlayın — çerez onayı alınmadan izleme kodu çalışmamalıdır (KVKK).

## 8. Yayın sonrası kontrol

```
https://www.brnyazilim.com/            -> 200, yeni tasarım
https://brnyazilim.com/                -> 301 -> www
http://www.brnyazilim.com/             -> 301 -> https
https://www.brnyazilim.com/tr/menu/hakkimizda/3  -> 301 -> /hakkimizda.html
https://www.brnyazilim.com/olmayan-sayfa         -> 404 sayfası
https://www.brnyazilim.com/sitemap.xml           -> 12 adres
```

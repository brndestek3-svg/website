# BRN Yazılım — Yeni Web Sitesi Tasarımı

`www.brnyazilim.com` için hazırlanan yeni web sitesi tasarımı (15 sayfa). Saf HTML/CSS/JS — çerçeve, derleme adımı veya bağımlılık yok, kurulum gerektirmez.

## Çalıştırma

`index.html` dosyasını çift tıklamak yeterli. Yerel sunucuyla denemek için
depodaki geliştirme sunucusunu kullanın:

```bash
python .claude/devserver.py 5510
```

Ardından `http://localhost:5510` adresini açın.

> `python -m http.server` kullanmayın: yanıtlarına `Cache-Control` koymadığı için
> tarayıcı sayfaları sezgisel olarak önbelleğe alır ve dosyayı değiştirdiğiniz hâlde
> ekranda eski hâli görürsünüz. `devserver.py` her yanıta `no-store` ekleyerek bunu
> engeller; yalnızca geliştirme içindir.

## Dosya yapısı

```
index.html        Ana sayfa (hero, hizmetler, neden biz, rakamlar bandı, çözüm kartları, süreç, blog, iletişim)
hakkimizda.html   Kurumsal: hikaye, misyon/vizyon/değerler, neden BRN, süreç
hizmetler.html    Üç hizmetin detayı + destek hizmetleri kartları
cozumler.html     Dokuz çözüm ailesinin detayı (#fi, #cash, #fleet, #data, #fiori,
                  #efatura, #enflasyon, #gecis, #entegrasyon)
blog.html         Yazı listesi
blog-*.html       Dört yazının detay sayfası (mali-kapanis, nakit-akisi, sap-fi, yapay-zeka)
iletisim.html     İletişim kartları, demo formu, harita
404.html          Sayfa bulunamadı (IIS httpErrors ile sunulur, <base href="/"> kullanır)
aydinlatma-metni.html  KVKK aydınlatma metni (10 bölüm, içindekiler menüsüyle)
cerez-politikasi.html  Çerez politikası ve kullanılan depolama kalemleri tablosu
css/style.css     Tasarım sistemi: tokenlar, bileşenler, animasyonlar, duyarlı kurallar
js/layout.js      Ortak üst çubuk, header (mega menü) ve footer — menü tek yerden yönetilir
js/i18n.js        TR / EN sözlük — tüm metinler burada (498 anahtar, iki dilde eşit)
js/main.js        Dil, tema, menü, açılış animasyonları, sayaçlar, form doğrulama
assets/           favicon, logo, zeminler, fotoğraflar, og-image.jpg (paylaşım görseli)
web.config        IIS: varsayılan belge, 301 yönlendirme haritası, önbellek ve güvenlik başlıkları
robots.txt        Arama motoru yönergesi + sitemap adresi
sitemap.xml       14 sayfanın dizin haritası (404 hariç)
YAYINA-ALMA.md    Mevcut sitenin teknik yapısı ve canlıya alma adımları
```


## Özellikler

- **TR / EN dil değiştirici** — tercih `localStorage`'da saklanır, sayfa yenilenmez
- **Açık / koyu tema** — sistem tercihini algılar, kullanıcı değiştirebilir
- **Çözüm kartları** — dokuz çözüm ailesi; ana sayfada kart ızgarası, çözümler sayfasında tam metin
- **Scroll animasyonları, sayaçlar, ilerleme çubuğu** — `IntersectionObserver` ile, `prefers-reduced-motion` desteğiyle
- **Mega menü** (masaüstü) ve açılır mobil menü
- **Erişilebilirlik** — klavye odağı, `aria` etiketleri, "içeriğe geç" bağlantısı, kontrast gözetilmiş palet
- **Alt sayfalar** — mevcut sitede içeriği boş olan çözüm sayfaları dahil tüm menü başlıkları dolu
- **KVKK uyum seti** — aydınlatma metni, çerez politikası ve onay kaydı tutan çerez bandı
- **Hero kolajı** — üç gerçek fotoğraf, üzerinde cam ölçüm kartı; fareyle hafif 3B eğim
- **Dış görsel bağımlılığı yok** — logo, zeminler ve tüm fotoğraflar `assets/` altında (toplam ~800 KB)
- Yatay taşma yok; 375 px'ten 1600 px'e kadar test edildi

### Menüyü değiştirmek

Header ve footer her sayfada tekrar edilmez; `js/layout.js` içindeki `NAV` ve `MEGA` dizilerinden üretilir. Yeni bir menü başlığı eklemek için tek değişiklik orada yapılır.

### Hero kompozisyonu

Üç fotoğraf, `index.html` içindeki `.shots` bloğunda:

| Parça | Dosya | Konum | Oran |
|---|---|---|---|
| Büyük fotoğraf | `assets/hero-main.jpg` | üst, tam genişlik | 3:2 (1080×720) |
| Küçük fotoğraf | `assets/hero-a.jpg` | alt sol | 4:3 (688×516) |
| Küçük fotoğraf | `assets/hero-c.jpg` | alt sağ | 4:3 (900×675) |

Fotoğrafları değiştirmek için `assets/` altına aynı isimle yeni dosya koymak yeterli; alt satırdaki iki kare aynı yükseklikte hizalanır, bu yüzden ikisinin de 4:3 olması önerilir. Alt metinleri `js/i18n.js` içindeki `hero.alt1`–`hero.alt3` anahtarlarındadır.

Sol sütundaki sayaç şeridi (`.hero-proof`) `data-count` özniteliğinden okunur; etiketleri `hero.p1`, `hero.p2`, `hero.p4`, `hero.p5` anahtarlarıdır.


## Devralan geliştirici için

Depoyu klonlayıp çalıştırmak:

```bash
git clone https://github.com/brndestek3-svg/website.git
cd website
python .claude/devserver.py 5510
```

Bilinmesi gereken üç şey:

1. **Derleme adımı yok.** Dosyalar olduğu gibi sunulur. Değişiklik yapıp sayfayı
   yenilemek yeterli.
2. **Metinler koda gömülü değil.** Tüm içerik `js/i18n.js` içindeki TR/EN
   sözlüktedir; HTML'deki `data-i18n` öznitelikleri çalışma anında doldurur.
   Metin değiştirirken iki dili de güncelleyin — sayılar eşit olmalıdır.
3. **Başlık ve altbilgi tek yerden üretilir.** `js/layout.js` içindeki `NAV` ve
   `MEGA` dizileri menüyü, aynı dosyanın altındaki şablon da altbilgiyi kurar.
   Sayfa dosyalarında kopya menü yoktur.

Yayına almadan önce kapatılması gereken maddeler `YAYINA-ALMA.md` dosyasındadır.

## KVKK / çerez tarafı

Üç parçadan oluşur:

1. **[Aydınlatma Metni](aydinlatma-metni.html)** — KVKK m. 10 gereği: veri sorumlusu, işlenen veri kategorileri, amaçlar, m. 5 hukuki sebepleri, aktarım, toplama yöntemi, saklama süresi, m. 11 hakları ve başvuru usulü.
2. **[Çerez Politikası](cerez-politikasi.html)** — sitenin gerçekten kullandığı depolama kalemleri (`brn-lang`, `brn-theme`, `brn-consent`) ve üçüncü taraf istekleri (Google Fonts, OpenStreetMap) tablo hâlinde.
3. **Çerez bandı** — ilk ziyarette açılır; "Yalnızca zorunlu" veya "Tümünü kabul et" seçimi tarih damgasıyla `brn-consent` altında saklanır ve 12 ay sonra tekrar sorulur. Footer’daki "Çerez Tercihleri" ve politika sayfasındaki düğme bandı yeniden açar.

> **Önemli:** Her iki metin de taslaktır. Köşeli parantezli alanlar (ticaret unvanı, MERSİS, KEP, VERBİS, saklama-imha periyotları) doldurulmalı ve metinler yayına alınmadan önce hukuk danışmanınızca onaylanmalıdır. Bu dosyalar hukuki görüş yerine geçmez.

### Analitik eklerseniz

`js/main.js` içindeki `applyConsent()` fonksiyonu tek giriş noktasıdır: analitik/pazarlama kodunu yalnızca oraya, `level === 'all'` koşulunun içine koyun. Ayrıca `cerez-politikasi.html` içindeki tabloya ilgili satırı eklemeyi unutmayın.

## Marka referansları

Tüm değerler brnyazilim.com’un kendi CSS’inden alındı:

| Öğe | Değer | Kaynağı |
|---|---|---|
| Ana lacivert | `#091847` | `--ogency-base` |
| Marka gradyanı | `linear-gradient(90deg,#0a0f3a,#152c6b,#1f4fa3,#26a3d6)` | `.ogency-btn` |
| Alternatif bölüm zemini | `#f1f1f1` | `--ogency-black2` |
| Gövde metni | `#5d5d5d` | `--ogency-color` |
| Başlıklar | `#000000` | orijinal `h1–h3` |
| Tipografi | Plus Jakarta Sans | orijinal font |

Renk ritmi de aynı: **beyaz ↔ `#f1f1f1` dönüşümlü bölümler, lacivert CTA bandı ve footer**. Koyu tema ayrı bir seçenek olarak durur; tüm renkler CSS değişkenlerinden geldiği için iki temada da tutarlıdır.

### Köşe ölçeği

Tasarımda tek bir yarıçap ölçeği var; hepsi `css/style.css` başındaki değişkenlerden gelir:

| Katman | Değer | Nerede |
|---|---|---|
| Buton | `0` | tüm `.btn` — orijinal `.ogency-btn` ile aynı |
| Etiket / kontrol | `--radius-chip: 4px` | çipler, etiketler, TR-EN anahtarı, tema düğmesi, menü bağlantıları |
| Küçük yüzey | `--radius-sm: 8px` | form alanları, ikon kutuları, sekme düğmeleri, mini kartlar |
| Orta yüzey | `--radius: 14px` | fotoğraflar, ölçüm kartı, içindekiler kutusu |
| Büyük yüzey | `--radius-lg: 18px` | hizmet kartları, mega menü, formlar, çerez bandı |

Daire yalnızca gerçek nokta olan öğelerde kalır (durum noktaları, madde imleri). Keskin butonla başlayıp büyük yüzeye doğru yumuşayan bu ritim, markanın kurumsal dilini korurken tasarımı tek parça tutar.

### Orijinal marka varlıkları

| Dosya | Nerede kullanılıyor |
|---|---|
| `assets/logo.png` | Header (açık tema) — sitenin gerçek logosu, boş kenarları kırpılmış |
| `assets/logo-white.png` | Footer ve koyu tema — logonun alfa maskesinden üretilmiş beyaz sürüm |
| `assets/bg-hero.png` | Hero ve tüm iç sayfa başlıklarının zemini (`slider-1-bg-1-light.png`) |
| `assets/bg-contact.png` | İletişim bölümü zemini (`contact-bg-1.png`) |
| `assets/bg-footer.png` | Footer, CTA bandı ve süreç bölümü dokusu (`footer-bg-1.png`) |
| `assets/sol-*.jpg` | Dokuz çözüm ailesinin fotoğrafı (çözümler sayfası) |
| `assets/hk2-3.jpg` | Kurumsal sayfasındaki ikili görsel — mevcut siteden |
| `assets/hero-main.jpg`, `hero-a.jpg`, `hero-b.jpg`, `about-1.jpg` | Ana sayfa hero ızgarası ve “Neden BRN” görselleri |

Logo koyu zeminlerde otomatik olarak beyaz sürüme geçer; `js/layout.js` header için iki sürümü de basar, CSS temaya göre birini gösterir.


### Fotoğrafların kaynağı ve lisansı

Mevcut sitedeki fotoğraflar 280–370 px genişliğindeydi; büyük alanlarda bulanık görünüyorlardı ve sitede daha büyük sürümleri yok. Bu nedenle ana sayfa, çözüm bölümleri ve Kurumsal sayfası için **Unsplash**’ten yüksek çözünürlüklü fotoğraflar kullanıldı (688–1200 px genişlik).

**Unsplash Lisansı:** ticari kullanım dahil ücretsiz, atf zorunluluğu yok. Yine de en doğru çözüm **kendi ofis ve ekip çekimlerinizdir**; stok fotoğraf yerine gerçek fotoğraf kullanmak kurumsal siteye görünür bir güven katar. Değiştirmek için `assets/` altına aynı isimlerle koymanız yeterli; önerilen en az genişlikler:

| Dosya | Önerilen |
|---|---|
| `hero-main.jpg` | 1080×720 (3:2) |
| `hero-a.jpg`, `hero-c.jpg` | 688×516 / 900×675 (4:3) |
| `hero-b.jpg`, `about-1.jpg` | 900×506 / 1200×675 (16:9) |
| `sol-*.jpg` | 900×600 (3:2) |
| `blog-*.jpg` | 1200×675 (16:9) |

Blog kapakları da yazı konularına göre seçilmiş 1200×675 görsellerle değiştirildi; yazı sayfalarında tam genişlikte 16:9 kapak olarak gösteriliyorlar.

## Canlıya almadan önce yapılacaklar

1. **Form uç noktası.** `js/main.js` içindeki `#demoForm` gönderimi şu an yalnızca doğrulama yapıp teşekkür mesajı gösterir. Gerçek gönderim için ilgili satırdaki nota bakıp kendi `fetch()` çağrınızı ekleyin.
2. **Görseller.** Tüm görseller `assets/` altında, dış bağımlılık yok. Hero ve çözüm fotoğrafları Unsplash kaynaklıdır (yukarıdaki lisans notuna bakın) — kendi çekimlerinizle değiştirilmesi önerilir. Blog kapakları da aynı kaynaktan yenilendi.
3. **İçerik doğrulaması.** Hero ve çözüm kartlarındaki sayısal örnekler (kapanış süresi, nakit görünürlüğü, göç doğruluğu vb.) tipik proje kazanımlarını temsil eder; gerçek referans değerlerinizle değiştirilmelidir.
4. **Blog yazıları.** Dört yazının tam metni mevcut siteden alınıp yerel sayfalara taşındı; artık hiçbir bağlantı eski siteye çıkmıyor. Yeni yazı eklemek için bir `blog-*.html` dosyasını kopyalayıp içeriği değiştirmek ve `blog.html` ile ana sayfaya kart eklemek yeterli. Yazı gövdeleri Türkçedir; İngilizce modda üstte bir bilgi notu çıkar.
5. **LinkedIn bağlantısı.** Üst çubuktaki LinkedIn adresi yer tutucudur (`js/layout.js` içinde).
6. **Harita.** İletişim sayfasındaki harita OpenStreetMap gömme çerçevesidir (anahtar gerektirmez). Google Maps tercih ederseniz `iletisim.html` içindeki `iframe` bağlantısını değiştirin; altındaki "Yol tarifi al" bağlantısı zaten Google Maps'e gider.
7. **SEO.** `canonical`, Open Graph ve Twitter Card etiketleri 14 sayfada da hazır; paylaşım görseli `assets/og-image.jpg` (1200×630). Site tek URL üzerinden iki dilli çalıştığı için `hreflang` kullanılmadı — ayrı `/en/` adresleri açılırsa eklenmelidir.
8. **Yayına alma.** Mevcut sitenin teknik yapısı, sunucu adımları ve eski adreslerin 301 haritası için `YAYINA-ALMA.md` dosyasına bakın.

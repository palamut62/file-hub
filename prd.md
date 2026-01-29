# Ürün Gereksinim Dokümanı (PRD) - File Hub

## 1. Proje Özeti
File Hub, Linux masaüstü kullanıcıları için tasarlanmış, minimalist ve modern bir dosya yönetim ve e-posta ile paylaşım aracıdır. Kullanıcıların dosyaları sürükle-bırak yöntemiyle hızlıca yüklemelerini, yönetmelerini ve yapılandırılmış bir Gmail hesabı üzerinden otomatik olarak göndermelerini sağlar.

## 2. Hedef Platform ve Teknoloji Yığını
- **İşletim Sistemi:** Linux (Ubuntu, Fedora vb. için .deb veya .AppImage)
- **Framework:** Electron.js
- **Frontend:** HTML5, CSS3 (Blur ve Glassmorphism efektleri), JavaScript
- **Backend/API:** Node.js, Nodemailer (Gmail SMTP için), Electron Store (Ayarlar için)
- **Tasarım Dili:** Translucent Glassmorphism (Buzlu Cam), Modern macOS Menü Bar stili.

## 3. Temel Özellikler

### 3.1. Ana Ekran (Main View)
- **Sürükle-Bırak Alanı:** En üstte kesikli çizgilerle belirtilmiş, dosya kabul eden interaktif alan.
- **Dosya Listesi:** Eklenen dosyaların (PDF, resim, arşiv vb.) listelendiği bölüm.
- **İşlem Butonları:** Her dosyanın yanında "Aç", "İndir" ve "Sil" aksiyonları.
- **İlerleme Çubuğu (Progress Bar):** Dosya e-postaya gönderilirken aktif olan yüzde göstergeli animasyon.
- **Ayarlar İkonu:** Sağ üst köşede, ayarlar paneline geçiş sağlayan dişli çark simgesi.

### 3.2. Ayarlar Ekranı (Settings View)
- **E-posta Kaydı:** Kullanıcının dosyaların gönderileceği Gmail adresini gireceği input alanı.
- **Validasyon:** Girilen adresin geçerli bir e-posta formatında olup olmadığını kontrol eder.
- **Gmail Sınırı Kontrolü:** Gönderilen dosyanın 25MB (Gmail sınırı) üzerinde olup olmadığını denetler ve kullanıcıyı uyarır.
- **Genel Ayarlar:** "Sistem başlangıcında çalıştır" ve "Bildirimleri göster" seçenekleri.

### 3.3. İşlevsel Gereksinimler
1. **Sürükle-Bırak Tetikleyicisi:** Bir dosya bırakıldığında, eğer e-posta kayıtlıysa otomatik olarak gönderim işlemi başlar.
2. **SMTP Entegrasyonu:** `Nodemailer` kullanılarak arka planda güvenli dosya gönderimi.
3. **Dosya Yönetimi:** Yerel dosya sistemindeki dosyalara erişim ve silme yetkisi.

## 4. Kullanıcı Arayüzü (UI) Spesifikasyonları

### Görsel Stil
- **Arka Plan:** `backdrop-filter: blur(20px)` ve `background: rgba(255, 255, 255, 0.4)`.
- **Köşe Yarıçapı (Border Radius):** 16px - 24px arası (yumuşak köşeler).
- **Tipografi:** Sistem varsayılan sans-serif fontu (Inter veya Ubuntu).

### Bileşen Yapısı
| Bölüm | Elemanlar |
| :--- | :--- |
| **Header** | Başlık (File Hub) + Sağda Ayarlar İkonu |
| **Dropzone** | Dash border + Bulut İkonu + "Dosyaları Buraya Bırak" metni |
| **List Item** | Dosya İkonu + Dosya Adı + (Aç/İndir/Sil) Buton Grubu |
| **Footer** | Versiyon bilgisi + Kapat butonu |

## 5. Teknik Kısıtlamalar ve Güvenlik
- **Gmail App Passwords:** Kullanıcının ana şifresi yerine Google "Uygulama Şifreleri" kullanması önerilmelidir.
- **Dosya Boyutu:** 25MB üzerindeki dosyalar için "Dosya çok büyük, gönderilemiyor" uyarısı verilir.
- **Veri Saklama:** Kullanıcı ayarları `electron-store` ile yerel olarak şifreli/güvenli tutulmalıdır.

## 6. Gelecek Yol Haritası (V2)
- Çoklu e-posta desteği.
- Google Drive / Dropbox entegrasyonu.
- Gönderilen dosyaların geçmiş (log) kaydı.
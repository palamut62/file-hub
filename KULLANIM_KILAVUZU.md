# File Hub - Kullanım Kılavuzu

File Hub, dosyalarınızı kendinize (e-postanıza) hızlıca göndermenizi sağlayan modern ve pratik bir masaüstü uygulamasıdır.

## 📥 Kurulum

Uygulamanın iki farklı sürümü mevcuttur:

### 1. .AppImage (Kurulumsuz / Taşınabilir)
*   İndirdiğiniz `.AppImage` dosyasına sağ tıklayın -> **Özellikler** -> **İzinler** sekmesine gidin.
*   "Dosyanın program olarak çalışmasına izin ver" (Allow executing file as program) kutucuğunu işaretleyin.
*   Dosyaya çift tıklayarak uygulamayı hemen kullanmaya başlayabilirsiniz.

### 2. .deb (Debian/Ubuntu Kurulumu)
*   Dosyaya çift tıklayarak Yazılım Merkezi üzerinden kurabilirsiniz.
*   Veya terminal üzerinden: `sudo dpkg -i dosya_adi.deb` komutu ile kurabilirsiniz.

---

## 🚀 Kullanım

### Dosya Gönderme
1.  Uygulamayı açın.
2.  Göndermek istediğiniz dosyaları uygulamanın üzerine sürükleyip bırakın (Drag & Drop).
3.  Dosyalar otomatik olarak 25MB'lık paketler halinde e-postanıza gönderilecektir.

### Ayarlar (Settings)
Uygulamanın sağ üst köşesindeki veya ayarlar menüsündeki **Çark (⚙️)** ikonuna tıklayarak ayarlara ulaşabilirsiniz.

*   **Email & App Password:** Gmail e-posta adresinizi ve [Uygulama Şifrenizi](https://support.google.com/accounts/answer/185833) (normal şifreniz değil) girin.
*   **Launch at Startup:** İşaretlerseniz bilgisayar açıldığında File Hub otomatik başlar.
*   **Show Notifications:** Masaüstü bildirimlerini açar/kapatır.
*   **Theme:** Görünümü Açık (Light), Koyu (Dark) veya Sistem temanıza göre ayarlayabilirsiniz.

---

## 🗑️ Uygulamayı Kaldırma (Uninstall)

### .deb Sürümü İçin
Uygulamayı sistemden tamamen kaldırmak için terminali açın ve şu komutu yazın:

```bash
sudo apt remove filehub
```

### .AppImage Sürümü İçin
Sadece `.AppImage` dosyasını silmeniz yeterlidir.

### 🧹 Tam Temizlik (Ayarları Sıfırlama)
Uygulamayı kaldırsanız bile, kişisel ayarlarınız (e-posta vb.) bilgisayarınızda saklanabilir. Bu ayarları da tamamen silmek isterseniz şu klasörü silin:

```bash
rm -rf ~/.config/FileHub
```

### 🔗 Menü Kısayollarını Temizleme
Eğer uygulamayı kaldırdıktan sonra hala uygulama menüsünde (Başlat menüsü vb.) uygulamanın ikonunu görüyorsanız:

1.  **Terminali açın.**
2.  Şu klasördeki ilgili dosyaları silin:
    ```bash
    ~$ sudo rm /usr/share/applications/file_hub*.desktop
    ~$ sudo rm /usr/share/applications/file_hub.desktop
    ```
    *(Not: .deb kurulumunda bu işlem genellikle otomatiktir. AppImage kullanıp manuel entegrasyon yaptıysanız gerekebilir.)*

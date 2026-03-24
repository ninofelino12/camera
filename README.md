# 📷 Kamera App - PWA dengan Google OAuth

Aplikasi kamera berbasis web yang menyimpan foto dengan metadata GPS, waktu, dan info device ke localStorage. Dilengkapi dengan Google OAuth 2.0 untuk autentikasi user.

## ✨ Fitur

- 🔐 **Google OAuth 2.0** - Login aman dengan akun Google
- 📧 **Manual Login** - Login dengan email tanpa Google
- 📸 Ambil foto menggunakan kamera perangkat
- 📍 Auto-capture GPS coordinates
- 🕐 Timestamp otomatis
- 📱 Info device lengkap (OS, browser, screen resolution)
- 👤 Email user yang upload
- 💾 Disimpan di localStorage browser
- 📱 PWA - bisa di-install di HP
- 🌐 Offline support dengan Service Worker
- 📥 Export data ke JSON
- 🗺️ Link ke Google Maps untuk lokasi GPS

## 🚀 Deploy ke Vercel

### Cara 1: Via Vercel Dashboard (Paling Mudah)

1. Push kode ke GitHub repository
2. Buka [vercel.com](https://vercel.com)
3. Login dengan Google
4. Klik **Add New Project**
5. Import repository GitHub kamu
6. Klik **Deploy**

### Cara 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel
```

## 🔐 Setup Google OAuth 2.0

### Langkah 1: Buat Project di Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Klik **Create Project**
3. Beri nama project (misal: "Kamera App")
4. Klik **Create**

### Langkah 2: Enable Google+ API

1. Di dashboard, klik **Enable APIs and Services**
2. Cari **Google+ API**
3. Klik **Enable**

### Langkah 3: Buat OAuth 2.0 Client ID

1. Buka **APIs & Services** → **Credentials**
2. Klik **Create Credentials** → **OAuth client ID**
3. Jika belum ada OAuth consent screen:
   - Pilih **External** user type
   - Isi App name: "Kamera App"
   - Isi User support email
   - Isi Developer contact email
   - Klik **Save and Continue**
   - Skip Scopes (klik **Save and Continue**)
   - Skip Test users (klik **Save and Continue**)

### Langkah 4: Konfigurasi OAuth Client ID

1. Pilih **Application type**: **Web application**
2. Isi **Name**: "Kamera App Web"
3. Di **Authorized redirect URIs**, klik **Add URI**
4. Masukkan URL Vercel kamu:
   ```
   https://kamera-app.vercel.app/callback.html
   ```
5. Untuk development lokal, tambahkan juga:
   ```
   http://localhost:8000/callback.html
   http://localhost:3000/callback.html
   ```
6. Klik **Create**

### Langkah 5: Copy Client ID ke Aplikasi

1. Copy **Client ID** yang muncul (berakhiran `.apps.googleusercontent.com`)
2. Buka file `login.html`
3. Cari baris:
   ```javascript
   const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
   ```
4. Ganti dengan Client ID kamu:
   ```javascript
   const GOOGLE_CLIENT_ID = '123456789-abc123def456.apps.googleusercontent.com';
   ```

### Langkah 6: Deploy Ulang

```bash
git add .
git commit -m "Update Google OAuth Client ID"
git push
```

Vercel akan otomatis deploy ulang.

## 📱 Install di HP

### Android (Chrome)
1. Buka aplikasi di browser
2. Menu ⋮ → **Install app** atau **Tambahkan ke Layar Utama**

### iPhone (Safari)
1. Buka aplikasi di Safari
2. Tap **Share** → **Add to Home Screen**

## 🛠️ Development

Jalankan local server:

```bash
# Menggunakan Python
python -m http.server 8000

# Atau menggunakan Node.js
npx serve .

# Atau VS Code Live Server extension
```

Buka `http://localhost:8000` di browser.

**Untuk testing Google OAuth di lokal:**
- Tambahkan `http://localhost:8000` ke **Authorized JavaScript origins**
- Tambahkan `http://localhost:8000/callback.html` ke **Authorized redirect URIs**

## 📁 Struktur File

```
camera/
├── login.html          # Halaman login dengan Google OAuth
├── index.html          # Main application (terproteksi)
├── callback.html       # OAuth callback handler
├── manifest.json       # PWA manifest
├── service-worker.js   # Service worker for offline support
├── vercel.json         # Vercel configuration
├── icon.svg            # App icon
└── README.md           # Documentation
```

## 🔒 Permissions

Aplikasi ini meminta izin:
- **Kamera** - Untuk mengambil foto
- **Geolocation** - Untuk mendapatkan koordinat GPS

## 📝 Data yang Disimpan

Setiap foto menyimpan:
- 📸 Gambar (base64)
- 🕐 Timestamp (waktu & tanggal)
- 📍 GPS coordinates (latitude, longitude)
- 📱 Device info (OS, browser, screen resolution, CPU cores, memory)
- 👤 Email user yang upload (dari Google OAuth atau manual)

## ⚠️ Catatan Penting

1. **Google OAuth hanya bekerja dengan HTTPS** (Vercel sudah menyediakan HTTPS otomatis)
2. **localStorage terbatas ~5-10MB** - foto dalam base64 cepat penuh
3. **GPS memerlukan HTTPS** untuk berfungsi di sebagian besar browser
4. **Simpan Client ID dengan aman** - jangan commit ke public repository

## 🔐 Security Best Practices

Untuk production, pertimbangkan:
- Gunakan Firebase Authentication untuk manajemen user yang lebih baik
- Simpan foto di cloud storage (Firebase Storage, AWS S3, dll)
- Gunakan backend untuk validasi token OAuth
- Implementasi rate limiting

## 📄 License

MIT License

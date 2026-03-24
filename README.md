# 📷 Kamera App - PWA

Aplikasi kamera berbasis web yang menyimpan foto dengan metadata GPS dan waktu ke localStorage.

## ✨ Fitur

- 📸 Ambil foto menggunakan kamera perangkat
- 📍 Auto-capture GPS coordinates
- 🕐 Timestamp otomatis
- 💾 Disimpan di localStorage browser
- 📱 PWA - bisa di-install di HP
- 🌐 Offline support dengan Service Worker
- 📥 Export data ke JSON
- 🗺️ Link ke Google Maps untuk lokasi GPS

## 🚀 Deploy ke Vercel

### Cara 1: Via Vercel Dashboard (Paling Mudah)

1. Push kode ke GitHub repository
2. Buka [vercel.com](https://vercel.com)
3. Klik **Add New Project**
4. Import repository GitHub kamu
5. Klik **Deploy**

### Cara 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel
```

### Cara 3: Drag & Drop (Tanpa Git)

1. Buka [vercel.com/new](https://vercel.com/new)
2. Drag & drop folder project
3. Deploy otomatis

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

## 📁 Struktur File

```
camera/
├── index.html          # Main application
├── manifest.json       # PWA manifest
├── service-worker.js   # Service worker for offline support
├── vercel.json         # Vercel configuration
└── README.md           # Documentation
```

## 🔒 Permissions

Aplikasi ini meminta izin:
- **Kamera** - Untuk mengambil foto
- **Geolocation** - Untuk mendapatkan koordinat GPS

## 📝 Catatan

- Data disimpan di localStorage browser (maksimal ~5-10MB)
- Untuk production, gunakan HTTPS (Vercel sudah menyediakan)
- GPS memerlukan HTTPS untuk berfungsi di sebagian besar browser

## 📄 License

MIT License
# camera

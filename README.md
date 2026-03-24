# 📷 Kamera App - PWA dengan Google OAuth + Neon PostgreSQL

Aplikasi kamera berbasis web yang menyimpan foto dengan metadata GPS, waktu, dan info device ke localStorage dan Neon PostgreSQL. Dilengkapi dengan Google OAuth 2.0 untuk autentikasi user dan ready untuk deploy ke Vercel.

## ✨ Fitur

- 🔐 **Google OAuth 2.0** - Login aman dengan akun Google
- 📧 **Manual Login** - Login dengan email tanpa Google
- 🎮 **Mode Demo** - Coba aplikasi tanpa login
- 📸 Ambil foto menggunakan kamera perangkat
- 📍 Auto-capture GPS coordinates
- 🕐 Timestamp otomatis
- 📱 Info device lengkap (OS, browser, screen resolution)
- 👤 Email user yang upload
- 💾 Disimpan di localStorage browser
- ☁️ **Save to Backend** - Sync foto ke Neon PostgreSQL
- 📱 PWA - bisa di-install di HP
- 🌐 Offline support dengan Service Worker
- 📥 Export data ke JSON
- 🗺️ Link ke Google Maps untuk lokasi GPS
- 🚀 **Vercel Ready** - Deploy mudah ke Vercel dengan serverless functions

## 🚀 Deploy ke Vercel

### Persiapan

1. **Push kode ke GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/camera.git
   git push -u origin main
   ```

2. **Setup Environment Variables di Vercel:**
   - Buka [Vercel Dashboard](https://vercel.com/dashboard)
   - Login dengan GitHub
   - Import repository GitHub kamu
   - **PENTING:** Klik "Environment Variables" sebelum deploy
   - Tambahkan variable:
     - `DATABASE_URL`: Paste connection string Neon PostgreSQL
   - Klik "Deploy"

### Cara 1: Via Vercel Dashboard (Paling Mudah)

1. Push kode ke GitHub repository
2. Buka [vercel.com](https://vercel.com)
3. Login dengan Google/GitHub
4. Klik **Add New Project**
5. Import repository GitHub kamu
6. **Settings → Environment Variables**
7. Add variable `DATABASE_URL` dengan connection string Neon
8. Klik **Deploy**

### Cara 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel

# Setup environment variables
vercel env add DATABASE_URL
# Paste connection string saat diminta

# Deploy lagi untuk apply env
vercel --prod
```

### Setup Neon PostgreSQL di Vercel

1. **Environment Variables di Vercel Dashboard:**
   - Buka Project Settings → Environment Variables
   - Klik "Add New"
   - Name: `DATABASE_URL`
   - Value: `postgresql://neondb_owner:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
   - Environment: Production, Preview, Development (centang semua)
   - Save

2. **Run Migration:**
   ```bash
   # Install dependencies dulu
   npm install

   # Jalankan migration
   npm run migrate
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

### Langkah 5: Buat File Konfigurasi

1. **Copy file config example:**
   ```bash
   cp config.example.js config.js
   ```

2. **Edit file `config.js`:**
   ```javascript
   const GOOGLE_CONFIG = {
       clientId: '123456789-abc123def456.apps.googleusercontent.com',
       redirectUri: window.location.origin + '/callback.html',
       scope: 'email profile'
   };
   ```

3. **Ganti `clientId`** dengan Client ID dari Google Cloud Console

### Langkah 6: Deploy Ulang

```bash
git add .
git commit -m "Update Google OAuth Client ID"
git push
```

**PENTING:** File `config.js` sudah ada di `.gitignore` jadi tidak akan ter-commit ke GitHub. Untuk production di Vercel, kamu bisa:

**Opsi A:** Edit `config.js` langsung di Vercel setelah deploy
**Opsi B:** Gunakan Environment Variables di Vercel Dashboard

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
# Terminal 1: Start backend server (port 3000)
npm start

# Terminal 2: Start frontend server (port 8000)
python -m http.server 8000

# Atau menggunakan npx
npx serve .

# Atau VS Code Live Server extension
```

Buka `http://localhost:8000` di browser.

**Untuk testing Google OAuth di lokal:**
- Tambahkan `http://localhost:8000` ke **Authorized JavaScript origins**
- Tambahkan `http://localhost:8000/callback.html` ke **Authorized redirect URIs**

### Test Sync to Backend

Untuk test fitur sync ke backend, buka:
```
http://localhost:8000/test-sync.html
```

Halaman ini akan membantu Anda:
1. Check koneksi ke backend
2. Add test photo ke localStorage
3. Sync photo ke Neon PostgreSQL
4. Lihat photo yang ada di database

## 📁 Struktur File

```
camera/
├── login.html          # Halaman login dengan Google OAuth
├── index.html          # Main application (terproteksi)
├── callback.html       # OAuth callback handler
├── api.js              # API helper untuk backend
├── test-sync.html      # Test page untuk sync
├── manifest.json       # PWA manifest
├── service-worker.js   # Service worker for offline support
├── vercel.json         # Vercel configuration
├── icon.svg            # App icon
│
├── server.js           # Express.js backend server (local dev)
├── db.js               # Database connection (Neon PostgreSQL)
├── migrate.js          # Database migration script
│
├── api/                # Vercel serverless functions
│   ├── health.js       # Health check endpoint
│   ├── photos.js       # Photos CRUD endpoint
│   ├── [id].js         # Single photo endpoint
│   └── user/
│       └── [email].js  # Delete user photos endpoint
│
├── package.json        # Node.js dependencies
├── .env                # Local environment variables
├── .env.example        # Environment variables template
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

## 🗄️ Backend dengan Neon PostgreSQL

### Setup Database

1. **Buat database di Neon:**
   - Buka [https://console.neon.tech/](https://console.neon.tech/)
   - Sign up / Login
   - Buat project baru
   - Copy connection string

2. **Konfigurasi environment:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` dan paste connection string:**
   ```
   DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/camera_db?sslmode=require
   PORT=3000
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Jalankan migration:**
   ```bash
   npm run migrate
   ```

6. **Start backend server:**
   ```bash
   # Production
   npm start

   # Development (auto-reload)
   npm run dev
   ```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/photos` | Get all photos |
| GET | `/api/photos?email=user@example.com` | Get photos by user |
| GET | `/api/photos/:id` | Get single photo |
| POST | `/api/photos` | Create new photo |
| PUT | `/api/photos/:id` | Update photo |
| DELETE | `/api/photos/:id` | Delete photo |
| DELETE | `/api/photos/user/:email` | Delete all user photos |

### Contoh Request

**Upload foto:**
```javascript
fetch('http://localhost:3000/api/photos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    image: 'data:image/jpeg;base64,...',
    email: 'user@example.com',
    timestamp: '2024-01-01T10:00:00Z',
    gps: { lat: -6.2088, lng: 106.8456 },
    device_info: { os: 'Android', browser: 'Chrome' }
  })
});
```

**Get photos:**
```javascript
const response = await fetch('http://localhost:3000/api/photos?email=user@example.com');
const result = await response.json();
console.log(result.data);
```

### Sync LocalStorage ke Backend

Untuk sync foto dari localStorage ke database:

```html
<script src="api.js"></script>
<script>
  // Sync semua foto
  const result = await window.CameraAPI.syncPhotosToBackend();
  console.log('Synced:', result.synced.length);
  console.log('Failed:', result.failed.length);
</script>
```

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

# 🚀 Quick Start Guide

## Setup Backend (Neon PostgreSQL + Express)

### 1. Setup Database
```bash
# Install dependencies
npm install

# Setup .env (sudah ada connection string)
# File .env sudah dikonfigurasi dengan Neon database
```

### 2. Run Migration
```bash
npm run migrate
```

### 3. Start Backend Server
```bash
npm start
```

Server akan berjalan di **http://localhost:3000**

---

## Setup Frontend

### 1. Start Frontend Server (terminal terpisah)
```bash
# Opsi 1: Python
python3 -m http.server 8000

# Opsi 2: npx
npx serve .
```

### 2. Buka Browser
```
http://localhost:8000
```

---

## Cara Menggunakan

### 1. Login
- Buka `http://localhost:8000/login.html`
- Login dengan Google atau mode Demo

### 2. Ambil Foto
- Klik "📸 Ambil Foto"
- Foto akan disimpan ke localStorage browser

### 3. Save to Backend
- Klik tombol **"☁️ Save to Backend"**
- Foto akan diupload ke Neon PostgreSQL
- Foto yang sudah ada tidak akan di-duplicate

---

## Test Sync Feature

Buka halaman test:
```
http://localhost:8000/test-sync.html
```

Halaman ini untuk testing:
- ✅ Health check backend
- ✅ Add test photo
- ✅ Sync ke database
- ✅ Lihat foto di database

---

## API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/health` | Cek koneksi database |
| GET | `/api/photos` | Ambil semua foto |
| GET | `/api/photos?email=user@example.com` | Ambil foto by user |
| POST | `/api/photos` | Upload foto baru |
| DELETE | `/api/photos/:id` | Hapus foto |

---

## Troubleshooting

### Backend tidak bisa connect
```bash
# Cek .env file
cat .env

# Restart server
pkill -f "node server.js"
npm start
```

### CORS error di browser
Pastikan backend dan frontend berjalan di port yang benar:
- Backend: port 3000
- Frontend: port 8000

### Storage penuh di browser
Klik "🗑️ Hapus Semua" untuk clear localStorage, lalu sync ke backend.

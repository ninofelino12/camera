# ✅ Checklist Deploy ke Vercel

## 📋 Pre-Deployment Checklist

### 1. Setup Database
- [ ] Sudah punya akun Neon PostgreSQL
- [ ] Sudah copy connection string
- [ ] Sudah test koneksi local (`npm run migrate`)

### 2. Setup GitHub
- [ ] Sudah install Git
- [ ] Sudah buat repository di GitHub
- [ ] Sudah push kode ke GitHub

### 3. Setup Vercel Account
- [ ] Sudah login ke Vercel (vercel.com)
- [ ] Sudah connect GitHub account

---

## 🚀 Deployment Steps

### Step 1: Push ke GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push
```

### Step 2: Deploy di Vercel Dashboard

1. Buka https://vercel.com/dashboard
2. Klik "Add New Project"
3. Import repository GitHub
4. **PENTING: Setup Environment Variables**
   - Name: `DATABASE_URL`
   - Value: `postgresql://neondb_owner:npg_bwRiaS79KeqZ@ep-divine-silence-adi2om1u-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require`
   - Centang: Production, Preview, Development
5. Klik "Deploy"

### Step 3: Run Migration
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Pull environment variables
vercel env pull

# Run migration
npm run migrate
```

---

## ✅ Post-Deployment Checklist

### Test Aplikasi
- [ ] Buka URL Vercel (https://your-app.vercel.app)
- [ ] Test login (Google OAuth atau Demo mode)
- [ ] Test ambil foto
- [ ] Test tombol "Save to Backend"
- [ ] Cek foto tersimpan di database

### Test API Endpoints
- [ ] Health check: `https://your-app.vercel.app/api/health`
- [ ] Get photos: `https://your-app.vercel.app/api/photos`
- [ ] Response harus JSON valid

### Check Logs
- [ ] Buka Vercel Dashboard → Project → Deployments
- [ ] Klik deployment terbaru
- [ ] View logs, pastikan tidak ada error

---

## 🔧 Troubleshooting

### Deployment Failed
**Problem:** Build error
**Solution:**
```bash
npm install
git add package.json package-lock.json
git commit -m "Fix dependencies"
git push
```

### API 500 Error
**Problem:** DATABASE_URL not set
**Solution:**
- Vercel Dashboard → Settings → Environment Variables
- Add `DATABASE_URL` dengan connection string Neon
- Redeploy

### CORS Error
**Problem:** Cannot connect to API
**Solution:**
- Pastikan `api.js` menggunakan relative path `/api` untuk production
- Clear browser cache

### Database Connection Failed
**Problem:** Cannot connect to Neon
**Solution:**
```bash
# Test connection string local
npm run migrate

# Check connection string di Vercel Environment Variables
# Pastikan sslmode=require ada di URL
```

---

## 📊 File Structure untuk Vercel

```
camera/
├── api/                    # Serverless Functions (Vercel API)
│   ├── health.js          # GET /api/health
│   ├── photos.js          # GET, POST /api/photos
│   ├── [id].js            # GET, PUT, DELETE /api/photos/:id
│   └── user/[email].js    # DELETE /api/photos/user/:email
│
├── *.html                 # Static files (auto-served)
├── *.js                   # Frontend JavaScript
├── *.json                 # Config files
│
├── server.js              # Local development only
├── db.js                  # Database connection (shared)
├── migrate.js             # Database migration
│
└── vercel.json            # Vercel configuration
```

---

## 🎯 Quick Commands

### Local Development
```bash
# Backend (terminal 1)
npm start

# Frontend (terminal 2)
python3 -m http.server 8000

# Test sync
open http://localhost:8000/test-sync.html
```

### Deployment
```bash
# Push to GitHub
git add . && git commit -m "Update" && git push

# Deploy with CLI
vercel --prod

# View logs
vercel logs --follow
```

### Database
```bash
# Run migration
npm run migrate

# Pull env from Vercel
vercel env pull
```

---

## 📞 Resources

- **Vercel Docs:** https://vercel.com/docs
- **Neon Docs:** https://neon.tech/docs
- **Vercel CLI:** https://vercel.com/docs/cli
- **Serverless Functions:** https://vercel.com/docs/functions

---

## 🎉 Success Criteria

Aplikasi berhasil deploy jika:
- ✅ Website bisa diakses di URL Vercel
- ✅ Login berfungsi
- ✅ Ambil foto berfungsi
- ✅ "Save to Backend" berhasil upload foto
- ✅ API health check return `{"status":"ok","database":"connected"}`
- ✅ Tidak ada error di browser console
- ✅ Tidak ada error di Vercel logs

---

**Last Updated:** March 24, 2026

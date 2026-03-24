# 🚀 Panduan Deploy ke Vercel

## Langkah 1: Persiapan Kode

### 1.1 Install Dependencies
```bash
npm install
```

### 1.2 Test Local Development
```bash
# Terminal 1 - Backend
npm start

# Terminal 2 - Frontend
python3 -m http.server 8000
```

Buka http://localhost:8000 dan test aplikasi.

### 1.3 Test Sync ke Backend
Buka http://localhost:8000/test-sync.html untuk test koneksi ke database.

---

## Langkah 2: Push ke GitHub

```bash
# Initialize git (jika belum)
git init

# Add semua file
git add .

# Commit
git commit -m "Ready for Vercel deployment"

# Buat branch main
git branch -M main

# Add remote (ganti dengan username GitHub Anda)
git remote add origin https://github.com/YOUR_USERNAME/camera.git

# Push ke GitHub
git push -u origin main
```

---

## Langkah 3: Deploy ke Vercel

### Opsi A: Via Vercel Dashboard (Recommended)

1. **Buka [Vercel Dashboard](https://vercel.com/dashboard)**
   - Login dengan GitHub atau Google account

2. **Add New Project**
   - Klik tombol "Add New..." → "Project"

3. **Import Repository**
   - Pilih repository `camera` dari list
   - Klik "Import"

4. **Configure Project**
   - **Framework Preset:** Other
   - **Build Command:** `npm run build`
   - **Output Directory:** (kosongkan)
   - **Install Command:** `npm install`

5. **Add Environment Variables** ⚠️ PENTING!
   - Klik "Environment Variables"
   - Klik "Add New"
   - Tambahkan variable:
     ```
     Name: DATABASE_URL
     Value: postgresql://neondb_owner:npg_bwRiaS79KeqZ@ep-divine-silence-adi2om1u-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
     Environments: ✓ Production ✓ Preview ✓ Development
     ```
   - Klik "Save"

6. **Deploy**
   - Klik "Deploy"
   - Tunggu proses deployment selesai (~1-2 menit)

7. **Test Deployment**
   - Klik "Visit" untuk buka aplikasi
   - Test login dan ambil foto
   - Klik "Save to Backend" untuk test sync

### Opsi B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login ke Vercel
vercel login

# Navigate ke folder project
cd /path/to/camera

# Deploy (pertama kali)
vercel

# Ikuti prompt:
# - Set up and deploy? Y
# - Which scope? (pilih account Anda)
# - Link to existing project? N
# - Project name? camera-app
# - Directory? ./
# - Override settings? N

# Setup environment variables
vercel env add DATABASE_URL
# Paste connection string saat diminta
# Pilih environments: Production, Preview, Development

# Deploy production
vercel --prod
```

---

## Langkah 4: Run Migration di Production

Setelah deploy, jalankan migration untuk membuat tabel:

```bash
# Via Vercel CLI
vercel env pull .env.production.local
npm run migrate

# Atau via Vercel Dashboard
# Settings → Functions → Run Build Hook
# Atau trigger deployment baru dengan commit
```

---

## Langkah 5: Setup Google OAuth (Optional)

Jika ingin menggunakan Google OAuth:

1. **Buka [Google Cloud Console](https://console.cloud.google.com/)**

2. **Authorized redirect URIs:**
   ```
   https://YOUR-APP.vercel.app/callback.html
   http://localhost:8000/callback.html (untuk development)
   ```

3. **Update config.js** dengan Client ID baru

4. **Commit dan push:**
   ```bash
   git add .
   git commit -m "Update Google OAuth config"
   git push
   ```

---

## Testing Deployment

### 1. Health Check
Buka: `https://YOUR-APP.vercel.app/api/health`

Expected response:
```json
{
  "status": "ok",
  "database": "connected"
}
```

### 2. Test Upload Foto
1. Buka aplikasi: `https://YOUR-APP.vercel.app`
2. Login dengan Google atau Demo mode
3. Ambil foto
4. Klik "☁️ Save to Backend"
5. Cek response status

### 3. Test API Manual
```bash
# Get all photos
curl https://YOUR-APP.vercel.app/api/photos

# Get photos by email
curl https://YOUR-APP.vercel.app/api/photos?email=user@example.com

# Health check
curl https://YOUR-APP.vercel.app/api/health
```

---

## Troubleshooting

### Deployment Failed

**Error: Module not found**
```bash
# Pastikan semua dependencies terinstall
npm install
git add package.json package-lock.json
git commit -m "Fix missing dependencies"
git push
```

**Error: DATABASE_URL not defined**
- Buka Vercel Dashboard → Project → Settings → Environment Variables
- Pastikan `DATABASE_URL` sudah ditambahkan
- Redeploy: `vercel --prod`

### API 500 Error

**Database connection error:**
- Cek connection string di Environment Variables
- Pastikan Neon database aktif
- Run migration: `npm run migrate`

### CORS Error di Browser

Pastikan API URL di `api.js` sudah benar:
- Localhost: `http://localhost:3000/api`
- Production: `/api` (relative path)

### Foto Tidak Tersimpan

1. Cek console browser untuk error
2. Test health endpoint
3. Pastikan database table ada (run migration)
4. Cek ukuran foto (base64 besar bisa gagal)

---

## Monitoring & Logs

### View Logs di Vercel
```bash
# Login dulu
vercel login

# View logs
vercel logs YOUR-APP.vercel.app

# Real-time logs
vercel logs YOUR-APP.vercel.app --follow
```

### Vercel Dashboard
- Buka Project → Deployments
- Klik deployment terbaru
- View logs untuk lihat errors

---

## Update Aplikasi

Setiap kali ada perubahan:

```bash
# Commit perubahan
git add .
git commit -m "Update: your changes"
git push

# Vercel akan auto-deploy
# Tunggu beberapa menit, aplikasi akan terupdate otomatis
```

---

## Custom Domain (Optional)

1. **Beli domain** (Niagahoster, Namecheap, dll)

2. **Vercel Dashboard:**
   - Project → Settings → Domains
   - Add domain: `yourdomain.com`

3. **Setup DNS di domain provider:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

4. **Add environment variable untuk CORS:**
   ```
   ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   ```

---

## Cost Estimate

**Vercel Free Tier:**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless functions (10GB hours/month)
- ✅ Automatic SSL

**Neon PostgreSQL Free Tier:**
- ✅ 0.5 GB storage
- ✅ Limited compute hours
- ✅ Community support

Cocok untuk project kecil dan testing!

---

## Support

- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- GitHub Issues: https://github.com/yourusername/camera/issues

// ============================================
// KONFIGURASI GOOGLE OAUTH 2.0
// ============================================
// 
// CARA MENDAPATKAN CLIENT ID:
// 1. Buka https://console.cloud.google.com/
// 2. Buat project baru
// 3. Enable Google+ API
// 4. APIs & Services → Credentials
// 5. Create Credentials → OAuth 2.0 Client ID
// 6. Application type: Web application
// 7. Authorized redirect URIs:
//    - https://YOUR-APP.vercel.app/callback.html
//    - http://localhost:8000/callback.html (untuk dev)
// 8. Copy Client ID ke bawah ini
// ============================================

const GOOGLE_CONFIG = {
    clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    redirectUri: window.location.origin + '/callback.html',
    scope: 'email profile'
};

// Export untuk digunakan di login.html
window.GOOGLE_CONFIG = GOOGLE_CONFIG;

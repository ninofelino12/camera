/**
 * API Helper untuk berkomunikasi dengan backend Express.js / Vercel Serverless
 * Mengirim data foto dari localStorage ke Neon PostgreSQL
 */

// Auto-detect API URL based on environment
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : '/api';

const CameraAPI = {
  /**
   * Sync semua foto dari localStorage ke database
   */
  async syncPhotosToBackend() {
    const photos = this.getPhotosFromLocalStorage();
    const syncedPhotos = [];
    const failedPhotos = [];

    for (const photo of photos) {
      try {
        // Cek apakah foto sudah ada di backend (berdasarkan timestamp)
        const exists = await this.checkPhotoExists(photo.timestamp, photo.email || photo.uploadedBy);
        
        if (!exists) {
          await this.uploadPhoto(photo);
          syncedPhotos.push(photo);
        }
      } catch (error) {
        console.error('Failed to sync photo:', error);
        failedPhotos.push(photo);
      }
    }

    return { synced: syncedPhotos, failed: failedPhotos };
  },

  /**
   * Ambil foto dari localStorage
   */
  getPhotosFromLocalStorage() {
    const photosData = localStorage.getItem('cameraPhotos');
    return photosData ? JSON.parse(photosData) : [];
  },

  /**
   * Upload satu foto ke backend
   */
  async uploadPhoto(photoData) {
    const response = await fetch(`${API_BASE_URL}/photos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: photoData.image,
        email: photoData.email || photoData.uploadedBy,
        timestamp: photoData.timestamp,
        gps: photoData.gps || null,
        device_info: photoData.device || photoData.device_info || null
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload photo');
    }

    return await response.json();
  },

  /**
   * Cek apakah foto sudah ada di backend
   */
  async checkPhotoExists(timestamp, email) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/photos?email=${encodeURIComponent(email)}&limit=1000`
      );
      
      if (!response.ok) return false;
      
      const result = await response.json();
      return result.data.some(photo => photo.timestamp === timestamp);
    } catch (error) {
      console.error('Error checking photo exists:', error);
      return false;
    }
  },

  /**
   * Ambil semua foto dari backend
   */
  async getPhotos(email = null) {
    let url = `${API_BASE_URL}/photos`;
    if (email) {
      url += `?email=${encodeURIComponent(email)}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch photos');
    }

    return await response.json();
  },

  /**
   * Hapus foto dari backend
   */
  async deletePhoto(id) {
    const response = await fetch(`${API_BASE_URL}/photos/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete photo');
    }

    return await response.json();
  },

  /**
   * Health check backend
   */
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      return { status: 'error', database: 'disconnected', error: error.message };
    }
  }
};

// Export untuk digunakan di browser
window.CameraAPI = CameraAPI;

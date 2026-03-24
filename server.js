import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Increase limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: error.message });
  }
});

// GET all photos
app.get('/api/photos', async (req, res) => {
  try {
    const { email, limit = 100, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM photos';
    let values = [];
    
    if (email) {
      query += ' WHERE email = $1';
      values = [email];
    }
    
    query += ' ORDER BY created_at DESC LIMIT $' + (values.length + 1) + ' OFFSET $' + (values.length + 2);
    values.push(parseInt(limit), parseInt(offset));
    
    const result = await pool.query(query, values);
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET single photo by ID
app.get('/api/photos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM photos WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Photo not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching photo:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST create new photo
app.post('/api/photos', async (req, res) => {
  try {
    const { image, email, timestamp, gps, device_info } = req.body;
    
    // Validate required fields
    if (!image || !email) {
      return res.status(400).json({
        success: false,
        error: 'Image and email are required'
      });
    }
    
    const result = await pool.query(
      `INSERT INTO photos (image, email, timestamp, gps, device_info) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [
        image,
        email,
        timestamp || new Date().toISOString(),
        gps || null,
        device_info || null
      ]
    );
    
    res.status(201).json({
      success: true,
      message: 'Photo created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating photo:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT update photo
app.put('/api/photos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { image, email, timestamp, gps, device_info } = req.body;
    
    const result = await pool.query(
      `UPDATE photos 
       SET image = COALESCE($1, image),
           email = COALESCE($2, email),
           timestamp = COALESCE($3, timestamp),
           gps = COALESCE($4, gps),
           device_info = COALESCE($5, device_info)
       WHERE id = $6
       RETURNING *`,
      [image, email, timestamp, gps, device_info, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Photo not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Photo updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating photo:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE photo
app.delete('/api/photos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM photos WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Photo not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Photo deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE all photos for a user
app.delete('/api/photos/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const result = await pool.query('DELETE FROM photos WHERE email = $1', [email]);
    
    res.json({
      success: true,
      message: `Deleted ${result.rowCount} photos for user ${email}`
    });
  } catch (error) {
    console.error('Error deleting user photos:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});

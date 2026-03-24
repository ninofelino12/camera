import pool from '../../db.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getPhotos(req, res);
      case 'POST':
        return await createPhoto(req, res);
      default:
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Photos API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function getPhotos(req, res) {
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
  
  res.status(200).json({
    success: true,
    count: result.rows.length,
    data: result.rows
  });
}

async function createPhoto(req, res) {
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
}

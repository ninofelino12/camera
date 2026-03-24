import pool from '../../db.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  try {
    switch (req.method) {
      case 'GET':
        return await getPhoto(req, res, id);
      case 'PUT':
        return await updatePhoto(req, res, id);
      case 'DELETE':
        return await deletePhoto(req, res, id);
      default:
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Photo ID API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function getPhoto(req, res, id) {
  if (!id) {
    return res.status(400).json({ success: false, error: 'Photo ID required' });
  }

  const result = await pool.query('SELECT * FROM photos WHERE id = $1', [id]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'Photo not found' });
  }
  
  res.status(200).json({ success: true, data: result.rows[0] });
}

async function updatePhoto(req, res, id) {
  if (!id) {
    return res.status(400).json({ success: false, error: 'Photo ID required' });
  }

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
    return res.status(404).json({ success: false, error: 'Photo not found' });
  }
  
  res.status(200).json({
    success: true,
    message: 'Photo updated successfully',
    data: result.rows[0]
  });
}

async function deletePhoto(req, res, id) {
  if (!id) {
    return res.status(400).json({ success: false, error: 'Photo ID required' });
  }

  const result = await pool.query('DELETE FROM photos WHERE id = $1 RETURNING *', [id]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'Photo not found' });
  }
  
  res.status(200).json({ success: true, message: 'Photo deleted successfully' });
}

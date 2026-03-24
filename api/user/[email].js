import pool from '../../../db.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { email } = req.query;

  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email required' });
  }

  try {
    const result = await pool.query('DELETE FROM photos WHERE email = $1', [email]);
    
    res.status(200).json({
      success: true,
      message: `Deleted ${result.rowCount} photos for user ${email}`
    });
  } catch (error) {
    console.error('Delete user photos error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

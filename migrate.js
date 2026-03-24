import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrate() {
  console.log('🔄 Running database migrations...');
  
  try {
    // Create photos table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS photos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        image TEXT NOT NULL,
        email VARCHAR(255) NOT NULL,
        timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        gps JSONB,
        device_info JSONB,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table "photos" created successfully');

    // Create index on email for faster queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_photos_email ON photos(email)
    `);
    console.log('✅ Index on "email" created successfully');

    // Create index on created_at for sorting
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_photos_created_at ON photos(created_at DESC)
    `);
    console.log('✅ Index on "created_at" created successfully');

    // Create function to update updated_at timestamp
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    console.log('✅ Function "update_updated_at_column" created successfully');

    // Create trigger to auto-update updated_at
    await pool.query(`
      DROP TRIGGER IF EXISTS update_photos_updated_at ON photos;
      CREATE TRIGGER update_photos_updated_at
        BEFORE UPDATE ON photos
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('✅ Trigger "update_photos_updated_at" created successfully');

    console.log('✅ All migrations completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();

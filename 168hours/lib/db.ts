import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("supabase.co") || process.env.DATABASE_URL?.includes("pooler.supabase.com")
    ? { rejectUnauthorized: false }
    : false,
});

async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS hour_entries (
        id SERIAL PRIMARY KEY,
        week_id TEXT NOT NULL,
        day INTEGER NOT NULL,
        hour INTEGER NOT NULL,
        category TEXT NOT NULL DEFAULT '',
        title TEXT NOT NULL DEFAULT '',
        notes TEXT NOT NULL DEFAULT '',
        UNIQUE(week_id, day, hour)
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS custom_categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        color TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  } finally {
    client.release();
  }
}

initDb().catch(console.error);

export default pool;

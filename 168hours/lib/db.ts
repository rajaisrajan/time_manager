import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes("supabase.co") || process.env.DATABASE_URL?.includes("pooler.supabase.com")
        ? { rejectUnauthorized: false }
        : false,
    });
  }
  return pool;
}

export default getPool;

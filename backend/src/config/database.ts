import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const dbUrl = process.env.DATABASE_URL;

// Mock database for development when DATABASE_URL is not set
let pool: Pool;
let useMockDB = false;

if (!dbUrl) {
  console.log('DATABASE_URL not set, using mock database for development');
  useMockDB = true;
  
  // Create a mock pool that returns empty results
  pool = {
    query: async (text: string, params?: any[]) => {
      console.log('Mock DB Query:', text, params);
      // Return empty result for now
      return { rows: [], rowCount: 0 };
    }
  } as any;
} else {
  console.log('Database URL:', dbUrl.replace(/:[^:]*@/, ':***@')); // Hide password in logs
  
  pool = new Pool({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

// Test connection
export { pool };

export const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Mock DB Query:', result);
    console.log('Mock: Database connected successfully');
    return true;
  } catch (error) {
    console.error('Mock: Database connection failed:', error);
    return false;
  }
};

import { VercelRequest, VercelResponse } from '@vercel/node';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import express, { Request, Response, NextFunction } from 'express';
import { initDatabase } from '../src/models/database';
import { apiLimiter } from '../src/middleware/rateLimiter';

// Import routes
import authRoutes from '../src/routes/auth';
import investmentRoutes from '../src/routes/investments';
import adminRoutes from '../src/routes/admin';
import assetRoutes from '../src/routes/assets';

// Initialize Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'https://fraction-fi.vercel.app',
    'https://fraction-grzcd6ohm-vrushank.vercel.app',
    'https://fraction-skm4znnag-vrushank.vercel.app'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined'));

// Add error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Express error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Apply rate limiting
app.use('/api/', apiLimiter);

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'FractionFi API is running' });
});

// Simple test endpoint
app.post('/api/test', (req: Request, res: Response) => {
  console.log('Test endpoint called with body:', req.body);
  res.json({ message: 'Test endpoint works', received: req.body });
});

app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/admin', adminRoutes);

// Initialize database
let dbInitialized = false;

const ensureDb = async () => {
  if (!dbInitialized) {
    try {
      await initDatabase();
      dbInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureDb();
  app(req, res);
}

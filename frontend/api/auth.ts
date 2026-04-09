import { VercelRequest, VercelResponse } from '@vercel/node';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import express, { Request, Response, NextFunction } from 'express';

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

// Mock user storage for now (will be replaced with real database)
interface MockUser {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  wallet_address?: string;
  role: 'user' | 'admin';
  created_at: Date;
  updated_at: Date;
}

let users: MockUser[] = [];
let nextId = 1;

const generateToken = (userId: number, email: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback-jwt-secret-for-development-only';
  const payload = { userId, email, iat: Date.now() / 1000 };
  return btoa(JSON.stringify(payload));
};

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'FractionFi API is running' });
});

// Register endpoint
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, wallet_address, role = 'user' } = req.body;

    console.log('Register request received:', { name, email });

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Create new user (simple hash for mock)
    const password_hash = `hash_${password}`;
    const newUser: MockUser = {
      id: nextId++,
      name,
      email,
      password_hash,
      wallet_address: wallet_address || null,
      role: role as 'user' | 'admin',
      created_at: new Date(),
      updated_at: new Date()
    };

    users.push(newUser);

    // Generate JWT token
    const token = generateToken(newUser.id, newUser.email);

    // Remove password from response
    const { password_hash: _, ...userResponse } = newUser;

    console.log('Registration successful for:', email);

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log('Login request received:', { email });

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user || user.password_hash !== `hash_${password}`) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email);
    
    // Remove password from response
    const { password_hash: _, ...userResponse } = user;

    console.log('Login successful for:', email);

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  app(req, res);
}

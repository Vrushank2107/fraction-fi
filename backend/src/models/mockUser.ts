// Mock user storage for development when database is not available
import bcrypt from 'bcryptjs';

export interface MockUser {
  id?: number;
  name: string;
  email: string;
  password_hash: string;
  wallet_address?: string;
  role?: 'user' | 'admin';
  created_at?: Date;
  updated_at?: Date;
}

// In-memory user storage
let users: MockUser[] = [];
let nextId = 1;

export const MockUserModel = {
  findByEmail: async (email: string): Promise<MockUser | null> => {
    return users.find(user => user.email === email) || null;
  },

  findById: async (id: number): Promise<MockUser | null> => {
    return users.find(user => user.id === id) || null;
  },

  create: async (userData: {
    name: string;
    email: string;
    password: string;
    wallet_address?: string;
    role?: string;
  }): Promise<MockUser> => {
    console.log('Mock DB: Creating user:', userData.email);
    const password_hash = await bcrypt.hash(userData.password, 10);
    
    const newUser: MockUser = {
      id: nextId++,
      name: userData.name,
      email: userData.email,
      password_hash,
      wallet_address: userData.wallet_address,
      role: (userData.role || 'user') as 'user' | 'admin',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    users.push(newUser);
    return newUser;
  },

  verifyPassword: async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
  },

  updateProfile: async (id: number, data: {
    name?: string;
    wallet_address?: string;
  }): Promise<MockUser | null> => {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;
    
    users[userIndex] = {
      ...users[userIndex],
      ...data,
      updated_at: new Date()
    };
    
    return users[userIndex];
  }
};

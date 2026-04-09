// Temporary mock API for development when backend is not available
interface MockUser {
  id: number;
  name: string;
  email: string;
  password: string; // Simple storage for mock
  wallet_address?: string;
  role: 'user' | 'admin';
  created_at: Date;
  updated_at: Date;
}

// In-memory storage
let users: MockUser[] = [];
let nextId = 1;

const generateToken = (userId: number, email: string): string => {
  const payload = { userId, email, iat: Date.now() / 1000 };
  return btoa(JSON.stringify(payload)); // Simple token for mock
};

export const mockApi = {
  async register(name: string, email: string, password: string, wallet_address?: string) {
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser: MockUser = {
      id: nextId++,
      name,
      email,
      password, // Simple storage for mock
      wallet_address,
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    };

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser.id, newUser.email);

    // Remove password from response
    const { password: _, ...userResponse } = newUser;

    return {
      message: 'User registered successfully',
      user: userResponse,
      token
    };
  },

  async login(email: string, password: string) {
    const user = users.find(u => u.email === email);
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user.id, user.email);
    
    const { password: _, ...userResponse } = user;

    return {
      message: 'Login successful',
      user: userResponse,
      token
    };
  },

  async getProfile(userId: number) {
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    const { password: _, ...userResponse } = user;
    return { user: userResponse };
  },

  async updateProfile(userId: number, data: { name?: string; wallet_address?: string }) {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex] = {
      ...users[userIndex],
      ...data,
      updated_at: new Date()
    };

    const { password: _, ...userResponse } = users[userIndex];
    return {
      message: 'Profile updated successfully',
      user: userResponse
    };
  }
};

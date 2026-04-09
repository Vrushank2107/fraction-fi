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

// Use localStorage for persistence
const getUsers = (): MockUser[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('mockUsers');
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

const saveUsers = (users: MockUser[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mockUsers', JSON.stringify(users));
  }
};

const getNextId = (): number => {
  if (typeof window !== 'undefined') {
    const currentId = localStorage.getItem('mockNextId');
    const nextId = currentId ? parseInt(currentId) + 1 : 1;
    localStorage.setItem('mockNextId', nextId.toString());
    return nextId;
  }
  return 1;
};

const generateToken = (userId: number, email: string): string => {
  const payload = { userId, email, iat: Date.now() / 1000 };
  return btoa(JSON.stringify(payload)); // Simple token for mock
};

export const mockApi = {
  async register(name: string, email: string, password: string, wallet_address?: string) {
    const users = getUsers();
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser: MockUser = {
      id: getNextId(),
      name,
      email,
      password, // Simple storage for mock
      wallet_address,
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    };

    users.push(newUser);
    saveUsers(users);

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
    const users = getUsers();
    const user = users.find((u: MockUser) => u.email === email);
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
    const users = getUsers();
    const user = users.find((u: MockUser) => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    const { password: _, ...userResponse } = user;
    return { user: userResponse };
  },

  async updateProfile(userId: number, data: { name?: string; wallet_address?: string }) {
    const users = getUsers();
    const userIndex = users.findIndex((u: MockUser) => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex] = {
      ...users[userIndex],
      ...data,
      updated_at: new Date()
    };

    saveUsers(users);

    const { password: _, ...userResponse } = users[userIndex];
    return {
      message: 'Profile updated successfully',
      user: userResponse
    };
  }
};


import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user info in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock authentication functions
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // In a real app, this would be a call to your backend
      
      // Simple mock for demo purposes
      if (!username || !password) {
        throw new Error('Username and password are required');
      }
      
      // Hardcoded users for demo
      const users = [
        { id: 1, username: 'employee', role: 'Employee' as UserRole, password: 'password' },
        { id: 2, username: 'manager', role: 'Manager' as UserRole, password: 'password' },
        { id: 3, username: 'admin', role: 'Admin' as UserRole, password: 'password' }
      ];
      
      const foundUser = users.find(u => 
        u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Save user to state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string, role: UserRole = 'Employee'): Promise<boolean> => {
    try {
      setIsLoading(true);
      // In a real app, this would be a call to your backend
      
      // Simple validation
      if (!username || !password) {
        throw new Error('Username and password are required');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a new user (this would be done by the backend)
      const newUser = {
        id: Math.floor(Math.random() * 1000),
        username,
        role
      };
      
      // Save user to state and localStorage
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { userApi } from '../services/api';

// TODO: Replace with actual TypeORM and PostgreSQL backend
// Example AuthService with TypeORM:
// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectRepository(UserEntity)
//     private userRepository: Repository<UserEntity>,
//   ) {}
//
//   async validateUser(username: string, password: string): Promise<any> {
//     const user = await this.userRepository.findOne({ where: { username } });
//     if (user && await bcrypt.compare(password, user.password)) {
//       const { password, ...result } = user;
//       return result;
//     }
//     return null;
//   }
// }

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

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual backend authentication
      // In the future, this would be a JWT-based authentication using PostgreSQL and TypeORM
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, password })
      // });
      // const data = await response.json();
      
      const validatedUser = await userApi.validateCredentials(username, password);
      
      if (!validatedUser) {
        throw new Error('Invalid credentials');
      }
      
      // Save user to state and localStorage
      setUser(validatedUser);
      localStorage.setItem('user', JSON.stringify(validatedUser));
      
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
      
      // TODO: Replace with actual backend registration using PostgreSQL and TypeORM
      // Example:
      // const hashedPassword = await bcrypt.hash(password, 10);
      // const newUser = this.userRepository.create({
      //   username,
      //   passwordHash: hashedPassword,
      //   role
      // });
      // await this.userRepository.save(newUser);
      
      // Simple validation
      if (!username || !password) {
        throw new Error('Username and password are required');
      }
      
      // Create a new user
      const newUser = await userApi.create({
        username,
        role
      });
      
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
    // TODO: In a real JWT system, you might want to invalidate the token on the server
    // Example:
    // await fetch('/api/auth/logout', {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
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

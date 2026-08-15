import { createContext } from 'react';
import type { LoginRequest, RegisterRequest, User } from '../models/user';

export interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
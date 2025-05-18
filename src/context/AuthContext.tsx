import { createContext } from 'react';

export interface User {
  id: number;
  email: string;
  token: string
  name?: string;
  isAdmin?: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
  isLoading: false,
  setIsLoading: () => {}
});

export default AuthContext;
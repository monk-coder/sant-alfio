import { createContext } from 'react';

export interface User {
  access: string
  refresh: string;
  isAdmin?: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  refreshToken: async () => false,
  isAuthenticated: false,
  isLoading: false,
  setIsLoading: () => {}
});

export default AuthContext;

import React, { useState, useEffect } from 'react';
import AuthContext, {type User, type AuthContextType } from '../context/AuthContext';

const mockUser: User = {
  id: 1,
  email: '<EMAIL>',
  name: 'Test',
  token: "access tocken",
  isAdmin: true
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const storedUser: string | null = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // const payload: RequestInit = {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     email: email,
    //     password: password
    //   })
    // }
    // const response: Response = await fetch(import.meta.env.VITE_API_URL + '/users/login', payload)
    //
    // if (!response.ok) {
    //   return false;
    // }
    //
    // const user: User | null = await response.json();

    const user: User = mockUser;

    if (user) {
      setUser(user);
      setIsAuthenticated(true);
      
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated,
    isLoading,
    setIsLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
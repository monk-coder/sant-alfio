import React, { useState, useEffect } from 'react';
import AuthContext, {type User, type AuthContextType } from '@context/AuthContext';


export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const storedUser: string | null = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        parsedUser.isAdmin = true
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const payload: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: email,
        password: password
      })
    }

    const response: Response = await fetch(import.meta.env.VITE_BACKEND_URL + '/token/', payload)

    if (!response.ok) {
      return false;
    }

    const user: User | null = await response.json();

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

  const refreshToken = async (): Promise<boolean> => {
    if (!user || !user.refresh) {
      return false;
    }

    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refresh: user.refresh
        })
      });

      if (!response.ok) {
        logout();
        return false;
      }

      const data = await response.json();

      // Update user with new access token
      console.log(data)
      const updatedUser = {
        ...user,
        access: data.access
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  };

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    refreshToken,
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

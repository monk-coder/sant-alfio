import { useContext } from 'react';
import AuthContext, { type AuthContextType } from '@context/AuthContext';
import {useNavigate} from "react-router-dom";

/**
 * Custom hook for making authenticated API requests with automatic token refresh
 * @returns Object with fetchWithAuth function
 */
export const useApi = () => {
  const { user, refreshToken, logout} = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate()

  /**
   * Makes an authenticated API request with automatic token refresh on 401 errors
   * @param url API endpoint URL
   * @param options Fetch options
   * @param retryCount Number of retry attempts (to prevent infinite loops)
   * @returns Response from the API
   */
  const fetchWithAuth = async (
    url: string,
    options: RequestInit = {},
    retryCount: number = 1
  ): Promise<Response> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${user.access}`
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (response.status === 401 && retryCount > 0) {
        const refreshSuccess = await refreshToken();
        
        if (refreshSuccess) {
          return fetchWithAuth(url, options, retryCount - 1);
        } else {
          logout()
          navigate("/login/")
        }
      }

      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };

  return { fetchWithAuth };
};
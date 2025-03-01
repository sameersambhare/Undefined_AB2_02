'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// Simple User interface
interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string; // Add createdAt field as optional
}

// Simplified AuthContext
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const authToken = Cookies.get('auth_token');
      
      if (authToken) {
        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          });
          
          const data = await response.json();
          
          if (response.ok && data.success) {
            setUser(data.user);
          } else {
            // Token is invalid or expired
            Cookies.remove('auth_token');
          }
        } catch (error) {
          console.error('Auth check error:', error);
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setUser(data.user);
        
        // Store token in cookies
        Cookies.set('auth_token', data.token, { 
          expires: 7, // 7 days
          path: '/'
        });
        
        // Redirect to dashboard
        router.push('/createui');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error: any) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setUser(data.user);
        
        // Store token in cookies
        Cookies.set('auth_token', data.token, { 
          expires: 7, // 7 days
          path: '/'
        });
        
        // Redirect to dashboard
        router.push('/createui');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error: any) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('auth_token');
    router.push('/');
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
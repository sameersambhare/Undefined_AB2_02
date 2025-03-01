'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useToast } from './ToastProvider';

// Layout component interface
interface LayoutComponent {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  styles?: Record<string, any>;
}

// Layout interface
interface Layout {
  _id?: string;
  name: string;
  description?: string;
  components: LayoutComponent[];
  thumbnail?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  savedLayouts?: Layout[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  // Layout management functions
  getUserLayouts: () => Promise<Layout[]>;
  saveLayout: (layout: Layout) => Promise<Layout>;
  updateLayout: (layoutId: string, layout: Layout) => Promise<Layout>;
  deleteLayout: (layoutId: string) => Promise<boolean>;
  getLayout: (layoutId: string) => Promise<Layout>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = Cookies.get('auth_token');
      
      console.log('Checking authentication, token exists:', !!storedToken);
      
      if (storedToken) {
        setToken(storedToken);
        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          });
          
          const data = await response.json();
          console.log('Auth check response:', response.status, data.success);
          
          if (response.ok && data.success) {
            setUser(data.user);
            toast.success('Welcome back!');
            console.log('User authenticated:', data.user.email);
          } else {
            // Token is invalid or expired
            console.log('Token invalid or expired');
            Cookies.remove('auth_token');
            setToken(null);
            toast.error('Session expired. Please log in again.');
          }
        } catch (error) {
          console.error('Error checking authentication:', error);
          toast.error('Error checking authentication status');
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
      console.log('Login response:', response.status, data);
      
      if (response.ok && data.success) {
        setUser(data.user);
        setToken(data.token);
        
        // Store token in cookies with proper settings
        Cookies.set('auth_token', data.token, { 
          expires: 7, // 7 days
          path: '/',
          sameSite: 'strict',
          secure: window.location.protocol === 'https:'
        });
        
        console.log('Token stored in cookies:', data.token.substring(0, 20) + '...');
        
        // Show success toast
        toast.success('Login successful!');
        
        // Redirect to dashboard or home
        router.push('/createui');
      } else {
        // Handle specific error status codes
        if (response.status === 401) {
          setError('Invalid email or password. Please try again.');
          toast.error('Invalid email or password. Please try again.');
        } else if (response.status === 500) {
          setError('Server error. Please try again later.');
          toast.error('Server error. Please try again later.');
          console.error('Server error:', data.error);
        } else {
          setError(data.error || 'Login failed');
          toast.error(data.error || 'Login failed');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection and try again.');
      toast.error('Network error. Please check your connection and try again.');
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
      console.log('Register response:', response.status, data);
      
      if (response.ok && data.success) {
        setUser(data.user);
        setToken(data.token);
        
        // Store token in cookies with proper settings
        Cookies.set('auth_token', data.token, { 
          expires: 7, // 7 days
          path: '/',
          sameSite: 'strict',
          secure: window.location.protocol === 'https:'
        });
        
        console.log('Token stored in cookies:', data.token.substring(0, 20) + '...');
        
        // Show success toast
        toast.success('Registration successful!');
        
        // Redirect to dashboard or home
        router.push('/createui');
      } else {
        setError(data.error || 'Registration failed');
        toast.error(data.error || 'Registration failed');
      }
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    
    // Remove the auth_token cookie with the same settings used when setting it
    Cookies.remove('auth_token', { 
      path: '/',
      sameSite: 'strict',
      secure: window.location.protocol === 'https:'
    });
    
    console.log('User logged out, auth_token cookie removed');
    toast.info('You have been logged out');
    router.push('/');
  };

  const clearError = () => {
    setError(null);
  };

  // Layout management functions
  const getUserLayouts = async (): Promise<Layout[]> => {
    if (!token) {
      setError('Authentication required');
      toast.error('Authentication required');
      return [];
    }

    try {
      const response = await fetch('/api/layouts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        return data.layouts;
      } else {
        setError(data.error || 'Failed to fetch layouts');
        toast.error(data.error || 'Failed to fetch layouts');
        return [];
      }
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
      toast.error(error.message || 'Something went wrong');
      return [];
    }
  };

  const saveLayout = async (layout: Layout): Promise<Layout> => {
    if (!token) {
      setError('Authentication required');
      toast.error('Authentication required');
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch('/api/layouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(layout)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Update user's layouts in state if needed
        if (user && user.savedLayouts) {
          setUser({
            ...user,
            savedLayouts: [...user.savedLayouts, data.layout]
          });
        }
        toast.success('Layout saved successfully');
        return data.layout;
      } else {
        setError(data.error || 'Failed to save layout');
        toast.error(data.error || 'Failed to save layout');
        throw new Error(data.error || 'Failed to save layout');
      }
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
      toast.error(error.message || 'Something went wrong');
      throw error;
    }
  };

  const updateLayout = async (layoutId: string, layout: Layout): Promise<Layout> => {
    if (!token) {
      setError('Authentication required');
      toast.error('Authentication required');
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`/api/layouts/${layoutId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(layout)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Update user's layouts in state if needed
        if (user && user.savedLayouts) {
          const updatedLayouts = user.savedLayouts.map(l => 
            l._id === layoutId ? data.layout : l
          );
          setUser({
            ...user,
            savedLayouts: updatedLayouts
          });
        }
        toast.success('Layout updated successfully');
        return data.layout;
      } else {
        setError(data.error || 'Failed to update layout');
        toast.error(data.error || 'Failed to update layout');
        throw new Error(data.error || 'Failed to update layout');
      }
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
      toast.error(error.message || 'Something went wrong');
      throw error;
    }
  };

  const deleteLayout = async (layoutId: string): Promise<boolean> => {
    if (!token) {
      setError('Authentication required');
      toast.error('Authentication required');
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`/api/layouts/${layoutId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Update user's layouts in state if needed
        if (user && user.savedLayouts) {
          const updatedLayouts = user.savedLayouts.filter(l => l._id !== layoutId);
          setUser({
            ...user,
            savedLayouts: updatedLayouts
          });
        }
        toast.success('Layout deleted successfully');
        return true;
      } else {
        setError(data.error || 'Failed to delete layout');
        toast.error(data.error || 'Failed to delete layout');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
      toast.error(error.message || 'Something went wrong');
      return false;
    }
  };

  const getLayout = async (layoutId: string): Promise<Layout> => {
    if (!token) {
      setError('Authentication required');
      toast.error('Authentication required');
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`/api/layouts/${layoutId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        return data.layout;
      } else {
        setError(data.error || 'Failed to fetch layout');
        toast.error(data.error || 'Failed to fetch layout');
        throw new Error(data.error || 'Failed to fetch layout');
      }
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
      toast.error(error.message || 'Something went wrong');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
        getUserLayouts,
        saveLayout,
        updateLayout,
        deleteLayout,
        getLayout
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
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { account } from '@/appwrite-config';
import { useRouter } from 'expo-router';
import { Models } from 'appwrite';

// Define the context type
interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  isAuthenticated: false,
});

// Define the provider props
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('Checking authentication status...');
      const currentUser = await account.get();
      console.log('User authenticated:', currentUser);
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.log('User not authenticated:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Create a session with email and password
      await account.createEmailPasswordSession(email, password);
      
      // Get the current user after successful login
      const currentUser = await account.get();
      setUser(currentUser);
      setIsAuthenticated(true);
      
      // Add a small delay before navigation to ensure the Root Layout is mounted
      setTimeout(() => {
        router.replace('/(tabs)' as any);
      }, 100);
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-throw the error to be handled by the component
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // Generate a valid user ID (alphanumeric, max 36 chars)
      const userId = 'user_' + Math.random().toString(36).substring(2, 15);
      const newUser = await account.create(userId, email, password, name);
      if (newUser) {
        await login(email, password); // Automatically log in after signup
      }
    } catch (error) {
      console.error('Signup failed:', error);
      throw error; // Re-throw the error to be handled by the component
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await account.deleteSession('current');
      setUser(null);
      setIsAuthenticated(false);
      
      // Add a small delay before navigation to ensure the Root Layout is mounted
      setTimeout(() => {
        router.replace('/(auth)/login' as any);
      }, 100);
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated,
  };

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  );
};
'use client';

import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import type { AppUser } from '@/types';
import { getUserById } from './actions/tree.actions';


interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  firebaseUser: FirebaseUser | null;
  login: () => void;
  signup: () => void;
  logout: () => void;
  addPoints: (points: number) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  firebaseUser: null,
  login: () => {},
  signup: () => {},
  logout: () => {},
  addPoints: () => {},
});

const getMockUser = async (): Promise<AppUser | null> => {
    const user = await getUserById('mock-user-id');
    return user ?? null;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
        try {
          const storedUser = localStorage.getItem('eco-user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            const newUser = await getMockUser();
            if (newUser) {
                localStorage.setItem('eco-user', JSON.stringify(newUser));
                setUser(newUser);
            }
          }
        } catch (error) {
            console.error("Failed to initialize auth:", error);
            const newUser = await getMockUser();
             if (newUser) {
                localStorage.setItem('eco-user', JSON.stringify(newUser));
                setUser(newUser);
            }
        }
        setLoading(false);
    };

    initAuth();
  }, []);


  const login = async () => {
    setLoading(true);
    const mockUser = await getMockUser();
    if (mockUser) {
      localStorage.setItem('eco-user', JSON.stringify(mockUser));
      setUser(mockUser);
    }
    setLoading(false);
  }

  const signup = async () => {
    setLoading(true);
    const mockUser = await getMockUser();
     if (mockUser) {
      localStorage.setItem('eco-user', JSON.stringify(mockUser));
      setUser(mockUser);
    }
    setLoading(false);
  }

  const logout = () => {
    localStorage.removeItem('eco-user');
    setUser(null);
  }

  const addPoints = useCallback((points: number) => {
    setUser(currentUser => {
      if (currentUser) {
        const updatedUser = { ...currentUser, points: currentUser.points + points };
        localStorage.setItem('eco-user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      return null;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, login, signup, logout, addPoints }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

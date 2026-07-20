import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMe, User, ChildProfile } from '../api/client';

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  activeChildId: string | null;
  setActiveChildId: (id: string | null) => void;
  activeChild: ChildProfile | null;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeChildId, setActiveChildIdState] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function restore() {
      try {
        // AUTH BYPASS: auto-login with mock token, then fetch real user from backend
        const mockToken = 'dev-bypass-token';
        await AsyncStorage.setItem('token', mockToken);
        if (isMounted) {
          setToken(mockToken);
        }
        // Fetch real user data (dev-user) from backend
        const result = await getMe();
        if (result.success && isMounted) {
          setUser(result.data.user);
        } else if (isMounted) {
          // Fallback mock user if backend is unreachable
          setUser({
            id: 'dev-user',
            phone: '9999999999',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            caregiverProfile: null,
            children: [],
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    restore();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeChild: ChildProfile | null = (() => {
    if (!user?.children?.length) return null;
    if (activeChildId) {
      return user.children.find((c) => c.id === activeChildId) || user.children[0];
    }
    return user.children[0];
  })();

  const setActiveChildId = async (id: string | null) => {
    setActiveChildIdState(id);
    if (id === null) {
      await AsyncStorage.removeItem('activeChildId');
    } else {
      await AsyncStorage.setItem('activeChildId', id);
    }
  };

  const signIn = async (newToken: string, newUser: User) => {
    await AsyncStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('activeChildId');
    await AsyncStorage.removeItem('onboardingCompleted');
    setActiveChildIdState(null);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, activeChildId, setActiveChildId, activeChild, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

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
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken && isMounted) {
          setToken(storedToken);
          const result = await getMe();
          if (result.success && isMounted) {
            setUser(result.data.user);
          }
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
    await AsyncStorage.removeItem('selectedLanguage');
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

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'visitor' | 'member' | 'admin';
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
}

interface AuthContextValue {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: IUser) => void;
  logout: () => void;
  updateUser: (user: IUser) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const storedToken = localStorage.getItem('auth_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      if (!res.ok) {
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
      } else {
        const data = await res.json();
        const userData = data?.data?.user ?? data?.data;
        setToken(storedToken);
        setUser(userData);
      }
    } catch {
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = (tok: string, userData: IUser) => {
    localStorage.setItem('auth_token', tok);
    setToken(tok);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData: IUser) => setUser(userData);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

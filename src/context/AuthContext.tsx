'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile } from '../lib/supabase/types';
import { supabase, isSupabaseConfigured } from '../lib/supabase/client';

interface AuthContextType {
  user: Profile | null;
  isAdmin: boolean;
  loginAsDemoUser: () => void;
  loginAsDemoAdmin: () => void;
  loginWithEmail: (email: string, name?: string, role?: 'customer' | 'admin') => Promise<void>;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: Profile = {
  id: 'usr-1',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@novatech.io',
  phone: '+91 98765 43210',
  company_name: 'NovaTech Solutions',
  role: 'customer',
  created_at: new Date().toISOString(),
};

const DEMO_ADMIN: Profile = {
  id: 'admin-1',
  name: 'VirSaa Master Admin',
  email: 'concierge@virsaagifts.com',
  phone: '+91 98110 00000',
  company_name: 'VirSaa Sustainable Gifting Co.',
  role: 'admin',
  created_at: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Check local storage for persisted user
    const saved = localStorage.getItem('virsaa_user_session');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        setUser(null);
      }
    } else {
      // Default to demo user for a richer initial experience
      setUser(DEMO_USER);
      localStorage.setItem('virsaa_user_session', JSON.stringify(DEMO_USER));
    }

    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const u: Profile = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            role: (session.user.user_metadata?.role as 'customer' | 'admin') || 'customer',
          };
          setUser(u);
          localStorage.setItem('virsaa_user_session', JSON.stringify(u));
        }
      });
    }
  }, []);

  const loginAsDemoUser = () => {
    setUser(DEMO_USER);
    localStorage.setItem('virsaa_user_session', JSON.stringify(DEMO_USER));
    setIsAuthModalOpen(false);
  };

  const loginAsDemoAdmin = () => {
    setUser(DEMO_ADMIN);
    localStorage.setItem('virsaa_user_session', JSON.stringify(DEMO_ADMIN));
    setIsAuthModalOpen(false);
  };

  const loginWithEmail = async (email: string, name?: string, role: 'customer' | 'admin' = 'customer') => {
    const newUser: Profile = {
      id: 'usr-' + Date.now(),
      email,
      name: name || email.split('@')[0],
      role,
      created_at: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('virsaa_user_session', JSON.stringify(newUser));
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('virsaa_user_session');
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        loginAsDemoUser,
        loginAsDemoAdmin,
        loginWithEmail,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

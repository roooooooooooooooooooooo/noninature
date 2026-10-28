'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, Role } from '../../types/database';
import { createClient } from '../supabase/client';

interface AuthContextType {
  user: Profile | null;
  role: Role;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ error?: string }>;
  signup: (email: string, pass: string, fullName: string, phone: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  simulateAdmin: (enable: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminSimulated, setAdminSimulated] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Check simulated admin in local storage for local testing
    try {
      const isSim = localStorage.getItem('noninature_sim_admin') === 'true';
      setAdminSimulated(isSim);
    } catch {
      // Ignore
    }

    if (!supabase) {
      // Offline fallback profile
      setIsLoading(false);
      return;
    }

    // Check live auth
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (data) {
            setUser(data as Profile);
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email || null,
              full_name: session.user.user_metadata?.full_name || '',
              phone: session.user.user_metadata?.phone || null,
              role: 'customer',
              avatar_url: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          }
        }
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) setUser(data as Profile);
          });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    const supabase = createClient();
    if (!supabase) {
      // Demo test login fallback
      if (email === 'admin@noninature.com' && pass === 'Admin@123456') {
        const adminProfile: Profile = {
          id: 'admin-user-001',
          email: 'admin@noninature.com',
          full_name: 'NoniNature Administrator',
          phone: '01711223344',
          role: 'admin',
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(adminProfile);
        setAdminSimulated(true);
        localStorage.setItem('noninature_sim_admin', 'true');
        return {};
      }
      return { error: 'Supabase credentials not configured in .env.local' };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) return { error: error.message };
    return {};
  };

  const signup = async (email: string, pass: string, fullName: string, phone: string) => {
    const supabase = createClient();
    if (!supabase) {
      return { error: 'Supabase credentials not configured in .env.local' };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: fullName,
          phone,
        },
      },
    });

    if (error) return { error: error.message };
    return {};
  };

  const logout = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setAdminSimulated(false);
    try {
      localStorage.removeItem('noninature_sim_admin');
    } catch {
      // Ignore
    }
  };

  const simulateAdmin = (enable: boolean) => {
    setAdminSimulated(enable);
    if (enable) {
      setUser({
        id: 'mock-admin',
        email: 'admin@noninature.com',
        full_name: 'Admin Manager',
        phone: '01711223344',
        role: 'admin',
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      localStorage.setItem('noninature_sim_admin', 'true');
    } else {
      setUser(null);
      localStorage.removeItem('noninature_sim_admin');
    }
  };

  const role: Role = adminSimulated ? 'admin' : user?.role || 'customer';
  const isAdmin = role === 'admin' || role === 'staff';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        isAdmin,
        login,
        signup,
        logout,
        simulateAdmin,
      }}
    >
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

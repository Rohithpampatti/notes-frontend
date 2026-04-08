import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient'; // ✅ FIXED: Changed from 'supabase' to 'supabaseClient'
import API, { setAuthToken } from '../api'; // ✅ Import setAuthToken from api

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ GET SESSION ON LOAD
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);

      if (session?.access_token) {
        setAuthToken(session.access_token); // ✅ SET TOKEN
      }

      setLoading(false);
    });

    // ✅ LISTEN AUTH CHANGES
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);

      if (session?.access_token) {
        setAuthToken(session.access_token); // ✅ UPDATE TOKEN
      } else {
        setAuthToken(null); // ✅ CLEAR TOKEN ON LOGOUT
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ✅ LOGIN
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data?.session?.access_token) {
      setAuthToken(data.session.access_token); // ✅ SET TOKEN AFTER LOGIN
    }

    return { data, error };
  };

  // ✅ REGISTER
  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    return { data, error };
  };

  // ✅ LOGOUT
  const signOut = async () => {
    await supabase.auth.signOut();
    setAuthToken(null); // ✅ REMOVE TOKEN
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
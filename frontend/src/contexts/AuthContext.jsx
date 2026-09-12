import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth session
  useEffect(() => {
    async function initAuth() {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            localStorage.setItem('codelift_token', session.access_token);
            await loadProfile(session.user);
          } else {
            checkSavedSession();
          }

          // Listen for Supabase auth state changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
              localStorage.setItem('codelift_token', session.access_token);
              await loadProfile(session.user);
            } else {
              handleLogout();
            }
          });

          return () => subscription?.unsubscribe();
        } else {
          checkSavedSession();
        }
      } catch (err) {
        console.warn('Auth init check warning:', err);
        checkSavedSession();
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  function checkSavedSession() {
    const savedUser = localStorage.getItem('codelift_user');
    const savedToken = localStorage.getItem('codelift_token');
    if (savedUser && savedToken) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        loadProfile(parsed);
      } catch (e) {
        handleLogout();
      }
    }
  }

  async function loadProfile(currentUser) {
    try {
      const res = await api.auth.me().catch(() => null);
      if (res?.student) {
        setStudent(res.student);
        setUser((prev) => ({
          ...prev,
          ...currentUser,
          isAdmin: res.isAdmin,
          name: res.student.name || currentUser.name
        }));
      } else {
        const isAdmin = currentUser.email?.includes('admin');
        setUser({ ...currentUser, isAdmin });
      }
    } catch {
      const isAdmin = currentUser.email?.includes('admin');
      setUser({ ...currentUser, isAdmin });
    }
  }

  async function signIn(email, password) {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        localStorage.setItem('codelift_token', data.session.access_token);
        await loadProfile(data.user);
        return data.user;
      } else {
        // Mock fallback sign-in
        return await loginAsDemo(email.toLowerCase().includes('admin') ? 'admin' : 'student', email);
      }
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email, password, { name, phone, batchId }) {
    setLoading(true);
    try {
      let userId;
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name, phone } }
        });
        if (error) throw error;
        userId = data.user?.id || `usr-${Date.now()}`;
        if (data.session) {
          localStorage.setItem('codelift_token', data.session.access_token);
        }
      } else {
        userId = `std-${Date.now().toString(36)}`;
        localStorage.setItem('codelift_token', `mock-token-student`);
      }

      // Sync new user to students.json
      const syncRes = await api.auth.sync({
        id: userId,
        email,
        name,
        phone,
        batchId
      });

      const newUser = {
        id: userId,
        email,
        name,
        isAdmin: false
      };

      localStorage.setItem('codelift_user', JSON.stringify(newUser));
      setUser(newUser);
      setStudent(syncRes.student);

      return newUser;
    } finally {
      setLoading(false);
    }
  }

  async function loginAsDemo(role = 'student', customEmail = null) {
    const isAdmin = role === 'admin';
    const email = customEmail || (isAdmin ? 'admin@codelift.com' : 'student@codelift.com');
    const id = isAdmin ? 'std-admin-super' : 'std-001-rahul';
    const name = isAdmin ? 'CodeLift Lead Instructor' : 'Rahul Verma';

    const demoUser = {
      id,
      email,
      name,
      isAdmin
    };

    localStorage.setItem('codelift_token', `mock-token-${role}`);
    localStorage.setItem('codelift_user', JSON.stringify(demoUser));
    setUser(demoUser);

    try {
      const res = await api.auth.me().catch(() => null);
      if (res?.student) {
        setStudent(res.student);
      } else {
        setStudent({
          id,
          email,
          name,
          phone: '+919876543210',
          batchId: 'batch-alpha-2026',
          progress: { 'topic-js-async': 'completed', 'topic-react-hooks': 'completed' },
          isActive: true
        });
      }
    } catch {
      // Ignore
    }

    return demoUser;
  }

  async function refreshStudent() {
    try {
      const res = await api.auth.me();
      if (res?.student) {
        setStudent(res.student);
      }
    } catch (e) {
      console.warn('Could not refresh student profile:', e);
    }
  }

  function handleLogout() {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    localStorage.removeItem('codelift_token');
    localStorage.removeItem('codelift_user');
    setUser(null);
    setStudent(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        loading,
        signIn,
        signUp,
        signOut: handleLogout,
        loginAsDemo,
        refreshStudent,
        isAdmin: Boolean(user?.isAdmin)
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

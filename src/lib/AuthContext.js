"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { mockDb } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check local storage for session on mount
    const currentUser = mockDb.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (data.success) {
        setUser(data.user);
        mockDb.setCurrentUser(data.user); // keep in sync with local mock
        router.push('/admin');
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (e) {
      return { success: false, error: 'Kesalahan jaringan' };
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    await mockDb.logout();
    setUser(null);
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading ? children : <div className="min-h-screen flex items-center justify-center bg-navy-darker text-white font-bold animate-pulse">Memuat Sesi...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

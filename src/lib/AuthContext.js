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

  useEffect(() => {
    if (!loading) {
      // If trying to access admin routes while not logged in, redirect to login
      if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login') && !pathname.startsWith('/admin/forgot-password')) {
        if (!user) {
          router.push('/admin/login');
        }
      }
      
      // If logged in and trying to access login, redirect to overview
      if (pathname.startsWith('/admin/login') && user) {
        router.push('/admin');
      }
    }
  }, [user, loading, pathname, router]);

  const login = async (username, password) => {
    const res = await mockDb.login(username, password);
    if (res.success) {
      setUser(res.user);
      router.push('/admin');
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const logout = async () => {
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

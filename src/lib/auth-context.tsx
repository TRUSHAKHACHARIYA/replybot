"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  email: string;
  name: string;
  shop_name: string;
  phone: string;
  niche: string;
  role: "owner" | "admin";
  plan: "starter" | "standard" | "growth";
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; redirect?: string }>;
  signup: (data: {
    shopName: string;
    ownerName: string;
    email: string;
    password: string;
    phone: string;
    niche: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchProfile = useCallback(async (userId: string) => {
    if (!supabase) return null;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    return data as Profile | null;
  }, [supabase]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const prof = await fetchProfile(session.user.id);
        setProfile(prof);
      }
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          const prof = await fetchProfile(session.user.id);
          setProfile(prof);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

  const login = useCallback(async (email: string, password: string) => {
    if (!supabase) return { success: false, error: "Supabase not configured" };

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      const prof = await fetchProfile(data.user.id);
      setProfile(prof);
      const redirect = prof?.role === "admin" ? "/admin" : "/dashboard";
      return { success: true, redirect };
    }

    return { success: false, error: "Login failed" };
  }, [supabase, fetchProfile]);

  const signup = useCallback(async (data: {
    shopName: string;
    ownerName: string;
    email: string;
    password: string;
    phone: string;
    niche: string;
  }) => {
    if (!supabase) return { success: false, error: "Supabase not configured" };

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (authData.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email: data.email,
        name: data.ownerName,
        shop_name: data.shopName,
        phone: data.phone,
        niche: data.niche,
        role: "owner",
        plan: "starter",
      });

      if (profileError) {
        return { success: false, error: profileError.message };
      }

      await supabase.from("shops").insert({
        owner_id: authData.user.id,
        name: data.shopName,
      });

      const prof = await fetchProfile(authData.user.id);
      setProfile(prof);
      return { success: true };
    }

    return { success: false, error: "Signup failed" };
  }, [supabase, fetchProfile]);

  const logout = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string; redirect?: string };
  signup: (data: {
    shopName: string;
    ownerName: string;
    email: string;
    password: string;
    phone: string;
    niche: string;
  }) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("replybot_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("replybot_user");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const users = getStoredUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) {
      return { success: false, error: "Invalid email or password" };
    }
    setUser(found);
    localStorage.setItem("replybot_user", JSON.stringify(found));
    const redirect = found.role === "admin" ? "/admin" : "/dashboard";
    return { success: true, redirect };
  }, []);

  const signup = useCallback((data: {
    shopName: string;
    ownerName: string;
    email: string;
    password: string;
    phone: string;
    niche: string;
  }) => {
    const users = getStoredUsers();
    if (users.find((u) => u.email === data.email)) {
      return { success: false, error: "Email already registered" };
    }
    const newUser: User = {
      id: String(users.length + 1),
      email: data.email,
      password: data.password,
      name: data.ownerName,
      shopName: data.shopName,
      phone: data.phone,
      niche: data.niche,
      role: "owner",
      plan: "starter",
    };
    users.push(newUser);
    localStorage.setItem("replybot_users", JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem("replybot_user", JSON.stringify(newUser));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("replybot_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

function getStoredUsers(): User[] {
  const defaults: User[] = [
    {
      id: "1", email: "admin@replybot.com", password: "admin123",
      name: "Admin User", shopName: "ReplyBot Admin", phone: "+91 99999 00000",
      niche: "admin", role: "admin", plan: "growth",
    },
    {
      id: "2", email: "priya@styleboutique.com", password: "shop123",
      name: "Priya Sharma", shopName: "Style Boutique", phone: "+91 98765 43210",
      niche: "boutique", role: "owner", plan: "standard",
    },
    {
      id: "3", email: "meera@glowsalon.com", password: "shop123",
      name: "Meera Joshi", shopName: "Glow Salon", phone: "+91 87654 32109",
      niche: "salon", role: "owner", plan: "growth",
    },
    {
      id: "4", email: "ankit@freshbakes.com", password: "shop123",
      name: "Ankit Patel", shopName: "Fresh Bakes", phone: "+91 76543 21098",
      niche: "bakery", role: "owner", plan: "starter",
    },
  ];
  if (typeof window === "undefined") return defaults;
  const stored = localStorage.getItem("replybot_users");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaults;
    }
  }
  return defaults;
}

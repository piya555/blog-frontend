"use client";
import { login as apiLogin, removeAuthToken, setAuthToken } from "@/lib/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "authToken";
const USER_KEY = "user";

const getStoredData = (key: string): string | null => {
  const localData = localStorage.getItem(key);
  if (localData) return localData;

  const cookieData = Cookies.get(key);
  return cookieData || null;
};

const setStoredData = (key: string, value: string) => {
  localStorage.setItem(key, value);
  Cookies.set(key, value, { expires: 7 }); // Set cookie to expire in 7 days
};

const removeStoredData = (key: string) => {
  localStorage.removeItem(key);
  Cookies.remove(key);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getStoredData(TOKEN_KEY);
    const storedUser = getStoredData(USER_KEY);

    if (token && storedUser) {
      setAuthToken(token);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { token, userId, username, role } = await apiLogin(email, password);
      const userData: User = { id: userId, username, email, role };
      setAuthToken(token);
      setUser(userData);
      setStoredData(TOKEN_KEY, token);
      setStoredData(USER_KEY, JSON.stringify(userData));
      router.push("/admin");
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // ส่ง error ต่อเพื่อให้ component จัดการได้
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    removeStoredData(TOKEN_KEY);
    removeStoredData(USER_KEY);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useRequireAuth = (redirectUrl = "/login") => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, isLoading, redirectUrl, router]);

  return { isAuthenticated, isLoading };
};

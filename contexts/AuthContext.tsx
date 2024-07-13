"use client";
// src/contexts/AuthContext.tsx
import { removeAuthToken, setAuthToken } from "@/lib/api";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (isValidUser(parsedUser)) {
          setUser(parsedUser);
          setAuthToken(storedToken);
        } else {
          clearLocalStorage();
        }
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        clearLocalStorage();
      }
    }
  }, []);

  const clearLocalStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const login = (token: string, userData: User) => {
    setUser(userData);
    setAuthToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    console.log("User logged in:", userData); // Debugging line
  };

  const logout = () => {
    setUser(null);
    removeAuthToken();
    clearLocalStorage();
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Helper function to validate user object
function isValidUser(user: any): user is User {
  return (
    typeof user === "object" &&
    user !== null &&
    typeof user.id === "string" &&
    typeof user.email === "string" &&
    typeof user.role === "string"
  );
}

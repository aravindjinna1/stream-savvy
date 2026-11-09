// src/context/AuthContext.jsx

import React, { createContext, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored
      ? { isAuthenticated: true, user: JSON.parse(stored) }
      : { isAuthenticated: false, user: null };
  });

  // ---- LOGIN ----
  const loginUser = async (email, password) => {
    try {
      const res = await axiosInstance.get(`/users?email=${email}&password=${password}`);

      if (res.data.length === 1) {
        const user = res.data[0];
        setAuth({ isAuthenticated: true, user });
        localStorage.setItem("user", JSON.stringify(user));
        return { ok: true };
      }

      return { ok: false, error: "Invalid credentials" };
    } catch {
      return { ok: false, error: "Server error" };
    }
  };

  // ---- REGISTER ----
  const registerUser = async (name, email, password) => {
    // check if user exists
    const exists = await axiosInstance.get(`/users?email=${email}`);
    if (exists.data.length > 0) {
      return { ok: false, error: "Email already exists" };
    }

    const res = await axiosInstance.post("/users", { name, email, password });

    // auto login after register
    setAuth({ isAuthenticated: true, user: res.data });
    localStorage.setItem("user", JSON.stringify(res.data));
    return { ok: true };
  };

  // ---- LOGOUT ----
  const logoutUser = () => {
    setAuth({ isAuthenticated: false, user: null });
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ auth, loginUser, registerUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

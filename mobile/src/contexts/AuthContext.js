import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userData = await AsyncStorage.getItem("user");

        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.error("Failed to load user", e);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  const signup = async (name, email, password, phoneNumber) => {
    try {
      await api.post("/auth/signup", { name, email, password, phoneNumber });
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.response?.data?.message || "Signup failed" };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      await api.post("/auth/verify-otp", { email, otp });
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.response?.data?.message || "Verification failed" };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, verifyOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

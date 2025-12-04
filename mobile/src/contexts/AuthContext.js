import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load stored login on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userData = await AsyncStorage.getItem("user");

        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (err) {
        console.error("Failed to load user", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // 🔹 LOGIN WITH OTP
  const login = async (email, otp) => {
    try {
      const response = await api.post("/auth/verify-otp", { email, otp });

      const { token, user } = response.data;

      // Store login info
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      return { success: true };

    } catch (error) {
      console.log(error);
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  // 🔹 SIGNUP: request OTP
  const signup = async (name, email, phoneNumber) => {
    try {
      await api.post("/auth/request-otp", { name, email, phoneNumber });
      return { success: true };
    } catch (error) {
      console.log(error);
      return { success: false, message: error.response?.data?.message || "Signup failed" };
    }
  };

  // 🔹 LOGOUT
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import React, { useState, useContext } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { AuthContext } from "../contexts/AuthContext";

const LoginScreen = () => {
  const { colors } = useTheme();
  const { login, signup } = useContext(AuthContext);

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOTPMode, setIsOTPMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- SIGNUP STEP 1: Send OTP ---
  const handleSignup = async () => {
    if (!email || !name) {
      Alert.alert("Error", "Please enter name and email");
      return;
    }

    setLoading(true);
    const res = await signup(name, email, phoneNumber);
    setLoading(false);

    if (res.success) {
      Alert.alert("OTP Sent", "Check your email for the OTP");
      setIsOTPMode(true);
    } else {
      Alert.alert("Signup Failed", res.message);
    }
  };

  // --- LOGIN STEP: Verify OTP ---
  const handleLogin = async () => {
    if (!email || !otp) {
      Alert.alert("Error", "Please enter email and OTP");
      return;
    }

    setLoading(true);
    const res = await login(email, otp);
    setLoading(false);

    if (!res.success) {
      Alert.alert("Login Failed", res.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
          <Text style={styles.logoText}>CB</Text>
        </View>
        <Text style={[styles.title, { color: colors.primary }]}>CampusBazaar</Text>
      </View>

      {/* ------------------ OTP ENTRY ------------------ */}
      {isOTPMode ? (
        <View style={styles.formContainer}>
          <Text style={styles.header}>Enter OTP</Text>

          <TextInput
            label="OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            mode="outlined"
            style={styles.input}
          />

          <Button mode="contained" onPress={handleLogin} loading={loading} style={styles.button}>
            Verify OTP
          </Button>

          <Button onPress={() => setIsOTPMode(false)} style={styles.link}>
            Back
          </Button>
        </View>
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.header}>{isSignup ? "Create Account" : "Login"}</Text>

          {isSignup && (
            <TextInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
            />
          )}

          <TextInput
            label="University Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            mode="outlined"
            style={styles.input}
          />

          {isSignup && (
            <TextInput
              label="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              mode="outlined"
              style={styles.input}
            />
          )}

          <Button
            mode="contained"
            loading={loading}
            onPress={isSignup ? handleSignup : () => setIsOTPMode(true)}
            style={styles.button}
          >
            {isSignup ? "Send OTP" : "Login with OTP"}
          </Button>

          <Button onPress={() => setIsSignup(!isSignup)} style={styles.link}>
            {isSignup ? "Already have an account? Login" : "New here? Sign Up"}
          </Button>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center", padding: 20 },
  logoContainer: { alignItems: "center", marginBottom: 40 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    justifyContent: "center", alignItems: "center", marginBottom: 10,
  },
  logoText: { color: "#fff", fontSize: 28, fontWeight: "bold" },
  title: { fontSize: 28, fontWeight: "bold" },
  formContainer: { width: "100%" },
  header: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: { marginBottom: 15 },
  button: { marginTop: 10, paddingVertical: 5, backgroundColor: "#8B0000" },
  link: { marginTop: 15, alignSelf: "center", color: "#8B0000" },
});

export default LoginScreen;

import React, { useState, useContext } from "react";
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { AuthContext } from "../contexts/AuthContext";

const LoginScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { login, signup, verifyOTP } = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      Alert.alert("Login Failed", result.message);
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !name) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    // Basic validation for university email (simple check)
    // if (!email.endsWith(".edu")) { // Uncomment if strict check needed
    //   Alert.alert("Error", "Please use a university email");
    //   return;
    // }

    setLoading(true);
    const result = await signup(name, email, password, phoneNumber);
    setLoading(false);
    if (result.success) {
      setIsVerifying(true);
      Alert.alert("Success", "OTP sent to your email");
    } else {
      Alert.alert("Signup Failed", result.message);
    }
  };

  const handleVerify = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter OTP");
      return;
    }
    setLoading(true);
    const result = await verifyOTP(email, otp);
    setLoading(false);
    if (result.success) {
      Alert.alert("Success", "Email verified! Please login.");
      setIsVerifying(false);
      setIsLogin(true);
    } else {
      Alert.alert("Verification Failed", result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        {/* Placeholder for Logo */}
        <View style={[styles.logoPlaceholder, { backgroundColor: colors.primary }]}>
          <Text style={styles.logoText}>CB</Text>
        </View>
        <Text style={[styles.title, { color: colors.primary }]}>CampusBazaar</Text>
      </View>

      <View style={styles.formContainer}>
        {isVerifying ? (
          <>
            <Text style={styles.header}>Verify Email</Text>
            <TextInput
              label="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              mode="outlined"
              style={styles.input}
              keyboardType="number-pad"
            />
            <Button
              mode="contained"
              onPress={handleVerify}
              loading={loading}
              style={styles.button}
            >
              Verify OTP
            </Button>
            <Button onPress={() => setIsVerifying(false)} style={styles.link}>
              Back
            </Button>
          </>
        ) : (
          <>
            <Text style={styles.header}>{isLogin ? "Login" : "Sign Up"}</Text>
            
            {!isLogin && (
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
              mode="outlined"
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
            />

            {!isLogin && (
              <TextInput
                label="Phone Number (for WhatsApp)"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
              />
            )}

            <Button
              mode="contained"
              onPress={isLogin ? handleLogin : handleSignup}
              loading={loading}
              style={styles.button}
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>

            <Button
              onPress={() => setIsLogin(!isLogin)}
              style={styles.link}
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </Button>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  logoText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  formContainer: {
    width: "100%",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
  link: {
    marginTop: 15,
  },
});

export default LoginScreen;

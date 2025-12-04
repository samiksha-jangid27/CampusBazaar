// src/screens/SignupScreen.js
import React, { useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { AuthContext } from '../contexts/AuthContext';

export default function SignupScreen({ navigation }) {
  const { signup } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) return Alert.alert('Please fill all fields');
    setLoading(true);
    const res = await signup(name, email, password, phoneNumber);
    setLoading(false);
    if (res.success) {
      Alert.alert('OTP sent', 'Check your email for OTP');
      navigation.navigate('OTPVerification', { email, mode: 'signup' });
    } else {
      Alert.alert('Signup failed', res.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.box}>
        <Text variant="headlineSmall" style={styles.title}>Create Account</Text>

        <TextInput label="Full name" value={name} onChangeText={setName} style={styles.input} />
        <TextInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input} />
        <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        <TextInput label="Phone (optional)" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" style={styles.input} />

        <Button mode="contained" onPress={handleSignup} loading={loading} style={styles.button}>Send OTP</Button>
        <Button onPress={() => navigation.navigate('Login')} style={styles.link}>Already have account? Login</Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', padding:20, backgroundColor:'#fff' },
  box: { backgroundColor:'#fff' },
  title: { textAlign:'center', marginBottom:20, color:'#8B0000' },
  input: { marginBottom:12 },
  button: { marginTop:8, backgroundColor:'#8B0000' },
  link: { marginTop:12, alignSelf:'center' },
});

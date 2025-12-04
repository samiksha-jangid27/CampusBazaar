// src/screens/LoginScreen.js
import React, { useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { AuthContext } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Enter email & password');
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      // navigate to main app
    } else {
      Alert.alert('Login failed', res.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.box}>
        <Text variant="headlineSmall" style={styles.title}>Welcome back</Text>
        <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" keyboardType="email-address" />
        <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        <Button mode="contained" onPress={handleLogin} loading={loading} style={styles.button}>Login</Button>
        <Button onPress={() => navigation.navigate('ForgotPassword')} style={styles.link}>Forgot password?</Button>
        <Button onPress={() => navigation.navigate('Signup')} style={styles.link}>Create account</Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, justifyContent:'center', padding:20, backgroundColor:'#fff'},
  box:{},
  title:{textAlign:'center', marginBottom:18, color:'#8B0000'},
  input:{marginBottom:12},
  button:{backgroundColor:'#8B0000'},
  link:{marginTop:8, alignSelf:'center'}
});

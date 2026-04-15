// src/screens/ForgotPasswordScreen.js
import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { AuthContext } from '../contexts/AuthContext';

export default function ForgotPasswordScreen({ navigation }) {
  const { forgotPassword } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email) return Alert.alert('Enter your email');
    setLoading(true);
    const res = await forgotPassword(email);
    setLoading(false);
    if (res.success) {
      Alert.alert('OTP sent', 'Check your email for password reset OTP');
      navigation.navigate('ResetPassword', { email });
    } else {
      Alert.alert('Failed', res.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput label="Enter your email" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
      <Button mode="contained" onPress={handleSend} loading={loading} style={styles.button}>Send OTP</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:20,justifyContent:'center',backgroundColor:'#fff'},
  title:{textAlign:'center', marginBottom:20, color:'#8B0000'},
  input:{marginBottom:12},
  button:{backgroundColor:'#8B0000'}
});

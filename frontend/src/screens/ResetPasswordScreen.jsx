// src/screens/ResetPasswordScreen.js
import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { AuthContext } from '../contexts/AuthContext';

export default function ResetPasswordScreen({ route, navigation }) {
  const { email } = route.params;
  const { resetPassword } = useContext(AuthContext);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!otp || !newPassword) return Alert.alert('Enter OTP and new password');
    setLoading(true);
    const res = await resetPassword(email, otp, newPassword);
    setLoading(false);
    if (res.success) {
      Alert.alert('Password reset', 'You are now logged in');
      navigation.replace('MainTabs');
    } else {
      Alert.alert('Reset failed', res.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset password for {email}</Text>
      <TextInput label="OTP" value={otp} onChangeText={setOtp} keyboardType="number-pad" style={styles.input} />
      <TextInput label="New password" value={newPassword} onChangeText={setNewPassword} secureTextEntry style={styles.input} />
      <Button mode="contained" onPress={handleReset} loading={loading} style={styles.button}>Reset Password</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:20,justifyContent:'center'},
  title:{textAlign:'center', marginBottom:20, color:'#8B0000'},
  input:{marginBottom:12},
  button:{backgroundColor:'#8B0000'}
});

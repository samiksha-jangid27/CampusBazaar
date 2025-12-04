// src/screens/OTPVerificationScreen.js
import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { AuthContext } from '../contexts/AuthContext';

export default function OTPVerificationScreen({ route, navigation }) {
  const { email, mode } = route.params; // mode: 'signup' or 'reset'
  const { verifySignupOTP, resetPassword } = useContext(AuthContext);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifySignup = async () => {
    if (!otp) return Alert.alert('Enter OTP');
    setLoading(true);
    const res = await verifySignupOTP(email, otp);
    setLoading(false);
    if (res.success) {
      Alert.alert('Success', 'Your account is verified!');
      navigation.replace('MainTabs');
    } else {
      Alert.alert('Verification failed', res.message);
    }
  };

  // If you want combined screen for reset, you could call reset flow here.

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify {email}</Text>
      <TextInput label="Enter OTP" value={otp} onChangeText={setOtp} keyboardType="number-pad" style={styles.input} />
      <Button mode="contained" onPress={handleVerifySignup} loading={loading} style={styles.button}>Verify OTP</Button>
      <Button onPress={() => navigation.goBack()} style={styles.link}>Back</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, padding:20, justifyContent:'center', backgroundColor:'#fff'},
  title:{textAlign:'center', marginBottom:20, fontSize:18, color:'#8B0000'},
  input:{marginBottom:12},
  button:{backgroundColor:'#8B0000'},
  link:{marginTop:12, alignSelf:'center'}
});

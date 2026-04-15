// src/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const BASE_URL =
  Platform.OS === 'ios'
    ? 'http://127.0.0.1:3000/api'
    : 'http://10.0.2.2:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers['x-auth-token'] = token;
  return config;
}, (error) => Promise.reject(error));

export default api;

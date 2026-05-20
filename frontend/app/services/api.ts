import Constants from 'expo-constants';
import axios from 'axios';
import { Platform } from 'react-native';

const DEFAULT_API_PORT = '5141';
const ANDROID_EMULATOR_HOST = '10.0.2.2';
const REQUEST_TIMEOUT_MS = 8000;

function resolveBaseURL() {
  const hostUri = Constants.expoConfig?.hostUri ?? Constants.platform?.hostUri;
  const host = hostUri?.split(':')[0];

  if (host) {
    return `http://${host}:${DEFAULT_API_PORT}`;
  }

  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (envUrl) return envUrl;

  if (Platform.OS === 'android') {
    return `http://${ANDROID_EMULATOR_HOST}:${DEFAULT_API_PORT}`;
  }

  return `http://localhost:${DEFAULT_API_PORT}`;
}

const baseURL = resolveBaseURL();

const api = axios.create({
  baseURL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

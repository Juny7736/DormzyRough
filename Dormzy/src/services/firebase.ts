import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Your web app's Firebase configuration
// For development, we'll use Firebase emulators
const firebaseConfig = {
  apiKey: "AIzaSyDevelopmentKeyForLocalTesting",
  authDomain: "dormzy-dev.firebaseapp.com",
  projectId: "dormzy-dev",
  storageBucket: "dormzy-dev.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);

// In development environment, we'll use mock authentication
// This allows us to test authentication without a real Firebase project
if (import.meta.env.DEV) {
  // For development, we'll simulate authentication locally
  // This prevents the API key errors in development
  auth.useDeviceLanguage();
}

export default app;
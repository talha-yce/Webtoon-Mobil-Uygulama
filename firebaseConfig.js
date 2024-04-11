// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyBcFqU2Rp39OijCMpxmN89lsXB2xAdk79Q",
  authDomain: "darkton-mobil-app.firebaseapp.com",
  projectId: "darkton-mobil-app",
  storageBucket: "darkton-mobil-app.appspot.com",
  messagingSenderId: "194654423361",
  appId: "1:194654423361:web:f7a3325f92495ba997f9c0",
  measurementId: "G-81N6LPZT7D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
  const db = getFirestore(app);
  const storage = getStorage(app); 
  
  export { app, auth, db, storage }; 
  export default app;
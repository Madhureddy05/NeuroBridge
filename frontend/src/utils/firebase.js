
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDqfcX39JRrpAt-qiep-YTWs8s8BuDskgA",
  authDomain: "neurobridge-272f0.firebaseapp.com",
  projectId: "neurobridge-272f0",
  storageBucket: "neurobridge-272f0.firebasestorage.app",
  messagingSenderId: "907852432686",
  appId: "1:907852432686:web:e54ecf6b443aaa7dc926bf",
  measurementId: "G-XHJZG74794"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
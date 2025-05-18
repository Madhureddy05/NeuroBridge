import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDqfcX39JRrpAt-qiep-YTWs8s8BuDskgA",
  authDomain: "neurobridge-272f0.firebaseapp.com",
  projectId: "neurobridge-272f0",
  storageBucket: "neurobridge-272f0.firebasestorage.app",
  messagingSenderId: "907852432686",
  appId: "1:907852432686:web:e54ecf6b443aaa7dc926bf",
  measurementId: "G-XHJZG74794"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export Firebase services
export { auth, db };

// Register new user
export const registerUser = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCredential.user.uid), {
      ...userData,
      createdAt: new Date(),
    });
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Login existing user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};
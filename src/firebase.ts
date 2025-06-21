import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB_OiG0B3Lk9iDdXwAAm0YbsemFwYkDzz4",
  authDomain: "skillchain-68998.firebaseapp.com",
  projectId: "skillchain-68998",
  storageBucket: "skillchain-68998.firebasestorage.app",
  messagingSenderId: "506231580358",
  appId: "1:506231580358:web:47761638eaa4637f2ed9c7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {db}
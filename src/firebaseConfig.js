import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyALxCtf9jMsNFmNJ_-u_hi6mEZ6bP9-N3E",
  authDomain: "patrimony-app.firebaseapp.com",
  projectId: "patrimony-app",
  storageBucket: "patrimony-app.firebasestorage.app",
  messagingSenderId: "29624488452",
  appId: "1:29624488452:web:0fdb3403328da692051b51"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

signInAnonymously(auth).catch((error) => {
  console.error("Anonymous sign-in failed:", error);
});

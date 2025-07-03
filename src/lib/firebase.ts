import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  authDomain: "jbtools-1fbf2.firebaseapp.com",
  projectId: "jbtools-1fbf2",
  storageBucket: "jbtools-1fbf2.firebasestorage.app",
  messagingSenderId: "848928717988",
  appId: "1:848928717988:web:55822eaa597eafdbb0ba31",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

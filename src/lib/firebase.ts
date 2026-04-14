/* eslint-disable @typescript-eslint/no-explicit-any */
// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

/*
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
*/

// Mocking Firebase for UI testing
export const auth: any = {
  onAuthStateChanged: (cb: any) => {
    // Simulate a logged in guest for UI testing
    setTimeout(() => cb({ uid: 'mock-user', photoURL: 'https://ui-avatars.com/api/?name=Guest' }), 500);
    return () => {};
  },
  signInWithPopup: () => Promise.resolve({ user: { uid: 'mock-user' } }),
  signOut: () => Promise.resolve(),
};

export const db: any = {};
export const googleProvider: any = {};

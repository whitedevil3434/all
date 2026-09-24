import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

export const getAnonymousUser = async () => {
  try {
    const userCred = await signInAnonymously(auth);
    return userCred.user;
  } catch (err: any) {
    // If anonymous sign-in is disabled or restricted in Firebase Console, fallback to guest
    console.warn('Anonymous sign-in unavailable or restricted (auth/admin-restricted-operation). Using guest scope:', err?.message || err);
    return null;
  }
};

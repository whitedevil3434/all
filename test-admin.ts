import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
try {
  initializeApp();
  console.log("App initialized");
  const db = getFirestore();
  console.log("Firestore ready");
} catch(e) {
  console.error("Failed:", e);
}

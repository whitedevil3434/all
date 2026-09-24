import { db } from './src/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

async function check() {
  const docRef = doc(db, 'system', 'seed_status');
  const snap = await getDoc(docRef);
  console.log("Seeded:", snap.exists() ? snap.data() : "No");
  process.exit(0);
}
check();

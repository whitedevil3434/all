const fs = require('fs');
let code = fs.readFileSync('src/engine/firebase-engine.ts', 'utf-8');

const newSub = `export function subscribeToWorkEvents(workId: string, callback: (events: any[]) => void) {
  const q = query(collection(db, 'works', workId, 'events'), orderBy('timestamp', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, \`works/\${workId}/events\`);
  });
}`;

code = code + '\n' + newSub;
fs.writeFileSync('src/engine/firebase-engine.ts', code);

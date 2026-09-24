const fs = require('fs');
let code = fs.readFileSync('extracted_commands.ts', 'utf8');

code = code.replace(/app\.post\("\/api\/commands", async \(req, res\) => \{/g, `import * as admin from 'firebase-admin';
try { admin.initializeApp(); } catch(e) {}
const db = admin.firestore();
const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

export async function handleCommand(req, res) {`);

// Replace writeBatch(db) with db.batch()
code = code.replace(/writeBatch\(db\)/g, "db.batch()");

// Replace getDoc(ref) with ref.get()
code = code.replace(/await getDoc\(([^)]+)\)/g, "await $1.get()");
code = code.replace(/\.data\(\)/g, ".data()");

// Replace doc(db, '...', '...', '...') with db.collection('...').doc('...').collection('...').doc('...')
function replaceDocDirect(match, inner) {
    const parts = inner.split(',').map(s => s.trim());
    if (parts[0] !== 'db') return match;
    let out = "db";
    for(let i=1; i<parts.length; i++) {
        if (i%2 === 1) out += `.collection(${parts[i]})`;
        else out += `.doc(${parts[i]})`;
    }
    return out;
}
code = code.replace(/doc\(([^)]+)\)/g, replaceDocDirect);

// Now for collection: doc(collection(db, 'works', workId, 'events'))
function replaceDocCollection(match, inner) {
    const parts = inner.split(',').map(s => s.trim());
    if (parts[0] !== 'db') return match;
    let out = "db";
    for(let i=1; i<parts.length; i++) {
        if (i%2 === 1) out += `.collection(${parts[i]})`;
        else out += `.doc(${parts[i]})`;
    }
    return out + ".doc()";
}
code = code.replace(/doc\(collection\(([^)]+)\)\)/g, replaceDocCollection);

code = code.replace(/GUEST_UID/g, "actorId");

fs.writeFileSync('server-commands.ts', code);

const fs = require('fs');
let code = fs.readFileSync('src/engine/firebase-engine.ts', 'utf-8');

// Replace auth imports
code = code.replace("import { auth, db } from '../lib/firebase';", "import { db } from '../lib/firebase';\n// Auth removed for now, using guest user\nconst GUEST_UID = 'guest_user_123';");

// Replace auth.currentUser checks
code = code.replace(/if \(!auth\.currentUser\) throw new Error\("Not authenticated"\);\n  const uid = auth\.currentUser\.uid;/g, "const uid = GUEST_UID;");
code = code.replace(/if \(!auth\.currentUser\) return \(\) => \{\};\n  const uid = auth\.currentUser\.uid;/g, "const uid = GUEST_UID;");
code = code.replace(/if \(!auth\.currentUser\) return \(\) => \{\};\n  const q = query\(collection\(db, 'works'\), where\('authorId', '==', auth\.currentUser\.uid\), orderBy\('createdAt', 'desc'\)\);/g, "const q = query(collection(db, 'works'), where('authorId', '==', GUEST_UID), orderBy('createdAt', 'desc'));");

fs.writeFileSync('src/engine/firebase-engine.ts', code);

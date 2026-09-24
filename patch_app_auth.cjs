const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace auth imports
code = code.replace(
  "import { auth, googleAuthProvider } from './lib/firebase';\nimport { signInWithPopup, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';",
  "// Auth removed for now\ntype FirebaseUser = { uid: string; displayName?: string | null; email?: string | null };"
);

// Replace User state with hardcoded GUEST_USER
code = code.replace(
  "const [user, setUser] = useState<FirebaseUser | null>(null);",
  "const [user, setUser] = useState<FirebaseUser | null>({ uid: 'guest_user_123', displayName: 'Guest' });"
);

// Remove the auth checking effect
code = code.replace(
  /  useEffect\(\(\) => \{\n    const unsub = onAuthStateChanged\(auth, \(u\) => \{\n      setUser\(u\);\n      setIsAuthChecking\(false\);\n    \}\);\n    return \(\) => unsub\(\);\n  \}, \[\]\);\n/g,
  "  useEffect(() => { setIsAuthChecking(false); }, []);\n"
);

// Remove the "Login to continue" UI
code = code.replace(
  /  if \(\!user\) \{\n    return \([\s\S]*?    \);\n  \}\n/g,
  ""
);

// Remove the login function
code = code.replace(
  /  const login = async \(\) => \{\n    try \{\n      await signInWithPopup\(auth, googleAuthProvider\);\n    \} catch \(error\) \{\n      console\.error\("Login failed", error\);\n    \}\n  \};\n/g,
  ""
);

// Optional: Also remove the "Sign In with Google" button import if it causes issues, but we already removed `LogIn`?
// Let's just do it string replacement.

fs.writeFileSync('src/App.tsx', code);

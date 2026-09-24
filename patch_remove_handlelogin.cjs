const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  /  const handleLogin = async \(\) => \{\n    try \{\n      await signInWithPopup\(auth, googleAuthProvider\);\n    \} catch \(error\) \{\n      console\.error\("Login failed", error\);\n    \}\n  \};\n/g,
  ""
);

fs.writeFileSync('src/App.tsx', code);

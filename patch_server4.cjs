const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(/app\.listen\(PORT, "0\.0\.0\.0", \(\) => \{\n    console\.log\(\`C-Link Full-Stack Server running on port \$\{PORT\}\`\);\n  \}\);\n\}\n\nstart\(\);/g, `
// Ensure fallback is closed properly
  app.listen(PORT, "0.0.0.0", () => {
    console.log(\`C-Link Full-Stack Server running on port \$\{PORT\}\`);
  });
}

start();
`);
fs.writeFileSync('server.ts', code);

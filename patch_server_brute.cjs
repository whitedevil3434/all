const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// The issue is an extra closing brace at the end of the file
const badBlock = `
// Ensure fallback is closed properly
    app.listen(PORT, "0.0.0.0", () => {
    console.log(\`C-Link Full-Stack Server running on port \${PORT}\`);
  });
}

start();
`;

const goodBlock = `
  app.listen(PORT, "0.0.0.0", () => {
    console.log(\`C-Link Full-Stack Server running on port \${PORT}\`);
  });
}

start();
`;

code = code.replace(badBlock, goodBlock);
fs.writeFileSync('server.ts', code);

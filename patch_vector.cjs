const fs = require('fs');
let code = fs.readFileSync('src/lib/vectorMemory.ts', 'utf8');

const target = `    } else {
      console.error("Error seeding memories:", err);
    }`;

const replacement = `    } else {
      if (err?.message?.includes('offline')) {
        console.warn("Skipped seeding memories: client offline.");
      } else {
        console.error("Error seeding memories:", err);
      }
    }`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/lib/vectorMemory.ts', code);
  console.log('Patched vectorMemory.ts');
} else {
  console.log('Target not found in vectorMemory.ts');
}

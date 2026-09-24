const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// Fix Hollow State (Dependency Unknown) Neumorphism
content = content.replace(
  `  if (isHollow) {
    baseClass += ' p-5 border-2 border-dashed border-black/5 bg-neo-bg shadow-neo-down-lg relative overflow-hidden';
  }`,
  `  if (isHollow) {
    baseClass += ' p-5 border-2 border-dashed border-gray-300/50 bg-neo-bg shadow-neo-down-lg relative overflow-hidden';
  }`
);

fs.writeFileSync(path, content);
console.log("Fixed Hollow state border contrast.");

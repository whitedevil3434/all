const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(/Talk to C-Link\.\.\./g, 'Compose Reality...');

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

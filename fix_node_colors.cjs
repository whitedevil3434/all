const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// Replace neo-up styles in NodeRenderer internals
content = content.replace(/shadow-neo-up/g, 'shadow-sm');
content = content.replace(/shadow-neo-down-sm/g, '');
content = content.replace(/shadow-neo-down/g, '');
content = content.replace(/bg-neo-bg/g, 'bg-transparent');
content = content.replace(/border-white\/40/g, 'border-transparent');

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

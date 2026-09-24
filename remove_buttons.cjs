const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// Remove Ledger, Complete Reality, Abort Reality
content = content.replace(
  /\{node\.type === 'WANT' && \([\s\S]*?<\/button>\s*<\/div>\s*\)\}/,
  ''
);

content = content.replace(
  /\{node\.state !== 'RESOLVED' && node\.state !== 'FAILED' && \([\s\S]*?<\/>\s*\)\}/,
  ''
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

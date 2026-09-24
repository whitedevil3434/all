const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// Remove pointermove listeners to prevent jitter cancelling the long press
content = content.replace(/window\.addEventListener\('pointermove', clear, \{ once: true \}\);\s*/g, '');

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

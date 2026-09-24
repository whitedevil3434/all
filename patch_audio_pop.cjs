const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(/causalAudio\.playPop\(\)/g, "causalAudio.playTick()");

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

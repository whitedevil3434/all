const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(
  /setTimeout\(\(\) => \{\s*causalAudio\.playTick\(\);\s*RealityEngine\.updateNode\(parentId, \{ state: 'ASKING' \}\);\s*setTimeout\(\(\) => \{\s*causalAudio\.playTick\(\);\s*RealityEngine\.updateNode\(parentId, \{ state: 'UNKNOWN' \}\);\s*\}, 1000\);\s*\}\s*\}/g,
  `setTimeout(() => {
    causalAudio.playTick();
    RealityEngine.updateNode(parentId, { state: 'UNKNOWN' });
  }, 1000);
}
}`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

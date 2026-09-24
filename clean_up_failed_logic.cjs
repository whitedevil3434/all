const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// Also fix the other hardcoded logic block for verify fail
content = content.replace(
  /setTimeout\(\(\) => \{\s*const parentNode = RealityEngine\.getGraph\(\)\.nodes\[parentId\];\s*const newCand = getContextualActors\(parentNode\?\.label \|\| '', 1\)\[0\];\s*const newActorId = RealityEngine\.addNode\(\{\s*type: 'ACTOR',\s*label: newCand\.label,\s*state: 'POSSIBLE',\s*attention: 100,\s*data: newCand\.data\s*\}\);\s*RealityEngine\.addEdge\(parentId, newActorId, 'candidate'\);\s*RealityEngine\.updateNode\(parentId, \{ state: 'POSSIBLE' \}\);\s*causalAudio\.playSettleHarmony\(\);\s*\}, 2500\);\s*\}, 1000\);/g,
  `setTimeout(() => {
    causalAudio.playTick();
    RealityEngine.updateNode(parentId, { state: 'UNKNOWN' });
  }, 1000);`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// The failure logic was hardcoding a replacement actor (`getContextualActors`). We need to let the outcome engine handle reroutes if needed, or just revert to UNKNOWN.
content = content.replace(
  /setTimeout\(\(\) => \{\s*causalAudio\.playTick\(\);\s*RealityEngine\.updateNode\(parentId, \{ state: 'ASKING' \}\);\s*setTimeout\(\(\) => \{\s*const parentNode = RealityEngine\.getGraph\(\)\.nodes\[parentId\];\s*const newCand = getContextualActors\(parentNode\?\.label \|\| '', 1\)\[0\];\s*const newActorId = RealityEngine\.addNode\(\{\s*type: 'ACTOR',\s*label: newCand\.label,\s*state: 'POSSIBLE',\s*attention: 100,\s*data: newCand\.data\s*\}\);\s*RealityEngine\.addEdge\(parentId, newActorId, 'candidate'\);\s*RealityEngine\.updateNode\(parentId, \{ state: 'POSSIBLE' \}\);\s*\}, 2000\);\s*\}, 1000\);/g,
  `setTimeout(() => {
    causalAudio.playTick();
    RealityEngine.updateNode(parentId, { state: 'UNKNOWN' }); // Just revert to UNKNOWN, let user explore again
  }, 1000);`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

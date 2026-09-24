const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(
  /<div className=\{baseClass\}>/,
  `<div className={baseClass + ' cursor-pointer'} onClick={() => setActiveContextId(activeContextId === node.id ? null : node.id)}>`
);

// We need to stop propagation on inner buttons so clicking a button doesn't collapse the node
content = content.replace(
  /onClick=\{\(\) => \{/g,
  `onClick={(e) => { e.stopPropagation(); `
);
// But that might break things that don't have e.
// Let's manually replace the common button clicks.
content = content.replace(
  /<button\s+onClick=\{\(\) => \{\n\s+causalAudio\.playTick\(\);/g,
  `<button onClick={(e) => { e.stopPropagation(); causalAudio.playTick(); `
);

content = content.replace(
  /<button\s+onClick=\{\(\) => \{\n\s+causalAudio\.playCommitChord\(\);/g,
  `<button onClick={(e) => { e.stopPropagation(); causalAudio.playCommitChord(); `
);

content = content.replace(
  /<button\s+onClick=\{\(\) => \{\n\s+causalAudio\.playSettleHarmony\(\);/g,
  `<button onClick={(e) => { e.stopPropagation(); causalAudio.playSettleHarmony(); `
);

content = content.replace(
  /<button\s+onClick=\{\(\) => \{\n\s+const refinementPrompt/g,
  `<button onClick={(e) => { e.stopPropagation(); const refinementPrompt`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

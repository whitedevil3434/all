const fs = require('fs');
const path = './src/components/LivingCausalSurface.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('causalAudio.playAttention()', 'causalAudio.playTick()');
content = content.replace('causalAudio.playSuccess()', 'causalAudio.playCommitChord()');

fs.writeFileSync(path, content);
console.log('Patched LivingCausalSurface for Find Actor audio calls');

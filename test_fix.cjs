const fs = require('fs');
const path = './src/components/LivingCausalSurface.tsx';
let content = fs.readFileSync(path, 'utf8');

console.log(content.split('\\n').slice(975, 990).join('\\n'));

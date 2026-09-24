const fs = require('fs');
const path = './src/components/LivingCausalSurface.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  `actorName={lang === 'bn' ? 'করিম' : 'Karim'}`,
  `actorName={lang === 'bn' ? 'রহিম' : 'Rahim'}`
);

fs.writeFileSync(path, content);
console.log('Fixed Rahim name');

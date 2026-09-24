const fs = require('fs');
const path = './src/engine/causalSemanticParser.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /customWant.item === rawText.split/g,
  'customWant.item === raw.split'
);

// Also need to check if there are other instances of rawText in causalSemanticParser.ts
fs.writeFileSync(path, content);

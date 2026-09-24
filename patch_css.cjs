const fs = require('fs');
const code = fs.readFileSync('src/index.css.backup', 'utf8');
fs.writeFileSync('src/index.css', code);
console.log('Restored index.css');

const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf-8');

content = content.replace(
  /background: linear-gradient\(to bottom, rgba\(163,177,198,0\.5\) 0%, rgba\(163,177,198,0\.5\) 100%\);/g,
  'background-color: #E4E4E7;' // Zinc 200
);

content = content.replace(
  /background-color: rgba\(163,177,198,0\.5\);/g,
  'background-color: #E4E4E7;'
);

fs.writeFileSync('src/index.css', content);

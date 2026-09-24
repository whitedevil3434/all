const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(
  /<\/div>\n\s*<\/div>\n\s*\{\/\* Render children recursively \(Semantic Causal Threads\) \*\/\}/g,
  `  </div>\n      </motion.div>\n      \n      {/* Render children recursively (Semantic Causal Threads) */}`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

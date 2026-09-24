const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(
  /projectedRoots = Array\.from\(new Map\(projectedRoots\.map\(n => \[n\.id, n\]\)\)\)\.values\(\);\s*\}/,
  `projectedRoots = Array.from(new Map(projectedRoots.map(n => [n.id, n])).values());
  }
  const boardRoots = projectedRoots.filter(r => !chatNodes.has(r.id));`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

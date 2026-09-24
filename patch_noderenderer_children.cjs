const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(
  /children = Array\.from\(new Map\(children\.map\(n => \[n\.id, n\]\)\)\)\.values\(\)\);/,
  `children = Array.from(new Map(children.map(n => [n.id, n])).values());

  // If this node is NOT in chatNodes (meaning it's on the board),
  // hide any children that ARE in chatNodes (so they only appear in the chat panel).
  if (chatNodes && !chatNodes.has(node.id)) {
    children = children.filter(c => !chatNodes.has(c.id));
  }`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

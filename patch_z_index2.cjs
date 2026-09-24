const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// 1. Remove z-0 from the child wrapper
content = content.replace(
  /<div className="w-full pl-8 mt-5 flex flex-col gap-5 relative z-0">/g,
  `<div className="w-full pl-8 mt-5 flex flex-col gap-5 relative">`
);

// 2. Remove z-0 from the node wrapper
content = content.replace(
  /className=\{`node-wrapper relative \$\{isPopped \? 'z-50' : 'z-0'\}`\}/g,
  `className={\`node-wrapper relative \${isPopped ? 'z-50' : ''}\`}`
);

// 3. Remove z-0 from the layout wrapper 
content = content.replace(
  /className=\{`node-wrapper relative \$\{isExpanded \|\| activeContextId === node\.id \|\| node\.state === 'ASKING' \|\| node\.state === 'EXECUTING' \? 'node-is-focused z-10' : 'z-0'\}`\}/g,
  `className={\`node-wrapper relative \${isExpanded || activeContextId === node.id || node.state === 'ASKING' || node.state === 'EXECUTING' ? 'node-is-focused z-10' : ''}\`}`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

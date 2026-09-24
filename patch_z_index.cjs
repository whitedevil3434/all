const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// 1. Fix the stacking context trap in the recursive children wrapper
content = content.replace(
  /<div className="w-full pl-8 mt-5 flex flex-col gap-5 relative z-0">/g,
  `<div className="w-full pl-8 mt-5 flex flex-col gap-5 relative">`
);

// 2. Fix the node-wrapper explicit z-0 that might trap it
content = content.replace(
  /className=\{`node-wrapper relative \$\{isPopped \? 'z-50' : 'z-0'\}`\}/g,
  `className={\`node-wrapper relative \${isPopped ? 'z-50' : ''}\`}`
);

// 3. Move the context menu OUTSIDE the baseClass div
// Currently it is right before </div> </motion.div>
// Let's replace the injection point carefully
const oldHtml = `
          {/* Haptic Context Menu */}
          {isPopped && (
`;

// It's currently inside the inner div. We want to move it just outside it.
// Wait, I injected it replacing `</div> </motion.div> {/* Render children recursively`
// This means it IS outside the inner div!
// Let's verify exactly where it is.

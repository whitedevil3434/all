const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// Update NodeRenderer CustomEvent dispatch
content = content.replace(
  /window\.dispatchEvent\(new CustomEvent\('CLINK_SUBMIT_INTENT', \{ detail: refinementPrompt \}\)\);/g,
  `window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: { prompt: refinementPrompt, parentId: node.id } }));`
);

// Update listener
content = content.replace(
  /const handleCustomSubmit = \(e: any\) => \{\n      submitIntent\(e\.detail\);\n    \};/,
  `const handleCustomSubmit = (e: any) => {
      setPendingContextId(e.detail.parentId);
      submitIntent(e.detail.prompt);
    };`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

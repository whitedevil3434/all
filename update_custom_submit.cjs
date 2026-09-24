const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(
  /const handleCustomSubmit = \(e: any\) => \{\s*setPendingContextId\(e\.detail\.parentId\);\s*submitIntent\(e\.detail\.prompt\);\s*\};/g,
  `const handleCustomSubmit = (e: any) => {
      setPendingContextId(e.detail.parentId);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: e.detail.prompt, nodeIds: [] }]);
      setIsChatOpen(true);
      submitIntent(e.detail.prompt);
    };`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

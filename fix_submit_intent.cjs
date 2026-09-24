const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

const listener = `
  useEffect(() => {
    const handleCustomSubmit = (e: any) => {
      submitIntent(e.detail);
    };
    window.addEventListener('CLINK_SUBMIT_INTENT', handleCustomSubmit);
    return () => window.removeEventListener('CLINK_SUBMIT_INTENT', handleCustomSubmit);
  }, [submitIntent]);
`;

content = content.replace(/const activeNode = activeContextId \? graph.nodes\[activeContextId\] : null;/, listener + '\n  const activeNode = activeContextId ? graph.nodes[activeContextId] : null;');

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

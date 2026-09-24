const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// Add poppedNodeId state
content = content.replace(
  /const \[pendingContextId, setPendingContextId\] = useState<string \| null>\(null\);/,
  `const [pendingContextId, setPendingContextId] = useState<string | null>(null);
  const [poppedNodeId, setPoppedNodeId] = useState<string | null>(null);`
);

// Add event listener for CLINK_POP_NODE
content = content.replace(
  /window\.addEventListener\('CLINK_SUBMIT_INTENT', handleCustomSubmit\);/,
  `window.addEventListener('CLINK_SUBMIT_INTENT', handleCustomSubmit);
    const handlePop = (e: any) => {
      if (navigator.vibrate) navigator.vibrate([50]);
      setPoppedNodeId(e.detail.id);
    };
    window.addEventListener('CLINK_POP_NODE', handlePop);`
);
content = content.replace(
  /return \(\) => window\.removeEventListener\('CLINK_SUBMIT_INTENT', handleCustomSubmit\);/,
  `return () => {
      window.removeEventListener('CLINK_SUBMIT_INTENT', handleCustomSubmit);
      window.removeEventListener('CLINK_POP_NODE', handlePop);
    };`
);

// Pass poppedNodeId down to board NodeRenderer
content = content.replace(
  /<NodeRenderer key=\{root\.id\} node=\{root\}/g,
  `<NodeRenderer key={root.id} node={root} poppedNodeId={poppedNodeId} setPoppedNodeId={setPoppedNodeId}`
);

// Pass poppedNodeId recursively
content = content.replace(
  /<NodeRenderer node=\{child\} activeContextId=\{activeContextId\} setActiveContextId=\{setActiveContextId\} currentProjection=\{currentProjection\} onOpenProvenance=\{onOpenProvenance\} currentFrontierId=\{currentFrontierId\} \/>/g,
  `<NodeRenderer node={child} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} onOpenProvenance={onOpenProvenance} currentFrontierId={currentFrontierId} poppedNodeId={poppedNodeId} setPoppedNodeId={setPoppedNodeId} />`
);

// Add backdrop when something is popped
content = content.replace(
  /\{!\(graph && Object\.keys\(graph\.nodes\)\.length > 0\) && \(/,
  `{poppedNodeId && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[2px] transition-all"
          onClick={() => setPoppedNodeId(null)}
        />
      )}

      {!(graph && Object.keys(graph.nodes).length > 0) && (`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

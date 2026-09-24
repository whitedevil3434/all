const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// Inside NodeRenderer, add the semantic compression return block
content = content.replace(
  /const isPopped = poppedNodeId === node\.id;/,
  `const isPopped = poppedNodeId === node.id;
  const isSettled = node.state === 'COMMITTED' || node.state === 'RESOLVED';`
);

const renderChildrenBlock = `
  const isCompact = !isExpanded && (!hasSemantics || node.state === 'COMMITTED' || node.state === 'RESOLVED');

  if (isSettled) {
    return (
      <AnimatePresence>
        {children.length > 0 && children.map(child => (
          <div key={child.id} className="relative w-full mb-4">
            <NodeRenderer node={child} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} onOpenProvenance={onOpenProvenance} currentFrontierId={currentFrontierId} poppedNodeId={poppedNodeId} setPoppedNodeId={setPoppedNodeId} />
          </div>
        ))}
      </AnimatePresence>
    );
  }
`;

content = content.replace(
  /const isCompact = !isExpanded && \(!hasSemantics \|\| node\.state === 'COMMITTED' \|\| node\.state === 'RESOLVED'\);/,
  renderChildrenBlock
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

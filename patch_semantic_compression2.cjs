const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// We need to inject the early return logic for settled nodes.
// Right before `const isCompact = node.type !== 'WANT' && node.type !== 'ACTOR';`

const renderChildrenBlock = `
  if (isSettled) {
    return (
      <AnimatePresence>
        {children.length > 0 && children.map(child => (
          <div key={child.id} className="relative w-full">
            <NodeRenderer node={child} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} onOpenProvenance={onOpenProvenance} currentFrontierId={currentFrontierId} poppedNodeId={poppedNodeId} setPoppedNodeId={setPoppedNodeId} />
          </div>
        ))}
      </AnimatePresence>
    );
  }

  const isCompact = node.type !== 'WANT' && node.type !== 'ACTOR';
`;

content = content.replace(
  /const isCompact = node\.type !== 'WANT' && node\.type !== 'ACTOR';/,
  renderChildrenBlock
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

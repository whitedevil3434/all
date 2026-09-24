const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// The original NodeRenderer layout was:
/*
  return (
    <div className="flex flex-col items-center w-full">
      <motion.div 
        layout="position"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={baseClass}
      >
      ...
        </motion.div>
      
      {children.length > 0 && (
*/

// Let's replace the top part with exactly what it was, plus the wrapper:
const badReturnRegex = /return \([\s\S]*?<div className="flex items-start justify-between">/m;
const match = content.match(badReturnRegex);

if (match) {
  content = content.replace(match[0], `return (
    <div className={\`flex flex-col items-center w-full node-wrapper relative \${isExpanded || activeContextId === node.id || node.state === 'ASKING' || node.state === 'EXECUTING' ? 'node-is-focused z-10' : 'z-0'}\`}>
      <motion.div 
        layout="position"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={baseClass}
      >
        {isHollow && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/[0.03] animate-pulse pointer-events-none" />
        )}

        <div className="flex items-start justify-between">`);
}

// And the bottom part, before `{children.length > 0 && (` we need to close the top `div` (the node-wrapper).
content = content.replace(`      </motion.div>

      </div>
      
      {/* Render children recursively (Semantic Causal Threads) */}`, `      </motion.div>
      
      {/* Render children recursively (Semantic Causal Threads) */}`);

content = content.replace(`      </motion.div>

      {/* Render children recursively (Semantic Causal Threads) */}`, `      </motion.div>
      
      {/* Render children recursively (Semantic Causal Threads) */}`);
      
content = content.replace(`      {/* Render children recursively (Semantic Causal Threads) */}
      {children.length > 0 && (
        <div className="w-full pl-8 mt-5 flex flex-col gap-5 relative">
          {/* Main vertical stem inheriting parent state opacity */}
          <div className={\`absolute left-[15px] top-[-10px] bottom-[30px] w-[2px] bg-gradient-to-b from-gray-300 via-gray-200/50 to-transparent rounded-full\`} />
          <AnimatePresence>
            {children.map((child, idx) => (
              <div key={child.id} className="relative w-full">
                {/* Horizontal branch reflecting the CHILD's precise state */}
                <div className={\`absolute left-[-17px] top-[24px] w-[17px] h-[2px] rounded-full transition-all duration-500 \${getThreadClass(child.state)}\`} />
                <NodeRenderer node={child} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} onOpenProvenance={onOpenProvenance} />
              </div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}`, `      {/* Render children recursively (Semantic Causal Threads) */}
      {children.length > 0 && (
        <div className="w-full pl-8 mt-5 flex flex-col gap-5 relative">
          {/* Main vertical stem inheriting parent state opacity */}
          <div className={\`absolute left-[15px] top-[-10px] bottom-[30px] w-[2px] bg-gradient-to-b from-gray-300 via-gray-200/50 to-transparent rounded-full\`} />
          <AnimatePresence>
            {children.map((child, idx) => (
              <div key={child.id} className="relative w-full">
                {/* Horizontal branch reflecting the CHILD's precise state */}
                <div className={\`absolute left-[-17px] top-[24px] w-[17px] h-[2px] rounded-full transition-all duration-500 \${getThreadClass(child.state)}\`} />
                <NodeRenderer node={child} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} onOpenProvenance={onOpenProvenance} />
              </div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}`);

fs.writeFileSync(path, content);
console.log("Fixed wrapper layout manually.");

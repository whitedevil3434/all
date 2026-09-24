const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// Replace the entire hasSemantics block with something much simpler, or remove most of it
content = content.replace(
  /\{hasSemantics && \([\s\S]*?<\/button>\n            <\/div>\n          \)\}/,
  `{hasSemantics && isExpanded && (
            <div className="mt-2 flex flex-col gap-1 text-[11px] text-gray-500 font-medium">
              {node.data?.rationale && <div><span className="text-gray-400">Context:</span> {node.data.rationale}</div>}
              {node.type === 'ACTOR' && node.data?.proofOfReality && (
                <div className="mt-1 flex gap-3 text-emerald-600">
                   <span>RES: {node.data.proofOfReality.totalResolutions}</span>
                   <span>GRV: {node.data.proofOfReality.gravityScore}</span>
                </div>
              )}
            </div>
          )}`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

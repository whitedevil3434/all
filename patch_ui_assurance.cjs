const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// Ensure import has Lock
if (!content.includes('Lock,')) {
  content = content.replace(/import \{ Star,/, `import { Lock, Star,`);
}

const assuranceHTML = `
          {node.state === 'COMMITTED' && node.type === 'ACTOR' && (
            <div className="mt-3 flex flex-col gap-2">
              <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Lock className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider">Payment Assurance Locked</div>
                    <div className="text-xs font-semibold">{node.data?.cost || 'Amount Reserved'}</div>
                  </div>
                </div>
                <div className="text-[10px] text-emerald-600 font-medium bg-emerald-100/50 px-2 py-1 rounded">
                  ESCROW
                </div>
              </div>
              <button 
                onClick={() => setActiveContextId(activeContextId === node.id ? null : node.id)}
                className={\`text-[10px] font-bold py-1.5 px-3 rounded-md transition-colors \${activeContextId === node.id ? 'bg-indigo-600 text-white ' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}\`}
              >
                {activeContextId === node.id ? 'Close Context' : 'Open Context Menu'}
              </button>
            </div>
          )}
`;

content = content.replace(
  /\{node\.state === 'COMMITTED' && node\.type === 'ACTOR' && \([\s\S]*?<\/button>\n            <\/div>\n          \)\}/,
  assuranceHTML
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

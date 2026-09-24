const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// Find NodeRenderer
const gapRender = `
          {node.type === 'GAP' && node.data?.isClarification && (
            <div className="mt-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Answer..."
                  className="w-full bg-neo-bg rounded-lg py-2 pl-3 pr-8 text-xs border-none shadow-neo-down focus:shadow-neo-down-md focus:outline-none transition-all text-gray-700"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.currentTarget.value.trim();
                      if (val) {
                        const refinementPrompt = \`Original Intent: \${node.data.parentRationale || ''}\nClarifying: \${node.label}\nUser Answer: \${val}\n\nPlease update the reality based on this answer.\`;
                        e.currentTarget.value = '';
                        RealityEngine.updateNode(node.id, { state: 'RESOLVED' });
                        // submitIntent is not directly available here, so we could dispatch an event or pass it down.
                        // For now we can dispatch a custom event.
                        window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: refinementPrompt }));
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}

          {node.type === 'GAP' && node.data?.isActionOption && (
            <div className="mt-3">
              <button
                onClick={() => {
                   const refinementPrompt = \`Original Intent: \${node.data.parentRationale || ''}\nAction Selected: \${node.label}\n\nPlease execute this action and update reality.\`;
                   RealityEngine.updateNode(node.id, { state: 'RESOLVED' });
                   window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: refinementPrompt }));
                }}
                className="w-full text-xs font-bold py-2 px-3 rounded-lg bg-indigo-50 text-indigo-700 shadow-neo-up hover:shadow-neo-down transition-all"
              >
                {node.label}
              </button>
            </div>
          )}
`;

content = content.replace(/{node.state === 'UNKNOWN' && node.type === 'DEPENDENCY' && \(/, gapRender + '\n          {node.state === \'UNKNOWN\' && node.type === \'DEPENDENCY\' && (');

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

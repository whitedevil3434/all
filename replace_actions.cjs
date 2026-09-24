const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

const target1 = `{node.type === 'GAP' && node.data?.isActionOption && (
            <div className="mt-3">
              <button
                onClick={(e) => { e.stopPropagation(); 
                   const refinementPrompt = \`Original Intent: \${node.data.parentRationale || ''}
Action Selected: \${node.label}

Please execute this action and update reality.\`;
                   RealityEngine.updateNode(node.id, { state: 'RESOLVED' });
                   window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: { prompt: refinementPrompt, parentId: node.id } }));
                }}
                className="w-full text-[11px] font-bold py-1 text-indigo-600 bg-transparent flex items-center gap-2 hover:text-indigo-800 transition-all text-left uppercase tracking-widest"
              >
                {node.label}
              </button>
            </div>
          )}`;

const replacement = `{/* Dynamic Contextual Actions on Frontier/Active Node */}
          {(node.id === currentFrontierId || activeContextId === node.id) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {node.type === 'GAP' && !node.data?.isClarification && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: { prompt: "Find someone to resolve this", parentId: node.id } })); }} className="text-[11px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors font-medium">Find actor</button>
                  <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: { prompt: "Change this requirement", parentId: node.id } })); }} className="text-[11px] bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors font-medium">Change requirement</button>
                </>
              )}
              {node.type === 'DEPENDENCY' && node.state === 'UNKNOWN' && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: { prompt: "Find capability", parentId: node.id } })); }} className="text-[11px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors font-medium">Find capability</button>
                </>
              )}
              {node.type === 'WANT' && node.state === 'UNKNOWN' && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: { prompt: "Break this down into steps", parentId: node.id } })); }} className="text-[11px] bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors font-medium">Breakdown</button>
                </>
              )}
              {node.state === 'ASKING' && (
                <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: { prompt: "Simulate actor response", parentId: node.id } })); }} className="text-[11px] bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors font-medium">Simulate Response</button>
              )}
              {node.state === 'OFFERED' && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: { prompt: "Accept the offer", parentId: node.id } })); }} className="text-[11px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors font-medium">Accept</button>
                  <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: { prompt: "Negotiate the offer", parentId: node.id } })); }} className="text-[11px] bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors font-medium">Negotiate</button>
                </>
              )}
            </div>
          )}`;

content = content.replace(target1, replacement);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

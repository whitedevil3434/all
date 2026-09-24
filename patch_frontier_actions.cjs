const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// Replace the old action options handling in the node renderer (since they are no longer added as nodes)
content = content.replace(
  /\{node\.type === 'GAP' && node\.data\?\.isActionOption && \([\s\S]*?\}\)\]\}[\s\S]*?<\/div>[\s\S]*?\}\)/,
  `{/* Dynamic Contextual Actions on Frontier/Active Node */}
          {(node.id === currentFrontierId || activeContextId === node.id) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {node.type === 'GAP' && !node.data?.isClarification && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: { prompt: "Find someone to resolve this", parentId: node.id } })); }} className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors font-medium">Find actor</button>
                  <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: { prompt: "Change this requirement", parentId: node.id } })); }} className="text-xs bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors font-medium">Change requirement</button>
                </>
              )}
              {node.type === 'DEPENDENCY' && node.state === 'UNKNOWN' && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: { prompt: "Find capability", parentId: node.id } })); }} className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors font-medium">Find capability</button>
                </>
              )}
              {node.type === 'WANT' && node.state === 'UNKNOWN' && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: { prompt: "Break this down into steps", parentId: node.id } })); }} className="text-xs bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors font-medium">Breakdown</button>
                </>
              )}
              {node.state === 'ASKING' && (
                <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: { prompt: "Simulate actor response", parentId: node.id } })); }} className="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors font-medium">Simulate Response</button>
              )}
              {node.state === 'OFFERED' && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: { prompt: "Accept the offer", parentId: node.id } })); }} className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors font-medium">Accept</button>
                  <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('CLINK_SUBMIT_INTENT', { detail: { prompt: "Negotiate the offer", parentId: node.id } })); }} className="text-xs bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors font-medium">Negotiate</button>
                </>
              )}
            </div>
          )}`
);

// We should also remove the old hardcoded "Find {node.label}" button if there is one
content = content.replace(
  /\{!isExpanded && node\.type === 'DEPENDENCY' && node\.state === 'UNKNOWN' && \([\s\S]*?\}\)\]\}[\s\S]*?<\/button>[\s\S]*?\}\)/,
  ``
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

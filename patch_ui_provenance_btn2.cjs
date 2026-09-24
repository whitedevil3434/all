const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// I will just add the button in the VERIFYING to RESOLVED transition or under RESOLVED state
const resolvedHTML = `
          {node.state === 'RESOLVED' && (
            <div className="mt-3 flex gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  causalAudio.playSettleHarmony();
                  onOpenProvenance(node.id);
                }}
                className="w-full border border-gray-800 hover:bg-gray-900 hover:text-white text-gray-800 text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Shield className="w-3.5 h-3.5" />
                View Cryptographic Provenance
              </button>
            </div>
          )}
`;

content = content.replace(
  /\{node\.state === 'RESOLVED' && \(\s*<div className="mt-3 flex gap-2">\s*<button[\s\S]*?<\/button>\s*<\/div>\s*\)\}/,
  resolvedHTML
);

// If it didn't exist before, append it after the VERIFYING block
if (!content.includes('View Cryptographic Provenance')) {
  const verifyingEnd = /Verify & Release Payment\n               <\/button>\n            <\/div>\n          \)\}/;
  content = content.replace(verifyingEnd, `Verify & Release Payment\n               </button>\n            </div>\n          )}\n${resolvedHTML}`);
}

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

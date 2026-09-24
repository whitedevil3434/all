const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

const btnReplacement = `
            <div className="flex gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  causalAudio.playSettleHarmony();
                  setProvenanceNodeId(node.id);
                }}
                className="flex-1 border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                View Cryptographic Provenance
              </button>
            </div>
`;

content = content.replace(
  /\{node\.state === 'RESOLVED' && \(\s*<div className="mt-3 flex gap-2">\s*<button[\s\S]*?<\/button>\s*<\/div>\s*\)\}/,
  `{node.state === 'RESOLVED' && (
            <div className="mt-3 flex gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  causalAudio.playSettleHarmony();
                  setProvenanceNodeId(node.id); // Open ledger
                }}
                className="w-full border border-gray-800 hover:bg-gray-900 hover:text-white text-gray-800 text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Shield className="w-3.5 h-3.5" />
                View Cryptographic Provenance
              </button>
            </div>
          )}`
);

if (!content.includes('Shield,')) {
  content = content.replace(/import \{ Play,/, 'import { Shield, Play,');
}

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update imports
content = content.replace(
  `import { Sparkles, CheckCircle2, User, Package, AlertTriangle, ArrowRight, Loader2, Target, Focus, FileCheck } from 'lucide-react';`,
  `import { Sparkles, CheckCircle2, User, Package, AlertTriangle, ArrowRight, Loader2, Target, Focus, FileCheck, Lock, Unlock, Coins } from 'lucide-react';`
);

// 2. Insert Escrow UI before the state badge
const stateBadgeStart = `<div className={\`px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase`;

const escrowUI = `
          {/* State Badge and Escrow Orb */}
          <div className="flex items-center gap-2">
            {node.type === 'ACTOR' && ['COMMITTED', 'EXECUTING', 'VERIFYING'].includes(node.state) && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 border border-amber-200 rounded-full shadow-neo-down animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                <Lock className="w-3 h-3 text-amber-600" />
                <span className="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Escrow Locked</span>
              </div>
            )}
            {node.type === 'ACTOR' && node.state === 'RESOLVED' && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-full shadow-neo-down">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <Unlock className="w-3 h-3 text-emerald-600" />
                <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest">Funds Released</span>
              </div>
            )}
            <div className={\`px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase`;

const stateBadgeEnd = `          </div>
        </div>`;
const stateBadgeEndReplaced = `          </div>
          </div>
        </div>`;

// Replace badge start
content = content.replace(stateBadgeStart, escrowUI);

// We need to close the extra div we opened for \`flex items-center gap-2\`
content = content.replace(
  `{node.state}\n          </div>\n        </div>`,
  `{node.state}\n          </div>\n          </div>\n        </div>`
);

fs.writeFileSync(path, content);
console.log("Phase 9 (Escrow Orb) implemented.");

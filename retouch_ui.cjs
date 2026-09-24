const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add dot grid to root background
content = content.replace(
  'className="w-full min-h-screen bg-neo-bg text-[#1C1C1A] flex flex-col font-sans relative overflow-x-hidden p-6"',
  'className="w-full min-h-screen bg-neo-bg bg-dot-grid text-[#1C1C1A] flex flex-col font-sans relative overflow-x-hidden p-6"'
);

// 2. Refine node attention classes
const oldAttentionClass = `  const getAttentionClass = () => {
    if (activeContextId === node.id) return 'ring-2 ring-indigo-500 shadow-neo-up-xl scale-[1.02] bg-indigo-50/30';
    if (node.attention && node.attention > 80) return 'ring-2 ring-indigo-500/50 shadow-neo-up-xl scale-[1.02]';
    if (node.state === 'EXECUTING') return 'ring-2 ring-amber-500/50 shadow-neo-up-xl scale-[1.02] border-amber-300';
    if (node.state === 'VERIFYING') return 'ring-2 ring-purple-500/50 shadow-neo-up-xl scale-[1.02] border-purple-300';
    if (node.state === 'FAILED') return 'ring-2 ring-red-500/50 shadow-neo-up-lg scale-95 bg-red-50 opacity-60';
    if (node.state === 'COMMITTED' || node.state === 'RESOLVED') return 'opacity-90 scale-95';
    return 'shadow-neo-up-lg hover:shadow-neo-up-xl';
  };`;

const newAttentionClass = `  const getAttentionClass = () => {
    // Semantic Gravity determines scale and shadow
    if (activeContextId === node.id) return 'ring-[1.5px] ring-indigo-500 shadow-neo-up-xl scale-[1.02] bg-white';
    if (node.attention && node.attention > 80) return 'ring-[1.5px] ring-indigo-400/50 shadow-neo-up-xl scale-[1.02] bg-white';
    if (node.state === 'EXECUTING') return 'ring-[1.5px] ring-amber-400 shadow-neo-up-lg scale-[1.01] bg-white';
    if (node.state === 'VERIFYING') return 'ring-[1.5px] ring-purple-400 shadow-neo-up-lg scale-[1.01] bg-white';
    if (node.state === 'FAILED') return 'ring-[1px] ring-red-200 shadow-sm scale-95 bg-red-50/50 opacity-70 grayscale-[30%]';
    if (node.state === 'COMMITTED' || node.state === 'RESOLVED') return 'shadow-sm scale-95 opacity-80 bg-white/80';
    return 'shadow-neo-up-lg hover:shadow-neo-up-xl bg-white transition-all duration-300';
  };`;
content = content.replace(oldAttentionClass, newAttentionClass);

// 3. Refine baseClass & Hollow state
const oldBaseClass = `  let baseClass = \`w-full rounded-2xl flex flex-col gap-3 transition-all \${getAttentionClass()}\`;
  if (isHollow) {
    baseClass += ' p-5 border-2 border-dashed border-black/15 bg-black/[0.02] shadow-inner relative overflow-hidden';
  } else {
    baseClass += \` bg-neo-bg border border-white/40 \${isCompact ? 'p-3' : 'p-5'}\`;
  }`;

const newBaseClass = `  let baseClass = \`w-full rounded-2xl flex flex-col gap-3 transition-all \${getAttentionClass()}\`;
  if (isHollow) {
    baseClass += ' p-5 border-[1.5px] border-dashed border-gray-300 bg-gray-50/50 shadow-neo-down-sm relative overflow-hidden backdrop-blur-sm';
  } else {
    baseClass += \` border border-gray-100/50 \${isCompact ? 'p-4' : 'p-6'}\`;
  }`;
content = content.replace(oldBaseClass, newBaseClass);

// 4. Update the state tags to include AI cursor (✦) and sharp tracking
const oldStatusTag = `            <div className={\`px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase
            \${node.state === 'UNKNOWN' ? 'bg-gray-100 text-gray-600' : ''}
            \${node.state === 'POSSIBLE' ? 'bg-blue-100 text-blue-700' : ''}
            \${node.state === 'ASKING' ? 'bg-amber-100 text-amber-700 animate-pulse' : ''}
            \${node.state === 'OFFERED' ? 'bg-purple-100 text-purple-700' : ''}
            \${node.state === 'COMMITTED' ? 'bg-emerald-100 text-emerald-700' : ''}
            \${node.state === 'EXECUTING' ? 'bg-amber-100 text-amber-700 animate-pulse' : ''}
            \${node.state === 'VERIFYING' ? 'bg-purple-100 text-purple-700' : ''}
            \${node.state === 'RESOLVED' ? 'bg-gray-800 text-white' : ''}
            \${node.state === 'FAILED' ? 'bg-red-100 text-red-700' : ''}
          \`}>
            {node.state}
          </div>`;

const newStatusTag = `            <div className={\`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase flex items-center gap-1 border
            \${node.state === 'UNKNOWN' ? 'bg-gray-50 text-gray-500 border-gray-200' : ''}
            \${node.state === 'POSSIBLE' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
            \${node.state === 'ASKING' ? 'bg-amber-50 text-amber-600 border-amber-300 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.2)]' : ''}
            \${node.state === 'OFFERED' ? 'bg-purple-50 text-purple-600 border-purple-200' : ''}
            \${node.state === 'COMMITTED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : ''}
            \${node.state === 'EXECUTING' ? 'bg-amber-50 text-amber-600 border-amber-300 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.2)]' : ''}
            \${node.state === 'VERIFYING' ? 'bg-purple-50 text-purple-600 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]' : ''}
            \${node.state === 'RESOLVED' ? 'bg-gray-900 text-white border-gray-900 shadow-sm' : ''}
            \${node.state === 'FAILED' ? 'bg-red-50 text-red-600 border-red-200' : ''}
          \`}>
            {(node.state === 'ASKING' || node.state === 'EXECUTING' || node.state === 'VERIFYING') && <span className="text-current">✦</span>}
            {node.state}
          </div>`;
content = content.replace(oldStatusTag, newStatusTag);


// 5. Upgrade the structural recursive rendering (Causal Threads)
const oldRecursiveRender = `      {/* Render children recursively */}
      {children.length > 0 && (
        <div className="w-full pl-6 mt-3 border-l-2 border-dashed border-black/10 ml-4 flex flex-col gap-3 relative">
          <div className="absolute left-[-2px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-black/10 to-transparent" />
          <AnimatePresence>
            {children.map(child => (
              <NodeRenderer key={child.id} node={child} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} onOpenProvenance={onOpenProvenance} />
            ))}
          </AnimatePresence>
        </div>
      )}`;

const newRecursiveRender = `      {/* Render children recursively (Causal Threads) */}
      {children.length > 0 && (
        <div className="w-full pl-8 mt-5 flex flex-col gap-5 relative">
          {/* Main vertical stem */}
          <div className="absolute left-[15px] top-[-10px] bottom-[30px] w-[1.5px] bg-gradient-to-b from-gray-300 via-gray-200 to-transparent rounded-full" />
          <AnimatePresence>
            {children.map((child, idx) => (
              <div key={child.id} className="relative w-full">
                {/* Horizontal branch */}
                <div className="absolute left-[-17px] top-[24px] w-[17px] h-[1.5px] bg-gray-300 rounded-full" />
                <NodeRenderer node={child} activeContextId={activeContextId} setActiveContextId={setActiveContextId} currentProjection={currentProjection} onOpenProvenance={onOpenProvenance} />
              </div>
            ))}
          </AnimatePresence>
        </div>
      )}`;
content = content.replace(oldRecursiveRender, newRecursiveRender);

// 6. Refine Input Bar styling
const oldInput = `            className="w-full bg-white/80 backdrop-blur-md border border-black/10 rounded-full py-4 pl-6 pr-12 shadow-neo-down focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm font-medium disabled:opacity-50"`;

const newInput = `            className="w-full bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-full py-4 pl-6 pr-12 shadow-neo-up-lg focus:outline-none focus:ring-[1.5px] focus:ring-indigo-500/30 transition-all text-sm font-medium disabled:opacity-50 text-gray-800 placeholder:text-gray-400"`;
content = content.replace(oldInput, newInput);

fs.writeFileSync(path, content);
console.log("Visual refinement applied: Modern shadows, dot grid canvas, dynamic AI cursors, and causal threads.");

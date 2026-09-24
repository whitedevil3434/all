const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update the base classes for motion.div in NodeRenderer
const oldMotionDiv = `<motion.div 
        layout="position"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={\`w-full bg-neo-bg rounded-2xl p-5 border border-white/40 flex flex-col gap-3 transition-all \${getAttentionClass()}\`}
      >`;

const newMotionDiv = `  const isHollow = node.type === 'DEPENDENCY' && node.state === 'UNKNOWN';
  const isCompact = node.type === 'ACTOR' || node.type === 'EVIDENCE';
  
  let baseClass = \`w-full rounded-2xl flex flex-col gap-3 transition-all \${getAttentionClass()}\`;
  if (isHollow) {
    baseClass += ' p-5 border-2 border-dashed border-black/15 bg-black/[0.02] shadow-inner relative overflow-hidden';
  } else {
    baseClass += \` bg-neo-bg border border-white/40 \${isCompact ? 'p-3' : 'p-5'}\`;
  }

  <motion.div 
        layout="position"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={baseClass}
      >
        {isHollow && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/[0.03] animate-pulse pointer-events-none" />
        )}
`;
// Need to carefully replace just the motion.div
content = content.replace(
  `<motion.div \n        layout="position"\n        initial={{ opacity: 0, y: 20, scale: 0.95 }}\n        animate={{ opacity: 1, y: 0, scale: 1 }}\n        className={\`w-full bg-neo-bg rounded-2xl p-5 border border-white/40 flex flex-col gap-3 transition-all \${getAttentionClass()}\`}\n      >`,
  newMotionDiv
);

// 2. Make the icon smaller for compact mode
content = content.replace(
  `<div className={\`w-10 h-10 rounded-full bg-white shadow-neo-down flex items-center justify-center shrink-0\`}>`,
  `<div className={\`\${isCompact ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-white shadow-neo-down flex items-center justify-center shrink-0\`}>`
);

// 3. Make text smaller for compact mode
content = content.replace(
  `<span className="text-base font-bold text-gray-900 leading-tight">`,
  `<span className={\`font-bold text-gray-900 leading-tight \${isCompact ? 'text-sm' : 'text-base'}\`}>`
);

// 4. Update the children container to look more like a "plug" for Actors
const oldChildrenContainer = `{children.length > 0 && (
        <div className="w-full pl-6 mt-4 border-l-2 border-dashed border-black/10 ml-5 flex flex-col gap-4">
          {children.map(child => (
            <NodeRenderer key={child.id} node={child} activeContextId={activeContextId} setActiveContextId={setActiveContextId} />
          ))}
        </div>
      )}`;

const newChildrenContainer = `{children.length > 0 && (
        <div className="w-full pl-6 mt-3 border-l-2 border-dashed border-black/10 ml-4 flex flex-col gap-3 relative">
          <div className="absolute left-[-2px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-black/10 to-transparent" />
          <AnimatePresence>
            {children.map(child => (
              <NodeRenderer key={child.id} node={child} activeContextId={activeContextId} setActiveContextId={setActiveContextId} />
            ))}
          </AnimatePresence>
        </div>
      )}`;

content = content.replace(oldChildrenContainer, newChildrenContainer);

// Write changes
fs.writeFileSync(path, content);
console.log("UI updated for Hollow Slot and Compact Actors.");

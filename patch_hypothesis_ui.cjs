const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// Update Hypothesis UI Style to look like an inline chat staging card
const oldHypothesisStart = `<motion.div 
              key="hypothesis-state"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="w-full bg-neo-bg rounded-2xl p-6 shadow-neo-up-lg mt-8"
            >`;

const newHypothesisStart = `<motion.div 
              key="hypothesis-state"
              layoutId="morph-intent-card"
              initial={{ opacity: 0, y: 20, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }} 
              className="w-full max-w-3xl mx-auto bg-neo-bg rounded-3xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-white/40 mt-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>`;

content = content.replace(oldHypothesisStart, newHypothesisStart);

// Update Materialize button to say "Materialize & View in Board"
const oldMaterializeBtn = `<button 
                  onClick={() => {
                    if (hypothesis) {`;

const newMaterializeBtn = `<button 
                  onClick={() => {
                    if (hypothesis) {`;

const oldMaterializeText = `Materialize Reality
                </button>`;

const newMaterializeText = `Materialize & View in Board
                </button>`;

content = content.replace(oldMaterializeText, newMaterializeText);

// Update the node renderer to accept layoutId for WANT
const oldNodeRender = `let baseClass = \`w-full rounded-3xl flex flex-col gap-3 transition-all \${getAttentionClass()}\`;`;

const newNodeRender = `let baseClass = \`w-full rounded-3xl flex flex-col gap-3 transition-all \${getAttentionClass()}\`;
  
  // Morph connection: if this is a WANT node, give it the morph layoutId so the chat card flies into it
  const morphProps = node.type === 'WANT' ? { layoutId: "morph-intent-card" } : {};
`;

content = content.replace(oldNodeRender, newNodeRender);

const oldMotionDiv = `<motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
      layout
      className={baseClass}`;

const newMotionDiv = `<motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
      layout
      {...morphProps}
      className={baseClass}`;

content = content.replace(oldMotionDiv, newMotionDiv);

fs.writeFileSync(path, content);
console.log("Hypothesis UI Patched.");

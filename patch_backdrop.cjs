const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(
  /\{\/\* The main tree rendering \*\/\}/,
  `{/* Haptic Context Menu Backdrop */}
      {poppedNodeId && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[2px] transition-all"
          onClick={() => setPoppedNodeId(null)}
        />
      )}

      {/* The main tree rendering */}`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

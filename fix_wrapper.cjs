const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// The replacement was too aggressive/messy. We need to fix the div closures.
// First, let's just restore the file to its previous state (git checkout) since we don't have git, we'll manually patch or rewrite the specific lines.
// Or we can just use sed to fix the broken divs. Let's find the exact breakage.

content = content.replace(`        </div>
        
        {/* Actions based on state */}
        {node.type === 'WANT' && (
          <div className="mt-3 flex gap-2">
            <button 
              onClick={() => onOpenProvenance(node.id)}
              className="text-[10px] font-bold text-gray-500 bg-gray-100 py-1.5 px-3 rounded hover:bg-gray-200 transition-colors flex items-center gap-1.5"
            >`, 
            `        {/* Actions based on state */}
        {node.type === 'WANT' && (
          <div className="mt-3 flex gap-2">
            <button 
              onClick={() => onOpenProvenance(node.id)}
              className="text-[10px] font-bold text-gray-500 bg-gray-100 py-1.5 px-3 rounded hover:bg-gray-200 transition-colors flex items-center gap-1.5"
            >`);

content = content.replace(`        </div>
      
      {/* Render children recursively (Semantic Causal Threads) */}
      {children.length > 0 && (`, 
      `      </div></div>
      
      {/* Render children recursively (Semantic Causal Threads) */}
      {children.length > 0 && (`);

fs.writeFileSync(path, content);
console.log("Fixed JSX closures.");

const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(
  /<header className="py-6 px-8 flex justify-between items-center mb-8 relative z-10 border-b border-black\/5 bg-white\/50 backdrop-blur-xl sticky top-0">[\s\S]*?<\/header>/,
  `<header className="py-6 px-8 flex justify-between items-center mb-8 relative z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="text-black font-black font-serif text-xl tracking-tighter">
            C-LINK
          </div>
          <div className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[9px] font-bold tracking-widest text-emerald-600 uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE REALITY
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={currentProjection}
            onChange={(e) => {
              setCurrentProjection(e.target.value);
              setActiveContextId(null);
            }}
            className="text-xs font-bold bg-transparent border-none text-gray-400 hover:text-gray-900 cursor-pointer outline-none"
          >
            <option value="owner">System Root</option>
            {committedActors.map(actor => (
              <option key={actor.id} value={actor.id}>{actor.label} Projection</option>
            ))}
          </select>
        </div>
      </header>`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

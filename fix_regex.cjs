const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// The error is caused by Vite/esbuild misinterpreting something near line 193
// Let's replace the TransformComponent content directly using string manipulation

const badBlock = `          </TransformComponent>
          
          <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md rounded-xl p-3 shadow-neo-up-lg border border-black/5 pointer-events-none flex flex-col items-center gap-1 z-10">
             <span className="text-[9px] font-bold tracking-widest uppercase text-gray-500">Causal Map</span>
             <div className="w-16 h-16 border-2 border-dashed border-black/10 rounded-lg relative">
               <div className="absolute inset-2 bg-indigo-500/20 rounded animate-pulse" />
             </div>
          </div>
        </TransformWrapper>
      </div>`;

// Check if there are any unclosed tags or weird characters
const goodBlock = `          </TransformComponent>
          
          <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md rounded-xl p-3 shadow-neo-up-lg border border-black/5 pointer-events-none flex flex-col items-center gap-1 z-10">
             <span className="text-[9px] font-bold tracking-widest uppercase text-gray-500">Causal Map</span>
             <div className="w-16 h-16 border-2 border-dashed border-black/10 rounded-lg relative">
               <div className="absolute inset-2 bg-indigo-500/20 rounded animate-pulse"></div>
             </div>
          </div>
        </TransformWrapper>
      </div>`;

content = content.replace(badBlock, goodBlock);
fs.writeFileSync(path, content);
console.log("Fixed regex error.");

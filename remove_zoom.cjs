const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace("import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';\n", "");

const wrapperStart = `<div className="flex-1 w-full relative">
  <TransformWrapper
    initialScale={1}
    minScale={0.2}
    maxScale={3}
    centerOnInit={true}
    wheel={{ step: 0.1 }}
    limitToBounds={false}
  >
    <TransformComponent wrapperClass="!w-full !h-full !absolute !inset-0 cursor-grab active:cursor-grabbing">
      <div className="w-full min-w-[800px] flex flex-col items-center pb-32 pt-10 relative">`;
      
const wrapperStartReplacement = `<div className="flex-1 w-full max-w-2xl mx-auto flex flex-col gap-6 items-center pb-32 pt-10">`;

content = content.replace(wrapperStart, wrapperStartReplacement);

const wrapperEnd = `          </div>
        </TransformComponent>
        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md rounded-xl p-3 shadow-neo-up-lg border border-black/5 pointer-events-none flex flex-col items-center gap-1 z-10">
           <span className="text-[9px] font-bold tracking-widest uppercase text-gray-500">Causal Map</span>
           <div className="w-16 h-16 border-2 border-dashed border-black/10 rounded-lg relative">
             <div className="absolute inset-2 bg-indigo-500/20 rounded animate-pulse"></div>
           </div>
        </div>
      </TransformWrapper>
      </div>`;

const wrapperEndReplacement = `</div>`;

content = content.replace(wrapperEnd, wrapperEndReplacement);

content = content.replace(
  '<div className="w-full h-screen bg-neo-bg text-[#1C1C1A] flex flex-col font-sans relative overflow-hidden p-6">',
  '<div className="w-full min-h-screen bg-neo-bg text-[#1C1C1A] flex flex-col font-sans relative overflow-x-hidden p-6">'
);

fs.writeFileSync(path, content);
console.log("Removed Zoom-Pan and restored natural DOM flow.");

const fs = require('fs');
const path = './src/components/LivingCausalSurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// The composer container
const oldComposer = /w-full bg-white rounded-full px-4 py-2\.5 shadow-\[0_12px_40px_rgba\(0,0,0,0\.06\)\] border border-black\/\[0\.04\] flex items-center gap-3 transition-shadow hover:shadow-\[0_16px_48px_rgba\(0,0,0,0\.08\)\]/g;
const newComposer = "w-full bg-[#e0e5ec] rounded-full px-4 py-2.5 shadow-[10px_10px_20px_#bec3c9,-10px_-10px_20px_#ffffff] border border-transparent flex items-center gap-3 transition-shadow";
content = content.replace(oldComposer, newComposer);

// Additional Card states (karim_offered, all_sourced, transport_active)
const oldCardGeneric = /w-full bg-white rounded-\[26px\] p-5 shadow-\[0_12px_36px_rgba\(0,0,0,0\.06\)\] border-2/g;
const newCardGeneric = "w-full bg-[#e0e5ec] rounded-[26px] p-5 shadow-[8px_8px_16px_#bec3c9,-8px_-8px_16px_#ffffff] border-2";
content = content.replace(oldCardGeneric, newCardGeneric);

// The input element in composer
content = content.replace(
  'className="flex-1 bg-transparent text-gray-800 text-[15px] outline-none placeholder:text-gray-400 font-medium"',
  'className="flex-1 bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#bec3c9,inset_-4px_-4px_8px_#ffffff] rounded-full px-4 py-2 text-gray-800 text-[15px] outline-none placeholder:text-gray-500 font-medium"'
);

// Any other bg-white cards that were missed
content = content.replace(/bg-white shadow-\[0_8px_30px_rgba\(0,0,0,0\.04\)\]/g, 'bg-[#e0e5ec] shadow-[8px_8px_16px_#bec3c9,-8px_-8px_16px_#ffffff]');

fs.writeFileSync(path, content);
console.log('Applied additional Neumorphism to Composer and other cards');

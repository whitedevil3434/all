const fs = require('fs');
const path = './src/components/LivingCausalSurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Change main background
content = content.replace(
  'bg-[#FAF9F5]',
  'bg-[#e0e5ec]'
);
content = content.replace(
  'bg-[#FAF9F5]/90',
  'bg-[#e0e5ec]/90'
);

// 2. Change Cards (Outset)
// Find standard card patterns: bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.035)] border border-black/[0.04]
const oldCardPattern1 = /bg-white rounded-\[24px\] p-5 shadow-\[0_8px_30px_rgba\(0,0,0,0\.035\)\] border border-black\/\[0\.04\]/g;
const newCardPattern1 = "bg-[#e0e5ec] rounded-[24px] p-5 shadow-[8px_8px_16px_#bec3c9,-8px_-8px_16px_#ffffff] border border-white/40";
content = content.replace(oldCardPattern1, newCardPattern1);

// Card 3 (Gap) and Dynamic Pending Dependencies
const oldCardPattern2 = /bg-white rounded-\[24px\] p-5 shadow-\[0_8px_30px_rgba\(0,0,0,0\.035\)\] border border-amber-300\/80/g;
const newCardPattern2 = "bg-[#e0e5ec] rounded-[24px] p-5 shadow-[8px_8px_16px_#bec3c9,-8px_-8px_16px_#ffffff] border border-amber-200";
content = content.replace(oldCardPattern2, newCardPattern2);

const oldCardPattern3 = /bg-white rounded-\[26px\] p-5 shadow-\[0_12px_36px_rgba\(0,0,0,0\.05\)\] border-2 border-amber-300\/80/g;
const newCardPattern3 = "bg-[#e0e5ec] rounded-[26px] p-5 shadow-[8px_8px_16px_#bec3c9,-8px_-8px_16px_#ffffff] border-2 border-transparent relative";
content = content.replace(oldCardPattern3, newCardPattern3);

// 3. Change Composer Area
// Outer container
const oldComposerOuter = /bg-white shadow-\[0_12px_40px_rgba\(0,0,0,0\.08\)\] border border-black\/\[0\.05\]/g;
const newComposerOuter = "bg-[#e0e5ec] shadow-[12px_12px_24px_#bec3c9,-12px_-12px_24px_#ffffff] border border-white/50";
content = content.replace(oldComposerOuter, newComposerOuter);

// Input Field (Inset)
const oldComposerInput = /bg-transparent text-gray-800/g;
const newComposerInput = "bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#bec3c9,inset_-6px_-6px_12px_#ffffff] rounded-full px-4 text-gray-800";
content = content.replace(oldComposerInput, newComposerInput);

// 4. Black Buttons to Neumorphic Buttons (optional, but 50% means we might keep some black for contrast, or make them softly extruded)
// The user said "50% neumorphism ... just as it is now but in neumorphism".
// Let's change the solid black buttons to Outset Neumorphic Buttons with dark text, or keep them black but give them neumorphic glow.
// Let's make them Neumorphic Outset with dark text.
const oldBlackButton = /bg-\[#1C1C1A\] hover:bg-black text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs/g;
const newBlackButton = "bg-[#e0e5ec] text-[#1C1C1A] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[6px_6px_12px_#bec3c9,-6px_-6px_12px_#ffffff] hover:shadow-[inset_4px_4px_8px_#bec3c9,inset_-4px_-4px_8px_#ffffff]";
content = content.replace(oldBlackButton, newBlackButton);

const oldBlackButton2 = /bg-\[#1C1C1A\] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs/g;
const newBlackButton2 = "bg-[#e0e5ec] text-[#1C1C1A] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[6px_6px_12px_#bec3c9,-6px_-6px_12px_#ffffff] hover:shadow-[inset_4px_4px_8px_#bec3c9,inset_-4px_-4px_8px_#ffffff]";
content = content.replace(oldBlackButton2, newBlackButton2);

const oldBlackBtn3 = /bg-\[#1C1C1A\] hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1\.5/g;
const newBlackBtn3 = "bg-[#e0e5ec] text-[#1C1C1A] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[6px_6px_12px_#bec3c9,-6px_-6px_12px_#ffffff] hover:shadow-[inset_4px_4px_8px_#bec3c9,inset_-4px_-4px_8px_#ffffff]";
content = content.replace(oldBlackBtn3, newBlackBtn3);

// 5. Circle icons inside cards (Currently bg-[#FAF9F5]/60 border border-[#EBEBE8])
// Change to Inset Neumorphic
const oldCircleIcon = /border border-\[#EBEBE8\] bg-\[#FAF9F5\]\/60/g;
const newCircleIcon = "border-transparent bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#bec3c9,inset_-4px_-4px_8px_#ffffff]";
content = content.replace(oldCircleIcon, newCircleIcon);

// 6. Header Chips (Toggle)
const oldChipActive = /bg-\[#1C1C1A\] text-white shadow-2xs/g;
const newChipActive = "bg-[#e0e5ec] text-[#1C1C1A] font-bold shadow-[inset_4px_4px_8px_#bec3c9,inset_-4px_-4px_8px_#ffffff]";
content = content.replace(oldChipActive, newChipActive);

const oldChipInactive = /hover:bg-gray-100 text-gray-500/g;
const newChipInactive = "hover:bg-[#e0e5ec]/50 text-gray-500 hover:shadow-[2px_2px_4px_#bec3c9,-2px_-2px_4px_#ffffff]";
content = content.replace(oldChipInactive, newChipInactive);

// 7. Suggestion Chips
const oldSuggChip = /bg-white border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 shadow-2xs/g;
const newSuggChip = "bg-[#e0e5ec] border border-transparent text-gray-700 shadow-[4px_4px_8px_#bec3c9,-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_4px_#bec3c9,inset_-2px_-2px_4px_#ffffff]";
content = content.replace(oldSuggChip, newSuggChip);

fs.writeFileSync(path, content);
console.log('Applied 50% Neumorphism to LivingCausalSurface.tsx');

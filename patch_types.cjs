const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  "type NodeType = 'WANT' | 'ACTOR' | 'GAP' | 'BLOCKER' | 'SYSTEM' | 'ACTION';",
  "type NodeType = 'WANT' | 'ACTOR' | 'GAP' | 'BLOCKER' | 'SYSTEM' | 'ACTION' | 'EVIDENCE';"
);

// We need to give EVIDENCE some nice styling in the getColors function
const getColorsOld = `    case 'GAP':
      return {
        bg: 'bg-[#FFF9F9]',
        border: 'border-[#FEE2E2]',
        text: 'text-[#991B1B]',
        icon: 'text-[#DC2626]',
        badge: 'bg-[#FEF2F2] text-[#B91C1C]'
      };`;
const getColorsNew = `    case 'GAP':
      return {
        bg: 'bg-[#FFF9F9]',
        border: 'border-[#FEE2E2]',
        text: 'text-[#991B1B]',
        icon: 'text-[#DC2626]',
        badge: 'bg-[#FEF2F2] text-[#B91C1C]'
      };
    case 'EVIDENCE':
      return {
        bg: 'bg-[#F8FAFC]',
        border: 'border-[#E2E8F0]',
        text: 'text-[#0F172A]',
        icon: 'text-[#3B82F6]',
        badge: 'bg-[#EFF6FF] text-[#1D4ED8]'
      };`;
code = code.replace(getColorsOld, getColorsNew);

fs.writeFileSync('src/App.tsx', code);

const fs = require('fs');

const filesToPatch = [
  'src/components/EscrowTrackerModal.tsx',
  'src/components/LiveRouteTrackerModal.tsx',
  'src/components/PhysicalProofModal.tsx',
  'src/components/SettlementCertificateModal.tsx',
  'src/components/CausalAuditTrailModal.tsx',
  'src/components/ShareableCLinkModal.tsx',
  'src/components/ExternalActorCausalSurface.tsx',
  'src/components/LivingCausalSurface.tsx'
];

const replaceRules = [
  // Outer Background / Cards
  { old: /bg-white/g, new: 'bg-[#e0e5ec]' },
  { old: /bg-\[\#FAF9F5\]/g, new: 'bg-[#e0e5ec]' },
  
  // Shadows to Neumorphic (Outset)
  { old: /shadow-\[0_8px_32px_rgba\(0,0,0,0\.08\)\]/g, new: 'shadow-[12px_12px_24px_#bec3c9,-12px_-12px_24px_#ffffff]' },
  { old: /shadow-\[0_12px_40px_rgba\(0,0,0,0\.12\)\]/g, new: 'shadow-[12px_12px_24px_#bec3c9,-12px_-12px_24px_#ffffff]' },
  { old: /shadow-2xl/g, new: 'shadow-[16px_16px_32px_#bec3c9,-16px_-16px_32px_#ffffff]' },
  { old: /shadow-xl/g, new: 'shadow-[12px_12px_24px_#bec3c9,-12px_-12px_24px_#ffffff]' },
  { old: /shadow-lg/g, new: 'shadow-[8px_8px_16px_#bec3c9,-8px_-8px_16px_#ffffff]' },
  { old: /shadow-md/g, new: 'shadow-[6px_6px_12px_#bec3c9,-6px_-6px_12px_#ffffff]' },
  { old: /shadow-sm/g, new: 'shadow-[4px_4px_8px_#bec3c9,-4px_-4px_8px_#ffffff]' },
  { old: /shadow-xs/g, new: 'shadow-[inset_2px_2px_4px_#bec3c9,inset_-2px_-2px_4px_#ffffff]' }, 
  
  // Borders
  { old: /border-gray-200/g, new: 'border-white/40' },
  { old: /border-gray-100/g, new: 'border-white/50' },
  
  // Base App Gray Backgrounds inside Modals
  { old: /bg-gray-50/g, new: 'bg-[#e0e5ec]' },
  { old: /bg-gray-100/g, new: 'bg-[#e0e5ec]' },
];

for (const file of filesToPatch) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    for (const rule of replaceRules) {
      content = content.replace(rule.old, rule.new);
    }
    fs.writeFileSync(file, content);
    console.log('Patched:', file);
  } else {
    console.warn('File not found:', file);
  }
}

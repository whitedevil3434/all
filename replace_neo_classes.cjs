const fs = require('fs');
const path = require('path');

const filesToPatch = [
  'src/components/EscrowTrackerModal.tsx',
  'src/components/LiveRouteTrackerModal.tsx',
  'src/components/PhysicalProofModal.tsx',
  'src/components/SettlementCertificateModal.tsx',
  'src/components/CausalAuditTrailModal.tsx',
  'src/components/ShareableCLinkModal.tsx',
  'src/components/ExternalActorCausalSurface.tsx',
  'src/components/LivingCausalSurface.tsx',
  'src/App.tsx'
];

const replaceRules = [
  // Backgrounds
  { old: /bg-\[\#e0e5ec\]/g, new: 'bg-neo-bg' },

  // XL Shadows
  { old: /shadow-\[16px_16px_32px_\#bec3c9,-16px_-16px_32px_\#ffffff\]/g, new: 'shadow-neo-up-xl' },
  
  // LG Shadows
  { old: /shadow-\[12px_12px_24px_\#bec3c9,-12px_-12px_24px_\#ffffff\]/g, new: 'shadow-neo-up-lg' },
  { old: /shadow-\[10px_10px_20px_\#bec3c9,-10px_-10px_20px_\#ffffff\]/g, new: 'shadow-neo-up-lg' },
  { old: /shadow-\[8px_8px_16px_\#bec3c9,-8px_-8px_16px_\#ffffff\]/g, new: 'shadow-neo-up-lg' },
  
  // MD Shadows
  { old: /shadow-\[6px_6px_12px_\#bec3c9,-6px_-6px_12px_\#ffffff\]/g, new: 'shadow-neo-up-md' },
  
  // Base Shadows
  { old: /shadow-\[4px_4px_8px_\#bec3c9,-4px_-4px_8px_\#ffffff\]/g, new: 'shadow-neo-up' },
  { old: /shadow-\[5px_5px_10px_\#bec3c9,-5px_-5px_10px_\#ffffff\]/g, new: 'shadow-neo-up' },

  // SM Shadows
  { old: /shadow-\[2px_2px_4px_\#bec3c9,-2px_-2px_4px_\#ffffff\]/g, new: 'shadow-neo-up-sm' },
  { old: /shadow-\[3px_3px_6px_\#bec3c9,-3px_-3px_6px_\#ffffff\]/g, new: 'shadow-neo-up-sm' },

  // INSET LG Shadows
  { old: /shadow-\[inset_12px_12px_24px_\#bec3c9,inset_-12px_-12px_24px_\#ffffff\]/g, new: 'shadow-neo-down-lg' },
  { old: /shadow-\[inset_8px_8px_16px_\#bec3c9,inset_-8px_-8px_16px_\#ffffff\]/g, new: 'shadow-neo-down-lg' },
  
  // INSET MD Shadows
  { old: /shadow-\[inset_6px_6px_12px_\#bec3c9,inset_-6px_-6px_12px_\#ffffff\]/g, new: 'shadow-neo-down-md' },

  // INSET Base Shadows
  { old: /shadow-\[inset_4px_4px_8px_\#bec3c9,inset_-4px_-4px_8px_\#ffffff\]/g, new: 'shadow-neo-down' },

  // INSET SM Shadows
  { old: /shadow-\[inset_2px_2px_4px_\#bec3c9,inset_-2px_-2px_4px_\#ffffff\]/g, new: 'shadow-neo-down-sm' },
  
  // Hover states fixes (for combinations like hover:shadow-[...])
  { old: /hover:shadow-\[inset_4px_4px_8px_\#bec3c9,inset_-4px_-4px_8px_\#ffffff\]/g, new: 'hover:shadow-neo-down' },
  { old: /hover:shadow-\[inset_2px_2px_4px_\#bec3c9,inset_-2px_-2px_4px_\#ffffff\]/g, new: 'hover:shadow-neo-down-sm' },
  { old: /hover:shadow-\[2px_2px_4px_\#bec3c9,-2px_-2px_4px_\#ffffff\]/g, new: 'hover:shadow-neo-up-sm' },
  { old: /hover:shadow-\[0_12px_36px_rgba\(0,0,0,0\.05\)\]/g, new: 'hover:shadow-neo-up-xl' },
  { old: /hover:shadow-\[0_16px_48px_rgba\(0,0,0,0\.08\)\]/g, new: 'hover:shadow-neo-up-xl' }
];

for (const file of filesToPatch) {
  const fullPath = path.resolve(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    for (const rule of replaceRules) {
      content = content.replace(rule.old, rule.new);
    }
    fs.writeFileSync(fullPath, content);
    console.log('Migrated to Neo System:', file);
  } else {
    console.log('Skipping missing file:', file);
  }
}

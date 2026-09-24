const fs = require('fs');
let content = fs.readFileSync('src/engine/core/UniversalGraphStore.ts', 'utf-8');

// intercept updateNode to enforce Reality Firewall
const firewallLogic = `
  updateNode: (id: string, updates: Partial<GraphNode>, isUserAuthorized = false) => {
    // 1. Reality Firewall (Validation)
    // Prevent AI from forcing COMMITTED state directly without user authorization
    if (updates.state === 'COMMITTED' && !isUserAuthorized) {
      updates.state = 'OFFERED'; // Downgrade to offered, requires user acceptance
      console.log('🛡️ Reality Firewall: Prevented unauthorized COMMITTED state. Downgraded to OFFERED.');
    }
`;

content = content.replace(/updateNode: \(id: string, updates: Partial<GraphNode>\) => \{/, firewallLogic);

fs.writeFileSync('src/engine/core/UniversalGraphStore.ts', content);

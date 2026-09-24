const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `
              if (actorRels.length === 0) {
                 // No actors yet, check for invitations
                 const invRels = relations.filter(ir => ir.from === \`capability:\${capId}\` && ir.relation === 'HAS_INVITATION');
                 if (invRels.length > 0) {
                    invRels.forEach(ir => {
                       const invId = ir.to.replace('invitation:', '');
                       const inv = invitations.find(i => i.id === invId);
                       if (inv) {
                          actorNodes.push({
                             id: inv.id,
                             type: 'WHO' as NodeType,
                             iconName: 'Building',
                             title: \`Role: \${inv.roleName}\`,
                             statusText: inv.status === 'PENDING' ? 'INVITATION PENDING' : 'INVITED',
                             isVoid: inv.status === 'PENDING',
                             actions: (currentUserRole === 'OWNER' && inv.status === 'PENDING') ? ['COPY LINK'] : (currentUserRole === 'ACTOR' && inv.status === 'PENDING') ? ['ACCEPT INVITATION'] : [],
                             value: JSON.stringify({ invitationId: inv.id, roleName: inv.roleName })
                          });
                       }
                    });
                 } else {
                    actorNodes.push({
                       id: \`no-actor-\${capId}\`,
                       type: 'WHO' as NodeType,
                       iconName: 'UserPlus',
                       title: 'No actor yet',
                       isVoid: true,
                       actions: currentUserRole === 'OWNER' ? ['CREATE INVITATION'] : [],
                       value: JSON.stringify({ capabilityId: capId, needId: need.id })
                    });
                 }
              }
`;

code = code.replace(/if \(actorRels\.length === 0\) \{[\s\S]*?\}\n\s*\}/, replacement.trim());
fs.writeFileSync('src/App.tsx', code);

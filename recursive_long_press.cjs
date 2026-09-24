const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

content = content.replace(
  /onLongPress=\{\(dragId\) => \{[\s\S]*?causalAudio\.playSettleHarmony\(\);[\s\S]*?setChatNodes\(prev => \{[\s\S]*?const next = new Set\(prev\);[\s\S]*?next\.delete\(dragId\);[\s\S]*?return next;[\s\S]*?\}\);[\s\S]*?\}\}/,
  `onLongPress={(dragId) => {
                                      causalAudio.playSettleHarmony();
                                      
                                      const getAllDescendants = (id: string, edges: any[]): string[] => {
                                        const childrenIds = edges.filter(e => e.sourceId === id).map(e => e.targetId);
                                        let all = [...childrenIds];
                                        childrenIds.forEach(c => all = all.concat(getAllDescendants(c, edges)));
                                        return all;
                                      };
                                      const descendants = getAllDescendants(dragId, Object.values(graph.edges));
                                      
                                      setChatNodes(prev => {
                                        const next = new Set(prev);
                                        next.delete(dragId);
                                        descendants.forEach(d => next.delete(d));
                                        return next;
                                      });
                                   }}`
);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

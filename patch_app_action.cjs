const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldActionHandler = /const handleLivingSurfaceAction = \(action: string, objectId: string\) => {[\s\S]*?}, 2000\);\n    }\n  };/;

const newActionHandler = `const handleLivingSurfaceAction = (action: string, objectId: string) => {
    if (!activeReality) return;
    
    const act = action.toLowerCase();
    const currentGraph = activeReality.graph || { objects: [], relations: [] };
    const targetObj = currentGraph.objects.find(o => o.id === objectId);
    
    if (!targetObj) return;

    if (act === 'find') {
      const updatedObjects = currentGraph.objects.map(o => {
        if (o.id === objectId) {
          return { ...o, aiTransientMessage: '✦ searching for actors...', availableActions: [] };
        }
        return o;
      });
      setActiveReality({ ...activeReality, graph: { ...currentGraph, objects: updatedObjects } });
      triggerHUD('Attention', 'Discovering capabilities...', 'running');
      
      setTimeout(() => {
        const finalObjects = [...updatedObjects];
        const gap = finalObjects.find(o => o.id === objectId);
        if (gap) {
           gap.aiTransientMessage = undefined;
           gap.availableActions = ['Ask', 'Why?'];
        }
        
        const actorKarim = {
          id: 'actor-karim-' + Date.now(),
          kind: 'ACTOR' as const,
          title: 'Karim',
          state: 'POSSIBLE' as const,
          quantity: 20,
          unit: 'kg',
          provenance: 'ai_inference' as const,
          aiTransientMessage: 'Karim found',
          availableActions: ['Ask', 'Inspect']
        };
        const actorMina = {
          id: 'actor-mina-' + Date.now(),
          kind: 'ACTOR' as const,
          title: 'Mina',
          state: 'UNKNOWN' as const,
          quantity: 15,
          unit: 'kg',
          provenance: 'ai_inference' as const,
          availableActions: ['Ask', 'Inspect']
        };
        finalObjects.push(actorKarim, actorMina);
        
        const newRelations = [...currentGraph.relations];
        newRelations.push({ id: 'rel-k-' + Date.now(), fromId: objectId, toId: actorKarim.id, kind: 'candidate', visibility: 'visible' });
        newRelations.push({ id: 'rel-m-' + Date.now(), fromId: objectId, toId: actorMina.id, kind: 'candidate', visibility: 'visible' });
        
        setActiveReality({ ...activeReality, graph: { objects: finalObjects, relations: newRelations } });
      }, 1500);
    } 
    else if (act === 'ask') {
      const updatedObjects = currentGraph.objects.map(o => {
        if (o.id === objectId) {
          return { ...o, state: 'ASKING' as const, aiTransientMessage: '✦ asking...', availableActions: [] };
        }
        return o;
      });
      setActiveReality({ ...activeReality, graph: { ...currentGraph, objects: updatedObjects } });
      
      setTimeout(() => {
          const finalObjects = updatedObjects.map(o => {
            if (o.id === objectId) {
              return { ...o, state: 'OFFERED' as const, aiTransientMessage: '✦ Offered 20kg.', availableActions: ['Accept', 'Decline'] };
            }
            return o;
          });
          setActiveReality({ ...activeReality, graph: { ...currentGraph, objects: finalObjects } });
          triggerHUD('Actor Responded', 'Offer received', 'success');
      }, 2000);
    }
    else if (act === 'accept') {
      const updatedObjects = currentGraph.objects.map(o => {
        if (o.id === objectId) {
          return { ...o, state: 'COMMITTED' as const, aiTransientMessage: '✓ Commitment accepted', availableActions: ['Trace', 'Change'] };
        }
        if (o.kind === 'GAP') {
           // We might resolve the gap if it covers everything
           return { ...o, state: 'DONE' as const, aiTransientMessage: undefined };
        }
        return o;
      });
      setActiveReality({ ...activeReality, graph: { ...currentGraph, objects: updatedObjects } });
    }
  };`;

if(oldActionHandler.test(code)){
    code = code.replace(oldActionHandler, newActionHandler);
    fs.writeFileSync('src/App.tsx', code);
    console.log('Patched handleLivingSurfaceAction in App.tsx');
} else {
    console.log('Regex did not match.');
}

const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldButton = `<button className="text-xs font-bold text-indigo-600 bg-indigo-50 py-2 rounded-lg mt-2 hover:bg-indigo-100 transition-colors">
            Find {node.label}
          </button>`;

const newButton = `<button 
            onClick={() => {
              causalAudio.playTick();
              RealityEngine.updateNode(node.id, { state: 'ASKING' });
              
              // Simulate Actor Discovery (Phase 2 -> Phase 3 mapping)
              setTimeout(() => {
                causalAudio.playSettleHarmony();
                
                // Add a possible actor
                const actorId1 = RealityEngine.addNode({
                  type: 'ACTOR',
                  label: 'Candidate A',
                  state: 'POSSIBLE'
                });
                RealityEngine.addEdge(node.id, actorId1, 'candidate');
                
                const actorId2 = RealityEngine.addNode({
                  type: 'ACTOR',
                  label: 'Candidate B',
                  state: 'POSSIBLE'
                });
                RealityEngine.addEdge(node.id, actorId2, 'candidate');
                
                // Update dependency state
                RealityEngine.updateNode(node.id, { state: 'POSSIBLE' });
              }, 1500);
            }}
            className="text-xs font-bold text-indigo-600 bg-indigo-50 py-2 px-4 rounded-lg mt-2 hover:bg-indigo-100 transition-colors self-start"
          >
            Find {node.label}
          </button>`;
          
content = content.replace(oldButton, newButton);

const possibleStateHandling = `{node.state === 'POSSIBLE' && node.type === 'DEPENDENCY' && (
          <div className="text-xs text-gray-500 mt-2 font-medium">
            Candidates discovered. Waiting for assignment.
          </div>
        )}
        
        {node.state === 'POSSIBLE' && node.type === 'ACTOR' && (
          <button 
            onClick={() => {
              causalAudio.playTick();
              RealityEngine.updateNode(node.id, { state: 'ASKING' });
              setTimeout(() => {
                causalAudio.playCommitChord();
                RealityEngine.updateNode(node.id, { state: 'OFFERED' });
              }, 1500);
            }}
            className="text-xs font-bold text-emerald-600 bg-emerald-50 py-2 px-4 rounded-lg mt-2 hover:bg-emerald-100 transition-colors self-start"
          >
            Ask {node.label}
          </button>
        )}
        
        {node.state === 'OFFERED' && node.type === 'ACTOR' && (
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => {
                causalAudio.playSettleHarmony();
                RealityEngine.updateNode(node.id, { state: 'COMMITTED' });
                
                // Find parent dependency and mark it COMMITTED
                const edges = Object.values(RealityEngine.getGraph().edges);
                const parentEdge = edges.find(e => e.targetId === node.id);
                if (parentEdge) {
                  RealityEngine.updateNode(parentEdge.sourceId, { state: 'COMMITTED' });
                  
                  // Reject other candidates
                  const siblingEdges = edges.filter(e => e.sourceId === parentEdge.sourceId && e.targetId !== node.id);
                  siblingEdges.forEach(e => {
                    RealityEngine.updateNode(e.targetId, { state: 'FAILED' });
                  });
                }
              }}
              className="text-xs font-bold text-white bg-emerald-600 py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Accept Offer
            </button>
            <button 
              onClick={() => {
                RealityEngine.updateNode(node.id, { state: 'FAILED' });
              }}
              className="text-xs font-bold text-gray-500 bg-gray-100 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Decline
            </button>
          </div>
        )}`;

content = content.replace(`{node.state === 'UNKNOWN' && node.type === 'DEPENDENCY' && (`, `${possibleStateHandling}\n        {node.state === 'UNKNOWN' && node.type === 'DEPENDENCY' && (`);

// Clean up failed actors so they don't clutter the UI
const filterFailed = `const children = childEdges.map(e => graph.nodes[e.targetId]).filter(n => n && n.state !== 'FAILED');`;
content = content.replace(`const children = childEdges.map(e => graph.nodes[e.targetId]).filter(Boolean);`, filterFailed);


fs.writeFileSync(path, content);
console.log('Fixed Surface Find & Actor flow');

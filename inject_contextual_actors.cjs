const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Import generator
if (!content.includes("getContextualActors")) {
  content = content.replace(
    "import { causalAudio } from '../lib/causalAudio';",
    "import { causalAudio } from '../lib/causalAudio';\nimport { getContextualActors, getContextualEvidence } from '../lib/mockGenerators';"
  );
}

// 2. Replace ASKING -> POSSIBLE Phase mapping (Candidate Discovery)
const oldCandidateGen = `                const actorId1 = RealityEngine.addNode({
                  type: 'ACTOR',
                  label: 'Sarah Jenkins',
                  state: 'POSSIBLE',
                  data: {
                    role: 'Senior System Architect',
                    rating: 4.9,
                    successRate: '98%',
                    cost: '$120/hr',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
                  }
                });
                RealityEngine.addEdge(node.id, actorId1, 'candidate');
                
                const actorId2 = RealityEngine.addNode({
                  type: 'ACTOR',
                  label: 'Nexus Logic Bot',
                  state: 'POSSIBLE',
                  data: {
                    role: 'Automated Pipeline AI',
                    rating: 4.99,
                    successRate: '99.9%',
                    cost: '$0.05/op',
                    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nexus'
                  }
                });
                RealityEngine.addEdge(node.id, actorId2, 'candidate');`;

const newCandidateGen = `                const candidates = getContextualActors(node.label, 2);
                candidates.forEach(cand => {
                  const actorId = RealityEngine.addNode({
                    type: 'ACTOR',
                    label: cand.label,
                    state: 'POSSIBLE',
                    data: cand.data
                  });
                  RealityEngine.addEdge(node.id, actorId, 'candidate');
                });`;

if (content.includes("Sarah Jenkins")) {
  content = content.replace(oldCandidateGen, newCandidateGen);
}


// 3. Replace Auto-Heal (Decline)
const oldAltTarget1 = `                      const newActorId = RealityEngine.addNode({
                        type: 'ACTOR',
                        label: 'David Chen',
                        state: 'POSSIBLE',
                        attention: 100,
                        data: {
                          role: 'Lead Developer',
                          rating: 4.7,
                          successRate: '92%',
                          cost: '$95/hr',
                          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
                        }
                      });`;

const newAltTarget1 = `                      const parentNode = RealityEngine.getGraph().nodes[parentId];
                      const newCand = getContextualActors(parentNode?.label || '', 1)[0];
                      const newActorId = RealityEngine.addNode({
                        type: 'ACTOR',
                        label: newCand.label,
                        state: 'POSSIBLE',
                        attention: 100,
                        data: newCand.data
                      });`;

if (content.includes("David Chen")) {
  content = content.replace(oldAltTarget1, newAltTarget1);
}


// 4. Replace Auto-Heal (Reject Proof)
const oldAltTarget2 = `                            const newActorId = RealityEngine.addNode({
                              type: 'ACTOR',
                              label: 'Elena Rodriguez',
                              state: 'POSSIBLE',
                              attention: 100,
                              data: {
                                role: 'Quality Assurance Expert',
                                rating: 4.8,
                                successRate: '95%',
                                cost: '$105/hr',
                                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena'
                              }
                            });`;

const newAltTarget2 = `                            const parentNode = RealityEngine.getGraph().nodes[parentId];
                            const newCand = getContextualActors(parentNode?.label || '', 1)[0];
                            const newActorId = RealityEngine.addNode({
                              type: 'ACTOR',
                              label: newCand.label,
                              state: 'POSSIBLE',
                              attention: 100,
                              data: newCand.data
                            });`;

if (content.includes("Elena Rodriguez")) {
  content = content.replace(oldAltTarget2, newAltTarget2);
}


// 5. Contextual Evidence Submission
const oldEvidence = `                   const evidenceId = RealityEngine.addNode({
                     type: 'EVIDENCE',
                     label: 'architecture_v2.pdf',
                     state: 'VERIFYING',
                     data: {
                       fileType: 'PDF Document',
                       size: '2.4 MB',
                       timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                     }
                   });`;

const newEvidence = `                   const generatedEvidence = getContextualEvidence(node.data?.role || '');
                   const evidenceId = RealityEngine.addNode({
                     type: 'EVIDENCE',
                     label: generatedEvidence.label,
                     state: 'VERIFYING',
                     data: {
                       fileType: generatedEvidence.fileType,
                       size: generatedEvidence.size,
                       timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                     }
                   });`;

if (content.includes("architecture_v2.pdf")) {
  content = content.replace(oldEvidence, newEvidence);
}


fs.writeFileSync(path, content);
console.log("Injected Contextual Actors logic successfully.");

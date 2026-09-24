const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Inject rationale into dependencies during materialization
const oldDepGen = `                        const depId = RealityEngine.addNode({
                          type: 'DEPENDENCY',
                          label: dep.label,
                          state: 'UNKNOWN',
                          attention: 80
                        });`;
const newDepGen = `                        const depId = RealityEngine.addNode({
                          type: 'DEPENDENCY',
                          label: dep.label,
                          state: 'UNKNOWN',
                          attention: 80,
                          data: { rationale: dep.rationale }
                        });`;
content = content.replaceAll(oldDepGen, newDepGen);

// 2. Inject context into root WANT
const oldWantGen = `                      const wantId = RealityEngine.addNode({
                        type: 'WANT',
                        label: hypothesis.inferredMeaning,
                        state: 'COMMITTED',
                        attention: 50
                      });`;
const newWantGen = `                      const wantId = RealityEngine.addNode({
                        type: 'WANT',
                        label: hypothesis.inferredMeaning,
                        state: 'COMMITTED',
                        attention: 50,
                        data: { unknowns: hypothesis.unknowns }
                      });`;
content = content.replaceAll(oldWantGen, newWantGen);

// 3. Inject evidence summary
const oldEvidenceGen = `                   const evidenceId = RealityEngine.addNode({
                     type: 'EVIDENCE',
                     label: generatedEvidence.label,
                     state: 'VERIFYING',
                     data: {
                       fileType: generatedEvidence.fileType,
                       size: generatedEvidence.size,
                       timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                     }
                   });`;
const newEvidenceGen = `                   const evidenceId = RealityEngine.addNode({
                     type: 'EVIDENCE',
                     label: generatedEvidence.label,
                     state: 'VERIFYING',
                     data: {
                       fileType: generatedEvidence.fileType,
                       size: generatedEvidence.size,
                       summary: generatedEvidence.summary,
                       hash: generatedEvidence.hash,
                       timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                     }
                   });`;
content = content.replaceAll(oldEvidenceGen, newEvidenceGen);

fs.writeFileSync(path, content);
console.log("Injected semantic data payloads into GraphNode instantiation.");

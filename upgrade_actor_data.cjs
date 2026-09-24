const fs = require('fs');
const path = './src/components/DynamicRealitySurface.tsx';
let content = fs.readFileSync(path, 'utf8');

// Update imports
const importTarget = `import { Sparkles, CheckCircle2, User, Package, AlertTriangle, ArrowRight, Loader2, Target, Focus, FileCheck, Lock, Unlock, Coins, History, Key, Activity } from 'lucide-react';`;
const importReplacement = `import { Sparkles, CheckCircle2, User, Package, AlertTriangle, ArrowRight, Loader2, Target, Focus, FileCheck, Lock, Unlock, Coins, History, Key, Activity, Star, Clock, DollarSign, FileText } from 'lucide-react';`;
content = content.replace(importTarget, importReplacement);

// 1. Upgrade Candidate A and B
const candidateGenTarget = `                const actorId1 = RealityEngine.addNode({
                  type: 'ACTOR',
                  label: 'Candidate A',
                  state: 'POSSIBLE'
                });
                RealityEngine.addEdge(node.id, actorId1, 'candidate');
                
                const actorId2 = RealityEngine.addNode({
                  type: 'ACTOR',
                  label: 'Candidate B',
                  state: 'POSSIBLE'
                });`;
const candidateGenReplacement = `                const actorId1 = RealityEngine.addNode({
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
                });`;
content = content.replace(candidateGenTarget, candidateGenReplacement);

// 2. Upgrade Alternative Candidate (Decline)
const altTarget1 = `                      const newActorId = RealityEngine.addNode({
                        type: 'ACTOR',
                        label: 'Alternative Candidate',
                        state: 'POSSIBLE',
                        attention: 100
                      });`;
const altReplace1 = `                      const newActorId = RealityEngine.addNode({
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
content = content.replace(altTarget1, altReplace1);

// 3. Upgrade Replacement Candidate (Reject)
const altTarget2 = `                            const newActorId = RealityEngine.addNode({
                              type: 'ACTOR',
                              label: 'Replacement Candidate',
                              state: 'POSSIBLE',
                              attention: 100
                            });`;
const altReplace2 = `                            const newActorId = RealityEngine.addNode({
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
content = content.replace(altTarget2, altReplace2);

// 4. Upgrade Evidence
const evidenceTarget = `                   const evidenceId = RealityEngine.addNode({
                     type: 'EVIDENCE',
                     label: 'Proof of Work (Simulated)',
                     state: 'VERIFYING'
                   });`;
const evidenceReplace = `                   const evidenceId = RealityEngine.addNode({
                     type: 'EVIDENCE',
                     label: 'architecture_v2.pdf',
                     state: 'VERIFYING',
                     data: {
                       fileType: 'PDF Document',
                       size: '2.4 MB',
                       timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                     }
                   });`;
content = content.replace(evidenceTarget, evidenceReplace);

fs.writeFileSync(path, content);
console.log("Upgraded Actor and Evidence Data Payloads.");

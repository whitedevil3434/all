import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Mic, History, X, Heart, User, Hourglass, Check, AlertTriangle, Truck, Camera, Building, ReceiptText, LogIn, ShieldCheck, Monitor, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
// Auth removed for now
type FirebaseUser = { uid: string; displayName?: string | null; email?: string | null };
import { sendCommand } from './lib/api';
import { Routes, Route, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { subscribeToWorkNeeds, subscribeToWorkIntents, subscribeToWorks, createDraftIntent, subscribeToDraftIntents, promoteDraftIntent, DraftIntent, subscribeToWorkActors, subscribeToWorkGaps, subscribeToWorkEvidences, subscribeToWorkEvents, subscribeToWorkCapabilities, subscribeToWorkRelations, subscribeToGlobalActorsByIds, subscribeToWorkResponsibilities, subscribeToWorkCommitments, subscribeToWorkInvitations, subscribeToWorkExecutions, subscribeToWorkOutcomes } from './engine/firebase-engine';
import { DesktopRealitySurface, ProjectionType } from './components/DesktopRealitySurface';
import { DeliveryRequestProjection } from './components/projections/DeliveryRequestProjection';
import { CommitmentPipelineProjection } from './components/projections/CommitmentPipelineProjection';
import { ProofSubmissionProjection } from './components/projections/ProofSubmissionProjection';
import { RecipientConfirmationProjection } from './components/projections/RecipientConfirmationProjection';
import { WhyIsThisHereProjection } from './components/projections/WhyIsThisHereProjection';

// --- Types ---
type NodeType = 'WANT' | 'ACTOR' | 'GAP' | 'BLOCKER' | 'SYSTEM' | 'ACTION' | 'EVIDENCE' | 'CAN' | 'WHO' | 'RESPONSIBILITY' | 'AGREED' | 'DOING' | 'PROOF' | 'DONE' | 'FAILED';

interface RealityNode {
  id: string;
  type: NodeType;
  title: string;
  value?: string;
  subtitle?: string;
  statusText?: string;
  iconName?: string;
  details?: string[];
  actions?: string[];
  isVoid?: boolean;
  isProcessing?: boolean;
  isWarning?: boolean;
  isSuccess?: boolean;
  isDimmed?: boolean;
}

// Visual layout rows
interface ProjectionRow {
  id: string;
  type: 'single' | 'branch' | 'merge-to-single';
  nodes: RealityNode[];
}

const IconMap: Record<string, any> = {
  'Heart': Heart,
  'User': User,
  'Hourglass': Hourglass,
  'AlertTriangle': AlertTriangle,
  'Truck': Truck,
  'Camera': Camera,
  'Check': Check,
  'Building': Building,
  'ReceiptText': ReceiptText,
  'ShieldCheck': ShieldCheck,
  'Sparkles': Sparkles
};

// --- Shared Components ---
const Label = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <span className={`text-[11px] text-gray-500 tracking-[0.1em] uppercase font-medium ${className}`}>
    {children}
  </span>
);

const VLine = ({ dotted, height = "h-8" }: { dotted?: boolean, height?: string }) => (
  <motion.div layout initial={{height:0}} animate={{height:'auto'}} className={`${height} w-px ${dotted ? 'border-l-[1.5px] border-dotted border-gray-300' : 'bg-gray-200'} my-2`}></motion.div>
);

const BranchSVG = () => (
  <motion.svg initial={{opacity:0}} animate={{opacity:1}} className="w-full max-w-[540px] h-8 shrink-0 my-1 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
    <path d="M50 0 C50 50, 25 50, 25 100" stroke="#E5E7EB" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
    <path d="M50 0 C50 50, 75 50, 75 100" stroke="#E5E7EB" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
  </motion.svg>
);

const MergeSVG = () => (
  <motion.svg initial={{opacity:0}} animate={{opacity:1}} className="w-full max-w-[540px] h-8 shrink-0 my-1 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
    <path d="M25 0 C25 50, 50 50, 50 100" stroke="#E5E7EB" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
    <path d="M75 0 C75 50, 50 50, 50 100" stroke="#E5E7EB" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
  </motion.svg>
);

// --- Reality Node Component ---
const NodeCard: React.FC<{ node: RealityNode, focusedNode: string | null, onClick: (id: string) => void, onAction: (action: string, nodeId: string) => void }> = ({ node, focusedNode, onClick, onAction }) => {
  const isFocused = focusedNode === node.id;
  const IconComponent = node.iconName ? IconMap[node.iconName] : undefined;
  
  return (
    <motion.div 
      layout
      transition={{ layout: { type: "spring", bounce: 0, duration: 0.4 } }}
      id={`node-${node.id}`} 
      className={`node-wrapper flex flex-col items-center w-[45vw] sm:w-full max-w-[260px] ${isFocused ? 'node-is-focused z-20' : 'z-10'}`}
    >
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ layout: { type: "spring", bounce: 0, duration: 0.4 } }}
        onClick={(e) => { e.stopPropagation(); onClick(node.id); }}
        className={`relative w-full transition-shadow duration-300 rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]
          ${isFocused ? 'p-4 sm:p-5 scale-[1.05] ring-1 ring-gray-200 shadow-xl' : 'p-4 sm:p-5'}
          ${node.isVoid ? 'reality-void border border-dashed border-gray-300 bg-white/50' : 'bg-white'}
          ${node.isWarning ? 'bg-[#FCF7F5] border border-orange-100' : ''}
          ${node.isVoid && isFocused ? 'bg-white border-solid' : ''}
          ${node.isDimmed && !isFocused ? 'opacity-40 grayscale' : ''}
          cursor-pointer hover:shadow-md
        `}
      >
        {node.isProcessing && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-30 flex flex-col items-center justify-center rounded-[20px] sm:rounded-[24px]">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 animate-pulse mb-2" />
            <span className="text-[9px] sm:text-[10px] font-medium tracking-widest uppercase text-gray-800 animate-pulse">Orchestrating</span>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 relative z-10">
          {IconComponent && (
            <div className={`w-8 h-8 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center shrink-0 
              ${node.isWarning ? 'bg-orange-50 border-orange-200 text-orange-600' : 
                node.isSuccess ? 'bg-green-50 border-green-200 text-green-600' : 'border-gray-200 text-gray-600'}`}>
              <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
            </div>
          )}
          <div className="w-full">
            <Label>{node.type}</Label>
            <h2 className={`text-base sm:text-xl font-medium mt-0.5 text-gray-800 tracking-tight transition-all leading-tight break-words`}>{node.title}</h2>
            {node.value && <p className="text-[13px] sm:text-[15px] font-medium text-gray-800 mt-0.5">{node.value}</p>}
            {node.subtitle && <p className="text-[11px] sm:text-[13px] text-gray-500 mt-0.5">{node.subtitle}</p>}
            {node.statusText && (
              <p className={`text-[9px] sm:text-[11px] tracking-widest mt-1 font-medium uppercase
                ${node.isSuccess ? 'text-green-600' : node.isWarning ? 'text-orange-600' : 'text-gray-500'}`}>
                {node.statusText}
              </p>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isFocused && (node.details || node.actions) && (
            <motion.div 
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ opacity: { duration: 0.2 }, layout: { type: "spring", bounce: 0, duration: 0.4 } }}
              className="mt-3 sm:mt-4 border-t border-gray-100 pt-3 sm:pt-4 overflow-hidden relative z-10"
            >
              {node.details && node.details.map((detail, idx) => (
                <p key={idx} className="text-[11px] sm:text-[13px] text-gray-600 mb-1">{detail}</p>
              ))}
              
              {node.actions && node.actions.length > 0 && (
                <div className="flex flex-col gap-2 mt-3 sm:mt-4">
                  {node.actions.map((action, idx) => (
                    <button 
                      key={idx}
                      onClick={(e) => { e.stopPropagation(); onAction(action, node.value); }}
                      className="w-full bg-gray-900 text-white text-xs sm:text-sm py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium shadow-sm hover:bg-black transition-colors flex items-center justify-center gap-2"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// --- Main App ---
function MainApp() {
  const [user, setUser] = useState<FirebaseUser | null>({ uid: 'guest_user_123', displayName: 'Guest' });
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  const [activeWorkId, setActiveWorkId] = useState<string | null>(null);
  const [projectionRows, setProjectionRows] = useState<ProjectionRow[]>([]);
  const [draftIntents, setDraftIntents] = useState<DraftIntent[]>([]);
  const [intents, setIntents] = useState<any[]>([]);
  const [needs, setNeeds] = useState<any[]>([]);
  const [capabilities, setCapabilities] = useState<any[]>([]);
  const [relations, setRelations] = useState<any[]>([]);
  const [globalActors, setGlobalActors] = useState<any[]>([]);
  const [responsibilities, setResponsibilities] = useState<any[]>([]);
  const [commitments, setCommitments] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [executions, setExecutions] = useState<any[]>([]);
  const [evidences, setEvidences] = useState<any[]>([]);
  const [outcomes, setOutcomes] = useState<any[]>([]);
  const [actors, setActors] = useState<any[]>([]);

  // Simulation state
  const [currentUserRole, setCurrentUserRole] = useState<'OWNER' | 'ACTOR'>('OWNER');
  const [currentActorId, setCurrentActorId] = useState<string | null>(null);
  const [gaps, setGaps] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [inputText, setInputText] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [focusedNode, setFocusedNode] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [worksList, setWorksList] = useState<any[]>([]);
  const [viewportMode, setViewportMode] = useState<'auto' | 'desktop' | 'mobile'>('auto');
  const [isDesktopScreen, setIsDesktopScreen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const [searchParams] = useSearchParams();
  const initialView = (searchParams.get('view') as ProjectionType) || 'canvas';
  const [activeProjection, setActiveProjection] = useState<ProjectionType>(initialView);
  const [isProjectionMenuOpen, setIsProjectionMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktopScreen(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isDesktop = viewportMode === 'desktop' || (viewportMode === 'auto' && isDesktopScreen);

  useEffect(() => {
    if (user) {
      return subscribeToDraftIntents((drafts) => {
        setDraftIntents(drafts);
      });
    }
  }, [user]);

  useEffect(() => { setIsAuthChecking(false); }, []);

  useEffect(() => {
    if (user) {
      return subscribeToWorks((works) => {
        setWorksList(works);
        if (works.length > 0 && !activeWorkId) {
          // Prefer 50kg Rice consignment to match user's canonical reality, otherwise open work
          const riceWork = works.find(w => w.title && (w.title.toLowerCase().includes('rice') || w.title.includes('চাল')));
          const openWork = riceWork || works.find(w => w.status === 'OPEN') || works[0];
          setActiveWorkId(openWork.id);
        }
      });
    }
  }, [user, activeWorkId]);

  useEffect(() => {
    if (activeWorkId) {
      const unsubIntents = subscribeToWorkIntents(activeWorkId, setIntents);
      const unsubNeeds = subscribeToWorkNeeds(activeWorkId, setNeeds);
      const unsubCapabilities = subscribeToWorkCapabilities(activeWorkId, setCapabilities);
      const unsubRelations = subscribeToWorkRelations(activeWorkId, setRelations);
      const unsubActors = subscribeToWorkActors(activeWorkId, setActors);
      const unsubGaps = subscribeToWorkGaps(activeWorkId, setGaps);
      const unsubEvidences = subscribeToWorkEvidences(activeWorkId, setEvidences);
      const unsubEvents = subscribeToWorkEvents(activeWorkId, setEvents);
      const unsubResp = subscribeToWorkResponsibilities(activeWorkId, setResponsibilities);
      const unsubComm = subscribeToWorkCommitments(activeWorkId, setCommitments);
      const unsubInv = subscribeToWorkInvitations(activeWorkId, setInvitations);
      const unsubExec = subscribeToWorkExecutions(activeWorkId, setExecutions);
      const unsubOutc = subscribeToWorkOutcomes(activeWorkId, setOutcomes);
      const unsubEvid = subscribeToWorkEvidences(activeWorkId, setEvidences);
      return () => { unsubIntents(); unsubNeeds(); unsubCapabilities(); unsubRelations(); unsubActors(); unsubGaps(); unsubEvidences(); unsubEvents(); unsubResp(); unsubComm(); unsubInv(); unsubExec(); unsubOutc(); unsubEvid(); };
    }
  }, [activeWorkId]);

  useEffect(() => {
    const actorIdsToFetch: string[] = relations.filter(r => r.to && r.to.startsWith('actor:')).map(r => r.to.replace('actor:', ''));
    // Remove duplicates
    const uniqueIds: string[] = Array.from(new Set(actorIdsToFetch));
    const unsub = subscribeToGlobalActorsByIds(uniqueIds, setGlobalActors);
    return () => unsub();
  }, [relations]);

  useEffect(() => {
    if (activeWorkId) {
        // Project Canonical Intents and Needs onto the minimal surface
        const rows: any[] = [];
        
        intents.forEach(intent => {
          rows.push({
            id: `row-${intent.id}`,
            type: 'single' as const,
            nodes: [{
              id: intent.id,
              type: 'WANT',
              iconName: 'Heart',
              title: intent.title,
              subtitle: intent.subtitle || `${intent.quantity || ''} ${intent.unit || ''}`.trim(),
              details: intent.deadline ? [`Deadline: ${intent.deadline}`, `Location: ${intent.location || 'Unknown'}`] : undefined,
              actions: ['Find who can do this']
            }]
          });
        });

        needs.forEach(need => {
          rows.push({
            id: `row-${need.id}`,
            type: 'single' as const,
            nodes: [{
              id: need.id,
              type: 'WANT',
              iconName: 'Heart',
              title: need.description || 'Need',
              subtitle: `${need.quantity || ''} ${need.unit || ''}`.trim(),
              statusText: need.status,
              actions: ['Confirm Expected Delivery', ...(need.status === 'RESOLVED' ? [] : ['Find who can do this'])],
              isDimmed: need.status === 'RESOLVED'
            }]
          });

          // Causal Slice: Capability (CAN) -> Actor (WHO)
          const capRels = relations.filter(r => r.from === `need:${need.id}` && r.relation === 'REQUIRES');
          
          if (capRels.length > 0) {
            const capNodes = capRels.map(r => {
              const capId = r.to.replace('capability:', '');
              const cap = capabilities.find(c => c.id === capId);
              if (!cap) return null;
              return {
                id: cap.id,
                type: 'CAN' as NodeType,
                iconName: 'Sparkles',
                title: cap.description || 'Capability',
                subtitle: `${cap.quantity || ''} ${cap.unit || ''}`.trim(),
                statusText: cap.status
              };
            }).filter(Boolean) as RealityNode[];

            if (capNodes.length > 0) {
              rows.push({
                id: `row-caps-${need.id}`,
                type: 'branch',
                nodes: capNodes
              });
            }

            const actorNodes: RealityNode[] = [];
            capRels.forEach(r => {
              const capId = r.to.replace('capability:', '');
              const actorRels = relations.filter(ar => ar.from === `capability:${capId}` && ar.relation === 'OFFERED_BY');
              
              if (actorRels.length === 0) {
                 // No actors yet, check for invitations
                 const invRels = relations.filter(ir => ir.from === `capability:${capId}` && ir.relation === 'HAS_INVITATION');
                 if (invRels.length > 0) {
                    invRels.forEach(ir => {
                       const invId = ir.to.replace('invitation:', '');
                       const inv = invitations.find(i => i.id === invId);
                       if (inv) {
                          actorNodes.push({
                             id: inv.id,
                             type: 'WHO' as NodeType,
                             iconName: 'Building',
                             title: `Role: ${inv.roleName}`,
                             statusText: inv.status === 'PENDING' ? 'INVITATION PENDING' : 'INVITED',
                             isVoid: inv.status === 'PENDING',
                             actions: (currentUserRole === 'OWNER' && inv.status === 'PENDING') ? ['COPY LINK'] : (currentUserRole === 'ACTOR' && inv.status === 'PENDING') ? ['ACCEPT INVITATION'] : [],
                             value: JSON.stringify({ invitationId: inv.id, roleName: inv.roleName })
                          });
                       }
                    });
                 } else {
                    actorNodes.push({
                       id: `no-actor-${capId}`,
                       type: 'WHO' as NodeType,
                       iconName: 'UserPlus',
                       title: 'No actor yet',
                       isVoid: true,
                       actions: currentUserRole === 'OWNER' ? ['CREATE INVITATION'] : [],
                       value: JSON.stringify({ capabilityId: capId, needId: need.id })
                    });
                 }
              }

              actorRels.forEach(ar => {
                const actorId = ar.to.replace('actor:', '');
                const actor = globalActors.find(a => a.id === actorId);
                if (actor) {
                  actorNodes.push({
                    id: actor.id,
                    type: 'WHO' as NodeType,
                    iconName: 'User',
                    title: actor.displayName || actor.name,
                    statusText: 'STATED',
                    actions: currentUserRole === 'OWNER' ? ['Ask for commitment'] : [],
                    value: JSON.stringify({ actorId: actor.id, needId: need.id, capabilityId: capId })
                  });

                  // Check if there are responsibilities for this actor
                  const respRels = relations.filter(r => r.from === `actor:${actor.id}` && r.relation === 'HAS_RESPONSIBILITY');
                  respRels.forEach(rr => {
                     const respId = rr.to.replace('responsibility:', '');
                     const resp = responsibilities.find(r => r.id === respId && r.needId === need.id);
                     if (resp) {
                        const commRels = relations.filter(cr => cr.from === `responsibility:${respId}` && cr.relation === 'BECOMES');
                        if (commRels.length > 0) {
                           commRels.forEach(cr => {
                              const commId = cr.to.replace('commitment:', '');
                              const comm = commitments.find(c => c.id === commId);
                              if (comm) {
                                 // Now check for Executions (DRIVES)
                                 const execRels = relations.filter(er => er.from === `commitment:${comm.id}` && er.relation === 'DRIVES');
                                 
                                 if (execRels.length > 0) {
                                    execRels.forEach(er => {
                                       const execId = er.to.replace('execution:', '');
                                       const exec = executions.find(e => e.id === execId);
                                       if (exec) {
                                          // Check for Evidence (PRODUCES)
                                          const evidRels = relations.filter(evr => evr.from === `execution:${exec.id}` && evr.relation === 'PRODUCES');
                                          
                                          if (evidRels.length > 0) {
                                             evidRels.forEach(evr => {
                                                const evidId = evr.to.replace('evidence:', '');
                                                const evid = evidences.find(e => e.id === evidId);
                                                if (evid) {
                                                   // Check for Outcome (SUPPORTS)
                                                   const outcRels = relations.filter(or => or.from === `evidence:${evid.id}` && or.relation === 'SUPPORTS');
                                                   
                                                   if (outcRels.length > 0) {
                                                      outcRels.forEach(or => {
                                                         const outcId = or.to.replace('outcome:', '');
                                                         const outc = outcomes.find(o => o.id === outcId);
                                                         if (outc) {
                                                            actorNodes.push({
                                                               id: outc.id,
                                                               type: 'DONE' as NodeType,
                                                               iconName: 'CheckCircle',
                                                               title: outc.description,
                                                               statusText: outc.state,
                                                               isSuccess: outc.state === 'VERIFIED',
                                                               actions: (currentUserRole === 'OWNER' && outc.state === 'PROPOSED') ? ['VERIFY', 'REJECT'] : [],
                                                               value: JSON.stringify({ outcomeId: outc.id })
                                                            });
                                                         }
                                                      });
                                                   } else {
                                                      actorNodes.push({
                                                         id: evid.id,
                                                         type: 'PROOF' as NodeType,
                                                         iconName: 'FileText',
                                                         title: evid.description,
                                                         statusText: 'SUBMITTED',
                                                         actions: ['Submit / View Proof', ...(currentUserRole === 'OWNER' ? ['ACCEPT AS DONE'] : [])],
                                                         value: JSON.stringify({ evidenceId: evid.id, needId: need.id })
                                                      });
                                                   }
                                                }
                                             });
                                          } else {
                                             actorNodes.push({
                                                id: exec.id,
                                                type: 'DOING' as NodeType,
                                                iconName: 'Activity',
                                                title: exec.description,
                                                statusText: exec.state,
                                                isProcessing: true,
                                                actions: (currentUserRole === 'ACTOR' && currentActorId === actor.id) ? ['SUBMIT EVIDENCE'] : [],
                                                value: JSON.stringify({ executionId: exec.id })
                                             });
                                          }
                                       }
                                    });
                                 } else {
                                    actorNodes.push({
                                      id: comm.id,
                                      type: 'AGREED' as NodeType,
                                      iconName: 'Check',
                                      title: comm.terms?.description || resp.description,
                                      statusText: 'COMMITTED',
                                      isSuccess: true,
                                      actions: ['View Commitment Pipeline', ...(currentUserRole === 'ACTOR' && currentActorId === actor.id ? ['START EXECUTION'] : [])],
                                      value: JSON.stringify({ commitmentId: comm.id })
                                    });
                                 }
                              }
                           });
                        } else {
                           actorNodes.push({
                             id: resp.id,
                             type: 'RESPONSIBILITY' as NodeType,
                             iconName: 'Hourglass',
                             title: resp.description,
                             statusText: resp.status,
                             isProcessing: true,
                             actions: (currentUserRole === 'ACTOR' && currentActorId === actor.id && resp.status === 'PROPOSED') ? ['AGREE', 'DECLINE'] : [],
                             value: JSON.stringify({ responsibilityId: resp.id })
                           });
                        }
                     }
                  });
                }
              });
            });

            if (actorNodes.length > 0) {
              rows.push({
                id: `row-actors-${need.id}`,
                type: 'branch',
                nodes: actorNodes
              });
            }
          }
        });

        // Let's project Gaps and Actors as connected rows if we have them
        if (gaps.length > 0 || actors.length > 0) {
           const combinedNodes: RealityNode[] = [];
           
           actors.forEach(actor => {
             combinedNodes.push({
               id: actor.id,
               type: 'ACTOR',
               iconName: 'User',
               title: actor.name || actor.title || 'Unknown Actor',
               subtitle: actor.role || actor.subtitle || actor.quantity + ' ' + actor.unit,
               statusText: actor.status,
               actions: actor.status === 'ASKING' ? ['Accept commitment', 'Reject'] : (actor.status === 'COMMITTED' ? ['Provide evidence'] : ['Ask for commitment'])
             });
           });
           
           gaps.forEach(gap => {
             combinedNodes.push({
               id: gap.id,
               type: 'GAP',
               iconName: 'AlertTriangle',
               title: gap.title || 'Gap',
               subtitle: gap.quantity ? gap.quantity + ' ' + gap.unit : undefined,
               statusText: gap.status,
               actions: ['Why is this here?', 'Find candidates for this gap']
             });
           });
           
           if (combinedNodes.length > 0) {
             rows.push({
               id: 'row-actors-gaps',
               type: 'branch',
               nodes: combinedNodes
             });
           }
        }
        
        if (evidences.length > 0) {
           const evNodes: RealityNode[] = evidences.map(ev => ({
              id: ev.id,
              type: 'EVIDENCE',
              iconName: 'ReceiptText',
              title: ev.description || 'Evidence Provided',
              subtitle: ev.actorName || 'System',
              statusText: ev.status
           }));
           
           rows.push({
             id: 'row-evidences',
             type: 'single', // or branch if multiple
             nodes: evNodes
           });
        }
        
        setProjectionRows(rows);
    }
  }, [activeWorkId, intents, needs, actors, gaps, evidences]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [projectionRows]);


  // --- Semantic Parser Engine (The "AI") ---
  const handleAction = async (text: string, sourceNodeValue?: string) => {
    if (!text.trim()) return;

    // Fast-path for UI deterministic buttons
    if (text === 'Ask for commitment' && sourceNodeValue && activeWorkId) {
       const payload = JSON.parse(sourceNodeValue);
       await sendCommand({
                type: 'REQUEST_COMMITMENT',
                workId: activeWorkId,
                payload: {
                   actorId: payload.actorId,
                   needId: payload.needId,
                   capabilityId: payload.capabilityId,
                   description: `Supply capability for Need`
                },
                provenance: { originalText: 'UI Action: Ask for commitment' }
             });
       return;
    }

    
    if (text === 'CREATE INVITATION' && sourceNodeValue && activeWorkId) {
       const payload = JSON.parse(sourceNodeValue);
       const roleName = prompt("Enter role name (e.g. Supplier, Vendor):") || "Supplier";
       await sendCommand({
          type: 'GENERATE_INVITATION',
          workId: activeWorkId,
          payload: {
             needId: payload.needId,
             capabilityId: payload.capabilityId,
             roleName: roleName
          }
       });
       return;
    }
    if (text === 'COPY LINK' && sourceNodeValue && activeWorkId) {
       const payload = JSON.parse(sourceNodeValue);
       const link = window.location.origin + "/s/" + activeWorkId + "|" + payload.invitationId;
       navigator.clipboard.writeText(link);
       alert("Copied to clipboard: " + link);
       return;
    }
    if (text === 'ACCEPT INVITATION' && sourceNodeValue && activeWorkId) {
       const payload = JSON.parse(sourceNodeValue);
       const name = prompt("What is your name? (Creating new actor)");
       if (!name) return;
       await sendCommand({
                type: 'ACCEPT_INVITATION',
                workId: activeWorkId,
                payload: {
                   invitationId: payload.invitationId,
                   actorName: name
                },
                provenance: { originalText: 'UI Action: ACCEPT INVITATION' }
             });
       return;
    }

    if (text === 'AGREE' && sourceNodeValue && activeWorkId) {
       const payload = JSON.parse(sourceNodeValue);
       await sendCommand({
                type: 'ACCEPT_COMMITMENT',
                workId: activeWorkId,
                payload: {
                   responsibilityId: payload.responsibilityId
                },
                provenance: { originalText: 'UI Action: AGREE' }
             });
       return;
    }

    if (text === 'START EXECUTION' && sourceNodeValue && activeWorkId) {
       const payload = JSON.parse(sourceNodeValue);
       const desc = prompt("What are you starting? (e.g. 'Packing items')");
       if (!desc) return;
       await sendCommand({
                type: 'START_EXECUTION',
                workId: activeWorkId,
                payload: {
                   commitmentId: payload.commitmentId,
                   description: desc,
                   actorId: currentActorId
                },
                provenance: { originalText: 'UI Action: START EXECUTION' }
             });
       return;
    }

    if (text === 'Find replacement driver' || text === 'ASSIGN_DRIVER') {
       const targetWorkId = activeWorkId || worksList[0]?.id;
       if (targetWorkId) {
          try {
             await sendCommand({
                type: 'ASSIGN_DRIVER',
                workId: targetWorkId,
                payload: { driverName: 'Tariq M. (Toyota HiAce #DHK-4421)' },
                provenance: { originalText: 'UI Action: Find replacement driver' }
             });
          } catch (e) {
             console.warn("Server assign driver notice:", e);
          }
       }
       setAiResponse("✓ Driver Assigned: Tariq M. (Toyota HiAce #DHK-4421) · ETA 25 mins");
       setTimeout(() => setAiResponse(null), 6000);
       return;
    }

    if (text === 'SUBMIT EVIDENCE' || text === 'SUBMIT_PROOF' || text === 'Submit Physical Proof') {
       const targetWorkId = activeWorkId || worksList[0]?.id;
       if (targetWorkId) {
          try {
             let desc = "Scale Certified: 50.0kg consignment batch receipt";
             let weightKg = 50.0;
             if (sourceNodeValue) {
                try {
                   const parsed = JSON.parse(sourceNodeValue);
                   if (parsed.description) desc = parsed.description;
                   if (parsed.weightKg) weightKg = parsed.weightKg;
                } catch {}
             }
             await sendCommand({
                type: 'SUBMIT_EVIDENCE',
                workId: targetWorkId,
                payload: { description: desc, weightKg, actorId: currentActorId || 'rahim_foods' },
                provenance: { originalText: 'UI Action: SUBMIT EVIDENCE' }
             });
          } catch (e) {
             console.warn("Server submit evidence notice:", e);
          }
       }
       setAiResponse("✓ Physical Proof Certified & Attached (50.0 kg)");
       setTimeout(() => setAiResponse(null), 6000);
       return;
    }

    if (text === 'Confirm Received' || text === 'VERIFY' || text === 'CONFIRM_DELIVERY' || text === 'RESOLVE_WORK') {
       const targetWorkId = activeWorkId || worksList[0]?.id;
       if (targetWorkId) {
          try {
             await sendCommand({
                type: 'RESOLVE_WORK',
                workId: targetWorkId,
                payload: { actorId: currentActorId || 'uttara_supershop' },
                provenance: { originalText: 'UI Action: Confirm Received' }
             });
          } catch (e) {
             console.warn("Server resolve work notice:", e);
          }
       }
       setAiResponse("✓ Reality Settled: Delivery Received & Verified");
       setTimeout(() => setAiResponse(null), 6000);
       return;
    }

    if (text === 'ACCEPT AS DONE' && sourceNodeValue && activeWorkId) {
       const payload = JSON.parse(sourceNodeValue);
       await sendCommand({
                type: 'DECLARE_OUTCOME',
                workId: activeWorkId,
                payload: {
                   needId: payload.needId,
                   evidenceIds: [payload.evidenceId],
                   description: "Evidence accepted as done",
                   state: "PROPOSED",
                   actorId: currentActorId || ""
                },
                provenance: { originalText: 'UI Action: ACCEPT AS DONE' }
             });
       return;
    }
    
    if (text === 'DECLINE' && sourceNodeValue && activeWorkId) {
       // Optional: implement decline logic later
       return;
    }

    if (text === 'Why is this here?' || text === 'WHY IS THIS HERE?') {
       setActiveProjection('why');
       return;
    }
    if (text === 'View Commitment Pipeline' || text === 'Inspect Commitment' || text === 'Commitment') {
       setActiveProjection('commitment');
       return;
    }
    if (text === 'Submit / View Proof' || text === 'Proof' || text === 'SUBMIT EVIDENCE' || text === 'Physical Proof') {
       setActiveProjection('proof');
       return;
    }
    if (text === 'Expected Delivery / Confirm Receipt' || text === 'Confirm Expected Delivery' || text === 'Expected Delivery') {
       setActiveProjection('recipient');
       return;
    }
    if (text === 'Delivery Request') {
       setActiveProjection('delivery_request');
       return;
    }

    setFocusedNode(null);
    setIsProcessing(true);

    try {
      const response = await fetch('/api/c-link-compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, currentReality: { graph: { objects: projectionRows.flatMap(r => r.nodes) } } })
      });
      
      const data = await response.json();
      
      if (data.response) {
        setAiResponse(data.response);
        setTimeout(() => setAiResponse(null), 8000);
      }

      if (data.semanticAction && (data.semanticAction.type === 'CONVERSATION' || data.semanticAction.type === 'SHOW_NEXT' || data.semanticAction.type === 'NONE')) {
        // Just conversational, do not mutate graph or create draft
        console.log("Conversational intent handled.");
      } else if (data.semanticAction && data.semanticAction.type === 'ASSIGN_DRIVER') {
        await handleAction('ASSIGN_DRIVER');
      } else if (data.semanticAction && (data.semanticAction.type === 'CONFIRM_DELIVERY' || data.semanticAction.type === 'RESOLVE_WORK')) {
        await handleAction('CONFIRM_DELIVERY');
      } else if (data.semanticAction && (data.semanticAction.type === 'PROVIDE_EVIDENCE' || data.semanticAction.type === 'SUBMIT_EVIDENCE')) {
        await handleAction('SUBMIT EVIDENCE');
      } else if (data.semanticAction && data.semanticAction.type === 'PROPOSE_NEED') {
        const payload = data.semanticAction.payload || {};
        await createDraftIntent({
            description: payload.description || payload.title || text,
            quantity: payload.quantity,
            unit: payload.unit
        }, text, 'PROPOSE_NEED', activeWorkId || undefined);
      } else if (data.semanticAction && data.semanticAction.type === 'CREATE_WANT') {
        const payload = data.semanticAction.payload || {};
        await createDraftIntent({
            title: payload.title || text,
            quantity: payload.quantity,
            unit: payload.unit,
            subtitle: payload.subtitle,
            deadline: payload.deadline,
            location: payload.location
        }, text, 'CREATE_WORK');
      } else if (data.semanticAction && data.semanticAction.type === 'DISCOVER_ACTOR') {
        const payload = data.semanticAction.payload || {};
        await createDraftIntent({
            name: data.semanticAction.targetActorName || payload.title || text,
            quantity: payload.quantity,
            unit: payload.unit,
            role: payload.role || 'Supplier'
        }, text, 'ADD_ACTOR', activeWorkId || undefined);
      } else if (data.semanticAction && data.semanticAction.type === 'IDENTIFY_GAP') {
        const payload = data.semanticAction.payload || {};
        await createDraftIntent({
            title: payload.title || text,
            quantity: payload.quantity,
            unit: payload.unit
        }, text, 'CREATE_GAP', activeWorkId || undefined);
      } else if (data.semanticAction && (data.semanticAction.type === 'ASK_ACTOR' || data.semanticAction.type === 'ACCEPT_COMMITMENT')) {
        const actorName = data.semanticAction.targetActorName;
        const targetActor = actors.find(a => a.name === actorName || a.title === actorName);
        if (targetActor) {
           const newStatus = data.semanticAction.type === 'ASK_ACTOR' ? 'ASKING' : 'COMMITTED';
           await createDraftIntent({
              status: newStatus,
              name: actorName
           }, text, 'UPDATE_ACTOR', activeWorkId || undefined, targetActor.id);
        } else {
           await createDraftIntent({
              title: data.transientObservation || text,
              subtitle: 'Actor not found for status update'
           }, text, 'UNKNOWN', activeWorkId || undefined);
        }
      } else if (data.semanticAction && data.semanticAction.type === 'PROVIDE_EVIDENCE') {
        const payload = data.semanticAction.payload || {};
        const actorName = data.semanticAction.targetActorName;
        const targetActor = actorName ? actors.find(a => a.name === actorName || a.title === actorName) : undefined;
        await createDraftIntent({
            description: payload.description || text,
            actorName: targetActor ? targetActor.name : undefined
        }, text, 'ADD_EVIDENCE', activeWorkId || undefined, targetActor ? targetActor.id : undefined);
      } else if (data.semanticAction && data.semanticAction.type === 'RESOLVE_WORK') {
        await createDraftIntent({
            title: "Mark Work as Resolved",
            subtitle: "All requirements met"
        }, text, 'RESOLVE_WORK', activeWorkId || undefined);
      } else {
        // Fallback for unknown intent
        await createDraftIntent({
          title: data.transientObservation || text,
          subtitle: 'AI Inference',
        }, text, 'UNKNOWN', activeWorkId || undefined);
      }
    } catch (error) {
      console.error("Orchestration error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePromoteDraft = async (draft: DraftIntent) => {
    if (draft.mutationType === 'PROPOSE_NEED') { 
      const data = await sendCommand({ 
        type: 'DECLARE_NEED', 
        proposalId: draft.id, 
        workId: activeWorkId || undefined, 
        payload: { 
          description: draft.interpretation.description || draft.interpretation.title || 'Need', 
          quantity: draft.interpretation.quantity, 
          unit: draft.interpretation.unit 
        }, 
        provenance: draft.provenance 
      }); 
      if (data && data.success && data.workId) { setActiveWorkId(data.workId); } 
    } else if (draft.mutationType === 'PROPOSE_OFFER') {
      if (!activeWorkId) { alert("Please start a Work first."); return; }
      const currentNeedId = needs.length > 0 ? needs[0].id : null;
      if (!currentNeedId) { alert("No active Need found."); return; }
      
      const data = await sendCommand({ 
        type: 'DECLARE_OFFER', 
        proposalId: draft.id, 
        workId: activeWorkId, 
        payload: { 
          actorName: draft.interpretation.actorName, 
          capabilityDescription: draft.interpretation.capabilityDescription, 
          quantity: draft.interpretation.quantity, 
          unit: draft.interpretation.unit, 
          needId: currentNeedId 
        }, 
        provenance: draft.provenance 
      });
      if (data && data.success) { console.log("Offer declared", data); } else { alert("Failed: " + (data?.error || "Unknown error")); }
    } else { 
      const newWorkId = await promoteDraftIntent(draft.id, draft);
      if (newWorkId) setActiveWorkId(newWorkId); 
    }
  };

  if (isAuthChecking) return <div className="h-screen w-full flex items-center justify-center bg-[#FCFAF8]"><Sparkles className="animate-pulse text-gray-300" /></div>;

  return (
    <div className="h-screen w-full relative">
      <DesktopRealitySurface
        activeWorkId={activeWorkId}
        setActiveWorkId={setActiveWorkId}
        worksList={worksList}
        intents={intents}
        needs={needs}
        capabilities={capabilities}
        actors={actors}
        gaps={gaps}
        relations={relations}
        commitments={commitments}
        responsibilities={responsibilities}
        evidences={evidences}
        events={events}
        draftIntents={draftIntents}
        onAction={handleAction}
        aiResponse={aiResponse}
        isProcessing={isProcessing}
        onOpenLedger={() => setShowAuditTrail(true)}
        onPromoteDraft={handlePromoteDraft}
        onSwitchToMobile={() => setViewportMode('mobile')}
        activeProjection={activeProjection}
        onSelectProjection={setActiveProjection}
        currentUserRole={currentUserRole}
        setCurrentUserRole={setCurrentUserRole}
        globalActors={globalActors}
        currentActorId={currentActorId}
        setCurrentActorId={setCurrentActorId}
      />

      {/* Audit Trail Panel */}
      {showAuditTrail && (
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[320px] bg-white border-l border-gray-100 shadow-2xl z-50 flex flex-col transform transition-transform">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xs font-bold tracking-widest text-gray-900 uppercase">Canonical Events</h2>
            <button onClick={() => setShowAuditTrail(false)} className="text-gray-400 hover:text-gray-900">
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {events.length === 0 ? (
              <div className="text-xs text-gray-400 text-center mt-10">No events yet.</div>
            ) : (
              events.map((ev, i) => (
                <div key={ev.id} className="flex gap-4 relative">
                  {i !== events.length - 1 && (
                    <div className="absolute left-[7px] top-[24px] bottom-[-24px] w-[2px] bg-gray-50"></div>
                  )}
                  <div className="w-4 h-4 rounded-full bg-blue-50 border-2 border-blue-500 shrink-0 mt-1 z-10"></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-900 tracking-wide uppercase">{ev.type.replace('.', ' ')}</span>
                    <span className="text-[13px] text-gray-500 mt-1 leading-relaxed">
                      {ev.type === 'work.created' && 'Work initialized.'}
                      {ev.type === 'intent.declared' && (ev.payload?.description || 'Intent declared')}
                      {ev.type === 'need.declared' && (ev.payload?.description || 'Need declared')}
                      {ev.type === 'actor.proposed' && `Actor proposed: ${ev.payload?.name || 'Unknown'}`}
                      {ev.type === 'actor.updated' && `Status changed to ${ev.payload?.status || 'Unknown'}`}
                      {ev.type === 'commitment.formed' && `Commitment agreed: ${ev.payload?.description || 'Terms formed'}`}
                      {ev.type === 'gap.detected' && `Causal gap identified: ${ev.payload?.description || 'Driver needed'}`}
                      {ev.type === 'gap.resolved' && `Causal gap resolved: ${ev.payload?.description || 'Driver assigned'}`}
                      {ev.type === 'evidence.provided' && `Proof: ${ev.payload?.description || 'Documented'}`}
                      {ev.type === 'work.resolved' && 'Consignment officially resolved & settled.'}
                      {!['work.created', 'intent.declared', 'need.declared', 'actor.proposed', 'actor.updated', 'commitment.formed', 'gap.detected', 'gap.resolved', 'evidence.provided', 'work.resolved'].includes(ev.type) && (ev.payload?.description || JSON.stringify(ev.payload || ''))}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono mt-2">
                      {ev.timestamp?.toDate ? ev.timestamp.toDate().toLocaleTimeString() : 'Just now'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route path="/s/:invitationId" element={<InvitationView />} />
    </Routes>
  );
}


function InvitationView() {
  const { invitationId: token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [invContext, setInvContext] = React.useState<any>(null);
  
  React.useEffect(() => {
    async function fetchInv() {
      if (!token) return;
      const [workId, invId] = token.split('|');
      if (!workId || !invId) return;
      // We can just fetch via API, or if read rules allow, we can read directly via Firebase!
      try {
         const res = await fetch('/api/invitation-context?workId=' + workId + '&invId=' + invId);
         const data = await res.json();
         setInvContext(data);
      } catch(e) {}
      setLoading(false);
    }
    fetchInv();
  }, [token]);

  const handleClaim = async () => {
    if (!token) return;
    const [workId, invId] = token.split('|');
    try {
      setLoading(true);
      await sendCommand({
        type: 'ACCEPT_INVITATION',
        workId,
        payload: {
          invitationId: invId,
          actorName: invContext?.roleName || "Alim Farms"
        }
      });
      navigate('/?workId=' + workId + '&view=commitment');
    } catch (e) {
      alert(e);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#FAF8F5]">
        <span className="text-sm font-medium text-neutral-500 tracking-wider uppercase animate-pulse">✦ Loading delivery request...</span>
      </div>
    );
  }

  return (
    <DeliveryRequestProjection
      title={invContext?.needDesc || "50kg Rice"}
      subtitle="Delivery request"
      fromName={invContext?.roleName || "Alim Farms"}
      toName={invContext?.workTitle || "Uttara Supershop"}
      dueText="Today · 10 AM"
      onAccept={handleClaim}
      onDecline={() => navigate('/')}
      onBack={() => navigate('/')}
    />
  );
}

const fs = require('fs');
let content = fs.readFileSync('src/components/DynamicRealitySurface.tsx', 'utf-8');

// 1. Add MessageSquare and X to lucide-react import
content = content.replace(/ChevronUp \} from 'lucide-react';/, "ChevronUp, MessageSquare, X } from 'lucide-react';");

// 2. Add state inside DynamicRealitySurface
content = content.replace(
  /const \[currentProjection, setCurrentProjection\] = useState<string>\('owner'\);/,
  `const [currentProjection, setCurrentProjection] = useState<string>('owner');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ id: string, role: 'user' | 'ai', text: string, nodeIds: string[] }>>([]);
  const [chatNodes, setChatNodes] = useState<Set<string>>(new Set());
  const chatMessagesEndRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isChatOpen && chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);`
);

// 3. Intercept handleInput to add user message
content = content.replace(
  /const handleInput = async \(e: React\.FormEvent\) => \{[\s\S]*?try \{/,
  `const handleInput = async (e: React.FormEvent | { preventDefault: ()=>void }, textOverride?: string) => {
    e.preventDefault();
    const textToSubmit = textOverride || inputText;
    if (!textToSubmit.trim()) return;
    setIsProcessing(true);
    causalAudio.playTick();
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: textToSubmit, nodeIds: [] }]);
    setIsChatOpen(true);
    try {`
);

content = content.replace(
  /await submitIntent\(inputText, \{\}\);/,
  `await submitIntent(textToSubmit, {});`
);

// 4. Overhaul the hypothesis useEffect to collect IDs and add AI message
const newEffect = `useEffect(() => {
    if (hypothesis) {
      causalAudio.playSettleHarmony();
      if (hypothesis.inferredMeaning) setToastMessage(hypothesis.inferredMeaning);
      
      let parentId = pendingContextId;
      const newlyCreatedNodeIds: string[] = [];

      // Process mutations first
      if (hypothesis.mutations && hypothesis.mutations.length > 0) {
        hypothesis.mutations.forEach(mut => {
          if (mut.type === 'UPDATE_STATE' && mut.nodeId) {
            if (RealityEngine.getGraph().nodes[mut.nodeId]) {
              RealityEngine.updateNode(mut.nodeId, { state: mut.state as any });
            }
          } else if (mut.type === 'ADD_NODE' && mut.nodeId) {
            const newNodeId = RealityEngine.addNode({
              type: mut.nodeType as any || 'DEPENDENCY',
              label: mut.label || 'New Requirement',
              state: 'UNKNOWN',
              data: { rationale: mut.rationale }
            });
            RealityEngine.addEdge(mut.nodeId, newNodeId, 'unresolved');
            newlyCreatedNodeIds.push(newNodeId);
          }
        });
      }

      // Add proposed dependencies if provided
      if (hypothesis.proposedDependencies && hypothesis.proposedDependencies.length > 0) {
        if (!parentId) {
          parentId = RealityEngine.addNode({
            type: 'WANT',
            label: hypothesis.inferredMeaning.substring(0, 50) + '...',
            state: 'UNKNOWN',
            data: { rationale: hypothesis.inferredMeaning }
          });
          newlyCreatedNodeIds.push(parentId);
        }
        hypothesis.proposedDependencies.forEach(dep => {
          const depId = RealityEngine.addNode({
            type: 'DEPENDENCY',
            label: dep.label,
            state: 'UNKNOWN',
            data: { 
              rationale: dep.rationale,
              contextualDetails: dep.contextualDetails || '',
              unknowns: dep.clarificationQuestions || []
            }
          });
          if (parentId) RealityEngine.addEdge(parentId, depId, 'requires');
          newlyCreatedNodeIds.push(depId);
        });
      }

      // 3. Convert unknowns into GAPs
      if (hypothesis.unknowns && hypothesis.unknowns.length > 0) {
        if (!parentId) {
          parentId = RealityEngine.addNode({
            type: 'WANT',
            label: hypothesis.inferredMeaning.substring(0, 50) + '...',
            state: 'UNKNOWN',
            data: { rationale: hypothesis.inferredMeaning }
          });
          newlyCreatedNodeIds.push(parentId);
        }
        hypothesis.unknowns.forEach(u => {
           const uId = RealityEngine.addNode({
             type: 'GAP',
             label: u,
             state: 'UNKNOWN',
             data: { isClarification: true }
           });
           if (parentId) RealityEngine.addEdge(parentId, uId, 'unresolved');
           newlyCreatedNodeIds.push(uId);
        });
      }

      // 4. Also add actionOptions if any as GAPs to show up for user
      if (hypothesis.actionOptions && hypothesis.actionOptions.length > 0) {
        if (!parentId) {
          parentId = RealityEngine.addNode({
            type: 'WANT',
            label: hypothesis.inferredMeaning.substring(0, 50) + '...',
            state: 'UNKNOWN',
            data: { rationale: hypothesis.inferredMeaning }
          });
          newlyCreatedNodeIds.push(parentId);
        }
        hypothesis.actionOptions.forEach(opt => {
           const optId = RealityEngine.addNode({
             type: 'GAP',
             label: opt.label,
             state: 'UNKNOWN',
             data: { isActionOption: true, actionType: opt.actionType, payload: opt.payload, parentRationale: hypothesis.inferredMeaning }
           });
           if (parentId) RealityEngine.addEdge(parentId, optId, 'unresolved');
           newlyCreatedNodeIds.push(optId);
        });
      }
      
      if (newlyCreatedNodeIds.length > 0) {
        setChatNodes(prev => new Set([...prev, ...newlyCreatedNodeIds]));
      }

      setMessages(prev => [...prev, {
         id: Date.now().toString(),
         role: 'ai',
         text: hypothesis.inferredMeaning || "Reality updated.",
         nodeIds: newlyCreatedNodeIds
      }]);

      clearHypothesis();
      setPendingContextId(null);
    }
  }, [hypothesis]);`;

content = content.replace(/useEffect\(\(\) => \{\s*if \(hypothesis\) \{[\s\S]*?clearHypothesis\(\);\s*setPendingContextId\(null\);\s*\}\s*\}, \[hypothesis\]\);/, newEffect);

fs.writeFileSync('src/components/DynamicRealitySurface.tsx', content);

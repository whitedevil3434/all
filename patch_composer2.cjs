const fs = require('fs');

let code = fs.readFileSync('src/components/CopilotComposer.tsx', 'utf8');

const newHandleSubmit = `
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || composerState !== 'IDLE') return;
    const userMsg = inputValue.trim();
    setInputValue('');
    setComposerState('LISTENING');
    setTransientMessage('● Listening...');
    
    try {
      const res = await fetch('/api/c-link-compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg, currentReality }),
      });
      
      if (!res.ok) throw new Error('API Rate Limit or Error');
      
      const data = await res.json();
      
      if (data.semanticAction) {
        setComposerState('PROJECTING');
        setTransientMessage('✦ Resolving Causal Reality...');
        
        setTimeout(() => {
          onSemanticAction(data.semanticAction);
          finishSim('✓ Reality updated');
        }, 1000);
      } else {
        // Fallback if no action
        finishSim('✦ I do not understand this context yet.');
      }
    } catch (err) {
      console.error(err);
      // Fallback to local simulation for the Litmus test if API fails
      setTimeout(() => {
        simulateAI(userMsg);
      }, 400);
    }
  };
`;

const startIdx = code.indexOf('const handleSubmit = async');
const endIdx = code.indexOf('if (!isEmbedded && !isOpen) {', startIdx);

if (startIdx > -1 && endIdx > -1) {
  code = code.substring(0, startIdx) + newHandleSubmit + '\n  ' + code.substring(endIdx);
  fs.writeFileSync('src/components/CopilotComposer.tsx', code);
}

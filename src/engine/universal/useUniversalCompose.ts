import { buildContextSnapshot } from './ContextOrchestrator';
import { useState } from 'react';
import { OutcomeHypothesis } from './CausalProposal';

export function useUniversalCompose() {
  const [isComposing, setIsComposing] = useState(false);
  const [hypothesis, setHypothesis] = useState<OutcomeHypothesis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitIntent = async (prompt: string, options?: any) => {
    const contextSnapshot = await buildContextSnapshot(prompt);
    setIsComposing(true);
    setError(null);
    try {
      const response = await fetch('/api/universal-compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, contextSnapshot, options }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to compose reality');
      }

      const data: OutcomeHypothesis = await response.json();
      setHypothesis(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setIsComposing(false);
    }
  };

  const clearHypothesis = () => setHypothesis(null);

  return {
    submitIntent,
    isComposing,
    hypothesis,
    error,
    clearHypothesis
  };
}

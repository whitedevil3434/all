import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { collection, doc, setDoc, updateDoc, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export type CausalState = 
  | 'UNKNOWN' 
  | 'POSSIBLE'
  | 'ASKING' 
  | 'OFFERED' 
  | 'COMMITTED' 
  | 'EXECUTING' 
  | 'VERIFYING' 
  | 'RESOLVED' 
  | 'FAILED';

export type NodeType = 'WANT' | 'DEPENDENCY' | 'ACTOR' | 'GAP' | 'RESPONSIBILITY' | 'EVIDENCE';

export interface GraphNode {
  id: string;
  type: NodeType | string;
  label: string;
  state: CausalState;
  attention?: number;
  data?: any;
}

export interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relation: string;
}

export interface RealityGraph {
  nodes: Record<string, GraphNode>;
  edges: Record<string, GraphEdge>;
}

// Global store (Projection)
let globalGraph: RealityGraph = { nodes: {}, edges: {} };
let listeners: Array<() => void> = [];

// Initialize Firebase Listeners
let isFirebaseInitialized = false;

const initFirebaseSync = () => {
  if (isFirebaseInitialized) return;
  isFirebaseInitialized = true;

  onSnapshot(collection(db, 'nodes'), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added' || change.type === 'modified') {
        globalGraph.nodes[change.doc.id] = change.doc.data() as GraphNode;
      }
      if (change.type === 'removed') {
        delete globalGraph.nodes[change.doc.id];
      }
    });
    RealityEngine.notify();
  });

  onSnapshot(collection(db, 'edges'), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added' || change.type === 'modified') {
        globalGraph.edges[change.doc.id] = change.doc.data() as GraphEdge;
      }
      if (change.type === 'removed') {
        delete globalGraph.edges[change.doc.id];
      }
    });
    RealityEngine.notify();
  });
};

export const RealityEngine = {
  getGraph: () => {
    if (!isFirebaseInitialized) initFirebaseSync();
    return globalGraph;
  },
  
  subscribe: (listener: () => void) => {
    if (!isFirebaseInitialized) initFirebaseSync();
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  
  notify: () => {
    listeners.forEach(l => l());
  },
  
  // These now push to Firebase (Command -> Event -> Reality)
  addNode: (node: Omit<GraphNode, 'id'> & { id?: string }) => {
    const id = node.id || uuidv4();
    const finalNode = { ...node, id };
    
    // Optimistic UI Update
    globalGraph.nodes[id] = finalNode as GraphNode;
    RealityEngine.notify();
    
    // Canonical Firebase Update
    setDoc(doc(db, 'nodes', id), finalNode).catch(console.error);
    
    // Append to Event Ledger
    setDoc(doc(db, 'events', uuidv4()), {
      type: 'NODE_ADDED',
      payload: finalNode,
      createdAt: Date.now()
    }).catch(console.error);

    return id;
  },

  
  updateNode: (id: string, updates: Partial<GraphNode>, isUserAuthorized = false) => {
    // 1. Reality Firewall (Validation)
    // Prevent AI from forcing COMMITTED state directly without user authorization
    if (updates.state === 'COMMITTED' && !isUserAuthorized) {
      updates.state = 'OFFERED'; // Downgrade to offered, requires user acceptance
      console.log('🛡️ Reality Firewall: Prevented unauthorized COMMITTED state. Downgraded to OFFERED.');
    }

    // 1. Reality Firewall (Validation)
    // We prevent direct state jump from UNKNOWN to COMMITTED for Actors unless authorized.
    // For now, we simulate the proposal check.
    
    // Optimistic UI
    if (globalGraph.nodes[id]) {
      globalGraph.nodes[id] = { ...globalGraph.nodes[id], ...updates };
      RealityEngine.notify();
    }
    
    // Canonical Firebase Update
    updateDoc(doc(db, 'nodes', id), updates).catch(console.error);
    
    // Append to Event Ledger
    setDoc(doc(db, 'events', uuidv4()), {
      type: 'NODE_UPDATED',
      payload: { id, updates },
      createdAt: Date.now()
    }).catch(console.error);
  },

  addEdge: (sourceId: string, targetId: string, relation: string) => {
    const id = `${sourceId}-${targetId}-${relation}`;
    const newEdge = { id, sourceId, targetId, relation };
    
    globalGraph.edges[id] = newEdge;
    RealityEngine.notify();
    
    setDoc(doc(db, 'edges', id), newEdge).catch(console.error);
    
    return id;
  },
  
  reset: async () => {
    // Only resets local. In a real app we don't drop tables.
    // But for dev, we can clear collections.
    globalGraph = { nodes: {}, edges: {} };
    RealityEngine.notify();
  }
};

export function useRealityGraph() {
  const [graph, setGraph] = useState<RealityGraph>(RealityEngine.getGraph());

  useEffect(() => {
    return RealityEngine.subscribe(() => {
      setGraph({ ...RealityEngine.getGraph() });
    });
  }, []);

  return graph;
}

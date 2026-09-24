import React from 'react';
import { DraftIntent } from '../engine/firebase-engine';
import { CausalBentoRealitySurface } from './CausalBentoRealitySurface';

export type ProjectionType = 'bento' | 'canvas' | 'delivery_request' | 'commitment' | 'proof' | 'recipient' | 'why';

interface DesktopRealitySurfaceProps {
  activeWorkId: string | null;
  setActiveWorkId: (id: string) => void;
  worksList: any[];
  intents: any[];
  needs: any[];
  capabilities: any[];
  actors: any[];
  gaps: any[];
  relations: any[];
  commitments?: any[];
  responsibilities?: any[];
  evidences?: any[];
  events?: any[];
  draftIntents: DraftIntent[];
  onAction: (action: string, value?: any) => Promise<void>;
  aiResponse: string | null;
  isProcessing: boolean;
  onOpenLedger: () => void;
  onPromoteDraft: (draft: DraftIntent) => Promise<void>;
  onSwitchToMobile?: () => void;
  activeProjection?: ProjectionType;
  onSelectProjection?: (projection: ProjectionType) => void;
  currentUserRole?: 'OWNER' | 'ACTOR';
  setCurrentUserRole?: (role: 'OWNER' | 'ACTOR') => void;
  globalActors?: any[];
  currentActorId?: string | null;
  setCurrentActorId?: (id: string | null) => void;
}

export const DesktopRealitySurface: React.FC<DesktopRealitySurfaceProps> = (props) => {
  return (
    <CausalBentoRealitySurface
      activeWorkId={props.activeWorkId}
      setActiveWorkId={props.setActiveWorkId}
      worksList={props.worksList}
      intents={props.intents}
      needs={props.needs}
      capabilities={props.capabilities}
      actors={props.actors}
      gaps={props.gaps}
      commitments={props.commitments || []}
      responsibilities={props.responsibilities || []}
      evidences={props.evidences || []}
      events={props.events || []}
      relations={props.relations}
      draftIntents={props.draftIntents}
      onAction={props.onAction}
      aiResponse={props.aiResponse}
      isProcessing={props.isProcessing}
      onOpenLedger={props.onOpenLedger}
      onPromoteDraft={props.onPromoteDraft}
      currentUserRole={props.currentUserRole}
      setCurrentUserRole={props.setCurrentUserRole}
      globalActors={props.globalActors}
      currentActorId={props.currentActorId}
      setCurrentActorId={props.setCurrentActorId}
    />
  );
};

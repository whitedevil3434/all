import React from 'react';

// 1. Isometric Box / Cube Icon (WANT) from IMG_0906, 0907, 0908, 0910, 0911
export const IsometricCubeIcon: React.FC<{ size?: number; className?: string }> = ({ 
  size = 18, 
  className = "text-neutral-700" 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2.5L3.5 7.5V16.5L12 21.5L20.5 16.5V7.5L12 2.5Z" />
    <path d="M12 12L3.5 7.5" />
    <path d="M12 12V21.5" />
    <path d="M12 12L20.5 7.5" />
  </svg>
);

// 2. Shopping Bag with Twin Handles (CAPABILITY) from IMG_0907
export const BagIcon: React.FC<{ size?: number; className?: string }> = ({ 
  size = 18, 
  className = "text-neutral-700" 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 8h12l1 12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L6 8z" />
    <path d="M9 10V6a3 3 0 0 1 6 0v4" />
  </svg>
);

// 3. User Avatar Outline (ACTOR) from IMG_0906, 0907, 0908
export const AvatarOutlineIcon: React.FC<{ size?: number; className?: string }> = ({ 
  size = 18, 
  className = "text-neutral-700" 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// 4. Clean Shield Icon (RESPONSIBILITY) from IMG_0906, 0907, 0910
export const ShieldOutlineIcon: React.FC<{ size?: number; className?: string }> = ({ 
  size = 18, 
  className = "text-neutral-700" 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

// 5. Handshake Icon (COMMITMENT) from IMG_0908, 0911
export const HandshakeIcon: React.FC<{ size?: number; className?: string }> = ({ 
  size = 18, 
  className = "text-neutral-700" 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.3-4.3a1 1 0 0 0 0-1.4l-2.6-2.6a1 1 0 0 0-1.4 0L12 13" />
    <path d="m14 14 2.5 2.5" />
    <path d="M2 12h5l3 3" />
    <path d="m7 7 3-3a1 1 0 0 1 1.4 0l4.3 4.3a1 1 0 0 1 0 1.4L13 12" />
    <path d="M22 12h-5l-3-3" />
  </svg>
);

// 6. Delivery Truck / Van Icon (DELIVERY / DISPATCH) from IMG_0409, 0904, 0908, 0911
export const DeliveryVanIcon: React.FC<{ size?: number; className?: string }> = ({ 
  size = 18, 
  className = "text-neutral-700" 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="6" width="13" height="10" rx="1.5" />
    <path d="M15 9h4l3 4v3h-7V9z" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="18" r="2" />
  </svg>
);

// 7. Pennant Flag Icon (CURRENT FRONTIER) from IMG_0409
export const FrontierFlagIcon: React.FC<{ size?: number; className?: string }> = ({ 
  size = 18, 
  className = "text-neutral-700" 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

// 8. Store / Supermarket Awning (WORK / STORE) from IMG_0409, 0408
export const StoreFrontIcon: React.FC<{ size?: number; className?: string }> = ({ 
  size = 18, 
  className = "text-neutral-700" 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m2 7 4.4-4.4A2 2 0 0 1 7.8 2h8.4a2 2 0 0 1 1.4.6L22 7" />
    <path d="M22 7v13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7" />
    <path d="M9 22v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6" />
    <line x1="2" y1="7" x2="22" y2="7" />
  </svg>
);

// 9. Kettlebell / Bell Scale Weight Icon from IMG_0407 (WEIGHT)
export const BellWeightIcon: React.FC<{ size?: number; className?: string }> = ({ 
  size = 20, 
  className = "text-neutral-400" 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2a3 3 0 0 0-3 3v1.1c-2.4.9-4 3.2-4 5.9v7a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-7c0-2.7-1.6-5-4-5.9V5a3 3 0 0 0-3-3zm0 2a1 1 0 0 1 1 1v1h-2V5a1 1 0 0 1 1-1z" />
  </svg>
);

// 10. Clock Icon from IMG_0405, 0409, 0904
export const OutlineClockIcon: React.FC<{ size?: number; className?: string }> = ({ 
  size = 18, 
  className = "text-neutral-700" 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// 11. Minimal Downward Causal Arrow (↓)
export const CausalDownArrow: React.FC<{ className?: string }> = ({ 
  className = "text-neutral-400 my-1 text-center flex justify-center" 
}) => (
  <div className={className}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  </div>
);

// 12. Rice Bowl Vector Component identical to IMG_0407 photo
export const RiceBowlGraphic: React.FC<{ className?: string }> = ({ 
  className = "w-14 h-14" 
}) => (
  <div className={`relative flex items-center justify-center rounded-xl overflow-hidden bg-[#FAF8F5] border border-neutral-200/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] ${className}`}>
    <img 
      src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&h=300&q=80" 
      alt="Rice Bowl" 
      className="w-full h-full object-cover"
      onError={(e) => {
        // SVG fallback if offline
        (e.target as HTMLElement).style.display = 'none';
      }}
    />
    <svg className="w-10 h-10 text-neutral-300 absolute pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 12c0 5.5 4.5 10 10 10s10-4.5 10-10H2zm2-2c.8-3.4 3.6-6 7-6s6.2 2.6 7 6H4z" fill="#EAE6DF"/>
      <circle cx="12" cy="7" r="1" fill="#FAF8F5"/>
      <circle cx="10" cy="8" r="0.9" fill="#FAF8F5"/>
      <circle cx="14" cy="8" r="0.9" fill="#FAF8F5"/>
    </svg>
  </div>
);

import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { DEMO_CONFIG } from '../../data/demo/policies';

export const DemoRibbon: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (!DEMO_CONFIG.DEMO_MODE || dismissed) return null;

  return (
    <div 
      role="alert" 
      aria-label="Simulation Notice"
      className="bg-[#FFFDF8] border-b border-[#A8884B]/40 text-[#2A1D15] px-4 py-2 text-xs flex items-center justify-between shadow-2xs z-30"
    >
      <div className="flex items-center gap-2 max-w-5xl mx-auto flex-1 justify-center text-center">
        <AlertTriangle className="w-4 h-4 text-[#A8884B] shrink-0" aria-hidden="true" />
        <span className="font-medium">
          {DEMO_CONFIG.DEMO_RIBBON_TEXT}
        </span>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss demo simulation notice"
        className="p-1 hover:bg-[#FAF6EE] text-[#2A1D15]/60 hover:text-[#2A1D15] rounded-[2px] transition-colors ml-2"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

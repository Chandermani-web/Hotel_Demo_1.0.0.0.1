import React from 'react';

/**
 * Restrained Heritage Ornaments for Hotel Carlton
 * 1px antique gold hairlines and traditional architectural geometric motifs.
 */

export const DiamondDivider: React.FC<{ className?: string; inverted?: boolean }> = ({ 
  className = "", 
  inverted = false 
}) => {
  const strokeColor = inverted ? "#FAF6EE" : "#A8884B";
  const lineColor = inverted ? "rgba(250, 246, 238, 0.25)" : "rgba(168, 136, 75, 0.35)";

  return (
    <div className={`flex items-center justify-center gap-3 my-6 ${className}`} aria-hidden="true">
      <div className="h-[1px] w-12 md:w-20" style={{ backgroundColor: lineColor }} />
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
        <rect x="6" y="0.5" width="7.5" height="7.5" transform="rotate(45 6 0.5)" fill={strokeColor} />
      </svg>
      <div className="h-[1px] w-12 md:w-20" style={{ backgroundColor: lineColor }} />
    </div>
  );
};

export const ArchitecturalArchIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-[#A8884B]" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
    <path d="M4 21V9C4 5 7.5 2 12 2C16.5 2 20 5 20 9V21" />
    <path d="M2 21H22" />
    <path d="M8 21V12C8 10 9.8 8.5 12 8.5C14.2 8.5 16 10 16 12V21" />
  </svg>
);

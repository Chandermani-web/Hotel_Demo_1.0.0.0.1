import React from 'react';
import { Phone, MessageSquare, CalendarCheck, Menu } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface MobileStickyBarProps {
  navigate: (path: string) => void;
  onOpenMenu?: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ navigate, onOpenMenu }) => {
  const hasWhatsApp = Boolean(siteConfig.whatsappNumber && siteConfig.whatsappNumber.trim() !== "");
  const whatsappUrl = hasWhatsApp
    ? `https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hello Hotel Carlton, I would like to enquire about room availability.")}`
    : null;

  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#2A1D15] text-[#FAF6EE] border-t border-[#A8884B]/30 px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-lg"
      role="region"
      aria-label="Quick contact and navigation actions"
    >
      <div className="grid grid-flow-col auto-cols-fr gap-2 max-w-md mx-auto text-center">
        
        {/* Menu Drawer Action */}
        {onOpenMenu && (
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open full site menu"
            className="flex items-center justify-center gap-1.5 py-2 px-2 bg-[#2A1D15] border border-[#A8884B]/40 rounded-[3px] text-xs font-semibold tracking-wider uppercase text-[#FAF6EE] hover:bg-[#3B291D] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Menu className="w-3.5 h-3.5 text-[#A8884B]" aria-hidden="true" />
            <span className="truncate">Menu</span>
          </button>
        )}

        {/* Call Action */}
        <a
          href={`tel:${siteConfig.phoneTel}`}
          className="flex items-center justify-center gap-1.5 py-2 px-2 bg-[#2A1D15] border border-[#A8884B]/40 rounded-[3px] text-xs font-semibold tracking-wider uppercase text-[#FAF6EE] hover:bg-[#3B291D] active:scale-[0.98] transition-all"
        >
          <Phone className="w-3.5 h-3.5 text-[#A8884B]" aria-hidden="true" />
          <span className="truncate">Call Hotel</span>
        </a>

        {/* WhatsApp Action - ONLY rendered if real number configured */}
        {hasWhatsApp && whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 px-2 bg-[#2A1D15] border border-[#A8884B]/40 rounded-[3px] text-xs font-semibold tracking-wider uppercase text-[#FAF6EE] hover:bg-[#3B291D] active:scale-[0.98] transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#A8884B]" aria-hidden="true" />
            <span className="truncate">WhatsApp</span>
          </a>
        )}

        {/* Book / Request Enquiry Action */}
        <button
          type="button"
          onClick={() => navigate('/book')}
          className="flex items-center justify-center gap-1.5 py-2 px-2 bg-[#5A1F24] border border-[#5A1F24] rounded-[3px] text-xs font-semibold tracking-wider uppercase text-[#FAF6EE] hover:bg-[#6D262C] active:scale-[0.98] transition-all cursor-pointer shadow-xs"
        >
          <CalendarCheck className="w-3.5 h-3.5 text-[#D9C9A8]" aria-hidden="true" />
          <span className="truncate">Book Stay</span>
        </button>

      </div>
    </div>
  );
};

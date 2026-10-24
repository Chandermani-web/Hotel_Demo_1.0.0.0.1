import React from 'react';
import { Phone, MessageSquare, CalendarCheck } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { DiamondDivider } from './Ornament';

interface BookingCTABandProps {
  navigate: (path: string) => void;
}

export const BookingCTABand: React.FC<BookingCTABandProps> = ({ navigate }) => {
  const hasWhatsApp = Boolean(siteConfig.whatsappNumber && siteConfig.whatsappNumber.trim() !== "");
  const whatsappUrl = hasWhatsApp
    ? `https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hello Hotel Carlton, I would like to enquire about room availability.")}`
    : null;

  return (
    <section className="bg-[#2A1D15] text-[#FAF6EE] py-16 md:py-20 border-t border-b border-[#A8884B]/30 relative overflow-hidden">
      {/* Restrained subtle architectural border texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#FAF6EE_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <p className="text-xs uppercase tracking-[0.25em] text-[#D9C9A8] mb-2 font-medium">
          Direct Reservations & Inquiries
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-[#FFFDF8] tracking-tight">
          Planning Your Stay in Bareilly?
        </h2>
        <DiamondDivider inverted className="my-4" />
        <p className="text-sm md:text-base text-[#FAF6EE]/85 max-w-xl mx-auto leading-relaxed mb-8">
          Contact our front desk directly for available dates, current room rates, and immediate booking assistance.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* Primary CTA */}
          <button
            type="button"
            onClick={() => navigate('/book')}
            className="px-6 py-3.5 bg-[#5A1F24] hover:bg-[#6D262C] text-[#FAF6EE] text-xs font-semibold uppercase tracking-widest rounded-[3px] border border-[#5A1F24] shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4 text-[#D9C9A8]" aria-hidden="true" />
            <span>Book Your Stay</span>
          </button>

          {/* Call Front Desk */}
          <a
            href={`tel:${siteConfig.phoneTel}`}
            className="px-6 py-3.5 bg-transparent hover:bg-[#FAF6EE]/10 text-[#FAF6EE] text-xs font-semibold uppercase tracking-widest rounded-[3px] border border-[#A8884B] flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-[#A8884B]" aria-hidden="true" />
            <span>Call: {siteConfig.phone}</span>
          </a>

          {/* WhatsApp if configured */}
          {hasWhatsApp && whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-transparent hover:bg-[#FAF6EE]/10 text-[#FAF6EE] text-xs font-semibold uppercase tracking-widest rounded-[3px] border border-[#A8884B]/60 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-[#A8884B]" aria-hidden="true" />
              <span>WhatsApp Hotel</span>
            </a>
          )}
        </div>

        <p className="text-xs text-[#FAF6EE]/60 mt-6 tracking-wide">
          Direct communication with hotel reception · No third-party reservation markups
        </p>
      </div>
    </section>
  );
};

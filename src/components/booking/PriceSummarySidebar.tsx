import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Tag, ShieldCheck } from 'lucide-react';
import { PricingCalculationResult, formatINR } from '../../lib/booking/pricing';
import { DemoRoom } from '../../data/demo/rooms';
import { formatIndianDate } from '../../lib/booking/dates';

interface PriceSummarySidebarProps {
  room?: DemoRoom;
  checkIn: string;
  checkOut: string;
  pricing: PricingCalculationResult;
  isMobileDrawer?: boolean;
}

export const PriceSummarySidebar: React.FC<PriceSummarySidebarProps> = ({
  room,
  checkIn,
  checkOut,
  pricing
}) => {
  const [showNightsBreakdown, setShowNightsBreakdown] = useState(false);

  return (
    <aside aria-label="Reservation Tariff Summary" className="bg-[#FFFDF8] border border-[#D9C9A8] rounded-[3px] p-5 md:p-6 shadow-xs sticky top-24">
      <div className="pb-4 border-b border-[#D9C9A8]/50">
        <span className="text-[11px] uppercase tracking-widest text-[#8C6F38] font-semibold block mb-1">
          Tariff Summary (Demo)
        </span>
        <h3 className="text-xl font-serif font-semibold text-[#2A1D15]">
          {room ? room.name : "Select a Room"}
        </h3>
        {checkIn && checkOut && (
          <p className="text-xs text-[#2B2B2B]/70 mt-1">
            {formatIndianDate(checkIn)} to {formatIndianDate(checkOut)}
          </p>
        )}
      </div>

      <div className="py-4 space-y-3 text-xs text-[#2B2B2B]/85 border-b border-[#D9C9A8]/50">
        {/* Rooms & Nights count */}
        <div className="flex justify-between items-center">
          <span className="text-[#2B2B2B]/70">Duration & Rooms:</span>
          <span className="font-medium text-[#2A1D15]">
            {pricing.nightsCount} Night{pricing.nightsCount > 1 ? 's' : ''} · {pricing.roomsCount} Room{pricing.roomsCount > 1 ? 's' : ''}
          </span>
        </div>

        {/* Room Base Total */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setShowNightsBreakdown(!showNightsBreakdown)}
            className="text-[#8C6F38] hover:text-[#5A1F24] underline flex items-center gap-1 cursor-pointer"
          >
            <span>Room Tariff Total</span>
            {showNightsBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          <span className="font-semibold text-[#2A1D15]">
            {formatINR(pricing.baseRoomTotal)}
          </span>
        </div>

        {/* Expandable Per-Night Breakdown */}
        {showNightsBreakdown && pricing.nightsBreakdown.length > 0 && (
          <div className="bg-[#FAF6EE] p-3 rounded-[2px] space-y-1.5 border border-[#D9C9A8]/40 my-2">
            <span className="text-[10px] uppercase tracking-wider text-[#2B2B2B]/60 font-semibold block mb-1">
              Daily Night Rates Breakdown
            </span>
            {pricing.nightsBreakdown.map((night, nIdx) => (
              <div key={nIdx} className="flex justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-[#2B2B2B]/80">
                  <span>{night.formattedDate}</span>
                  {night.isWeekend && (
                    <span className="text-[9px] bg-[#A8884B]/20 text-[#8C6F38] px-1 rounded-[1px] font-mono">
                      Weekend +15%
                    </span>
                  )}
                </span>
                <span className="font-mono text-[#2A1D15]">
                  {formatINR(night.totalForRooms)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Extra Bed Charge */}
        {pricing.extraBedCharge > 0 && (
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#2B2B2B]/70">Extra Bed Surcharge:</span>
            <span className="font-mono text-[#2A1D15]">+{formatINR(pricing.extraBedCharge)}</span>
          </div>
        )}

        {/* Coupon Discount */}
        {pricing.discountAmount > 0 && (
          <div className="flex justify-between items-center text-xs text-emerald-800">
            <span className="flex items-center gap-1 font-medium">
              <Tag className="w-3 h-3 text-emerald-700" />
              <span>Promo ({pricing.couponCodeApplied}):</span>
            </span>
            <span className="font-mono font-semibold">-{formatINR(pricing.discountAmount)}</span>
          </div>
        )}

        {/* Taxes (12% Demo Tax) */}
        <div className="flex justify-between items-center">
          <span className="text-[#2B2B2B]/70">Goods & Service Tax (12% Demo Tax):</span>
          <span className="font-mono text-[#2A1D15]">{formatINR(pricing.taxAmount)}</span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="pt-4">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#2A1D15]">
            Estimated Total:
          </span>
          <span className="text-2xl font-serif font-bold text-[#5A1F24]">
            {formatINR(pricing.grandTotal)}
          </span>
        </div>
        <p className="text-[11px] text-[#2B2B2B]/60 leading-tight">
          Inclusive of all applicable demo taxes and facility charges.
        </p>

        <div className="mt-4 pt-3 border-t border-[#D9C9A8]/40 flex items-center gap-1.5 text-[11px] text-[#8C6F38]">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>Demo Booking: No real card or charges</span>
        </div>
      </div>
    </aside>
  );
};

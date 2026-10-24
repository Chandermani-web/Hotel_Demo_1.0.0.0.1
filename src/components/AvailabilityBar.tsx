import React, { useState } from 'react';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface AvailabilityBarProps {
  onCheckAvailability: (dates: { checkIn: string; checkOut: string; guests: string }) => void;
}

export const AvailabilityBar: React.FC<AvailabilityBarProps> = ({ onCheckAvailability }) => {
  // Default dates: tomorrow and day after tomorrow
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(formatDate(tomorrow));
  const [checkOut, setCheckOut] = useState(formatDate(dayAfter));
  const [guests, setGuests] = useState('2');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (siteConfig.bookingUrl && siteConfig.bookingUrl.trim() !== '') {
      window.location.href = siteConfig.bookingUrl;
      return;
    }
    onCheckAvailability({ checkIn, checkOut, guests });
  };

  return (
    <div className="relative -mt-10 sm:-mt-12 z-30 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="bg-[#FFFDF8] border border-[#D9C9A8] shadow-md rounded-[3px] p-5 md:p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          
          {/* Check-In */}
          <div>
            <label htmlFor="avail-checkin" className="block text-xs font-semibold uppercase tracking-widest text-[#2A1D15] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#A8884B]" aria-hidden="true" />
              <span>Check-In</span>
            </label>
            <input
              id="avail-checkin"
              type="date"
              value={checkIn}
              min={formatDate(today)}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] px-3 py-2 text-sm text-[#2B2B2B] focus:border-[#A8884B] focus:outline-hidden focus:ring-1 focus:ring-[#A8884B]"
              required
            />
          </div>

          {/* Check-Out */}
          <div>
            <label htmlFor="avail-checkout" className="block text-xs font-semibold uppercase tracking-widest text-[#2A1D15] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#A8884B]" aria-hidden="true" />
              <span>Check-Out</span>
            </label>
            <input
              id="avail-checkout"
              type="date"
              value={checkOut}
              min={checkIn || formatDate(tomorrow)}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] px-3 py-2 text-sm text-[#2B2B2B] focus:border-[#A8884B] focus:outline-hidden focus:ring-1 focus:ring-[#A8884B]"
              required
            />
          </div>

          {/* Guests */}
          <div>
            <label htmlFor="avail-guests" className="block text-xs font-semibold uppercase tracking-widest text-[#2A1D15] mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#A8884B]" aria-hidden="true" />
              <span>Guests</span>
            </label>
            <select
              id="avail-guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] px-3 py-2 text-sm text-[#2B2B2B] focus:border-[#A8884B] focus:outline-hidden focus:ring-1 focus:ring-[#A8884B]"
            >
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4+ Guests</option>
            </select>
          </div>

          {/* Submit Action */}
          <div>
            <button
              type="submit"
              className="w-full h-[42px] bg-[#5A1F24] hover:bg-[#6D262C] text-[#FAF6EE] font-semibold text-xs uppercase tracking-widest rounded-[2px] border border-[#5A1F24] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Check Availability</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D9C9A8]" aria-hidden="true" />
            </button>
          </div>

        </form>

        <p className="text-[11px] text-[#2B2B2B]/60 text-center mt-3 pt-3 border-t border-[#D9C9A8]/40">
          * Checking availability transmits a direct reservation enquiry to the hotel front desk; it does not confirm a booked stay.
        </p>
      </div>
    </div>
  );
};

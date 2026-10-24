import React, { useState, useEffect } from 'react';
import { siteConfig } from '../../config/siteConfig';
import { getStoredBookings, getBookingById, modifyBookingDates, cancelBooking } from '../../lib/booking/store';
import { StoredBooking } from '../../data/demo/seedBookings';
import { getRoomById } from '../../data/demo/rooms';
import { formatIndianDate, formatShortDate, calculateNights, addDays, getTodayIso, getTomorrowIso } from '../../lib/booking/dates';
import { checkAllRoomsAvailability, getMinRemainingInventory } from '../../lib/booking/availability';
import { formatINR, calculateStayPricing } from '../../lib/booking/pricing';
import { generateIcsCalendarFile } from '../../lib/booking/ics';
import { validateStayDates } from '../../lib/booking/validation';
import { DEMO_CONFIG } from '../../data/demo/policies';

import { DemoRibbon } from '../../components/booking/DemoRibbon';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { SeoHead } from '../../components/SeoHead';
import { DiamondDivider } from '../../components/Ornament';

import { 
  Search, 
  Phone, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  Download, 
  Clock, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface ManageBookingPageProps {
  navigate: (path: string, state?: Record<string, any>) => void;
  navigationState?: Record<string, any>;
}

export const ManageBookingPage: React.FC<ManageBookingPageProps> = ({ navigate, navigationState }) => {
  const [bookingIdInput, setBookingIdInput] = useState<string>(() => {
    if (navigationState?.bookingId) return navigationState.bookingId;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('id')) return params.get('id')!;
    }
    return '';
  });

  const [phoneInput, setPhoneInput] = useState<string>(() => {
    if (navigationState?.phone) {
      return navigationState.phone.replace(/[^0-9]/g, '').slice(-10);
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('phone')) return params.get('phone')!;
    }
    return '';
  });

  const [currentBooking, setCurrentBooking] = useState<StoredBooking | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Modify Dates modal state
  const [isModifyingDates, setIsModifyingDates] = useState(false);
  const [newCheckIn, setNewCheckIn] = useState('');
  const [newCheckOut, setNewCheckOut] = useState('');
  const [modifyError, setModifyError] = useState<string | null>(null);
  const [modifySuccess, setModifySuccess] = useState<string | null>(null);

  // Cancellation modal state
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('Change in schedule');

  // Auto-search if both inputs are present on mount
  useEffect(() => {
    if (bookingIdInput && phoneInput) {
      handleLookup();
    }
  }, []);

  const handleLookup = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchError(null);
    setModifySuccess(null);

    const cleanId = bookingIdInput.trim().toUpperCase();
    const cleanPhoneDigits = phoneInput.replace(/[^0-9]/g, '').slice(-10);

    if (!cleanId || !cleanPhoneDigits) {
      setSearchError("Please provide both your Booking ID (e.g. CARL-261022-P9M4) and registered 10-digit mobile number.");
      return;
    }

    const booking = getBookingById(cleanId);
    if (!booking) {
      setSearchError(`No reservation found matching ID "${cleanId}". Please check your booking code or contact the reception.`);
      setCurrentBooking(null);
      return;
    }

    // Verify phone matches (last 10 digits)
    const storedPhoneDigits = booking.guest.phone.replace(/[^0-9]/g, '').slice(-10);
    if (storedPhoneDigits !== cleanPhoneDigits) {
      setSearchError("The mobile number entered does not match the contact number registered on this reservation.");
      setCurrentBooking(null);
      return;
    }

    setCurrentBooking(booking);
    setNewCheckIn(booking.checkIn);
    setNewCheckOut(booking.checkOut);
  };

  // Modify dates handler
  const handleConfirmModifyDates = () => {
    if (!currentBooking) return;
    setModifyError(null);

    const dateVal = validateStayDates(newCheckIn, newCheckOut);
    if (!dateVal.valid) {
      setModifyError(dateVal.error || "Invalid stay dates.");
      return;
    }

    // Check inventory for the room excluding this current booking
    const room = getRoomById(currentBooking.roomId);
    if (!room) {
      setModifyError("Room type configuration error.");
      return;
    }

    const bookings = getStoredBookings();
    const remaining = getMinRemainingInventory(room, newCheckIn, newCheckOut, bookings, currentBooking.id);
    if (remaining < currentBooking.roomsCount) {
      setModifyError(`The ${room.name} has only ${remaining} room(s) available for the new dates. You requested ${currentBooking.roomsCount}.`);
      return;
    }

    const result = modifyBookingDates(currentBooking.id, newCheckIn, newCheckOut);
    if (result.success && result.booking) {
      setCurrentBooking(result.booking);
      setIsModifyingDates(false);
      const deltaText = result.priceDelta !== undefined && result.priceDelta !== 0
        ? result.priceDelta > 0
          ? ` Additional tariff of ${formatINR(result.priceDelta)} applies.`
          : ` Tariff adjustment of ${formatINR(Math.abs(result.priceDelta))} credited.`
        : ' No change in total tariff.';
      setModifySuccess(`Reservation dates updated to ${formatShortDate(newCheckIn)} - ${formatShortDate(newCheckOut)}.${deltaText}`);
    } else {
      setModifyError(result.error || "Unable to modify booking dates.");
    }
  };

  // Cancellation handler
  const handleConfirmCancellation = () => {
    if (!currentBooking) return;

    const result = cancelBooking(currentBooking.id, cancellationReason);
    if (result.success && result.booking) {
      setCurrentBooking(result.booking);
      setIsCancelling(false);
    }
  };

  // Preview pricing difference for date modification
  const calculateDeltaPreview = () => {
    if (!currentBooking || !newCheckIn || !newCheckOut) return null;
    const room = getRoomById(currentBooking.roomId);
    if (!room) return null;

    const newPricing = calculateStayPricing({
      baseRate: room.baseRate,
      checkIn: newCheckIn,
      checkOut: newCheckOut,
      roomsCount: currentBooking.roomsCount,
      hasExtraBed: currentBooking.requests.extraBed,
      extraBedAllowed: room.extraBedAllowed,
      couponDiscountPercent: currentBooking.pricing.discountAmount > 0 ? 10 : 0,
      couponCode: currentBooking.pricing.couponApplied
    });

    return newPricing.grandTotal - currentBooking.pricing.grandTotal;
  };

  const delta = isModifyingDates ? calculateDeltaPreview() : null;

  return (
    <div className="min-h-screen bg-[#FAF6EE] pb-20">
      <SeoHead
        title="Manage Your Booking – Hotel Carlton | Civil Lines, Bareilly"
        description="Lookup, review, reschedule or cancel your reservation at Hotel Carlton, Civil Lines, Bareilly."
        canonicalPath="/manage-booking"
        breadcrumbs={[{ name: "Manage Booking", item: "/manage-booking" }]}
      />

      <DemoRibbon />
      <Breadcrumbs items={[{ label: "Manage Booking", path: "/manage-booking" }]} navigate={navigate} />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C6F38] font-semibold block mb-1">
            Guest Self-Service
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#2A1D15]">
            Manage Your Reservation
          </h1>
          <DiamondDivider className="my-3" />
          <p className="text-sm text-[#2B2B2B]/75 max-w-lg mx-auto leading-relaxed">
            Enter your Booking Reference ID and registered phone number to view reservation status, modify dates, or request cancellation.
          </p>
        </div>

        {/* Lookup Search Form */}
        <div className="bg-[#FFFDF8] border border-[#D9C9A8] p-6 sm:p-8 rounded-[3px] shadow-xs mb-8">
          <form onSubmit={handleLookup} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-5">
              <label htmlFor="lookup-id" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1">
                Booking Reference ID
              </label>
              <input
                id="lookup-id"
                type="text"
                value={bookingIdInput}
                onChange={(e) => setBookingIdInput(e.target.value.toUpperCase())}
                placeholder="e.g. CARL-261022-P9M4"
                className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] px-3.5 py-2 text-sm font-mono uppercase tracking-wider text-[#2A1D15]"
                required
              />
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="lookup-phone" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1">
                Registered Mobile Number
              </label>
              <input
                id="lookup-phone"
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="10-digit mobile"
                maxLength={10}
                className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] px-3.5 py-2 text-sm text-[#2B2B2B]"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full h-[40px] bg-[#5A1F24] hover:bg-[#6D262C] text-[#FAF6EE] text-xs font-semibold uppercase tracking-widest rounded-[2px] flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Find Booking</span>
              </button>
            </div>
          </form>

          {searchError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-[2px] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          {modifySuccess && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[2px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{modifySuccess}</span>
            </div>
          )}
        </div>

        {/* Display Booking Details */}
        {currentBooking && (
          <div className="bg-[#FFFDF8] border border-[#D9C9A8] rounded-[3px] p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D9C9A8]/40 gap-3">
              <div>
                <span className="text-[11px] font-mono text-[#8C6F38] uppercase tracking-wider block">
                  Reference: {currentBooking.id}
                </span>
                <h2 className="text-2xl font-serif font-semibold text-[#2A1D15]">
                  {currentBooking.roomName}
                </h2>
              </div>

              {/* Status Indicator */}
              <div>
                <span className={`inline-flex items-center px-3 py-1 rounded-[2px] text-xs font-semibold uppercase tracking-wider ${
                  currentBooking.status === 'Confirmed'
                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                    : currentBooking.status === 'Checked-in'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : currentBooking.status === 'Completed'
                    ? 'bg-neutral-100 text-neutral-800 border border-neutral-300'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {currentBooking.status}
                </span>
              </div>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-[#FAF6EE] rounded-[2px] border border-[#D9C9A8]/50">
                <span className="text-[#2B2B2B]/60 uppercase tracking-wider block mb-1">Check-in</span>
                <strong className="text-sm text-[#2A1D15] block">{formatShortDate(currentBooking.checkIn)}</strong>
                <span>2:00 PM</span>
              </div>

              <div className="p-3 bg-[#FAF6EE] rounded-[2px] border border-[#D9C9A8]/50">
                <span className="text-[#2B2B2B]/60 uppercase tracking-wider block mb-1">Check-out</span>
                <strong className="text-sm text-[#2A1D15] block">{formatShortDate(currentBooking.checkOut)}</strong>
                <span>11:00 AM</span>
              </div>

              <div className="p-3 bg-[#FAF6EE] rounded-[2px] border border-[#D9C9A8]/50">
                <span className="text-[#2B2B2B]/60 uppercase tracking-wider block mb-1">Stay Duration</span>
                <strong className="text-sm text-[#2A1D15] block">{currentBooking.nights} Night(s)</strong>
                <span>{currentBooking.roomsCount} Room(s) · {currentBooking.adults} Adult(s)</span>
              </div>

              <div className="p-3 bg-[#FAF6EE] rounded-[2px] border border-[#D9C9A8]/50">
                <span className="text-[#2B2B2B]/60 uppercase tracking-wider block mb-1">Total Bill</span>
                <strong className="text-base font-serif font-bold text-[#5A1F24] block">
                  {formatINR(currentBooking.pricing.grandTotal)}
                </strong>
                <span>{currentBooking.paymentStatus}</span>
              </div>
            </div>

            {/* Guest Info & Requests */}
            <div className="text-xs text-[#2B2B2B]/85 space-y-1.5 pt-2">
              <p><strong>Primary Guest:</strong> {currentBooking.guest.title} {currentBooking.guest.fullName} ({currentBooking.guest.phone})</p>
              <p><strong>Email:</strong> {currentBooking.guest.email}</p>
              {currentBooking.requests.notes && (
                <p><strong>Special Requests:</strong> {currentBooking.requests.notes}</p>
              )}
              {currentBooking.status === 'Cancelled' && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-900 rounded-[2px] mt-2">
                  <p><strong>Cancellation Reason:</strong> {currentBooking.cancellationReason}</p>
                  <p><strong>Fee Assessed:</strong> {formatINR(currentBooking.cancellationFee || 0)}</p>
                </div>
              )}
            </div>

            {/* Actions for active bookings */}
            <div className="pt-4 border-t border-[#D9C9A8]/50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => generateIcsCalendarFile(currentBooking)}
                  className="px-3.5 py-2 bg-[#FFFDF8] border border-[#D9C9A8] hover:bg-[#FAF6EE] text-[#2A1D15] text-xs font-semibold uppercase tracking-wider rounded-[2px] flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#A8884B]" />
                  <span>Download .ics</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-[#FFFDF8] border border-[#D9C9A8] hover:bg-[#FAF6EE] text-[#2A1D15] text-xs font-semibold uppercase tracking-wider rounded-[2px] flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#A8884B]" />
                  <span>Print Voucher</span>
                </button>
              </div>

              {/* If Confirmed, allow Modify Dates and Cancel */}
              {currentBooking.status === 'Confirmed' && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModifyingDates(true);
                      setModifyError(null);
                    }}
                    className="px-4 py-2 bg-[#2A1D15] hover:bg-[#5A1F24] text-[#FAF6EE] text-xs font-semibold uppercase tracking-wider rounded-[2px] cursor-pointer"
                  >
                    Modify Dates
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCancelling(true)}
                    className="px-4 py-2 bg-transparent border border-red-300 text-red-700 hover:bg-red-50 text-xs font-semibold uppercase tracking-wider rounded-[2px] cursor-pointer"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}

              {/* Read only note for completed or cancelled */}
              {(currentBooking.status === 'Completed' || currentBooking.status === 'Cancelled') && (
                <span className="text-xs text-[#2B2B2B]/60 italic">
                  * This reservation is {currentBooking.status.toLowerCase()} and is archived as read-only.
                </span>
              )}
            </div>

          </div>
        )}

      </section>

      {/* ========================================================================= */}
      {/* MODAL: MODIFY DATES                                                       */}
      {/* ========================================================================= */}
      {isModifyingDates && currentBooking && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-label="Modify Stay Dates"
          className="fixed inset-0 z-50 bg-[#2A1D15]/80 flex items-center justify-center p-4 backdrop-blur-2xs"
        >
          <div className="bg-[#FFFDF8] border border-[#D9C9A8] rounded-[3px] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-left">
            <h3 className="text-xl font-serif font-semibold text-[#2A1D15] mb-1">
              Modify Stay Dates
            </h3>
            <p className="text-xs text-[#2B2B2B]/70 mb-4">
              Select new arrival and departure dates for your reservation ({currentBooking.roomName}).
            </p>

            {modifyError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-[2px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{modifyError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1">
                  New Check-In Date
                </label>
                <input
                  type="date"
                  value={newCheckIn}
                  min={getTodayIso()}
                  onChange={(e) => setNewCheckIn(e.target.value)}
                  className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] p-2 text-xs text-[#2A1D15]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1">
                  New Check-Out Date
                </label>
                <input
                  type="date"
                  value={newCheckOut}
                  min={newCheckIn || getTomorrowIso()}
                  onChange={(e) => setNewCheckOut(e.target.value)}
                  className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] p-2 text-xs text-[#2A1D15]"
                />
              </div>
            </div>

            {/* Price difference notice */}
            {delta !== null && (
              <div className="p-3 bg-[#FAF6EE] border border-[#D9C9A8]/60 text-xs rounded-[2px] mb-6">
                <div className="flex justify-between items-center">
                  <span>Tariff Adjustment:</span>
                  <span className={`font-semibold font-mono ${delta > 0 ? 'text-[#5A1F24]' : delta < 0 ? 'text-emerald-800' : 'text-[#2A1D15]'}`}>
                    {delta > 0 ? `+${formatINR(delta)}` : delta < 0 ? `-${formatINR(Math.abs(delta))}` : '₹0 (No change)'}
                  </span>
                </div>
                <p className="text-[11px] text-[#2B2B2B]/60 mt-1">
                  {delta > 0 
                    ? "Additional charges will be added to your booking." 
                    : delta < 0 
                    ? "Reduction will be credited upon check-in." 
                    : "Room rates match previous stay length."}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-[#D9C9A8]/40">
              <button
                type="button"
                onClick={() => setIsModifyingDates(false)}
                className="px-4 py-2 border border-[#D9C9A8] hover:bg-[#FAF6EE] text-xs font-semibold uppercase tracking-wider text-[#2A1D15] rounded-[2px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmModifyDates}
                className="px-5 py-2 bg-[#5A1F24] hover:bg-[#6D262C] text-[#FAF6EE] text-xs font-semibold uppercase tracking-wider rounded-[2px]"
              >
                Confirm Date Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CANCEL BOOKING                                                     */}
      {/* ========================================================================= */}
      {isCancelling && currentBooking && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-label="Confirm Cancellation"
          className="fixed inset-0 z-50 bg-[#2A1D15]/80 flex items-center justify-center p-4 backdrop-blur-2xs"
        >
          <div className="bg-[#FFFDF8] border border-[#D9C9A8] rounded-[3px] max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-left">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-3">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-[#2A1D15] text-center mb-1">
              Cancel Reservation?
            </h3>
            <p className="text-xs text-[#2B2B2B]/75 text-center mb-4">
              Booking {currentBooking.id} · {currentBooking.roomName}
            </p>

            <div className="bg-[#FAF6EE] p-4 rounded-[2px] border border-[#D9C9A8]/60 text-xs text-[#2B2B2B]/85 space-y-2 mb-4">
              <p className="font-semibold text-[#2A1D15]">Cancellation Policy Assessment:</p>
              <p>
                {/* 48 hours calculation */}
                {(() => {
                  const now = new Date();
                  const checkInDate = new Date(`${currentBooking.checkIn}T14:00:00`);
                  const diffHours = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);
                  if (diffHours >= DEMO_CONFIG.FREE_CANCELLATION_HOURS) {
                    return `Your cancellation is outside the 48-hour penalty window. Free cancellation applies (₹0 fee).`;
                  } else {
                    const fee = Math.round(currentBooking.pricing.roomTotal / currentBooking.nights);
                    return `This cancellation is within 48 hours of scheduled check-in. In accordance with policy, a 1-night charge (${formatINR(fee)}) applies.`;
                  }
                })()}
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="cancel-reason" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1">
                Reason for Cancellation
              </label>
              <select
                id="cancel-reason"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] p-2 text-xs text-[#2A1D15]"
              >
                <option value="Change in schedule">Change in travel schedule</option>
                <option value="Travel postponed">Travel postponed</option>
                <option value="Booked by mistake">Booked alternative accommodation</option>
                <option value="Personal emergency">Personal emergency</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#D9C9A8]/40">
              <button
                type="button"
                onClick={() => setIsCancelling(false)}
                className="px-4 py-2 border border-[#D9C9A8] hover:bg-[#FAF6EE] text-xs font-semibold uppercase tracking-wider text-[#2A1D15] rounded-[2px]"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancellation}
                className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold uppercase tracking-wider rounded-[2px]"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

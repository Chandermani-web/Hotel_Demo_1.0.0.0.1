import React, { useState, useEffect, useRef } from 'react';
import { siteConfig } from '../../config/siteConfig';
import { demoRooms, DemoRoom, getRoomById } from '../../data/demo/rooms';
import { validateCoupon, Coupon } from '../../data/demo/coupons';
import { DEMO_CONFIG } from '../../data/demo/policies';
import { 
  getTodayIso, 
  getTomorrowIso, 
  addDays, 
  calculateNights, 
  formatIndianDate, 
  formatShortDate 
} from '../../lib/booking/dates';
import { 
  checkAllRoomsAvailability, 
  verifyRoomAvailabilityForConfirmation, 
  RoomAvailabilityStatus 
} from '../../lib/booking/availability';
import { 
  calculateStayPricing, 
  formatINR, 
  PricingCalculationResult 
} from '../../lib/booking/pricing';
import { 
  validateStayDates, 
  validateGuestForm, 
  GuestFormData 
} from '../../lib/booking/validation';
import { generateBookingId } from '../../lib/booking/ids';
import { 
  saveBooking, 
  getStoredBookings, 
  isLocalStorageUsable 
} from '../../lib/booking/store';
import { StoredBooking, PaymentMethod, PaymentStatus } from '../../data/demo/seedBookings';
import { generateIcsCalendarFile } from '../../lib/booking/ics';

import { DemoRibbon } from '../../components/booking/DemoRibbon';
import { BookingStepper } from '../../components/booking/BookingStepper';
import { PriceSummarySidebar } from '../../components/booking/PriceSummarySidebar';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { SeoHead } from '../../components/SeoHead';
import { DiamondDivider } from '../../components/Ornament';

import { 
  Calendar, 
  Users, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Phone, 
  Printer, 
  Download, 
  Copy, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  Mail, 
  MessageSquare,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Tag
} from 'lucide-react';

interface BookPageProps {
  navigate: (path: string, state?: Record<string, any>) => void;
  navigationState?: Record<string, any>;
}

const SESSION_DRAFT_KEY = 'carlton_booking_draft_v1';

export const BookPage: React.FC<BookPageProps> = ({ navigate, navigationState }) => {
  // Step navigation (1: Search, 2: Choose Room, 3: Details & Requests, 4: Review & Payment, 5: Confirmation)
  const [step, setStep] = useState<number>(1);
  const [maxAccessibleStep, setMaxAccessibleStep] = useState<number>(1);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  // Search parameters
  const [checkIn, setCheckIn] = useState<string>(() => {
    if (navigationState?.checkIn) return navigationState.checkIn;
    // Check URL query parameters
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('checkin')) return params.get('checkin')!;
    }
    return getTodayIso();
  });

  const [checkOut, setCheckOut] = useState<string>(() => {
    if (navigationState?.checkOut) return navigationState.checkOut;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('checkout')) return params.get('checkout')!;
    }
    return addDays(getTodayIso(), 2);
  });

  const [adults, setAdults] = useState<number>(() => {
    if (navigationState?.guests) {
      const g = parseInt(navigationState.guests, 10);
      return isNaN(g) ? 2 : Math.min(6, Math.max(1, g));
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('adults')) return parseInt(params.get('adults')!, 10) || 2;
    }
    return 2;
  });

  const [children, setChildren] = useState<number>(0);
  const [childrenAges, setChildrenAges] = useState<number[]>([]);
  const [roomsCount, setRoomsCount] = useState<number>(1);

  // Room selection
  const [selectedRoomId, setSelectedRoomId] = useState<string>(() => {
    if (navigationState?.roomPreference) {
      const match = demoRooms.find(r => r.name === navigationState.roomPreference);
      if (match) return match.id;
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('room')) return params.get('room')!;
    }
    return 'deluxe-room';
  });

  // Guest details & requests
  const [guestForm, setGuestForm] = useState<GuestFormData>({
    title: 'Mr.',
    fullName: '',
    phone: '',
    email: '',
    gstNumber: ''
  });

  const [requests, setRequests] = useState({
    earlyCheckIn: false,
    lateCheckOut: false,
    extraBed: false,
    groundFloorPreference: false,
    notes: '',
    estimatedArrivalTime: '2:00 PM'
  });

  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Policy agreement & Payment state
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pay_at_hotel');
  const [showSimulatedPaymentModal, setShowSimulatedPaymentModal] = useState(false);
  const [simulatedPaymentFailed, setSimulatedPaymentFailed] = useState(false);

  // Completed booking data
  const [confirmedBooking, setConfirmedBooking] = useState<StoredBooking | null>(null);
  const [copiedIdToast, setCopiedIdToast] = useState(false);

  // Validation errors
  const [dateError, setDateError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [doubleBookingError, setDoubleBookingError] = useState<string | null>(null);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Restore draft from sessionStorage on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedDraft = window.sessionStorage.getItem(SESSION_DRAFT_KEY);
        if (savedDraft) {
          const draft = JSON.parse(savedDraft);
          if (draft.checkIn) setCheckIn(draft.checkIn);
          if (draft.checkOut) setCheckOut(draft.checkOut);
          if (draft.adults) setAdults(draft.adults);
          if (draft.children !== undefined) setChildren(draft.children);
          if (draft.childrenAges) setChildrenAges(draft.childrenAges);
          if (draft.roomsCount) setRoomsCount(draft.roomsCount);
          if (draft.selectedRoomId) setSelectedRoomId(draft.selectedRoomId);
          if (draft.guestForm) setGuestForm(draft.guestForm);
          if (draft.requests) setRequests(draft.requests);
          if (draft.appliedCoupon) setAppliedCoupon(draft.appliedCoupon);
          if (draft.step && draft.step < 5) {
            setStep(draft.step);
            setMaxAccessibleStep(draft.maxAccessibleStep || draft.step);
          }
        }
      } catch (e) {
        console.error("Error restoring booking draft from sessionStorage", e);
      }
    }
  }, []);

  // Save draft to sessionStorage whenever key fields update
  useEffect(() => {
    if (typeof window !== 'undefined' && step < 5) {
      try {
        const draft = {
          step,
          maxAccessibleStep,
          checkIn,
          checkOut,
          adults,
          children,
          childrenAges,
          roomsCount,
          selectedRoomId,
          guestForm,
          requests,
          appliedCoupon
        };
        window.sessionStorage.setItem(SESSION_DRAFT_KEY, JSON.stringify(draft));
      } catch (e) {
        // Ignored
      }
    }
  }, [step, maxAccessibleStep, checkIn, checkOut, adults, children, childrenAges, roomsCount, selectedRoomId, guestForm, requests, appliedCoupon]);

  // Focus step heading on step change
  useEffect(() => {
    stepHeadingRef.current?.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Selected room data
  const selectedRoom = getRoomById(selectedRoomId) || demoRooms[0];

  // Dynamic pricing calculation
  const currentPricing: PricingCalculationResult = calculateStayPricing({
    baseRate: selectedRoom.baseRate,
    checkIn,
    checkOut,
    roomsCount,
    hasExtraBed: requests.extraBed,
    extraBedAllowed: selectedRoom.extraBedAllowed,
    couponDiscountPercent: appliedCoupon?.discountPercentage,
    couponCode: appliedCoupon?.code
  });

  // Dynamic availability list for Step 2
  const roomAvailabilities: RoomAvailabilityStatus[] = checkAllRoomsAvailability(checkIn, checkOut, roomsCount);

  // Sync children ages count
  const handleChildrenChange = (newCount: number) => {
    setChildren(newCount);
    const newAges = [...childrenAges];
    if (newCount > childrenAges.length) {
      for (let i = childrenAges.length; i < newCount; i++) {
        newAges.push(5);
      }
    } else {
      newAges.splice(newCount);
    }
    setChildrenAges(newAges);
  };

  const handleAgeChange = (index: number, age: number) => {
    const updated = [...childrenAges];
    updated[index] = age;
    setChildrenAges(updated);
  };

  // STEP 1 -> STEP 2
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDateError(null);

    const validation = validateStayDates(checkIn, checkOut);
    if (!validation.valid) {
      setDateError(validation.error || "Please select valid check-in and check-out dates.");
      return;
    }

    setStep(2);
    setMaxAccessibleStep(prev => Math.max(prev, 2));
  };

  // STEP 2 -> STEP 3
  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);
    setDoubleBookingError(null);
    setStep(3);
    setMaxAccessibleStep(prev => Math.max(prev, 3));
  };

  // Coupon handling in Step 3
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponMessage(null);
    const result = validateCoupon(couponCodeInput);
    if (result.valid && result.coupon) {
      setAppliedCoupon(result.coupon);
      setCouponMessage({ text: `Promotional code "${result.coupon.code}" applied: 10% off room total!`, isError: false });
    } else {
      setCouponMessage({ text: result.errorMessage || "Invalid code.", isError: true });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput('');
    setCouponMessage(null);
  };

  // STEP 3 -> STEP 4
  const handleGuestDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateGuestForm(guestForm);
    if (!result.valid) {
      setFormErrors(result.errors);
      return;
    }
    setFormErrors({});
    setStep(4);
    setMaxAccessibleStep(prev => Math.max(prev, 4));
  };

  // STEP 4 -> FINAL CONFIRMATION DISPATCH
  const handleFinalizeBooking = (paidOnlineSimulation: boolean = false) => {
    // 1. Double-booking check
    const check = verifyRoomAvailabilityForConfirmation(selectedRoomId, checkIn, checkOut, roomsCount);
    if (!check.available) {
      setDoubleBookingError(
        `Apologies: The ${selectedRoom.name} was just booked for these dates in another session. Please select an available room or try nearby dates.`
      );
      setStep(2);
      setShowSimulatedPaymentModal(false);
      return;
    }

    // 2. Generate unique booking ID
    const existing = getStoredBookings().map(b => b.id);
    const bookingId = generateBookingId(existing);

    const newBooking: StoredBooking = {
      id: bookingId,
      createdAt: getTodayIso(),
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
      checkIn,
      checkOut,
      nights: currentPricing.nightsCount,
      roomsCount,
      adults,
      children,
      guest: { ...guestForm, phone: `+91${guestForm.phone.replace(/[^0-9]/g, '').slice(-10)}` },
      requests: { ...requests },
      pricing: {
        baseRate: selectedRoom.baseRate,
        roomTotal: currentPricing.baseRoomTotal,
        extraBedCharge: currentPricing.extraBedCharge,
        discountAmount: currentPricing.discountAmount,
        couponApplied: appliedCoupon?.code,
        taxAmount: currentPricing.taxAmount,
        grandTotal: currentPricing.grandTotal
      },
      paymentMethod: paidOnlineSimulation ? 'demo_online' : 'pay_at_hotel',
      paymentStatus: paidOnlineSimulation ? 'Paid (Demo simulation)' : 'Pending (Pay at hotel)',
      status: 'Confirmed'
    };

    const saved = saveBooking(newBooking);
    if (saved) {
      // Clear draft
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(SESSION_DRAFT_KEY);
      }
      setConfirmedBooking(newBooking);
      setShowSimulatedPaymentModal(false);
      setStep(5);
      setMaxAccessibleStep(5);
    }
  };

  // Copy Booking ID
  const handleCopyBookingId = () => {
    if (!confirmedBooking) return;
    navigator.clipboard.writeText(confirmedBooking.id);
    setCopiedIdToast(true);
    setTimeout(() => setCopiedIdToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE]">
      <SeoHead
        title="Book Your Stay – Hotel Carlton | Civil Lines, Bareilly"
        description="Demo booking system for Hotel Carlton, Civil Lines, Bareilly. Check availability, choose rooms, and simulate reservations."
        canonicalPath="/book"
      />

      {/* Demo Simulation Banner */}
      <DemoRibbon />

      {/* Accessible Stepper */}
      <BookingStepper
        currentStep={step}
        maxAccessibleStep={maxAccessibleStep}
        onStepClick={(targetStep) => {
          if (targetStep < step) {
            setStep(targetStep);
          }
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Double-booking alert notice */}
        {doubleBookingError && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-300 rounded-[3px] text-amber-900 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Availability Update</p>
              <p>{doubleBookingError}</p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: SEARCH (Dates & Occupancy)                                        */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C6F38] font-semibold block mb-1">
                Step 1 of 5
              </span>
              <h1 
                ref={stepHeadingRef} 
                tabIndex={-1} 
                className="text-3xl sm:text-4xl font-serif font-semibold text-[#2A1D15] outline-hidden"
              >
                Plan Your Stay Dates
              </h1>
              <DiamondDivider className="my-3" />
              <p className="text-sm text-[#2B2B2B]/75 leading-relaxed">
                Choose arrival and departure dates to verify live demo room inventory in Civil Lines, Bareilly.
              </p>
            </div>

            <div className="bg-[#FFFDF8] border border-[#D9C9A8] p-6 sm:p-8 rounded-[3px] shadow-xs">
              {dateError && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-[2px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{dateError}</span>
                </div>
              )}

              <form onSubmit={handleSearchSubmit} className="space-y-6">
                
                {/* Dates Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="step1-checkin" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#A8884B]" aria-hidden="true" />
                      <span>Check-In Date</span>
                    </label>
                    <input
                      id="step1-checkin"
                      type="date"
                      value={checkIn}
                      min={getTodayIso()}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] px-3.5 py-2.5 text-sm text-[#2B2B2B] focus:border-[#A8884B] focus:outline-hidden focus:ring-1 focus:ring-[#A8884B]"
                      required
                    />
                    <span className="text-[11px] text-[#2B2B2B]/60 mt-1 block">
                      {checkIn ? formatIndianDate(checkIn) : 'Standard check-in from 2:00 PM'}
                    </span>
                  </div>

                  <div>
                    <label htmlFor="step1-checkout" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#A8884B]" aria-hidden="true" />
                      <span>Check-Out Date</span>
                    </label>
                    <input
                      id="step1-checkout"
                      type="date"
                      value={checkOut}
                      min={checkIn || getTomorrowIso()}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] px-3.5 py-2.5 text-sm text-[#2B2B2B] focus:border-[#A8884B] focus:outline-hidden focus:ring-1 focus:ring-[#A8884B]"
                      required
                    />
                    <span className="text-[11px] text-[#2B2B2B]/60 mt-1 block">
                      {checkOut ? formatIndianDate(checkOut) : 'Check-out until 11:00 AM'}
                    </span>
                  </div>
                </div>

                {/* Stay Duration Display */}
                <div className="p-3 bg-[#FAF6EE] border border-[#D9C9A8]/60 rounded-[2px] flex items-center justify-between text-xs text-[#2A1D15]">
                  <span>Stay Duration:</span>
                  <span className="font-semibold font-mono text-sm">
                    {calculateNights(checkIn, checkOut)} Night(s)
                  </span>
                </div>

                {/* Rooms & Guests */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="step1-rooms" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1.5">
                      Number of Rooms
                    </label>
                    <select
                      id="step1-rooms"
                      value={roomsCount}
                      onChange={(e) => setRoomsCount(parseInt(e.target.value, 10))}
                      className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] px-3 py-2.5 text-sm text-[#2B2B2B] focus:border-[#A8884B]"
                    >
                      <option value={1}>1 Room</option>
                      <option value={2}>2 Rooms</option>
                      <option value={3}>3 Rooms</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="step1-adults" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1.5">
                      Adults (12+ yrs)
                    </label>
                    <select
                      id="step1-adults"
                      value={adults}
                      onChange={(e) => setAdults(parseInt(e.target.value, 10))}
                      className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] px-3 py-2.5 text-sm text-[#2B2B2B] focus:border-[#A8884B]"
                    >
                      <option value={1}>1 Adult</option>
                      <option value={2}>2 Adults</option>
                      <option value={3}>3 Adults</option>
                      <option value={4}>4 Adults</option>
                      <option value={5}>5 Adults</option>
                      <option value={6}>6 Adults</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="step1-children" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1.5">
                      Children (0–11 yrs)
                    </label>
                    <select
                      id="step1-children"
                      value={children}
                      onChange={(e) => handleChildrenChange(parseInt(e.target.value, 10))}
                      className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] px-3 py-2.5 text-sm text-[#2B2B2B] focus:border-[#A8884B]"
                    >
                      <option value={0}>0 Children</option>
                      <option value={1}>1 Child</option>
                      <option value={2}>2 Children</option>
                      <option value={3}>3 Children</option>
                    </select>
                  </div>
                </div>

                {/* Child age selection for free child policy (< 6 free) */}
                {children > 0 && (
                  <div className="p-4 bg-[#FAF6EE] border border-[#D9C9A8]/60 rounded-[2px] space-y-2">
                    <span className="text-xs font-semibold text-[#2A1D15] uppercase tracking-wider block">
                      Child Ages at Stay (Children under 6 stay free)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {childrenAges.map((age, idx) => (
                        <div key={idx}>
                          <label className="text-[11px] text-[#2B2B2B]/70 block mb-1">Child {idx + 1} Age</label>
                          <select
                            value={age}
                            onChange={(e) => handleAgeChange(idx, parseInt(e.target.value, 10))}
                            className="w-full bg-[#FFFDF8] border border-[#D9C9A8] rounded-[2px] px-2 py-1 text-xs"
                          >
                            {Array.from({ length: 12 }, (_, i) => (
                              <option key={i} value={i}>
                                {i === 0 ? 'Under 1 yr' : `${i} year${i > 1 ? 's' : ''}`} {i < 6 ? '(Free)' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#5A1F24] hover:bg-[#6D262C] text-[#FAF6EE] text-xs font-semibold uppercase tracking-widest rounded-[2px] border border-[#5A1F24] shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Check Room Availability</span>
                    <ArrowRight className="w-4 h-4 text-[#D9C9A8]" aria-hidden="true" />
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: CHOOSE ROOM                                                       */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div>
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C6F38] font-semibold block mb-1">
                Step 2 of 5
              </span>
              <h1 
                ref={stepHeadingRef} 
                tabIndex={-1} 
                className="text-3xl sm:text-4xl font-serif font-semibold text-[#2A1D15] outline-hidden"
              >
                Select Your Accommodation
              </h1>
              <DiamondDivider className="my-3" />
              <p className="text-sm text-[#2B2B2B]/75 leading-relaxed">
                Available rooms for <strong className="text-[#2A1D15] font-semibold">{formatShortDate(checkIn)}</strong> to <strong className="text-[#2A1D15] font-semibold">{formatShortDate(checkOut)}</strong> ({calculateNights(checkIn, checkOut)} nights, {roomsCount} room{roomsCount > 1 ? 's' : ''}).
              </p>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#8C6F38] hover:text-[#5A1F24] underline cursor-pointer"
                >
                  Change Dates or Guests
                </button>
              </div>
            </div>

            <div className="space-y-8 max-w-5xl mx-auto">
              {roomAvailabilities.map(({ room, available, minRemainingInventory, isFewLeft, suggestedCheckInDates }) => {
                const stayPricing = calculateStayPricing({
                  baseRate: room.baseRate,
                  checkIn,
                  checkOut,
                  roomsCount
                });

                return (
                  <article
                    key={room.id}
                    className={`bg-[#FFFDF8] border rounded-[3px] overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12 items-stretch transition-all ${
                      available ? 'border-[#D9C9A8]' : 'border-neutral-300 opacity-75'
                    }`}
                  >
                    {/* Room Photo */}
                    <div className="md:col-span-5 relative min-h-[220px]">
                      <img
                        src={room.image}
                        alt={room.imageAlt}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover ${!available ? 'grayscale-40' : ''}`}
                      />
                      {/* Few Left Warning */}
                      {isFewLeft && (
                        <div className="absolute top-3 left-3 bg-[#5A1F24] text-[#FAF6EE] text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-[2px] shadow-sm">
                          Only {minRemainingInventory} left!
                        </div>
                      )}
                      {!available && (
                        <div className="absolute inset-0 bg-neutral-900/60 flex items-center justify-center p-4">
                          <span className="bg-[#2A1D15] text-[#FAF6EE] text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-[2px]">
                            Sold Out for Selected Dates
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Room Information */}
                    <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <span className="text-xs uppercase tracking-widest text-[#8C6F38] font-semibold">
                            Max {room.maxOccupancy} Guests · {room.bedType}
                          </span>
                          <span className="text-xs text-[#2B2B2B]/60 font-mono">
                            {minRemainingInventory} of {room.inventoryCount} Available
                          </span>
                        </div>

                        <h2 className="text-2xl font-serif font-semibold text-[#2A1D15] mb-2">
                          {room.name}
                        </h2>

                        <p className="text-xs sm:text-sm text-[#2B2B2B]/80 leading-relaxed mb-4">
                          {room.shortDesc}
                        </p>

                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#2B2B2B]/70 mb-4">
                          {room.confirmedAmenities.map((am, aIdx) => (
                            <React.Fragment key={am}>
                              <span>{am}</span>
                              {aIdx < room.confirmedAmenities.length - 1 && <span className="text-[#A8884B]">·</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {/* Pricing & Selection */}
                      <div className="pt-4 border-t border-[#D9C9A8]/40 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                          <span className="text-[11px] text-[#2B2B2B]/60 uppercase tracking-wider block">
                            Demo Tariff
                          </span>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl sm:text-2xl font-serif font-bold text-[#2A1D15]">
                              {formatINR(room.baseRate)}
                            </span>
                            <span className="text-xs text-[#2B2B2B]/70">/ night</span>
                          </div>
                          <span className="text-xs font-semibold text-[#5A1F24]">
                            Total {formatINR(stayPricing.grandTotal)} for {stayPricing.nightsCount} night(s)
                          </span>
                        </div>

                        <div>
                          {available ? (
                            <button
                              type="button"
                              onClick={() => handleRoomSelect(room.id)}
                              className="w-full sm:w-auto px-6 py-3 bg-[#5A1F24] hover:bg-[#6D262C] text-[#FAF6EE] text-xs font-semibold uppercase tracking-widest rounded-[2px] transition-colors cursor-pointer shadow-xs"
                            >
                              Select Room
                            </button>
                          ) : (
                            <div className="space-y-2 text-right sm:text-right">
                              <span className="text-xs font-medium text-neutral-600 block">
                                Not available for these dates
                              </span>
                              {suggestedCheckInDates && suggestedCheckInDates.length > 0 && (
                                <div className="text-left bg-[#FAF6EE] p-2.5 rounded-[2px] border border-[#D9C9A8]/60 text-xs">
                                  <span className="font-semibold text-[#8C6F38] block mb-1">
                                    Next Available Check-In Dates:
                                  </span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {suggestedCheckInDates.map(dateStr => (
                                      <button
                                        key={dateStr}
                                        type="button"
                                        onClick={() => {
                                          setCheckIn(dateStr);
                                          setCheckOut(addDays(dateStr, calculateNights(checkIn, checkOut)));
                                        }}
                                        className="px-2 py-1 bg-[#FFFDF8] hover:bg-[#D9C9A8] border border-[#D9C9A8] text-[11px] font-mono rounded-[2px] transition-colors"
                                      >
                                        {formatShortDate(dateStr)}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </article>
                );
              })}

              {/* Friendly Empty State if all rooms are sold out */}
              {roomAvailabilities.every(r => !r.available) && (
                <div className="bg-[#FFFDF8] border border-[#D9C9A8] p-8 text-center rounded-[3px]">
                  <h3 className="text-xl font-serif font-semibold text-[#2A1D15] mb-2">
                    No Rooms Available for Selected Dates
                  </h3>
                  <p className="text-sm text-[#2B2B2B]/75 max-w-md mx-auto mb-6">
                    All inventory is committed for these dates. Please consider altering your stay window, or contact our reservations desk directly.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-2.5 bg-[#5A1F24] text-[#FAF6EE] text-xs font-semibold uppercase tracking-wider rounded-[2px]"
                    >
                      Search Different Dates
                    </button>
                    <a
                      href={`tel:${siteConfig.phoneTel}`}
                      className="px-5 py-2.5 border border-[#A8884B] text-[#2A1D15] text-xs font-semibold uppercase tracking-wider rounded-[2px]"
                    >
                      Call Front Desk: {siteConfig.phone}
                    </a>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-[#D9C9A8] hover:bg-[#FAF6EE] text-xs font-semibold uppercase tracking-wider text-[#2A1D15] rounded-[2px] flex items-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Dates</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: GUEST DETAILS & SPECIAL REQUESTS                                   */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div>
            <div className="text-center mb-8">
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C6F38] font-semibold block mb-1">
                Step 3 of 5
              </span>
              <h1 
                ref={stepHeadingRef} 
                tabIndex={-1} 
                className="text-3xl sm:text-4xl font-serif font-semibold text-[#2A1D15] outline-hidden"
              >
                Guest Information & Preferences
              </h1>
              <DiamondDivider className="my-3" />
              <p className="text-sm text-[#2B2B2B]/75 leading-relaxed">
                Provide primary guest details and any preferences for your stay in Civil Lines.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Section */}
              <div className="lg:col-span-8 bg-[#FFFDF8] border border-[#D9C9A8] p-6 sm:p-8 rounded-[3px] shadow-xs">
                <form onSubmit={handleGuestDetailsSubmit} className="space-y-6">
                  
                  {/* Guest Name & Title */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-3">
                      <label htmlFor="guest-title" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1">
                        Title
                      </label>
                      <select
                        id="guest-title"
                        value={guestForm.title}
                        onChange={(e) => setGuestForm({ ...guestForm, title: e.target.value })}
                        className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] px-3 py-2 text-sm text-[#2B2B2B] focus:border-[#A8884B]"
                      >
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Dr.">Dr.</option>
                      </select>
                    </div>

                    <div className="sm:col-span-9">
                      <label htmlFor="guest-fullname" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1">
                        Full Name <span className="text-[#5A1F24]">*</span>
                      </label>
                      <input
                        id="guest-fullname"
                        type="text"
                        value={guestForm.fullName}
                        onChange={(e) => setGuestForm({ ...guestForm, fullName: e.target.value })}
                        placeholder="e.g. Anand Vardhan Sharma"
                        className={`w-full bg-[#FAF6EE] border rounded-[2px] px-3.5 py-2 text-sm text-[#2B2B2B] focus:outline-hidden ${
                          formErrors.fullName ? 'border-red-500' : 'border-[#D9C9A8] focus:border-[#A8884B]'
                        }`}
                        required
                      />
                      {formErrors.fullName && (
                        <span className="text-[11px] text-red-600 mt-1 block">{formErrors.fullName}</span>
                      )}
                    </div>
                  </div>

                  {/* Contact Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="guest-phone" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1">
                        Mobile Phone Number <span className="text-[#5A1F24]">*</span>
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 bg-[#EAE2D2] border border-r-0 border-[#D9C9A8] text-xs font-mono font-medium text-[#2A1D15] rounded-l-[2px]">
                          +91
                        </span>
                        <input
                          id="guest-phone"
                          type="tel"
                          value={guestForm.phone}
                          onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })}
                          placeholder="9876543210"
                          maxLength={10}
                          className={`w-full bg-[#FAF6EE] border rounded-r-[2px] px-3.5 py-2 text-sm text-[#2B2B2B] focus:outline-hidden ${
                            formErrors.phone ? 'border-red-500' : 'border-[#D9C9A8] focus:border-[#A8884B]'
                          }`}
                          required
                        />
                      </div>
                      {formErrors.phone ? (
                        <span className="text-[11px] text-red-600 mt-1 block">{formErrors.phone}</span>
                      ) : (
                        <span className="text-[11px] text-[#2B2B2B]/60 mt-1 block">10-digit Indian mobile number</span>
                      )}
                    </div>

                    <div>
                      <label htmlFor="guest-email" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1">
                        Email Address <span className="text-[#5A1F24]">*</span>
                      </label>
                      <input
                        id="guest-email"
                        type="email"
                        value={guestForm.email}
                        onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
                        placeholder="anand.sharma@example.com"
                        className={`w-full bg-[#FAF6EE] border rounded-[2px] px-3.5 py-2 text-sm text-[#2B2B2B] focus:outline-hidden ${
                          formErrors.email ? 'border-red-500' : 'border-[#D9C9A8] focus:border-[#A8884B]'
                        }`}
                        required
                      />
                      {formErrors.email && (
                        <span className="text-[11px] text-red-600 mt-1 block">{formErrors.email}</span>
                      )}
                    </div>
                  </div>

                  {/* GST Number (Optional) */}
                  <div>
                    <label htmlFor="guest-gst" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1">
                      Company GSTIN <span className="text-[#2B2B2B]/50 font-normal">(Optional for business invoice)</span>
                    </label>
                    <input
                      id="guest-gst"
                      type="text"
                      value={guestForm.gstNumber || ''}
                      onChange={(e) => setGuestForm({ ...guestForm, gstNumber: e.target.value.toUpperCase() })}
                      placeholder="e.g. 09AAAAA0000A1Z5"
                      maxLength={15}
                      className={`w-full bg-[#FAF6EE] border rounded-[2px] px-3.5 py-2 text-sm text-[#2B2B2B] font-mono focus:outline-hidden ${
                        formErrors.gstNumber ? 'border-red-500' : 'border-[#D9C9A8] focus:border-[#A8884B]'
                      }`}
                    />
                    {formErrors.gstNumber && (
                      <span className="text-[11px] text-red-600 mt-1 block">{formErrors.gstNumber}</span>
                    )}
                  </div>

                  {/* Arrival Time */}
                  <div>
                    <label htmlFor="guest-arrival" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1">
                      Estimated Arrival Time
                    </label>
                    <select
                      id="guest-arrival"
                      value={requests.estimatedArrivalTime}
                      onChange={(e) => setRequests({ ...requests, estimatedArrivalTime: e.target.value })}
                      className="w-full sm:w-64 bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] px-3 py-2 text-sm text-[#2B2B2B]"
                    >
                      <option value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</option>
                      <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM (Standard Check-in)</option>
                      <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                      <option value="6:00 PM - 9:00 PM">6:00 PM - 9:00 PM</option>
                      <option value="Late Evening (After 9 PM)">Late Evening (After 9 PM)</option>
                    </select>
                  </div>

                  {/* Special Requests Checkboxes */}
                  <div className="pt-4 border-t border-[#D9C9A8]/50">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6F38] block mb-3">
                      Stay Preferences & Requests
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#2B2B2B]/85">
                      <label className="flex items-center gap-2 p-2.5 bg-[#FAF6EE] border border-[#D9C9A8]/40 rounded-[2px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={requests.earlyCheckIn}
                          onChange={(e) => setRequests({ ...requests, earlyCheckIn: e.target.checked })}
                          className="accent-[#5A1F24]"
                        />
                        <span>Early Check-in Request (Subject to availability)</span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 bg-[#FAF6EE] border border-[#D9C9A8]/40 rounded-[2px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={requests.lateCheckOut}
                          onChange={(e) => setRequests({ ...requests, lateCheckOut: e.target.checked })}
                          className="accent-[#5A1F24]"
                        />
                        <span>Late Check-out Request (Subject to availability)</span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 bg-[#FAF6EE] border border-[#D9C9A8]/40 rounded-[2px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={requests.groundFloorPreference}
                          onChange={(e) => setRequests({ ...requests, groundFloorPreference: e.target.checked })}
                          className="accent-[#5A1F24]"
                        />
                        <span>Ground Floor / Verandah Preference</span>
                      </label>

                      {/* Extra Bed (Only allowed on Executive & Suite) */}
                      {selectedRoom.extraBedAllowed ? (
                        <label className="flex items-center gap-2 p-2.5 bg-[#FAF6EE] border border-[#D9C9A8]/40 rounded-[2px] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={requests.extraBed}
                            onChange={(e) => setRequests({ ...requests, extraBed: e.target.checked })}
                            className="accent-[#5A1F24]"
                          />
                          <span>
                            Request Extra Bed (<strong>+Rs. 700 / night</strong>)
                          </span>
                        </label>
                      ) : (
                        <div className="p-2.5 bg-[#FAF6EE]/50 border border-dashed border-[#D9C9A8]/40 rounded-[2px] text-[11px] text-[#2B2B2B]/50">
                          * Extra bed not accommodated in {selectedRoom.name}.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Special Requests Textarea */}
                  <div>
                    <label htmlFor="guest-notes" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1">
                      Additional Notes or Requests
                    </label>
                    <textarea
                      id="guest-notes"
                      rows={2}
                      value={requests.notes}
                      onChange={(e) => setRequests({ ...requests, notes: e.target.value })}
                      placeholder="Special dietary considerations, quiet room preference, or arrival details..."
                      className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] px-3.5 py-2 text-sm text-[#2B2B2B]"
                    />
                  </div>

                  {/* Coupon Code Section */}
                  <div className="pt-4 border-t border-[#D9C9A8]/50">
                    <label htmlFor="coupon-input" className="block text-xs font-semibold uppercase tracking-wider text-[#8C6F38] mb-1.5 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Promotional Code (Demo)</span>
                    </label>
                    
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-[2px] text-xs">
                        <span className="font-semibold text-emerald-800">
                          Code "{appliedCoupon.code}" applied ({appliedCoupon.discountPercentage}% off room total)
                        </span>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-xs text-red-700 hover:underline font-medium ml-3 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          id="coupon-input"
                          type="text"
                          value={couponCodeInput}
                          onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                          placeholder="e.g. CARLTON10"
                          className="bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] px-3 py-2 text-xs font-mono uppercase tracking-wider w-48 text-[#2A1D15]"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="px-4 py-2 bg-[#2A1D15] hover:bg-[#5A1F24] text-[#FAF6EE] text-xs font-semibold uppercase tracking-wider rounded-[2px] cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                    )}

                    {couponMessage && (
                      <span className={`text-[11px] mt-1.5 block ${couponMessage.isError ? 'text-red-600' : 'text-emerald-700 font-medium'}`}>
                        {couponMessage.text}
                      </span>
                    )}
                    <span className="text-[11px] text-[#2B2B2B]/50 mt-1 block">
                      * Try demo promotional coupon <strong>CARLTON10</strong> for 10% discount.
                    </span>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="pt-6 border-t border-[#D9C9A8]/50 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2.5 border border-[#D9C9A8] hover:bg-[#FAF6EE] text-xs font-semibold uppercase tracking-wider text-[#2A1D15] rounded-[2px] flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Rooms</span>
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#5A1F24] hover:bg-[#6D262C] text-[#FAF6EE] text-xs font-semibold uppercase tracking-widest rounded-[2px] flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>Continue to Review</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#D9C9A8]" />
                    </button>
                  </div>

                </form>
              </div>

              {/* Sidebar Summary */}
              <div className="lg:col-span-4">
                <PriceSummarySidebar
                  room={selectedRoom}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  pricing={currentPricing}
                />
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: REVIEW & PAYMENT                                                  */}
        {/* ========================================================================= */}
        {step === 4 && (
          <div>
            <div className="text-center mb-8">
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C6F38] font-semibold block mb-1">
                Step 4 of 5
              </span>
              <h1 
                ref={stepHeadingRef} 
                tabIndex={-1} 
                className="text-3xl sm:text-4xl font-serif font-semibold text-[#2A1D15] outline-hidden"
              >
                Review & Confirm Reservation
              </h1>
              <DiamondDivider className="my-3" />
              <p className="text-sm text-[#2B2B2B]/75 leading-relaxed">
                Please verify your stay details and select your preferred simulated payment method.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Review Manifest */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Stay & Room Summary Card */}
                <div className="bg-[#FFFDF8] border border-[#D9C9A8] p-6 sm:p-8 rounded-[3px] shadow-xs">
                  <div className="flex justify-between items-center pb-4 border-b border-[#D9C9A8]/40 mb-4">
                    <h2 className="text-lg font-serif font-semibold text-[#2A1D15]">
                      Reservation Details
                    </h2>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs text-[#8C6F38] hover:underline"
                    >
                      Change Room
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[#2B2B2B]/60 uppercase tracking-wider block mb-1">Selected Room:</span>
                      <strong className="text-sm font-serif text-[#2A1D15]">{selectedRoom.name}</strong>
                      <p className="text-[#2B2B2B]/75 mt-0.5">{selectedRoom.bedType}</p>
                    </div>

                    <div>
                      <span className="text-[#2B2B2B]/60 uppercase tracking-wider block mb-1">Duration:</span>
                      <strong className="text-sm text-[#2A1D15]">
                        {currentPricing.nightsCount} Night(s) · {roomsCount} Room(s)
                      </strong>
                      <p className="text-[#2B2B2B]/75 mt-0.5">
                        {formatShortDate(checkIn)} to {formatShortDate(checkOut)}
                      </p>
                    </div>

                    <div>
                      <span className="text-[#2B2B2B]/60 uppercase tracking-wider block mb-1">Check-in / Check-out:</span>
                      <p className="text-[#2A1D15]">Check-in: 2:00 PM · Check-out: 11:00 AM</p>
                      <p className="text-[#2B2B2B]/70">Est. Arrival: {requests.estimatedArrivalTime}</p>
                    </div>

                    <div>
                      <span className="text-[#2B2B2B]/60 uppercase tracking-wider block mb-1">Guests:</span>
                      <p className="text-[#2A1D15]">{adults} Adult(s){children > 0 ? `, ${children} Child(ren)` : ''}</p>
                    </div>
                  </div>

                  {/* Special Requests summary */}
                  <div className="mt-4 pt-4 border-t border-[#D9C9A8]/40 text-xs">
                    <span className="text-[#2B2B2B]/60 uppercase tracking-wider block mb-1">Preferences & Notes:</span>
                    <div className="flex flex-wrap gap-2 text-[#2A1D15]">
                      {requests.earlyCheckIn && <span className="bg-[#FAF6EE] px-2 py-0.5 border border-[#D9C9A8]/60">Early Check-in Requested</span>}
                      {requests.lateCheckOut && <span className="bg-[#FAF6EE] px-2 py-0.5 border border-[#D9C9A8]/60">Late Check-out Requested</span>}
                      {requests.groundFloorPreference && <span className="bg-[#FAF6EE] px-2 py-0.5 border border-[#D9C9A8]/60">Ground Floor Preferred</span>}
                      {requests.extraBed && <span className="bg-[#FAF6EE] px-2 py-0.5 border border-[#D9C9A8]/60">Extra Bed Included</span>}
                      {!requests.earlyCheckIn && !requests.lateCheckOut && !requests.groundFloorPreference && !requests.extraBed && (
                        <span className="text-[#2B2B2B]/60">Standard room preferences</span>
                      )}
                    </div>
                    {requests.notes && (
                      <p className="mt-2 text-[#2B2B2B]/80 italic">"{requests.notes}"</p>
                    )}
                  </div>
                </div>

                {/* Guest Contact Details Summary */}
                <div className="bg-[#FFFDF8] border border-[#D9C9A8] p-6 rounded-[3px] shadow-xs">
                  <div className="flex justify-between items-center pb-3 border-b border-[#D9C9A8]/40 mb-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[#2A1D15]">
                      Guest Contact
                    </h3>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-xs text-[#8C6F38] hover:underline"
                    >
                      Edit Details
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-[#2B2B2B]/60 block mb-0.5">Guest Name:</span>
                      <strong className="text-[#2A1D15]">{guestForm.title} {guestForm.fullName}</strong>
                    </div>
                    <div>
                      <span className="text-[#2B2B2B]/60 block mb-0.5">Telephone:</span>
                      <strong className="text-[#2A1D15]">+91 {guestForm.phone}</strong>
                    </div>
                    <div>
                      <span className="text-[#2B2B2B]/60 block mb-0.5">Confirmation Email:</span>
                      <strong className="text-[#2A1D15]">{guestForm.email}</strong>
                    </div>
                  </div>
                  {guestForm.gstNumber && (
                    <div className="mt-2 text-xs">
                      <span className="text-[#2B2B2B]/60">GSTIN: </span>
                      <strong className="font-mono text-[#2A1D15]">{guestForm.gstNumber}</strong>
                    </div>
                  )}
                </div>

                {/* Policies & Agreement */}
                <div className="bg-[#FAF6EE] border border-[#D9C9A8] p-5 rounded-[3px] text-xs text-[#2B2B2B]/85 space-y-2">
                  <h4 className="font-semibold text-[#2A1D15] uppercase tracking-wider mb-1">
                    Hotel Policies & Cancellation Rules (Demo)
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-[#2B2B2B]/80">
                    <li>Check-in: 2:00 PM · Check-out: 11:00 AM.</li>
                    <li><strong>Free cancellation:</strong> Cancel up to 48 hours prior to check-in for a full refund (or zero penalty). Cancellations within 48 hours incur a 1-night room charge.</li>
                    <li>Valid government photo ID is mandatory for all adult guests upon arrival in Bareilly.</li>
                  </ul>

                  <label className="flex items-start gap-2.5 pt-3 border-t border-[#D9C9A8]/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAgreed}
                      onChange={(e) => setTermsAgreed(e.target.checked)}
                      className="mt-0.5 accent-[#5A1F24]"
                    />
                    <span className="font-semibold text-[#2A1D15]">
                      I understand and agree to the hotel booking terms, cancellation policy, and demo simulation rules. <span className="text-[#5A1F24]">*</span>
                    </span>
                  </label>
                </div>

                {/* Payment Selection */}
                <div className="bg-[#FFFDF8] border border-[#D9C9A8] p-6 rounded-[3px] shadow-xs">
                  <h3 className="text-base font-serif font-semibold text-[#2A1D15] mb-2">
                    Payment Selection (Demo Simulation)
                  </h3>
                  <p className="text-xs text-[#2B2B2B]/70 mb-4">
                    Choose how you would like to complete this demonstration reservation. No actual card or bank charges will be processed.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Pay at hotel */}
                    <label 
                      className={`p-4 border rounded-[3px] cursor-pointer flex flex-col justify-between transition-all ${
                        paymentMethod === 'pay_at_hotel'
                          ? 'border-[#5A1F24] bg-[#FAF6EE]/80 ring-1 ring-[#5A1F24]'
                          : 'border-[#D9C9A8] hover:border-[#A8884B]'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'pay_at_hotel'}
                          onChange={() => setPaymentMethod('pay_at_hotel')}
                          className="accent-[#5A1F24]"
                        />
                        <span className="font-semibold text-sm text-[#2A1D15]">Pay at Hotel</span>
                      </div>
                      <p className="text-xs text-[#2B2B2B]/75 leading-relaxed pl-6">
                        Confirm reservation now with zero prepayment. Settle room charges in cash, UPI, or card upon arrival at reception.
                      </p>
                    </label>

                    {/* Pay online demo */}
                    <label 
                      className={`p-4 border rounded-[3px] cursor-pointer flex flex-col justify-between transition-all ${
                        paymentMethod === 'demo_online'
                          ? 'border-[#5A1F24] bg-[#FAF6EE]/80 ring-1 ring-[#5A1F24]'
                          : 'border-[#D9C9A8] hover:border-[#A8884B]'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'demo_online'}
                          onChange={() => setPaymentMethod('demo_online')}
                          className="accent-[#5A1F24]"
                        />
                        <span className="font-semibold text-sm text-[#2A1D15]">Pay Online (Simulated)</span>
                      </div>
                      <p className="text-xs text-[#2B2B2B]/75 leading-relaxed pl-6">
                        Simulate an instant gateway authorization. Opens a zero-risk simulator testing both success and failure states.
                      </p>
                    </label>

                  </div>
                </div>

                {/* Final Submission Trigger */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-4 py-2.5 border border-[#D9C9A8] hover:bg-[#FAF6EE] text-xs font-semibold uppercase tracking-wider text-[#2A1D15] rounded-[2px] flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Details</span>
                  </button>

                  <button
                    type="button"
                    disabled={!termsAgreed}
                    onClick={() => {
                      if (paymentMethod === 'demo_online') {
                        setShowSimulatedPaymentModal(true);
                      } else {
                        handleFinalizeBooking(false);
                      }
                    }}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#5A1F24] hover:bg-[#6D262C] disabled:opacity-50 disabled:cursor-not-allowed text-[#FAF6EE] text-xs font-semibold uppercase tracking-widest rounded-[2px] shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#D9C9A8]" />
                    <span>
                      {paymentMethod === 'demo_online' ? 'Proceed to Simulated Payment' : 'Confirm Reservation (Pay at Hotel)'}
                    </span>
                  </button>
                </div>

              </div>

              {/* Sidebar Summary */}
              <div className="lg:col-span-4">
                <PriceSummarySidebar
                  room={selectedRoom}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  pricing={currentPricing}
                />
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: CONFIRMATION                                                      */}
        {/* ========================================================================= */}
        {step === 5 && confirmedBooking && (
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Header Stamp */}
            <div className="bg-[#FFFDF8] border border-[#D9C9A8] p-8 md:p-10 rounded-[3px] text-center shadow-xs">
              <div className="w-16 h-16 bg-[#5A1F24]/10 text-[#5A1F24] rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8" />
              </div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C6F38] font-semibold block mb-1">
                Reservation Confirmed (Demo)
              </span>
              <h1 
                ref={stepHeadingRef} 
                tabIndex={-1} 
                className="text-3xl sm:text-4xl font-serif font-semibold text-[#2A1D15] outline-hidden mb-2"
              >
                Thank You, {confirmedBooking.guest.title} {confirmedBooking.guest.fullName}
              </h1>
              <p className="text-sm text-[#2B2B2B]/80 max-w-lg mx-auto leading-relaxed mb-6">
                Your reservation at Hotel Carlton in Civil Lines, Bareilly has been generated in the demo system.
              </p>

              {/* Prominent Booking Reference Card */}
              <div className="max-w-md mx-auto p-4 bg-[#FAF6EE] border border-[#A8884B] rounded-[2px] flex items-center justify-between gap-4 mb-6">
                <div className="text-left">
                  <span className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/60 block">Booking Reference ID</span>
                  <span className="text-xl sm:text-2xl font-mono font-bold text-[#5A1F24] tracking-wider">
                    {confirmedBooking.id}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyBookingId}
                  className="px-3 py-1.5 bg-[#FFFDF8] border border-[#D9C9A8] hover:bg-[#FAF6EE] text-xs font-medium text-[#2A1D15] rounded-[2px] flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Copy booking ID to clipboard"
                >
                  <Copy className="w-3.5 h-3.5 text-[#A8884B]" />
                  <span>{copiedIdToast ? "Copied!" : "Copy"}</span>
                </button>
              </div>

              {/* Status Pills as clean text with separators */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#2B2B2B]/75 mb-6">
                <span>Status: <strong className="text-emerald-800">{confirmedBooking.status}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Payment: <strong className="text-[#2A1D15]">{confirmedBooking.paymentStatus}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Total: <strong className="text-[#5A1F24] font-mono">{formatINR(confirmedBooking.pricing.grandTotal)}</strong></span>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-[#D9C9A8]/40">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#2A1D15] hover:bg-[#5A1F24] text-[#FAF6EE] text-xs font-semibold uppercase tracking-wider rounded-[2px] flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#D9C9A8]" />
                  <span>Print / Save PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => generateIcsCalendarFile(confirmedBooking)}
                  className="px-4 py-2 bg-[#FFFDF8] border border-[#A8884B] hover:bg-[#FAF6EE] text-[#2A1D15] text-xs font-semibold uppercase tracking-wider rounded-[2px] flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#A8884B]" />
                  <span>Add to Calendar (.ics)</span>
                </button>

                {siteConfig.whatsappNumber && (
                  <a
                    href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(`Hello Hotel Carlton, I have booked ${confirmedBooking.roomName} under ID ${confirmedBooking.id}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold uppercase tracking-wider rounded-[2px] flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Share on WhatsApp</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => navigate('/manage-booking', { bookingId: confirmedBooking.id, phone: confirmedBooking.guest.phone })}
                  className="px-4 py-2 border border-[#D9C9A8] hover:bg-[#FAF6EE] text-xs font-semibold uppercase tracking-wider text-[#2A1D15] rounded-[2px]"
                >
                  Manage This Booking
                </button>
              </div>

            </div>

            {/* Structured Summary Sheet */}
            <div className="bg-[#FFFDF8] border border-[#D9C9A8] p-6 sm:p-8 rounded-[3px] shadow-xs">
              <h2 className="text-xl font-serif font-semibold text-[#2A1D15] mb-4 pb-2 border-b border-[#D9C9A8]/50">
                Reservation Voucher & Specifications
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs text-[#2B2B2B]/85 mb-6">
                <div>
                  <span className="text-[#2B2B2B]/60 uppercase tracking-wider block mb-1">Accommodation</span>
                  <strong className="text-sm font-serif text-[#2A1D15] block">{confirmedBooking.roomName}</strong>
                  <span>{confirmedBooking.roomsCount} Room · {confirmedBooking.nights} Night(s)</span>
                </div>

                <div>
                  <span className="text-[#2B2B2B]/60 uppercase tracking-wider block mb-1">Check-in</span>
                  <strong className="text-sm text-[#2A1D15] block">{formatShortDate(confirmedBooking.checkIn)}</strong>
                  <span>Standard 2:00 PM</span>
                </div>

                <div>
                  <span className="text-[#2B2B2B]/60 uppercase tracking-wider block mb-1">Check-out</span>
                  <strong className="text-sm text-[#2A1D15] block">{formatShortDate(confirmedBooking.checkOut)}</strong>
                  <span>Until 11:00 AM</span>
                </div>

                <div>
                  <span className="text-[#2B2B2B]/60 uppercase tracking-wider block mb-1">Total Bill</span>
                  <strong className="text-base font-serif font-bold text-[#5A1F24] block">
                    {formatINR(confirmedBooking.pricing.grandTotal)}
                  </strong>
                  <span>{confirmedBooking.paymentStatus}</span>
                </div>
              </div>

              {/* Guest & Hotel Contact Breakdown */}
              <div className="p-4 bg-[#FAF6EE] rounded-[2px] border border-[#D9C9A8]/50 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-semibold text-[#2A1D15] uppercase tracking-wider block mb-1">Guest Details</span>
                  <p>{confirmedBooking.guest.fullName} ({confirmedBooking.guest.phone})</p>
                  <p>{confirmedBooking.guest.email}</p>
                  {confirmedBooking.guest.gstNumber && <p className="font-mono">GST: {confirmedBooking.guest.gstNumber}</p>}
                </div>
                <div>
                  <span className="font-semibold text-[#2A1D15] uppercase tracking-wider block mb-1">Property Address & Assistance</span>
                  <p>{siteConfig.name}</p>
                  <p>{siteConfig.address.full}</p>
                  <p>Reception Phone: <strong>{siteConfig.phone}</strong></p>
                </div>
              </div>
            </div>

            {/* On-Screen "Confirmation Email Preview" Panel */}
            <div className="bg-[#FFFDF8] border border-dashed border-[#A8884B] p-6 rounded-[3px]">
              <div className="flex items-center justify-between pb-3 border-b border-[#D9C9A8]/40 mb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#A8884B]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#2A1D15]">
                    Confirmation Email Preview
                  </span>
                </div>
                <span className="text-[11px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-[2px] font-mono">
                  Demo – no actual email is transmitted
                </span>
              </div>

              <div className="bg-[#FAF6EE] p-4 text-xs font-mono text-[#2B2B2B]/85 space-y-2 rounded-[2px] leading-relaxed">
                <p><strong>To:</strong> {confirmedBooking.guest.email}</p>
                <p><strong>Subject:</strong> Reservation Confirmation: {confirmedBooking.id} – Hotel Carlton Bareilly</p>
                <div className="border-t border-[#D9C9A8]/40 pt-2 space-y-1">
                  <p>Dear {confirmedBooking.guest.fullName},</p>
                  <p>Thank you for choosing Hotel Carlton, Civil Lines, Bareilly. Your booking has been registered with details below:</p>
                  <p>· Reference: {confirmedBooking.id}</p>
                  <p>· Room: {confirmedBooking.roomName} ({confirmedBooking.roomsCount} room(s))</p>
                  <p>· Check-in: {formatIndianDate(confirmedBooking.checkIn)} at 2:00 PM</p>
                  <p>· Check-out: {formatIndianDate(confirmedBooking.checkOut)} at 11:00 AM</p>
                  <p>· Total Tariff: {formatINR(confirmedBooking.pricing.grandTotal)} ({confirmedBooking.paymentStatus})</p>
                  <p>For inquiries or early check-in coordination, please contact reception at {siteConfig.phone}.</p>
                </div>
              </div>
            </div>

            {/* Book Another Stay CTA */}
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => {
                  setConfirmedBooking(null);
                  setStep(1);
                  setMaxAccessibleStep(1);
                }}
                className="px-6 py-3 bg-[#5A1F24] hover:bg-[#6D262C] text-[#FAF6EE] text-xs font-semibold uppercase tracking-widest rounded-[2px] transition-colors"
              >
                Book Another Stay
              </button>
            </div>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* SIMULATED PAYMENT GATEWAY MODAL (Pure Simulation - No real card inputs)   */}
      {/* ========================================================================= */}
      {showSimulatedPaymentModal && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-label="Simulated Payment Gateway"
          className="fixed inset-0 z-50 bg-[#2A1D15]/80 flex items-center justify-center p-4 backdrop-blur-2xs"
        >
          <div className="bg-[#FFFDF8] border border-[#D9C9A8] rounded-[3px] max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-left">
            <div className="text-center pb-4 border-b border-[#D9C9A8]/50 mb-5">
              <div className="w-12 h-12 rounded-full bg-[#5A1F24]/10 text-[#5A1F24] flex items-center justify-center mx-auto mb-2">
                <CreditCard className="w-6 h-6" />
              </div>
              <span className="text-[11px] uppercase tracking-widest text-[#8C6F38] font-semibold block">
                Simulated Payment Gateway
              </span>
              <h3 className="text-xl font-serif font-semibold text-[#2A1D15]">
                {formatINR(currentPricing.grandTotal)} Authorization
              </h3>
              <p className="text-xs text-[#2B2B2B]/70 mt-1">
                Hotel Carlton Demo Reservation {selectedRoom.name}
              </p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-[2px] mb-6">
              <strong>Notice:</strong> This is a browser demonstration. No card number, UPI ID, or banking credentials are requested or stored.
            </div>

            {simulatedPaymentFailed ? (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 text-red-900 text-xs rounded-[2px]">
                  <p className="font-semibold text-sm mb-1 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span>Simulated Payment Declined</span>
                  </p>
                  <p>The bank authorization simulation failed. You can retry the simulated payment or switch to "Pay at Hotel" without any charge.</p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSimulatedPaymentFailed(false)}
                    className="w-full py-2.5 bg-[#2A1D15] text-[#FAF6EE] text-xs font-semibold uppercase tracking-wider rounded-[2px]"
                  >
                    Retry Simulated Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('pay_at_hotel');
                      setShowSimulatedPaymentModal(false);
                      setSimulatedPaymentFailed(false);
                      handleFinalizeBooking(false);
                    }}
                    className="w-full py-2.5 bg-[#5A1F24] text-[#FAF6EE] text-xs font-semibold uppercase tracking-wider rounded-[2px]"
                  >
                    Switch to Pay at Hotel & Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSimulatedPaymentModal(false);
                      setSimulatedPaymentFailed(false);
                    }}
                    className="w-full py-2 text-xs text-[#2B2B2B]/60 hover:underline"
                  >
                    Cancel and Return to Review
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-[#2B2B2B]/80 leading-relaxed text-center">
                  Click below to test the payment outcome branches:
                </p>

                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => handleFinalizeBooking(true)}
                    className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold uppercase tracking-widest rounded-[2px] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simulate Successful Payment</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSimulatedPaymentFailed(true)}
                    className="w-full py-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-semibold uppercase tracking-widest rounded-[2px] cursor-pointer transition-colors"
                  >
                    Simulate Failed Payment
                  </button>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSimulatedPaymentModal(false)}
                    className="text-xs text-[#2B2B2B]/60 hover:text-[#2A1D15] underline"
                  >
                    Close & Return to Review
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

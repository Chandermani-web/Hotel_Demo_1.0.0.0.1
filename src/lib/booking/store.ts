/**
 * Data Access Layer for Hotel Carlton Demo Booking System
 * 
 * Features:
 * - Versioned localStorage (key prefix: 'carlton_demo_v1_')
 * - In-memory fallback if localStorage is blocked or throws (e.g. Incognito mode)
 * - CRUD for bookings, status transitions, date modifications, cancellations
 * - CRUD for enquiries (contact form submissions with 'Convert to booking')
 * - Safe JSON serialization/deserialization
 */

import { StoredBooking, createSeedBookings, BookingStatus } from '../../data/demo/seedBookings';
import { calculateStayPricing } from './pricing';
import { getRoomById } from '../../data/demo/rooms';
import { calculateNights } from './dates';
import { DEMO_CONFIG } from '../../data/demo/policies';

export interface StoredEnquiry {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  roomPreference: string;
  specialRequests: string;
  submittedAt: string;
}

const STORAGE_PREFIX = 'carlton_demo_v1_';
const BOOKINGS_KEY = `${STORAGE_PREFIX}bookings`;
const ENQUIRIES_KEY = `${STORAGE_PREFIX}enquiries`;
const VERSION_KEY = `${STORAGE_PREFIX}version`;
const CURRENT_VERSION = '1.0.0';

// In-memory fallback stores if localStorage is disabled/blocked
const memoryStore = {
  bookings: [] as StoredBooking[],
  enquiries: [] as StoredEnquiry[],
  initialized: false
};

let storageBlockedNoticeGiven = false;

export function isLocalStorageUsable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__carlton_test_storage__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    if (!storageBlockedNoticeGiven) {
      console.warn("Hotel Carlton: LocalStorage is blocked or unavailable. Falling back to in-memory store.");
      storageBlockedNoticeGiven = true;
    }
    return false;
  }
}

/**
 * Initialize store on startup with seed bookings
 */
function ensureInitialized(): void {
  const usable = isLocalStorageUsable();

  if (usable) {
    try {
      const ver = window.localStorage.getItem(VERSION_KEY);
      const rawBookings = window.localStorage.getItem(BOOKINGS_KEY);

      if (!rawBookings || ver !== CURRENT_VERSION) {
        const initial = createSeedBookings();
        window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(initial));
        window.localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
      }
      return;
    } catch (e) {
      console.error("Storage initialization error, using memory fallback", e);
    }
  }

  // Fallback to memory
  if (!memoryStore.initialized || memoryStore.bookings.length === 0) {
    memoryStore.bookings = createSeedBookings();
    memoryStore.initialized = true;
  }
}

/**
 * Get all bookings
 */
export function getStoredBookings(): StoredBooking[] {
  ensureInitialized();
  if (isLocalStorageUsable()) {
    try {
      const raw = window.localStorage.getItem(BOOKINGS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error("Error reading stored bookings", e);
    }
  }
  return [...memoryStore.bookings];
}

/**
 * Persist bookings array
 */
function persistBookings(bookings: StoredBooking[]): void {
  if (isLocalStorageUsable()) {
    try {
      window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
      return;
    } catch (e) {
      console.error("Error persisting bookings to localStorage", e);
    }
  }
  memoryStore.bookings = [...bookings];
}

/**
 * Look up booking by ID
 */
export function getBookingById(bookingId: string): StoredBooking | undefined {
  const cleanId = bookingId.trim().toUpperCase();
  const all = getStoredBookings();
  return all.find(b => b.id.toUpperCase() === cleanId);
}

/**
 * Save new booking
 */
export function saveBooking(booking: StoredBooking): boolean {
  try {
    const all = getStoredBookings();
    // Prepend new booking
    const updated = [booking, ...all.filter(b => b.id !== booking.id)];
    persistBookings(updated);
    return true;
  } catch (e) {
    console.error("Failed to save booking", e);
    return false;
  }
}

/**
 * Update booking status (e.g. Confirmed -> Checked-in -> Completed -> Cancelled)
 */
export function updateBookingStatus(
  bookingId: string, 
  status: BookingStatus,
  cancellationReason?: string,
  cancellationFee?: number
): StoredBooking | null {
  const all = getStoredBookings();
  const index = all.findIndex(b => b.id.toUpperCase() === bookingId.trim().toUpperCase());
  if (index === -1) return null;

  const target = { ...all[index], status };
  if (status === 'Cancelled') {
    target.cancellationReason = cancellationReason || 'Cancelled by guest / admin';
    target.cancellationFee = cancellationFee !== undefined ? cancellationFee : 0;
  } else if (status === 'Checked-in' || status === 'Completed') {
    if (target.paymentMethod === 'pay_at_hotel') {
      target.paymentStatus = 'Paid (Demo simulation)';
    }
  }

  all[index] = target;
  persistBookings(all);
  return target;
}

/**
 * Modify booking dates (recalculates pricing and nights)
 */
export function modifyBookingDates(
  bookingId: string,
  newCheckIn: string,
  newCheckOut: string
): { success: boolean; booking?: StoredBooking; priceDelta?: number; error?: string } {
  const all = getStoredBookings();
  const index = all.findIndex(b => b.id.toUpperCase() === bookingId.trim().toUpperCase());
  if (index === -1) {
    return { success: false, error: "Booking not found." };
  }

  const existing = all[index];
  if (existing.status === 'Cancelled' || existing.status === 'Completed') {
    return { success: false, error: `Cannot modify dates for a ${existing.status.toLowerCase()} booking.` };
  }

  const room = getRoomById(existing.roomId);
  if (!room) {
    return { success: false, error: "Room configuration missing." };
  }

  // Recalculate stay pricing with new dates
  const newNights = calculateNights(newCheckIn, newCheckOut);
  const newPricing = calculateStayPricing({
    baseRate: room.baseRate,
    checkIn: newCheckIn,
    checkOut: newCheckOut,
    roomsCount: existing.roomsCount,
    hasExtraBed: existing.requests.extraBed,
    extraBedAllowed: room.extraBedAllowed,
    couponDiscountPercent: existing.pricing.discountAmount > 0 ? 10 : 0,
    couponCode: existing.pricing.couponApplied
  });

  const priceDelta = newPricing.grandTotal - existing.pricing.grandTotal;

  const updatedBooking: StoredBooking = {
    ...existing,
    checkIn: newCheckIn,
    checkOut: newCheckOut,
    nights: newNights,
    pricing: {
      baseRate: room.baseRate,
      roomTotal: newPricing.baseRoomTotal,
      extraBedCharge: newPricing.extraBedCharge,
      discountAmount: newPricing.discountAmount,
      couponApplied: existing.pricing.couponApplied,
      taxAmount: newPricing.taxAmount,
      grandTotal: newPricing.grandTotal
    }
  };

  all[index] = updatedBooking;
  persistBookings(all);
  return { success: true, booking: updatedBooking, priceDelta };
}

/**
 * Cancel booking with policy calculation
 */
export function cancelBooking(
  bookingId: string,
  reason: string = "Requested by guest"
): { success: boolean; booking?: StoredBooking; feeCharged: number; isWithinPenaltyWindow: boolean } {
  const booking = getBookingById(bookingId);
  if (!booking) return { success: false, feeCharged: 0, isWithinPenaltyWindow: false };

  // Calculate cancellation window (48 hours before check-in)
  const now = new Date();
  const checkInDate = new Date(`${booking.checkIn}T14:00:00`); // 2:00 PM check-in
  const diffHours = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  const isWithinPenaltyWindow = diffHours < DEMO_CONFIG.FREE_CANCELLATION_HOURS;
  let feeCharged = 0;

  if (isWithinPenaltyWindow) {
    // 1 night charge
    const oneNightRate = Math.round(booking.pricing.roomTotal / booking.nights);
    feeCharged = oneNightRate;
  }

  const updated = updateBookingStatus(bookingId, 'Cancelled', reason, feeCharged);
  return {
    success: !!updated,
    booking: updated || undefined,
    feeCharged,
    isWithinPenaltyWindow
  };
}

/**
 * Enquiries Store (Submissions from Contact Form)
 */
export function getStoredEnquiries(): StoredEnquiry[] {
  if (isLocalStorageUsable()) {
    try {
      const raw = window.localStorage.getItem(ENQUIRIES_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error("Error reading stored enquiries", e);
    }
  }
  return [...memoryStore.enquiries];
}

export function saveEnquiry(enquiry: StoredEnquiry): boolean {
  try {
    const all = getStoredEnquiries();
    const updated = [enquiry, ...all];
    if (isLocalStorageUsable()) {
      window.localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(updated));
    }
    memoryStore.enquiries = updated;
    return true;
  } catch (e) {
    console.error("Failed to save enquiry", e);
    return false;
  }
}

/**
 * Reset all demo data to initial seed bookings and clear demo test enquiries
 */
export function resetDemoStore(): void {
  const seeds = createSeedBookings();
  if (isLocalStorageUsable()) {
    try {
      window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(seeds));
      window.localStorage.removeItem(ENQUIRIES_KEY);
      window.localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    } catch (e) {
      console.error("Failed to reset localStorage", e);
    }
  }
  memoryStore.bookings = seeds;
  memoryStore.enquiries = [];
}

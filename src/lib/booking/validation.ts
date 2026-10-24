/**
 * Validation utilities for Hotel Carlton Demo Booking System
 */

import { calculateNights, isPastDate, toIsoDate, addDays, getTodayIso } from './dates';
import { DEMO_CONFIG } from '../../data/demo/policies';
import { DemoRoom } from '../../data/demo/rooms';

export interface DateValidationResult {
  valid: boolean;
  error?: string;
  nights?: number;
}

export function validateStayDates(checkIn: string, checkOut: string): DateValidationResult {
  if (!checkIn || !checkOut) {
    return { valid: false, error: "Please select both check-in and check-out dates." };
  }

  if (isPastDate(checkIn)) {
    return { valid: false, error: "Check-in date cannot be in the past." };
  }

  const nights = calculateNights(checkIn, checkOut);
  if (nights < 1) {
    return { valid: false, error: "Check-out date must be at least one day after check-in." };
  }

  if (nights > DEMO_CONFIG.MAX_STAY_NIGHTS) {
    return { valid: false, error: `Maximum stay duration is ${DEMO_CONFIG.MAX_STAY_NIGHTS} nights.` };
  }

  const maxAdvanceDate = addDays(getTodayIso(), DEMO_CONFIG.MAX_ADVANCE_DAYS);
  if (checkIn > maxAdvanceDate) {
    return { valid: false, error: `Bookings can only be scheduled up to ${DEMO_CONFIG.MAX_ADVANCE_DAYS} days in advance.` };
  }

  return { valid: true, nights };
}

export interface OccupancyValidationResult {
  valid: boolean;
  error?: string;
}

export function validateOccupancy(
  room: DemoRoom,
  adults: number,
  children: number,
  roomsCount: number
): OccupancyValidationResult {
  const totalOccupancyAllowed = room.maxOccupancy * roomsCount;
  const totalGuests = adults + children;

  if (adults < 1) {
    return { valid: false, error: "At least one adult is required for each booking." };
  }

  if (adults > room.maxAdults * roomsCount) {
    return { 
      valid: false, 
      error: `${room.name} can accommodate up to ${room.maxAdults * roomsCount} adults across ${roomsCount} room(s). Consider an additional room.` 
    };
  }

  if (totalGuests > totalOccupancyAllowed) {
    return { 
      valid: false, 
      error: `Maximum combined occupancy for ${roomsCount} ${room.name}(s) is ${totalOccupancyAllowed} guests.` 
    };
  }

  return { valid: true };
}

export interface GuestFormValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export interface GuestFormData {
  title: string;
  fullName: string;
  phone: string;
  email: string;
  gstNumber?: string;
}

export function validateGuestForm(data: GuestFormData): GuestFormValidationResult {
  const errors: Record<string, string> = {};

  if (!data.fullName.trim()) {
    errors.fullName = "Please enter guest full name.";
  } else if (data.fullName.trim().length < 3) {
    errors.fullName = "Full name must be at least 3 characters.";
  }

  // 10-digit Indian phone number
  const cleanPhone = data.phone.replace(/[^0-9]/g, '');
  // Allows optional 91 prefix or direct 10 digits starting with 6-9
  const isTenDigit = /^[6-9]\d{9}$/.test(cleanPhone);
  const isTwelveDigit = /^91[6-9]\d{9}$/.test(cleanPhone);

  if (!data.phone.trim()) {
    errors.phone = "Please enter a contact mobile number.";
  } else if (!isTenDigit && !isTwelveDigit) {
    errors.phone = "Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).";
  }

  // Email format check
  if (!data.email.trim()) {
    errors.email = "Please enter an email address for reservation confirmation.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  // Optional GST number format: 2 digits, 5 letters, 4 digits, 1 letter, 1 alphanumeric, 'Z', 1 alphanumeric
  if (data.gstNumber && data.gstNumber.trim()) {
    const cleanGst = data.gstNumber.trim().toUpperCase();
    const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstPattern.test(cleanGst)) {
      errors.gstNumber = "Invalid GSTIN format. Standard format is 22AAAAA0000A1Z5.";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

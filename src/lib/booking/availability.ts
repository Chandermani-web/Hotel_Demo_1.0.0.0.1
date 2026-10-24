/**
 * Room Availability Engine for Hotel Carlton Demo Booking System
 * 
 * Features:
 * - Computes physical room availability per date by inspecting active bookings (Confirmed & Checked-in)
 * - Identifies bottleneck nights during multi-night stays
 * - Suggests the next 3 available check-in dates when a room is sold out
 * - Provides double-booking verification check prior to final reservation confirmation
 */

import { demoRooms, DemoRoom, getRoomById } from '../../data/demo/rooms';
import { getStoredBookings } from './store';
import { getNightsList, addDays, toIsoDate, parseLocalIsoDate, calculateNights } from './dates';
import { StoredBooking } from '../../data/demo/seedBookings';

export interface RoomAvailabilityStatus {
  room: DemoRoom;
  available: boolean;
  minRemainingInventory: number;
  isFewLeft: boolean; // True when 1 <= minRemainingInventory <= 3
  reason?: string;
  suggestedCheckInDates?: string[]; // Next 3 available check-in dates if sold out
}

/**
 * Calculates how many rooms of a specific room type are booked on a single night.
 */
export function getBookedRoomsCountForNight(
  roomId: string, 
  nightIso: string, 
  bookings: StoredBooking[],
  excludeBookingId?: string
): number {
  return bookings
    .filter(b => {
      if (excludeBookingId && b.id.toUpperCase() === excludeBookingId.toUpperCase()) {
        return false;
      }
      if (b.roomId !== roomId) return false;
      // Only active bookings occupy inventory
      if (b.status !== 'Confirmed' && b.status !== 'Checked-in') return false;

      // A booking occupies the night if: b.checkIn <= nightIso && nightIso < b.checkOut
      return b.checkIn <= nightIso && nightIso < b.checkOut;
    })
    .reduce((total, b) => total + b.roomsCount, 0);
}

/**
 * Checks remaining inventory for a room over a multi-night stay.
 * Returns the minimum remaining inventory across all nights of the stay.
 */
export function getMinRemainingInventory(
  room: DemoRoom,
  checkIn: string,
  checkOut: string,
  bookings: StoredBooking[],
  excludeBookingId?: string
): number {
  const nights = getNightsList(checkIn, checkOut);
  if (nights.length === 0) return 0;

  let minRemaining = room.inventoryCount;

  for (const night of nights) {
    const booked = getBookedRoomsCountForNight(room.id, night, bookings, excludeBookingId);
    const remaining = Math.max(0, room.inventoryCount - booked);
    if (remaining < minRemaining) {
      minRemaining = remaining;
    }
  }

  return minRemaining;
}

/**
 * Finds the next 3 alternative check-in dates where the room has at least requiredRooms available
 * for a stay of stayNights duration.
 */
export function findNearbyAvailableDates(
  room: DemoRoom,
  currentCheckIn: string,
  stayNights: number,
  requiredRooms: number,
  bookings: StoredBooking[],
  maxLookaheadDays: number = 30
): string[] {
  const suggestions: string[] = [];
  const nightsCount = Math.max(1, stayNights);

  // Scan starting from tomorrow or currentCheckIn + 1
  let searchDate = addDays(currentCheckIn, 1);

  for (let i = 0; i < maxLookaheadDays && suggestions.length < 3; i++) {
    const searchCheckOut = addDays(searchDate, nightsCount);
    const minAvail = getMinRemainingInventory(room, searchDate, searchCheckOut, bookings);

    if (minAvail >= requiredRooms) {
      suggestions.push(searchDate);
    }

    searchDate = addDays(searchDate, 1);
  }

  return suggestions;
}

/**
 * Evaluates availability for all room types for a given date range and requested room count.
 */
export function checkAllRoomsAvailability(
  checkIn: string,
  checkOut: string,
  roomsCount: number = 1,
  excludeBookingId?: string
): RoomAvailabilityStatus[] {
  const bookings = getStoredBookings();
  const stayNights = calculateNights(checkIn, checkOut);

  return demoRooms.map(room => {
    const minRemaining = getMinRemainingInventory(room, checkIn, checkOut, bookings, excludeBookingId);
    const isAvailable = minRemaining >= roomsCount;
    const isFewLeft = isAvailable && minRemaining <= 3;

    let suggestedCheckInDates: string[] | undefined = undefined;
    if (!isAvailable) {
      suggestedCheckInDates = findNearbyAvailableDates(
        room,
        checkIn,
        stayNights,
        roomsCount,
        bookings
      );
    }

    return {
      room,
      available: isAvailable,
      minRemainingInventory: minRemaining,
      isFewLeft,
      reason: !isAvailable ? `Sold out for these dates (${minRemaining} available, ${roomsCount} requested)` : undefined,
      suggestedCheckInDates
    };
  });
}

/**
 * Double-booking protection: re-checks availability at the exact moment of confirmation.
 */
export function verifyRoomAvailabilityForConfirmation(
  roomId: string,
  checkIn: string,
  checkOut: string,
  roomsCount: number = 1,
  excludeBookingId?: string
): { available: boolean; remaining: number } {
  const room = getRoomById(roomId);
  if (!room) return { available: false, remaining: 0 };

  const bookings = getStoredBookings();
  const remaining = getMinRemainingInventory(room, checkIn, checkOut, bookings, excludeBookingId);
  return {
    available: remaining >= roomsCount,
    remaining
  };
}

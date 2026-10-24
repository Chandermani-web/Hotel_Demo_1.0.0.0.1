import { describe, it, expect } from 'vitest';
import { calculateNights, getNightsList, isWeekendNight, parseLocalIsoDate } from '../dates';
import { generateBookingId, generateEnquiryId } from '../ids';
import { calculateStayPricing, formatINR } from '../pricing';
import { validateStayDates, validateGuestForm } from '../validation';
import { getBookedRoomsCountForNight, getMinRemainingInventory } from '../availability';
import { demoRooms } from '../../../data/demo/rooms';
import { StoredBooking } from '../../../data/demo/seedBookings';

describe('Date Utilities', () => {
  it('correctly calculates stay nights count', () => {
    expect(calculateNights('2026-11-01', '2026-11-04')).toBe(3);
    expect(calculateNights('2026-11-01', '2026-11-01')).toBe(0);
    expect(calculateNights('2026-11-05', '2026-11-06')).toBe(1);
  });

  it('generates the exact list of stay nights', () => {
    const nights = getNightsList('2026-11-01', '2026-11-04');
    expect(nights).toEqual(['2026-11-01', '2026-11-02', '2026-11-03']);
  });

  it('correctly identifies weekend nights (Friday and Saturday)', () => {
    // 2026-11-05 is Thursday, 2026-11-06 is Friday, 2026-11-07 is Saturday, 2026-11-08 is Sunday
    expect(isWeekendNight('2026-11-05')).toBe(false);
    expect(isWeekendNight('2026-11-06')).toBe(true);
    expect(isWeekendNight('2026-11-07')).toBe(true);
    expect(isWeekendNight('2026-11-08')).toBe(false);
  });
});

describe('ID Generation', () => {
  it('generates booking IDs in the format CARL-YYMMDD-XXXX', () => {
    const id = generateBookingId();
    expect(id).toMatch(/^CARL-\d{6}-[A-Z2-9]{4}$/);
  });

  it('generates unique booking IDs avoiding collisions', () => {
    const existing = ['CARL-261024-ABCD'];
    const newId = generateBookingId(existing);
    expect(newId).not.toBe('CARL-261024-ABCD');
    expect(newId.startsWith('CARL-')).toBe(true);
  });

  it('generates enquiry IDs with ENQ- prefix', () => {
    const enqId = generateEnquiryId();
    expect(enqId).toMatch(/^ENQ-\d{6}-[A-Z2-9]{4}$/);
  });
});

describe('Pricing Engine', () => {
  it('calculates standard weekday stay pricing (2 nights @ ₹2,800)', () => {
    // 2026-11-02 (Mon) to 2026-11-04 (Wed)
    const pricing = calculateStayPricing({
      baseRate: 2800,
      checkIn: '2026-11-02',
      checkOut: '2026-11-04',
      roomsCount: 1
    });

    expect(pricing.nightsCount).toBe(2);
    expect(pricing.baseRoomTotal).toBe(5600);
    expect(pricing.weekendSurchargeTotal).toBe(0);
    expect(pricing.taxAmount).toBe(672); // 12% of 5600
    expect(pricing.grandTotal).toBe(6272);
  });

  it('applies +15% weekend surcharge on Friday and Saturday nights', () => {
    // 2026-11-05 (Thu) to 2026-11-07 (Sat) -> Thu night (weekday: 2800), Fri night (weekend: 2800*1.15 = 3220)
    const pricing = calculateStayPricing({
      baseRate: 2800,
      checkIn: '2026-11-05',
      checkOut: '2026-11-07',
      roomsCount: 1
    });

    expect(pricing.nightsCount).toBe(2);
    expect(pricing.baseRoomTotal).toBe(2800 + 3220); // 6020
    expect(pricing.weekendSurchargeTotal).toBe(420);
    expect(pricing.taxAmount).toBe(Math.round(6020 * 0.12)); // 722
    expect(pricing.grandTotal).toBe(6020 + 722);
  });

  it('applies 10% coupon discount (CARLTON10) and recalculates taxes on net total', () => {
    const pricing = calculateStayPricing({
      baseRate: 2800,
      checkIn: '2026-11-02',
      checkOut: '2026-11-04',
      roomsCount: 1,
      couponDiscountPercent: 10,
      couponCode: 'CARLTON10'
    });

    expect(pricing.baseRoomTotal).toBe(5600);
    expect(pricing.discountAmount).toBe(560); // 10% of 5600
    expect(pricing.netRoomTotal).toBe(5040);
    expect(pricing.taxAmount).toBe(Math.round(5040 * 0.12)); // 605
    expect(pricing.grandTotal).toBe(5040 + 605);
  });

  it('includes ₹700 per night extra bed charge when allowed and requested', () => {
    const pricing = calculateStayPricing({
      baseRate: 3600,
      checkIn: '2026-11-02',
      checkOut: '2026-11-04',
      roomsCount: 1,
      hasExtraBed: true,
      extraBedAllowed: true
    });

    expect(pricing.extraBedCharge).toBe(1400); // 2 nights * 700
    expect(pricing.grandTotal).toBe(pricing.netRoomTotal + 1400 + pricing.taxAmount);
  });

  it('formats amounts in Indian Rupee format correctly', () => {
    expect(formatINR(2800)).toBe('₹2,800');
    expect(formatINR(12450)).toBe('₹12,450');
  });
});

describe('Validation Rules', () => {
  it('rejects invalid stay dates (same day or checkout before checkin)', () => {
    const result = validateStayDates('2026-11-05', '2026-11-05');
    expect(result.valid).toBe(false);
  });

  it('validates 10-digit Indian phone numbers', () => {
    const validForm = validateGuestForm({
      title: 'Mr.',
      fullName: 'Vikram Malhotra',
      phone: '9876543210',
      email: 'vikram@example.com'
    });
    expect(validForm.valid).toBe(true);

    const invalidPhoneForm = validateGuestForm({
      title: 'Mr.',
      fullName: 'Vikram Malhotra',
      phone: '12345',
      email: 'vikram@example.com'
    });
    expect(invalidPhoneForm.valid).toBe(false);
    expect(invalidPhoneForm.errors.phone).toBeDefined();
  });
});

describe('Availability Engine', () => {
  it('correctly tracks booked rooms per night from active bookings', () => {
    const mockBookings: StoredBooking[] = [
      {
        id: 'CARL-TEST-001',
        createdAt: '2026-10-01',
        roomId: 'deluxe-room',
        roomName: 'Deluxe Room',
        checkIn: '2026-11-01',
        checkOut: '2026-11-04',
        nights: 3,
        roomsCount: 2,
        adults: 2,
        children: 0,
        guest: { title: 'Mr.', fullName: 'Test', phone: '+919876543210', email: 'test@test.com' },
        requests: { earlyCheckIn: false, lateCheckOut: false, extraBed: false, groundFloorPreference: false, notes: '' },
        pricing: { baseRate: 2800, roomTotal: 16800, extraBedCharge: 0, discountAmount: 0, taxAmount: 2016, grandTotal: 18816 },
        paymentMethod: 'pay_at_hotel',
        paymentStatus: 'Pending (Pay at hotel)',
        status: 'Confirmed'
      }
    ];

    // Deluxe total inventory is 10
    const deluxe = demoRooms.find(r => r.id === 'deluxe-room')!;
    const bookedOnNov01 = getBookedRoomsCountForNight('deluxe-room', '2026-11-01', mockBookings);
    expect(bookedOnNov01).toBe(2);

    const bookedOnNov04 = getBookedRoomsCountForNight('deluxe-room', '2026-11-04', mockBookings);
    expect(bookedOnNov04).toBe(0); // Check-out day does not occupy night

    const minRemaining = getMinRemainingInventory(deluxe, '2026-11-01', '2026-11-03', mockBookings);
    expect(minRemaining).toBe(8); // 10 - 2
  });
});

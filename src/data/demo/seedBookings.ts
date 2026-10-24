/**
 * Seed Bookings for Hotel Carlton Demo
 * 12 realistic pre-made bookings across past, today, and future 60 days.
 */

import { addDays, getTodayIso } from '../../lib/booking/dates';

export type BookingStatus = 'Confirmed' | 'Checked-in' | 'Completed' | 'Cancelled';
export type PaymentMethod = 'pay_at_hotel' | 'demo_online';
export type PaymentStatus = 'Pending (Pay at hotel)' | 'Paid (Demo simulation)';

export interface GuestInfo {
  title: string;
  fullName: string;
  phone: string;
  email: string;
  gstNumber?: string;
}

export interface SpecialRequests {
  earlyCheckIn: boolean;
  lateCheckOut: boolean;
  extraBed: boolean;
  groundFloorPreference: boolean;
  notes: string;
  estimatedArrivalTime?: string;
}

export interface StoredBooking {
  id: string;
  createdAt: string;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomsCount: number;
  adults: number;
  children: number;
  guest: GuestInfo;
  requests: SpecialRequests;
  pricing: {
    baseRate: number;
    roomTotal: number;
    extraBedCharge: number;
    discountAmount: number;
    couponApplied?: string;
    taxAmount: number;
    grandTotal: number;
  };
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  cancellationReason?: string;
  cancellationFee?: number;
}

export function createSeedBookings(): StoredBooking[] {
  const today = getTodayIso();

  return [
    // 1. Current In-House Guest (Carlton Suite) - Checked-in
    {
      id: "CARL-261020-K7X2",
      createdAt: addDays(today, -10),
      roomId: "carlton-suite",
      roomName: "Carlton Suite",
      checkIn: addDays(today, -1),
      checkOut: addDays(today, 2),
      nights: 3,
      roomsCount: 1,
      adults: 2,
      children: 0,
      guest: {
        title: "Dr.",
        fullName: "Anand Vardhan Sharma",
        phone: "+919811234567",
        email: "anand.sharma@aims.org"
      },
      requests: {
        earlyCheckIn: true,
        lateCheckOut: false,
        extraBed: false,
        groundFloorPreference: true,
        notes: "Attending regional medical symposium in Bareilly",
        estimatedArrivalTime: "1:00 PM"
      },
      pricing: {
        baseRate: 5400,
        roomTotal: 17010,
        extraBedCharge: 0,
        discountAmount: 0,
        taxAmount: 2041,
        grandTotal: 19051
      },
      paymentMethod: "pay_at_hotel",
      paymentStatus: "Pending (Pay at hotel)",
      status: "Checked-in"
    },

    // 2. Today's Arrival (Deluxe Room) - Confirmed
    {
      id: "CARL-261022-P9M4",
      createdAt: addDays(today, -5),
      roomId: "deluxe-room",
      roomName: "Deluxe Room",
      checkIn: today,
      checkOut: addDays(today, 2),
      nights: 2,
      roomsCount: 1,
      adults: 1,
      children: 0,
      guest: {
        title: "Mr.",
        fullName: "Rajeshwar Saxena",
        phone: "+919412098765",
        email: "rajeshwar.saxena@tcs.com"
      },
      requests: {
        earlyCheckIn: false,
        lateCheckOut: false,
        extraBed: false,
        groundFloorPreference: false,
        notes: "Quiet corner room requested if possible",
        estimatedArrivalTime: "3:30 PM"
      },
      pricing: {
        baseRate: 2800,
        roomTotal: 6020,
        extraBedCharge: 0,
        discountAmount: 0,
        taxAmount: 722,
        grandTotal: 6742
      },
      paymentMethod: "demo_online",
      paymentStatus: "Paid (Demo simulation)",
      status: "Confirmed"
    },

    // 3. Today's Departure (Executive Room) - Checked-in
    {
      id: "CARL-261019-W2Q8",
      createdAt: addDays(today, -7),
      roomId: "executive-room",
      roomName: "Executive Room",
      checkIn: addDays(today, -2),
      checkOut: today,
      nights: 2,
      roomsCount: 1,
      adults: 2,
      children: 1,
      guest: {
        title: "Mrs.",
        fullName: "Sunita Mehrotra",
        phone: "+919839012345",
        email: "sunitamehrotra@gmail.com"
      },
      requests: {
        earlyCheckIn: false,
        lateCheckOut: true,
        extraBed: false,
        groundFloorPreference: true,
        notes: "Family wedding visit",
        estimatedArrivalTime: "2:00 PM"
      },
      pricing: {
        baseRate: 3600,
        roomTotal: 7740,
        extraBedCharge: 0,
        discountAmount: 774,
        couponApplied: "CARLTON10",
        taxAmount: 836,
        grandTotal: 7802
      },
      paymentMethod: "pay_at_hotel",
      paymentStatus: "Pending (Pay at hotel)",
      status: "Checked-in"
    },

    // 4. Heavy Booking on Carlton Suite (Tomorrow for 3 days) - 2 rooms
    {
      id: "CARL-261023-T4J9",
      createdAt: addDays(today, -3),
      roomId: "carlton-suite",
      roomName: "Carlton Suite",
      checkIn: addDays(today, 1),
      checkOut: addDays(today, 4),
      nights: 3,
      roomsCount: 2,
      adults: 4,
      children: 0,
      guest: {
        title: "Mr.",
        fullName: "Vikramaditya Singhania",
        phone: "+919920198273",
        email: "vikram.singhania@heritageholdings.in",
        gstNumber: "09AAACH7409R1ZZ"
      },
      requests: {
        earlyCheckIn: true,
        lateCheckOut: true,
        extraBed: false,
        groundFloorPreference: false,
        notes: "Both suites on upper floor adjacent to each other",
        estimatedArrivalTime: "12:30 PM"
      },
      pricing: {
        baseRate: 5400,
        roomTotal: 34020,
        extraBedCharge: 0,
        discountAmount: 3402,
        couponApplied: "CARLTON10",
        taxAmount: 3674,
        grandTotal: 34292
      },
      paymentMethod: "demo_online",
      paymentStatus: "Paid (Demo simulation)",
      status: "Confirmed"
    },

    // 5. Deluxe Room Cluster next weekend (reduces inventory)
    {
      id: "CARL-261024-B1F7",
      createdAt: addDays(today, -2),
      roomId: "deluxe-room",
      roomName: "Deluxe Room",
      checkIn: addDays(today, 5),
      checkOut: addDays(today, 8),
      nights: 3,
      roomsCount: 3,
      adults: 6,
      children: 0,
      guest: {
        title: "Mr.",
        fullName: "Alok Kumar Verma",
        phone: "+919717088992",
        email: "alok.verma@delhicapital.com"
      },
      requests: {
        earlyCheckIn: false,
        lateCheckOut: false,
        extraBed: false,
        groundFloorPreference: true,
        notes: "Company sales retreat delegation",
        estimatedArrivalTime: "4:00 PM"
      },
      pricing: {
        baseRate: 2800,
        roomTotal: 27720,
        extraBedCharge: 0,
        discountAmount: 0,
        taxAmount: 3326,
        grandTotal: 31046
      },
      paymentMethod: "pay_at_hotel",
      paymentStatus: "Pending (Pay at hotel)",
      status: "Confirmed"
    },

    // 6. Another Deluxe group same dates
    {
      id: "CARL-261024-C8D3",
      createdAt: addDays(today, -1),
      roomId: "deluxe-room",
      roomName: "Deluxe Room",
      checkIn: addDays(today, 5),
      checkOut: addDays(today, 7),
      nights: 2,
      roomsCount: 3,
      adults: 5,
      children: 1,
      guest: {
        title: "Mrs.",
        fullName: "Kavita Rastogi",
        phone: "+919821098456",
        email: "kavita.rastogi@yahoo.co.in"
      },
      requests: {
        earlyCheckIn: false,
        lateCheckOut: false,
        extraBed: true,
        groundFloorPreference: false,
        notes: "Extra bed for child in first room",
        estimatedArrivalTime: "2:00 PM"
      },
      pricing: {
        baseRate: 2800,
        roomTotal: 18060,
        extraBedCharge: 4200,
        discountAmount: 0,
        taxAmount: 2167,
        grandTotal: 24427
      },
      paymentMethod: "pay_at_hotel",
      paymentStatus: "Pending (Pay at hotel)",
      status: "Confirmed"
    },

    // 7. Executive Room booking next week
    {
      id: "CARL-261025-E5L1",
      createdAt: addDays(today, -4),
      roomId: "executive-room",
      roomName: "Executive Room",
      checkIn: addDays(today, 10),
      checkOut: addDays(today, 13),
      nights: 3,
      roomsCount: 2,
      adults: 3,
      children: 1,
      guest: {
        title: "Dr.",
        fullName: "Deepak Chawla",
        phone: "+919910045612",
        email: "dchawla@apollo.org"
      },
      requests: {
        earlyCheckIn: true,
        lateCheckOut: false,
        extraBed: false,
        groundFloorPreference: true,
        notes: "Visiting Bareilly Cantonment",
        estimatedArrivalTime: "1:30 PM"
      },
      pricing: {
        baseRate: 3600,
        roomTotal: 22680,
        extraBedCharge: 0,
        discountAmount: 2268,
        couponApplied: "CARLTON10",
        taxAmount: 2450,
        grandTotal: 22862
      },
      paymentMethod: "demo_online",
      paymentStatus: "Paid (Demo simulation)",
      status: "Confirmed"
    },

    // 8. Completed booking (Past)
    {
      id: "CARL-261010-H3V5",
      createdAt: addDays(today, -20),
      roomId: "deluxe-room",
      roomName: "Deluxe Room",
      checkIn: addDays(today, -8),
      checkOut: addDays(today, -5),
      nights: 3,
      roomsCount: 1,
      adults: 2,
      children: 0,
      guest: {
        title: "Mr.",
        fullName: "Sanjay Tandon",
        phone: "+919415033441",
        email: "sanjay.tandon@gmail.com"
      },
      requests: {
        earlyCheckIn: false,
        lateCheckOut: false,
        extraBed: false,
        groundFloorPreference: false,
        notes: "None"
      },
      pricing: {
        baseRate: 2800,
        roomTotal: 8820,
        extraBedCharge: 0,
        discountAmount: 0,
        taxAmount: 1058,
        grandTotal: 9878
      },
      paymentMethod: "pay_at_hotel",
      paymentStatus: "Paid (Demo simulation)",
      status: "Completed"
    },

    // 9. Cancelled booking (Past)
    {
      id: "CARL-261012-X9K2",
      createdAt: addDays(today, -15),
      roomId: "carlton-suite",
      roomName: "Carlton Suite",
      checkIn: addDays(today, -3),
      checkOut: addDays(today, -1),
      nights: 2,
      roomsCount: 1,
      adults: 2,
      children: 0,
      guest: {
        title: "Ms.",
        fullName: "Pooja Deshmukh",
        phone: "+919820011223",
        email: "pooja.d@mumbaiad.in"
      },
      requests: {
        earlyCheckIn: false,
        lateCheckOut: false,
        extraBed: false,
        groundFloorPreference: false,
        notes: ""
      },
      pricing: {
        baseRate: 5400,
        roomTotal: 10800,
        extraBedCharge: 0,
        discountAmount: 0,
        taxAmount: 1296,
        grandTotal: 12096
      },
      paymentMethod: "pay_at_hotel",
      paymentStatus: "Pending (Pay at hotel)",
      status: "Cancelled",
      cancellationReason: "Change in travel schedule",
      cancellationFee: 0
    },

    // 10. Future booking 3 weeks out (Executive Room)
    {
      id: "CARL-261102-M7Y1",
      createdAt: addDays(today, -1),
      roomId: "executive-room",
      roomName: "Executive Room",
      checkIn: addDays(today, 21),
      checkOut: addDays(today, 24),
      nights: 3,
      roomsCount: 1,
      adults: 2,
      children: 0,
      guest: {
        title: "Mr.",
        fullName: "Rohan Kapoor",
        phone: "+919871122334",
        email: "rohan.kapoor@outlook.com"
      },
      requests: {
        earlyCheckIn: false,
        lateCheckOut: false,
        extraBed: false,
        groundFloorPreference: true,
        notes: "Quiet garden view room preferred"
      },
      pricing: {
        baseRate: 3600,
        roomTotal: 11340,
        extraBedCharge: 0,
        discountAmount: 0,
        taxAmount: 1361,
        grandTotal: 12701
      },
      paymentMethod: "demo_online",
      paymentStatus: "Paid (Demo simulation)",
      status: "Confirmed"
    },

    // 11. Future booking 4 weeks out (Deluxe Room)
    {
      id: "CARL-261110-Z4T8",
      createdAt: addDays(today, -2),
      roomId: "deluxe-room",
      roomName: "Deluxe Room",
      checkIn: addDays(today, 30),
      checkOut: addDays(today, 32),
      nights: 2,
      roomsCount: 1,
      adults: 1,
      children: 0,
      guest: {
        title: "Mr.",
        fullName: "Gaurav Agarwal",
        phone: "+919935012398",
        email: "gaurav.agarwal@bareillygrain.com"
      },
      requests: {
        earlyCheckIn: true,
        lateCheckOut: false,
        extraBed: false,
        groundFloorPreference: false,
        notes: "Corporate commercial visit"
      },
      pricing: {
        baseRate: 2800,
        roomTotal: 5600,
        extraBedCharge: 0,
        discountAmount: 0,
        taxAmount: 672,
        grandTotal: 6272
      },
      paymentMethod: "pay_at_hotel",
      paymentStatus: "Pending (Pay at hotel)",
      status: "Confirmed"
    },

    // 12. Future booking 5 weeks out (Carlton Suite)
    {
      id: "CARL-261118-N2W6",
      createdAt: addDays(today, -3),
      roomId: "carlton-suite",
      roomName: "Carlton Suite",
      checkIn: addDays(today, 38),
      checkOut: addDays(today, 41),
      nights: 3,
      roomsCount: 1,
      adults: 2,
      children: 1,
      guest: {
        title: "Mr.",
        fullName: "Naveen Jindal",
        phone: "+919810987654",
        email: "naveen.j@delhicap.in"
      },
      requests: {
        earlyCheckIn: false,
        lateCheckOut: true,
        extraBed: true,
        groundFloorPreference: false,
        notes: "Family weekend trip"
      },
      pricing: {
        baseRate: 5400,
        roomTotal: 17010,
        extraBedCharge: 2100,
        discountAmount: 1701,
        couponApplied: "CARLTON10",
        taxAmount: 1837,
        grandTotal: 19246
      },
      paymentMethod: "demo_online",
      paymentStatus: "Paid (Demo simulation)",
      status: "Confirmed"
    }
  ];
}

/**
 * Demo Booking Policies & Configurations for Hotel Carlton
 * 
 * Notice: All values are for simulation and client presentation.
 */

export const DEMO_CONFIG = {
  // Master toggle for simulation banners and indicators
  DEMO_MODE: true,
  DEMO_RIBBON_TEXT: "Demo website – bookings and payments are simulated. No real payment or reservation is made.",
  
  // Hotel check-in & check-out times (demo text, to be confirmed by hotel)
  CHECK_IN_TIME: "2:00 PM",
  CHECK_OUT_TIME: "11:00 AM",
  
  // Pricing rules
  TAX_RATE: 0.12,          // 12% demo tax on room rate total
  WEEKEND_MARKUP: 0.15,    // +15% on Friday and Saturday nights
  EXTRA_BED_RATE: 700,     // Rs. 700 per night where allowed
  CHILD_FREE_AGE_LIMIT: 6, // Children under 6 stay free
  
  // Date and duration constraints
  MIN_STAY_NIGHTS: 1,
  MAX_STAY_NIGHTS: 15,
  MAX_ADVANCE_DAYS: 365,
  
  // Cancellation policy
  FREE_CANCELLATION_HOURS: 48, // Free cancellation up to 48 hours before check-in
  CANCELLATION_PENALTY_NIGHTS: 1, // 1 night charge if cancelled within 48 hours
  
  // Admin demo credentials (displayed transparently on demo login)
  ADMIN_CREDENTIALS: {
    username: "admin",
    password: "carlton123"
  }
};

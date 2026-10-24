/**
 * Pricing Engine for Hotel Carlton Demo Booking System
 * 
 * Rules:
 * - Weekend (Fri & Sat nights): +15%
 * - Demo Tax: 12% on discounted room total
 * - Extra bed: Rs. 700 per night where allowed
 * - Coupon: e.g. CARLTON10 gives 10% discount on room total
 */

import { DEMO_CONFIG } from '../../data/demo/policies';
import { getNightsList, isWeekendNight, formatShortDate } from './dates';

export interface NightRateBreakdown {
  nightDate: string;
  formattedDate: string;
  isWeekend: boolean;
  ratePerRoom: number;
  totalForRooms: number;
}

export interface PricingCalculationResult {
  nightsCount: number;
  roomsCount: number;
  nightsBreakdown: NightRateBreakdown[];
  baseRoomTotal: number;          // Total of all night rates across rooms
  weekendSurchargeTotal: number;  // Surcharge portion from weekend nights
  extraBedCharge: number;         // Extra bed charge total (if requested & allowed)
  discountAmount: number;         // Coupon discount amount
  couponCodeApplied?: string;
  netRoomTotal: number;           // baseRoomTotal - discountAmount
  taxAmount: number;              // 12% demo tax on netRoomTotal
  grandTotal: number;             // netRoomTotal + extraBedCharge + taxAmount
}

export interface PricingParams {
  baseRate: number;
  checkIn: string;
  checkOut: string;
  roomsCount?: number;
  hasExtraBed?: boolean;
  extraBedAllowed?: boolean;
  couponDiscountPercent?: number;
  couponCode?: string;
}

/**
 * Formats a number into Indian Rupee format: e.g. "₹2,800" or "₹12,450"
 */
export function formatINR(amount: number): string {
  const rounded = Math.round(amount);
  return '₹' + rounded.toLocaleString('en-IN');
}

/**
 * Pure calculation function for stay pricing
 */
export function calculateStayPricing(params: PricingParams): PricingCalculationResult {
  const roomsCount = Math.max(1, params.roomsCount || 1);
  const nights = getNightsList(params.checkIn, params.checkOut);
  const nightsCount = nights.length;

  let baseRoomTotal = 0;
  let weekendSurchargeTotal = 0;
  const nightsBreakdown: NightRateBreakdown[] = [];

  for (const night of nights) {
    const isWknd = isWeekendNight(night);
    const multiplier = isWknd ? (1 + DEMO_CONFIG.WEEKEND_MARKUP) : 1;
    const ratePerRoom = Math.round(params.baseRate * multiplier);
    const totalForRooms = ratePerRoom * roomsCount;

    if (isWknd) {
      weekendSurchargeTotal += (ratePerRoom - params.baseRate) * roomsCount;
    }
    baseRoomTotal += totalForRooms;

    nightsBreakdown.push({
      nightDate: night,
      formattedDate: formatShortDate(night),
      isWeekend: isWknd,
      ratePerRoom,
      totalForRooms
    });
  }

  // Extra bed charge
  let extraBedCharge = 0;
  if (params.hasExtraBed && params.extraBedAllowed) {
    extraBedCharge = DEMO_CONFIG.EXTRA_BED_RATE * nightsCount * roomsCount;
  }

  // Discount from coupon (applies to room total)
  let discountAmount = 0;
  if (params.couponDiscountPercent && params.couponDiscountPercent > 0) {
    discountAmount = Math.round((baseRoomTotal * params.couponDiscountPercent) / 100);
  }

  const netRoomTotal = Math.max(0, baseRoomTotal - discountAmount);
  // 12% demo tax
  const taxAmount = Math.round(netRoomTotal * DEMO_CONFIG.TAX_RATE);
  const grandTotal = netRoomTotal + extraBedCharge + taxAmount;

  return {
    nightsCount,
    roomsCount,
    nightsBreakdown,
    baseRoomTotal,
    weekendSurchargeTotal,
    extraBedCharge,
    discountAmount,
    couponCodeApplied: params.couponCode,
    netRoomTotal,
    taxAmount,
    grandTotal
  };
}

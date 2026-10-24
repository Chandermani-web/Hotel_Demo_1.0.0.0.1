/**
 * Demo Coupons for Hotel Carlton
 */

export interface Coupon {
  code: string;
  discountPercentage: number;
  description: string;
}

export const DEMO_COUPONS: Record<string, Coupon> = {
  "CARLTON10": {
    code: "CARLTON10",
    discountPercentage: 10,
    description: "10% off room rate total"
  }
};

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  errorMessage?: string;
}

export function validateCoupon(inputCode: string): CouponValidationResult {
  const normalized = inputCode.trim().toUpperCase();
  if (!normalized) {
    return { valid: false, errorMessage: "Please enter a promotional code." };
  }

  const coupon = DEMO_COUPONS[normalized];
  if (coupon) {
    return { valid: true, coupon };
  }

  return {
    valid: false,
    errorMessage: `Coupon code "${normalized}" is invalid or expired. Try demo code "CARLTON10".`
  };
}

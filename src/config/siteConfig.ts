/**
 * Central Configuration for Hotel Carlton
 * 
 * TRUTH RULES & GOVERNANCE:
 * - Verified hotel details are locked below.
 * - Any field that is empty ("" or empty array) will cleanly cause its UI element to disappear.
 * - No fake phone numbers, emails, URLs, reviews, or amenities may be introduced.
 */

export interface HotelAddress {
  street: string;
  locality: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  full: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tripadvisor?: string;
}

export interface AnalyticsConfig {
  ga4Id?: string;
  gtmId?: string;
  googleSearchConsoleId?: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  source: string;
  date?: string;
  comment: string;
}

export interface LandmarkItem {
  category: 'transit' | 'landmark' | 'hospital' | 'shopping';
  name: string;
  note?: string;
}

export interface SiteConfig {
  name: string;
  category: string;
  starRating: number;
  phone: string;
  phoneTel: string;
  address: HotelAddress;
  confirmedAmenities: string[];
  
  // Configurable fields — EMPTY BY DEFAULT, NEVER FAKED
  whatsappNumber: string;
  email: string;
  mapEmbedUrl: string;
  googleBusinessUrl: string;
  bookingUrl: string;
  siteUrl: string;
  checkInTime: string;
  checkOutTime: string;
  hotelPolicies: string[];
  socialLinks: SocialLinks;
  analytics: AnalyticsConfig;
  reviews: ReviewItem[];
  nearbyLandmarks: LandmarkItem[];
}

export const siteConfig: SiteConfig = {
  name: "Hotel Carlton",
  category: "3-star hotel",
  starRating: 3,
  phone: "0581 257 4049",
  phoneTel: "+915812574049",
  address: {
    street: "164/A, Malgodam Rd",
    locality: "Civil Lines",
    city: "Bareilly",
    state: "Uttar Pradesh",
    postalCode: "243001",
    country: "India",
    full: "164/A, Malgodam Rd, Civil Lines, Bareilly, Uttar Pradesh 243001, India"
  },
  // Confirmed amenities ONLY — no invented amenities
  confirmedAmenities: [
    "Wi-Fi",
    "Parking",
    "Food & Dining",
    "Air Conditioning",
    "Laundry Service",
    "Room Service"
  ],

  // CONFIGURABLE BY HOTEL MANAGEMENT — EMPTY BY DEFAULT
  // When empty, the corresponding UI elements disappear cleanly with zero layout shift
  whatsappNumber: "", // e.g. "91XXXXXXXXXX" (no spaces/symbols)
  email: "",          // e.g. "reservations@hotelcarltonbareilly.com"
  mapEmbedUrl: "",    // e.g. "https://www.google.com/maps/embed?pb=..."
  googleBusinessUrl: "", // e.g. "https://maps.google.com/?cid=..."
  bookingUrl: "",     // Direct external booking engine URL if available
  siteUrl: "",        // Public site URL for canonical tags (defaults to window.location.origin)
  checkInTime: "",    // e.g. "12:00 PM" (left empty until confirmed by hotel)
  checkOutTime: "",   // e.g. "11:00 AM" (left empty until confirmed by hotel)
  hotelPolicies: [],  // Specific policies confirmed in writing by hotel
  
  socialLinks: {
    facebook: "",
    instagram: "",
    twitter: "",
    tripadvisor: ""
  },
  
  analytics: {
    ga4Id: "",
    gtmId: "",
    googleSearchConsoleId: ""
  },

  // Empty until verified reviews are provided by hotel management
  reviews: [],

  // Empty until verified local landmarks are configured
  nearbyLandmarks: []
};

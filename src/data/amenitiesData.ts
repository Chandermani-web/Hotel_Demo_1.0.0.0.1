/**
 * Confirmed Amenities for Hotel Carlton
 * 
 * Strict Truth Rules:
 * ONLY verified amenities are included:
 * 1. Wi-Fi
 * 2. Parking
 * 3. Swimming Pool
 * 4. Air Conditioning
 * 5. Laundry Service
 * 6. Room Service
 * 
 * NO fabricated internet speeds, opening hours, square footages, or vehicle capacities.
 */

import { imageManifest } from '../config/imageManifest';

export interface AmenityItem {
  id: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  image?: string;
  imageAlt?: string;
}

export const amenitiesData: AmenityItem[] = [
  {
    id: "swimming-pool",
    name: "Swimming Pool",
    shortDesc: "Outdoor pool surrounded by sandstone deck and quiet garden grounds.",
    fullDesc: "An outdoor swimming pool set within the hotel's private courtyard, complemented by sun loungers and shaded sitting areas for guest relaxation.",
    image: imageManifest.swimmingPool.src,
    imageAlt: imageManifest.swimmingPool.alt
  },
  {
    id: "wifi",
    name: "Wi-Fi",
    shortDesc: "Wireless internet connectivity available for guests across hotel premises.",
    fullDesc: "Complimentary wireless internet access available in guest rooms and common areas, enabling continuous communication for leisure and business travellers.",
    image: imageManifest.roomSuite.src,
    imageAlt: "Wi-Fi connectivity available throughout guest rooms and suites"
  },
  {
    id: "parking",
    name: "Parking",
    shortDesc: "On-site parking area for visiting guests and private vehicles.",
    fullDesc: "Dedicated vehicular parking space provided on the property grounds for resident guests and visitors traveling by personal or hired transport.",
    image: imageManifest.hero.src,
    imageAlt: "Paved entrance courtyard and parking area at Hotel Carlton"
  },
  {
    id: "air-conditioning",
    name: "Air Conditioning",
    shortDesc: "Climate-controlled accommodation ensuring comfort through all seasons.",
    fullDesc: "All guest accommodations feature individually regulated air conditioning systems to maintain a balanced, pleasant indoor environment year-round.",
    image: imageManifest.roomDeluxe.src,
    imageAlt: "Air-conditioned guest room at Hotel Carlton"
  },
  {
    id: "room-service",
    name: "Room Service",
    shortDesc: "In-room dining and refreshment service delivered to your door.",
    fullDesc: "Attentive room service providing tea, coffee, and freshly prepared meals delivered directly to your accommodation during operating service hours.",
    image: imageManifest.roomDeluxe.src,
    imageAlt: "Comfortable in-room dining setting"
  },
  {
    id: "laundry-service",
    name: "Laundry Service",
    shortDesc: "Professional laundering and pressing services for guests.",
    fullDesc: "Daily laundry and garment pressing services handled with care by hotel staff to keep your wardrobe fresh throughout your stay in Bareilly.",
    image: imageManifest.welcomeGrounds.src,
    imageAlt: "Attentive housekeeping and laundry care at Hotel Carlton"
  }
];

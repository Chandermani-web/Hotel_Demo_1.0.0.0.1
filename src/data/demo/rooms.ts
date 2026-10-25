/**
 * Demo Room Inventory & Pricing Configuration
 * 
 * Reuses the existing 3 verified room types with hardcoded demo rates,
 * inventory counts, and occupancy limits.
 */

import { imageManifest } from '../../config/imageManifest';

export interface DemoRoom {
  id: string;
  name: string;
  slug: string;
  baseRate: number;        // INR per night on weekdays (demo)
  inventoryCount: number;  // Total physical rooms in hotel
  maxAdults: number;
  maxChildren: number;
  maxOccupancy: number;
  extraBedAllowed: boolean;
  image: string;
  imageAlt: string;
  shortDesc: string;
  bedType: string;
  confirmedAmenities: string[];
  isDemoData: boolean;
}

export const demoRooms: DemoRoom[] = [
  {
    id: "deluxe-room",
    name: "Deluxe Room",
    slug: "deluxe-room",
    baseRate: 2800,
    inventoryCount: 10,
    maxAdults: 2,
    maxChildren: 1,
    maxOccupancy: 2,
    extraBedAllowed: false,
    image: imageManifest.roomDeluxe.src,
    imageAlt: imageManifest.roomDeluxe.alt,
    shortDesc: "Quiet, comfortable accommodation featuring polished wooden furnishings and dedicated work desk.",
    bedType: "Double Bed / Twin (subject to hotel confirmation)",
    confirmedAmenities: ["Air Conditioning", "Wi-Fi", "Room Service", "Laundry Service"],
    isDemoData: true
  },
  {
    id: "executive-room",
    name: "Executive Room",
    slug: "executive-room",
    baseRate: 3600,
    inventoryCount: 8,
    maxAdults: 2,
    maxChildren: 2,
    maxOccupancy: 3,
    extraBedAllowed: true,
    image: imageManifest.roomDeluxe.src,
    imageAlt: "Executive Room with warm lighting and wooden furnishings",
    shortDesc: "Spacious room with additional sitting area and wardrobe storage, ideal for business visitors.",
    bedType: "King or Queen Bed (subject to hotel confirmation)",
    confirmedAmenities: ["Air Conditioning", "Wi-Fi", "Room Service", "Laundry Service", "Parking"],
    isDemoData: true
  },
  {
    id: "carlton-suite",
    name: "Carlton Suite",
    slug: "carlton-suite",
    baseRate: 5400,
    inventoryCount: 3,
    maxAdults: 3,
    maxChildren: 2,
    maxOccupancy: 4,
    extraBedAllowed: true,
    image: imageManifest.roomSuite.src,
    imageAlt: imageManifest.roomSuite.alt,
    shortDesc: "Generous heritage suite with separated sitting lounge, reading chairs, and natural courtyard light.",
    bedType: "Master Bedroom with Sitting Lounge (subject to hotel confirmation)",
    confirmedAmenities: ["Air Conditioning", "Wi-Fi", "Room Service", "Laundry Service", "Parking", "Food & Dining"],
    isDemoData: true
  }
];

export const getRoomById = (id: string): DemoRoom | undefined => {
  return demoRooms.find(r => r.id === id);
};

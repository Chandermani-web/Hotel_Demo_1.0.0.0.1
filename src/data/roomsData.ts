/**
 * DESIGN PLACEHOLDER: Rooms Data for Hotel Carlton
 * 
 * Developer Notice:
 * The room categories, bed configurations, occupancy figures, and descriptions below
 * serve as structural design placeholders for website commissioning.
 * Final specifications (exact dimensions, bedding, and current tariffs) must be
 * provided and confirmed in writing by the hotel management before publication.
 */

import { imageManifest } from '../config/imageManifest';

export interface RoomItem {
  id: string;
  name: string;
  slug: string;
  isPlaceholder: boolean;
  occupancyPlaceholder: string;
  bedTypePlaceholder: string;
  description: string;
  image: string;
  imageAlt: string;
  confirmedAmenitiesIncluded: string[];
}

export const roomsData: RoomItem[] = [
  {
    id: "deluxe-room",
    name: "Deluxe Room",
    slug: "deluxe-room",
    isPlaceholder: true,
    occupancyPlaceholder: "Up to 2 Adults",
    bedTypePlaceholder: "Double Bed / Twin (subject to hotel confirmation)",
    description: "Quiet and well-proportioned guest room appointed with traditional wooden furnishings, comfortable bedding, and dedicated work desk. Designed for restful stays in Civil Lines.",
    image: imageManifest.roomDeluxe.src,
    imageAlt: imageManifest.roomDeluxe.alt,
    confirmedAmenitiesIncluded: [
      "Air Conditioning",
      "Wi-Fi",
      "Room Service",
      "Laundry Service"
    ]
  },
  {
    id: "executive-room",
    name: "Executive Room",
    slug: "executive-room",
    isPlaceholder: true,
    occupancyPlaceholder: "Up to 2 Adults",
    bedTypePlaceholder: "King or Queen Bed (subject to hotel confirmation)",
    description: "Thoughtfully arranged accommodation offering additional living space, reading chair, and ample wardrobe storage for business visitors and extended stays.",
    image: imageManifest.roomDeluxe.src, // Using verified manifest asset
    imageAlt: "Executive Room arrangement with warm lighting and wooden desk",
    confirmedAmenitiesIncluded: [
      "Air Conditioning",
      "Wi-Fi",
      "Room Service",
      "Laundry Service",
      "Parking"
    ]
  },
  {
    id: "carlton-suite",
    name: "Carlton Suite",
    slug: "carlton-suite",
    isPlaceholder: true,
    occupancyPlaceholder: "Up to 3 Guests",
    bedTypePlaceholder: "Master Bedroom with Sitting Lounge (subject to hotel confirmation)",
    description: "The hotel's most spacious suite category featuring a separated sitting lounge, heritage armchairs, generous dressing area, and natural daylight throughout.",
    image: imageManifest.roomSuite.src,
    imageAlt: imageManifest.roomSuite.alt,
    confirmedAmenitiesIncluded: [
      "Air Conditioning",
      "Wi-Fi",
      "Room Service",
      "Laundry Service",
      "Parking",
      "Swimming Pool Access"
    ]
  }
];

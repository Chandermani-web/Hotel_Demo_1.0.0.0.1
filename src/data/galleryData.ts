/**
 * Gallery Data for Hotel Carlton
 * 
 * Strict Truth Rules:
 * - Categories: 'all' | 'rooms' | 'hotel' | 'amenities'
 */

import { imageManifest } from '../config/imageManifest';

export interface GalleryItem {
  id: string;
  title: string;
  category: 'rooms' | 'hotel' | 'amenities';
  src: string;
  alt: string;
  caption: string;
}

export const galleryCategories = [
  { id: 'all', label: 'All Photos' },
  { id: 'hotel', label: 'Hotel & Courtyard' },
  { id: 'rooms', label: 'Rooms & Suites' },
  { id: 'amenities', label: 'Amenities' },
] as const;

export const galleryData: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Hotel Carlton Facade",
    category: "hotel",
    src: imageManifest.hero.src,
    alt: imageManifest.hero.alt,
    caption: "The grand entrance and heritage architectural facade of Hotel Carlton in Civil Lines, Bareilly."
  },
  {
    id: "gal-2",
    title: "Verandah & Garden Walk",
    category: "hotel",
    src: imageManifest.welcomeCourtyard.src,
    alt: imageManifest.welcomeCourtyard.alt,
    caption: "Arched verandah overlooking the quiet hotel garden pathway."
  },
  {
    id: "gal-3",
    title: "Food & Dining",
    category: "amenities",
    src: imageManifest.foodFeature.src,
    alt: imageManifest.foodFeature.alt,
    caption: "Food and dining service available for resident guests."
  },
  {
    id: "gal-4",
    title: "Deluxe Guest Room",
    category: "rooms",
    src: imageManifest.roomDeluxe.src,
    alt: imageManifest.roomDeluxe.alt,
    caption: "Deluxe Guest Room interior (Design placeholder – exact bedding and layout to be confirmed by hotel)."
  },
  {
    id: "gal-5",
    title: "Executive Suite Living Area",
    category: "rooms",
    src: imageManifest.roomSuite.src,
    alt: imageManifest.roomSuite.alt,
    caption: "Executive Suite seating and desk (Design placeholder – exact furnishings to be confirmed by hotel)."
  },
  {
    id: "gal-6",
    title: "Resident Dining Service",
    category: "amenities",
    src: imageManifest.foodFeature.src,
    alt: "Food and dining service for resident guests",
    caption: "Meals and refreshments prepared for resident guests."
  }
];

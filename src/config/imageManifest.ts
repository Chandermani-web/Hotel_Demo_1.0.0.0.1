
import heroImage from "../assets/images/image.png";
import groundsImage from "../assets/images/carlton_welcome_grounds_1792844006827.jpg";
import poolImage from "../assets/images/carlton_swimming_pool_1792844007306.jpg";
import deluxeImage from "../assets/images/carlton_room_deluxe_1792844008621.jpg";
import suiteImage from "../assets/images/carlton_room_suite_1792844008255.jpg";
export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  category: "hotel" | "rooms" | "amenities" | "pool";
}

export const imageManifest = {
  hero: {
    src: heroImage,
    alt: "Hotel Carlton exterior facade and entrance in Civil Lines, Bareilly",
    width: 1920,
    height: 1080,
    caption: "Hotel Carlton facade and entrance portico in Civil Lines",
    category: "hotel",
  },
  welcomeGrounds: {
    src: groundsImage,
    alt: "Arched verandah and manicured garden grounds at Hotel Carlton",
    width: 1200,
    height: 900,
    caption: "Heritage verandah and hotel garden walkway",
    category: "hotel",
  },
  swimmingPool: {
    src: poolImage,
    alt: "Outdoor swimming pool and poolside seating at Hotel Carlton",
    width: 1200,
    height: 900,
    caption: "The outdoor swimming pool and sun loungers",
    category: "pool",
  },
  roomDeluxe: {
    src: deluxeImage,
    alt: "Deluxe guest room with classic wooden furnishings and warm natural light",
    width: 1200,
    height: 900,
    caption: "Deluxe Room (Design placeholder – to be confirmed by hotel)",
    category: "rooms",
  },
  roomSuite: {
    src: suiteImage,
    alt: "Spacious guest suite with sitting area and heritage decor",
    width: 1200,
    height: 900,
    caption: "Executive Suite (Design placeholder – to be confirmed by hotel)",
    category: "rooms",
  },
} satisfies Record<string, ImageAsset>;

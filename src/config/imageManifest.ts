
import heroImage from "../assets/images/image.png";
import courtyardImage from "../assets/images/Commonarea.jpg";
import foodImage from "../assets/images/Reception.avif";
import deluxeImage from "../assets/images/Room2.jpg";
import suiteImage from "../assets/images/Room1.jpg";
export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  category: "hotel" | "rooms" | "amenities";
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
  welcomeCourtyard: {
    src: courtyardImage,
    alt: "Arched verandah and landscaped courtyard at Hotel Carlton",
    width: 1200,
    height: 900,
    caption: "Heritage verandah and hotel garden walkway",
    category: "hotel",
  },
  foodFeature: {
    src: foodImage,
    alt: "Food and dining service at Hotel Carlton",
    width: 1200,
    height: 900,
    caption: "Food and dining service for resident guests",
    category: "amenities",
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

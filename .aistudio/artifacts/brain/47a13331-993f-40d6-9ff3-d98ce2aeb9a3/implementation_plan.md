# Hotel Carlton – Official Heritage Website (Civil Lines, Bareilly)

A production-grade, classic heritage website for **Hotel Carlton**, an established 3-star hospitality property located in Civil Lines, Bareilly, Uttar Pradesh. Built to convert visitor interest into direct phone calls and enquiries while strictly upholding verified property facts and timeless hotel aesthetics.

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural direction and key styling choices have been aligned based on user clarification:

- **Confirmed Heritage Accent**: **Heritage Oxblood (`#5A1F24`)** for the primary CTA bands, footer backdrop, and elevated focal accents.
- **Confirmed Technical Structure**: **React Single-Page Architecture** with clean history-based routing and seamless URL switching, ensuring rapid client performance and preview fidelity.
- **Confirmed Enquiry Flow**: **Standard enquiry form with email draft launch and instant confirmation modal**, pre-filling check-in/out dates, guest counts, and room choices with zero friction.
- **Strict Truth Rules & Zero-Fake Discipline**: Only 6 confirmed amenities (Wi-Fi, Parking, Swimming Pool, Air Conditioning, Laundry Service, Room Service) will ever appear. Any unconfigured fields (e.g. WhatsApp number, Map embed URL, Google Business link, check-in/out hours) cleanly hide corresponding UI elements rather than fabricating values. All room specs are explicitly designated design placeholders.

---

## 1. Overview & Core Concept

- **What It Does**: Presents Hotel Carlton as a dignified, trusted Indian hotel in Civil Lines, Bareilly. Visitors can explore confirmed amenities, view placeholder room types, inspect the hotel gallery with an accessible lightbox, read clear FAQs and location details, and immediately check availability or initiate direct contact via phone or structured enquiry.
- **Target Audience / Persona**: Business travelers, wedding guests, visiting professionals, and heritage travelers looking for a calm, well-located stay in central Bareilly.
- **Key Value**: Direct bookings and enquiries without intermediary commissions; crystal-clear, verified hotel information that builds immediate trust.

---

## 2. User Experience & Visual Design

```
┌────────────────────────────────────────────────────────────────────────┐
│  UTILITY BAR: Phone 0581 257 4049 · Address: Civil Lines, Bareilly     │
├────────────────────────────────────────────────────────────────────────┤
│  NAVBAR: [ HOTEL CARLTON ]   Rooms · Amenities · Gallery · Contact     │
├────────────────────────────────────────────────────────────────────────┤
│  HERO SECTION                                                          │
│  "Civil Lines, Bareilly"                                               │
│  "Welcome to Hotel Carlton"                                            │
│  [ Book Your Stay ] [ Explore Rooms ]                                  │
├────────────────────────────────────────────────────────────────────────┤
│  AVAILABILITY BAR (Check-in | Check-out | Guests | Check Availability) │
├────────────────────────────────────────────────────────────────────────┤
│  EDITORIAL SPLIT: Heritage Hospitality in the Heart of Bareilly        │
├────────────────────────────────────────────────────────────────────────┤
│  ROOMS PREVIEW: Alternating Elegant Rows (Deluxe, Executive, Suite)   │
├────────────────────────────────────────────────────────────────────────┤
│  CONFIRMED AMENITIES: Wi-Fi, Parking, Pool, AC, Laundry, Room Service  │
├────────────────────────────────────────────────────────────────────────┤
│  WHY STAY AT CARLTON: 5 Curated Editorial Points                       │
├────────────────────────────────────────────────────────────────────────┤
│  HERITAGE OXBLOOD CTA BAND: "Planning Your Stay in Bareilly?"          │
├────────────────────────────────────────────────────────────────────────┤
│  FOOTER: Heritage Oxblood #5A1F24 · Verified Contact Details & Links   │
└────────────────────────────────────────────────────────────────────────┘
```

### Visual Identity & Theme
- **Aesthetic Direction**: **"Classic Heritage"** — timeless, symmetrical, restrained Indian hospitality aesthetic. Editorial elegance inspired by mid-century cantonment and civil lines properties; zero SaaS clichés, zero glassmorphism, zero pill capsules, zero neon.
- **Color Palette**:
  - Dominant Neutral Canvas (60%): Ivory (`#FAF6EE`), Warm White (`#FFFDF8`), Parchment (`#F1E9DA`)
  - Structural Surfaces & Type (30%): Deep Espresso (`#2A1D15`), Antique Charcoal (`#2B2B2B`), Sandstone borders (`#D9C9A8`)
  - High-Intent Accents (10%): Antique Gold (`#A8884B` / hover `#8C6F38`) and Heritage Oxblood (`#5A1F24`) for footer and high-contrast CTA bands.
- **Typography & Scale**:
  - Headings: *Cormorant Garamond* / *Playfair Display* serif, tracked headlines with optical balance.
  - Body & Microcopy: *Source Sans 3* / *Lato* (17–18px, 1.7 line height).
  - Eyebrows: Subdued uppercase serif/sans with wide tracking (`tracking-widest text-xs`).
  - Strict anti-orphan typography and zero pill badge enclosures.
- **Ornamentation**: 1px antique gold hairlines, inline SVG heritage lotus/diamond dividers, arched image frames, and subtle traditional architectural jali lattice motifs.
- **Mobile Sticky Bar**: Compact 3-action bar (`Call Hotel` | `WhatsApp` [if configured] | `Book Stay`) adhering to the $\le 15\%$ viewport cap with safe-area padding.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Centralized Configuration File (`siteConfig.ts`)**
  - *Chosen Approach*: All hotel metadata (name, address, telephone `0581 257 4049`, category, verified amenities, optional URLs, analytics IDs, policies) resides in a single, strictly typed configuration module.
  - *Why*: The hotel owner or operator can configure email, WhatsApp, or map embed URLs in one place. Any empty string or null cleanly hides the corresponding UI element without template crashes or awkward blank cards.
- **Decision 2: Strict Truth Rules & Banned Phrasing**
  - *Chosen Approach*: Completely eliminate buzzwords ("unparalleled luxury", "oasis", "nestled", "tapestry"). Room cards display an honest developer disclaimer: *"Design placeholder — room specifics to be confirmed by hotel"*. Reviews and nearby landmark sections only render if real verified data exists.
  - *Why*: Builds authentic credibility for a 3-star civil lines hotel and prevents misrepresentation.
- **Decision 3: Zero-Dependency Lightbox & Clean Navigation**
  - *Chosen Approach*: Lightweight, fully accessible modal lightbox for the gallery with keyboard navigation (Esc, Arrow keys), focus trapping, and zero layout shift. Clean client-side routing handles `/`, `/rooms`, `/amenities`, `/gallery`, `/about`, `/location`, `/contact`, `/faq`, `/privacy`, and `/terms`.
  - *Why*: Eliminates bundle bloat while ensuring smooth navigation and fast initial paint.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          SITE ARCHITECTURE                             │
│                                                                        │
│   src/config/siteConfig.ts  <──── Centralized Hotel Details & Features │
│   src/data/                                                            │
│     ├── roomsData.ts       <──── Placeholder Room Types & Amenities   │
│     ├── amenitiesData.ts   <──── Confirmed Amenities (6 verified)     │
│     ├── galleryData.ts     <──── High-Fidelity Categorized Imagery     │
│     └── faqData.ts         <──── Verified FAQs & Inquiries             │
│                                                                        │
│   Components/                                                          │
│     ├── Header & UtilityBar                                            │
│     ├── Footer (Oxblood #5A1F24) & MobileStickyBar                     │
│     ├── AvailabilityBar (Direct Enquiry prefill)                       │
│     ├── RoomCard & RoomDisplay                                         │
│     ├── Lightbox & GalleryFilter                                       │
│     ├── EnquiryForm (Validation + Email draft trigger)                 │
│     ├── MapEmbed & ContactInfo                                         │
│     └── SeoHead (JSON-LD Hotel Schema & OpenGraph)                     │
│                                                                        │
│   Pages/                                                               │
│     Home · Rooms · Amenities · Gallery · About · Location · Contact    │
│     FAQ · Privacy · Terms · NotFound (404)                             │
└────────────────────────────────────────────────────────────────────────┘
```

### Component & State Interaction
1. **Availability Bar -> Enquiry Form**:
   - Guests choose Check-in, Check-out, and Guest count on the homepage.
   - Clicking "Check Availability" transitions to `/contact`, pre-populating form state and focusing the booking section.
2. **Gallery Filtering & Lightbox**:
   - Filter state (`All`, `Rooms`, `Hotel`, `Amenities`, `Pool`) drives reactive grid rendering.
   - Click triggers the Lightbox modal with ARIA focus management, keyboard handlers, and touch swipe.
3. **Enquiry Submission Workflow**:
   - Form validates full name, phone number, and optional email with honeypot spam protection.
   - Dispatches a structured `mailto:` link with formatted subject and body, and triggers a clean success modal with booking summary and direct telephone confirmation.
4. **Local SEO & Schema.org**:
   - Dynamic document title and meta description per route.
   - Embedded `Hotel` JSON-LD schema with exact address (`164/A, Malgodam Rd, Civil Lines, Bareilly, UP 243001`), telephone, star rating, and amenity features.
   - BreadcrumbList schema on inner pages.

---

## 5. Implementation Sequence

1. **Brand & Typography Setup**: Configure font preloading (*Cormorant Garamond* & *Source Sans 3*), Tailwind v4 heritage palette tokens, and CSS variables.
2. **Central Configuration & Data Repositories**: Author `siteConfig.ts`, `roomsData.ts`, `amenitiesData.ts`, `galleryData.ts`, and `faqData.ts`.
3. **Core Shared UI Components**: Build `UtilityBar`, `Header`, `Footer`, `MobileStickyBar`, `SectionDivider`, and `Breadcrumbs`.
4. **Visual Asset Generation**: Batch generate authentic heritage hotel imagery (exterior facade, pool, heritage bedroom, civil lines architectural context).
5. **Views & Pages**:
   - `Home`: Hero, Availability bar, Welcome split, Rooms preview, Amenities showcase, 5 Reasons to stay, Oxblood booking CTA.
   - `Rooms`: Categorized room types with specs, amenities, and enquire triggers.
   - `Amenities`: Detail panels for the 6 confirmed amenities.
   - `Gallery`: Filterable grid and accessible lightbox.
   - `About` & `Location`: Factual history, location context, map embed with graceful fallback.
   - `Contact` & `FAQ`: Full reservation enquiry form, direct phone call links, and expandable FAQs.
   - `Legal`: Privacy Policy and Terms & Conditions.
6. **SEO & Accessibility Audit**: Metadata, JSON-LD, sitemap simulation, robots.txt, keyboard navigation, and responsive validation at 360px, 768px, 1024px, and 1440px.

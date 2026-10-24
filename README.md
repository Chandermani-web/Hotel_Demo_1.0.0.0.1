# Hotel Carlton – Official Heritage Website
### 164/A, Malgodam Rd, Civil Lines, Bareilly, Uttar Pradesh 243001, India
**Contact Phone:** `0581 257 4049` | **Category:** 3-Star Hotel

A production-ready website engineered for **Hotel Carlton**, designed with timeless Indian heritage aesthetics, strict truth discipline, and clean performance.

---

## 1. Quick Start & Development

To run the application locally:
```bash
npm install
npm run dev
```
The development server will launch at `http://localhost:3000`.

To build for production:
```bash
npm run build
```

---

## 2. Configuration & Business Details

All hotel information is managed in one central file:
📁 **`src/config/siteConfig.ts`**

### A. Updating Verified Business Information
In `src/config/siteConfig.ts`, you can update:
- `phone`: The public display telephone (currently `0581 257 4049`).
- `phoneTel`: The international telephone URI string (`+915812574049`).
- `address`: The street, locality, city, state, postal code, and country.

### B. Setting the WhatsApp Number
```typescript
// in src/config/siteConfig.ts
whatsappNumber: "919876543210", // Enter country code + mobile number (digits only, no '+' or spaces)
```
*Note: If left empty (`""`), all WhatsApp buttons across the website cleanly disappear without broken links.*

### C. Adding the Hotel Email Address
```typescript
// in src/config/siteConfig.ts
email: "reservations@hotelcarltonbareilly.com",
```
*Note: If empty, the email icon in the utility bar and footer hides cleanly.*

### D. Adding Google Maps Embed & Business Profile
```typescript
// in src/config/siteConfig.ts
mapEmbedUrl: "https://www.google.com/maps/embed?pb=...",
googleBusinessUrl: "https://maps.google.com/?cid=...",
```
*When empty, the website renders a handsome address fallback card with a one-click "Open in Google Maps" search link.*

### E. Check-in/Check-out Times & Policies
```typescript
// in src/config/siteConfig.ts
checkInTime: "12:00 PM",
checkOutTime: "11:00 AM",
hotelPolicies: [
  "Valid government photo ID required for all adult guests upon arrival (Aadhaar, Passport, Voter ID, Driving License).",
  "Swimming pool access is complimentary for resident guests."
]
```

### F. Analytics & Search Console IDs
```typescript
// in src/config/siteConfig.ts
analytics: {
  ga4Id: "G-XXXXXXXXXX",
  gtmId: "GTM-XXXXXXX",
  googleSearchConsoleId: "google-site-verification-token"
}
```

---

## 3. Replacing Placeholder Images with Real Photography

All photographs are centralized in:
📁 **`src/config/imageManifest.ts`**

When real, high-resolution photographs are provided by Hotel Carlton management:
1. Place the image files in `public/images/` or `src/assets/images/`.
2. Update the paths and dimensions in `src/config/imageManifest.ts`:
   - `hero`: Exterior facade / entrance portico (`16:9` ratio recommended).
   - `welcomeGrounds`: Verandah / courtyard garden.
   - `swimmingPool`: Outdoor swimming pool deck.
   - `roomDeluxe`: Deluxe room interior.
   - `roomSuite`: Suite living area or master bedroom.

---

## 4. Connecting the Reservation Enquiry Form

The enquiry form submission logic is isolated inside:
📁 **`src/components/EnquiryForm.tsx`** in the `dispatchEnquiry` function.

### Options for Backend Connection:
- **Option 1: Formspree / Web3Forms**: Replace `dispatchEnquiry` with a `fetch('https://formspree.io/f/YOUR_FORM_ID', { method: 'POST', body: JSON.stringify(data) })`.
- **Option 2: Custom API Route**: Dispatch to an Express endpoint `/api/enquiries` that triggers SendGrid, Nodemailer, or WhatsApp Cloud API.
- **Option 3: Current Default (Zero-Dependency)**: Automatically constructs an organized `mailto:` draft addressed to the configured hotel email while recording immediate client-side confirmation and a printable reservation summary.

---

## 5. Strict Truth Rules & Design Constitution

1. **No Invented Claims**: No "7-star", "luxury palace", or fabricated awards.
2. **Confirmed Amenities Only**: Strictly limited to the 6 verified amenities: Wi-Fi, Parking, Swimming Pool, Air Conditioning, Laundry Service, Room Service.
3. **No Pill Clutter**: Metadata uses unboxed typography with elegant `·` separators.
4. **Heritage Palette**:
   - Canvas: Ivory `#FAF6EE`, Warm White `#FFFDF8`, Parchment `#F1E9DA`
   - Structure & Ink: Deep Espresso `#2A1D15`, Antique Charcoal `#2B2B2B`
   - Accents: Antique Gold `#A8884B`, Heritage Oxblood `#5A1F24`
5. **Mobile Friendly**: Sticky action bar respects the $\le 15\%$ viewport cap and safe area padding.

---

## 6. Demo Booking System

A complete, fully functional, in-browser booking simulation is built into the website. It operates 100% client-side without external dependencies, databases, or payment gateways, allowing hotel management and stakeholders to test the end-to-end guest and reception workflows.

### A. Data Architecture & Files
The demo engine is decoupled through a clean data access layer:
- **`src/data/demo/rooms.ts`**: Room definitions, starting rates in INR, inventory allocation (`inventoryCount`), adult/child capacity, and extra bed policies.
- **`src/data/demo/policies.ts`**: Demo pricing rules (weekend +15% Friday/Saturday markup, 12% demo GST, child under 6 free, extra bed ₹700/night, 48h cancellation rules, and admin credentials).
- **`src/data/demo/coupons.ts`**: Promo code registry (includes demo coupon `CARLTON10` for 10% off room tariff).
- **`src/data/demo/seedBookings.ts`**: 12 pre-loaded bookings spanning the next 60 days across Confirmed, Checked-in, Completed, and Cancelled statuses to showcase inventory changes and realistic reception logs.
- **`src/lib/booking/store.ts`**: Versioned LocalStorage store (`carlton_demo_v1_`) with in-memory fallback if storage is restricted or disabled.
- **`src/lib/booking/availability.ts`**: Real-time room availability calculator, bottleneck night detector, and double-booking preventer.
- **`src/lib/booking/pricing.ts`**: Night-by-night tariff calculator applying weekend surge, extra bed charges, promo discounts, and tax.
- **`src/lib/booking/validation.ts`**: Pure validators for check-in/out dates, guest occupancy rules, Indian 10-digit phone numbers, and emails.
- **`src/lib/booking/ics.ts`**: Client-side `.ics` iCalendar file generator for one-click addition to Google Calendar, Apple Calendar, or Outlook.

### B. Demo Credentials & Promo Codes
- **Reception Desk (Admin Console):**
  - URL: `/admin-demo` (also linked in the footer)
  - Username: `admin`
  - Password: `carlton123`
- **Demo Coupon Code:**
  - Code: `CARLTON10` (10% off room rate on Step 3 of checkout)

### C. How to Customize Rates, Inventory, and Policies
1. **Modify Room Rates or Inventory:**
   Edit `src/data/demo/rooms.ts`:
   ```typescript
   export const DEMO_ROOMS: DemoRoom[] = [
     {
       id: 'deluxe-room',
       title: 'Deluxe Room',
       baseRate: 2800, // INR per night
       inventoryCount: 10, // Total rooms in hotel
       maxAdults: 2,
       maxChildren: 1,
       maxOccupancy: 2,
       extraBedAllowed: false,
       // ...
     },
   ];
   ```
2. **Modify Pricing Rules & Taxes:**
   Edit `src/data/demo/policies.ts`:
   ```typescript
   export const DEMO_POLICIES = {
     WEEKEND_MARKUP: 0.15, // +15% for Fri & Sat nights
     TAX_RATE: 0.12, // 12% GST simulation
     EXTRA_BED_RATE_PER_NIGHT: 700, // INR
     MIN_STAY_NIGHTS: 1,
     MAX_STAY_NIGHTS: 15,
     MAX_ADVANCE_BOOKING_DAYS: 365,
     FREE_CANCELLATION_HOURS: 48,
   };
   ```

### D. How to Reset Demo Data
- **From UI:** Log into the Reception Console at `/admin-demo` and click the **"Reset Demo Data"** button in the header bar.
- **From Browser DevTools:** Run `localStorage.removeItem('carlton_demo_v1_bookings'); localStorage.removeItem('carlton_demo_v1_enquiries'); location.reload();`.

### E. Vitest Unit Test Suite
Run the automated test suite covering date arithmetic, ID generation, pricing rules, form validation, and inventory availability:
```bash
npm test
```
*All 14 tests run purely in-memory with Vitest.*

### F. How to Swap for a Live Backend & Payment Gateway
The demo layer was specifically designed with an isolated data store (`src/lib/booking/store.ts`). When transitioning to a production backend:
1. **API Endpoints:**
   Replace the `store.ts` synchronous localStorage calls (`bookingStore.getBookings()`, `bookingStore.createBooking(...)`) with asynchronous HTTP `fetch()` requests to your backend (e.g., `/api/bookings`, `/api/availability`, `/api/enquiries`).
2. **Payment Gateway Integration:**
   In `src/pages/booking/BookPage.tsx` (`handleSimulatePayment`):
   - Replace the simulated timeout with Razorpay / Cashfree / Stripe checkout SDK.
   - For UPI and NetBanking, invoke the payment gateway's standard checkout script:
     ```typescript
     const options = {
       key: "YOUR_RAZORPAY_KEY",
       amount: pricing.grandTotal * 100, // paise
       currency: "INR",
       name: "Hotel Carlton",
       description: `Reservation for ${selectedRoom.title}`,
       order_id: razorpayOrderIdFromBackend,
       handler: function (response) {
         // Verify signature on backend and confirm reservation
         completeBookingWithBackend(response.razorpay_payment_id);
       }
     };
     const rzp = new window.Razorpay(options);
     rzp.open();
     ```
3. **Database & Concurrency:**
   Replace the client-side availability calculation with a database transaction (PostgreSQL / Cloud SQL / Firestore) using optimistic locking or row locks to guarantee no double-bookings occur during concurrent checkouts.

#   H o t e l _ D e m o _ 1 . 0 . 0 . 0 . 1  
 
import React from 'react';
import { ArrowRight, Phone, MessageSquare, Check, ShieldCheck, MapPin } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { imageManifest } from '../config/imageManifest';
import { roomsData } from '../data/roomsData';
import { amenitiesData } from '../data/amenitiesData';
import { AvailabilityBar } from '../components/AvailabilityBar';
import { BookingCTABand } from '../components/BookingCTABand';
import { MapEmbed } from '../components/MapEmbed';
import { DiamondDivider } from '../components/Ornament';
import { SeoHead } from '../components/SeoHead';

interface HomePageProps {
  navigate: (path: string, state?: Record<string, any>) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const hasWhatsApp = Boolean(siteConfig.whatsappNumber && siteConfig.whatsappNumber.trim() !== "");
  const whatsappUrl = hasWhatsApp
    ? `https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hello Hotel Carlton, I would like to enquire about room availability.")}`
    : null;

  const handleCheckAvailability = (dates: { checkIn: string; checkOut: string; guests: string }) => {
    navigate('/book', dates);
  };

  const whyStayPoints = [
    {
      number: "01",
      title: "Prime Civil Lines Location",
      desc: "Situated on Malgodam Road in central Civil Lines, providing quiet surroundings and convenient connectivity across Bareilly."
    },
    {
      number: "02",
      title: "Essential Modern Amenities",
      desc: "Thoughtful hospitality featuring confirmed Wi-Fi, on-site parking, food and dining service, air conditioning, room service, and laundry."
    },
    {
      number: "03",
      title: "Direct Hotel Communication",
      desc: "Deal directly with hotel reception for transparent communication, room availability checks, and personalized assistance."
    },
    {
      number: "04",
      title: "Comfortable Accommodation",
      desc: "Clean, well-appointed rooms and suites designed for a calm night's rest after business engagements or regional travel."
    },
    {
      number: "05",
      title: "Easy Access to Bareilly Transit",
      desc: "Conveniently positioned for straightforward access to local business centers, railway transit points, and regional arterial roads."
    }
  ];

  return (
    <>
      <SeoHead
        title="Hotel Carlton – Civil Lines, Bareilly | Official Website"
        description="Hotel Carlton is an established 3-star hotel on Malgodam Road in Civil Lines, Bareilly. Quiet heritage hospitality, verified amenities, and direct booking enquiries."
        canonicalPath="/"
      />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center bg-[#2A1D15] text-[#FAF6EE] overflow-hidden">
        {/* Background Photo with warm contrast overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={imageManifest.hero.src}
            alt={imageManifest.hero.alt}
            width={imageManifest.hero.width}
            height={imageManifest.hero.height}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.04]"
          />
          {/* Subtle vignette and dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A1D15] via-[#2A1D15]/40 to-black/35" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-[#D9C9A8] mb-4 font-medium">
            Civil Lines, Bareilly
          </p>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-semibold text-[#FFFDF8] tracking-tight leading-[1.1] mb-6">
            Welcome to Hotel Carlton
          </h1>
          
          <DiamondDivider inverted className="my-5" />
          
          <p className="text-base sm:text-lg md:text-xl text-[#FAF6EE]/90 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Quiet hospitality and comfortable accommodation in the heart of Civil Lines, Bareilly.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/book')}
              className="px-7 py-3.5 bg-[#5A1F24] hover:bg-[#6D262C] text-[#FAF6EE] text-xs font-semibold uppercase tracking-widest rounded-[3px] border border-[#5A1F24] shadow-md transition-colors cursor-pointer"
            >
              Book Your Stay
            </button>
            <button
              type="button"
              onClick={() => navigate('/rooms')}
              className="px-7 py-3.5 bg-[#FAF6EE]/15 hover:bg-[#FAF6EE]/25 text-[#FAF6EE] text-xs font-semibold uppercase tracking-widest rounded-[3px] border border-[#FAF6EE]/50 backdrop-blur-xs transition-colors cursor-pointer"
            >
              Explore Rooms
            </button>
          </div>
        </div>
      </section>

      {/* 2. AVAILABILITY BAR (Submits direct enquiry prefill) */}
      <AvailabilityBar onCheckAvailability={handleCheckAvailability} />

      {/* 3. WELCOME EDITORIAL SPLIT */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text Column */}
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8C6F38] mb-2 font-semibold">
              Heritage Hospitality
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-[#2A1D15] tracking-tight leading-[1.2] mb-6">
              A Quiet Presence in Central Bareilly
            </h2>
            <div className="w-16 h-[2px] bg-[#A8884B] mb-6" />
            
            <div className="space-y-4 text-base text-[#2B2B2B]/85 leading-relaxed font-sans">
              <p>
                Hotel Carlton offers tranquil accommodation in Civil Lines, Bareilly. Positioned along Malgodam Road, the hotel combines classic architectural proportion with essential amenities designed for modern travelers, families, and visiting professionals.
              </p>
              <p>
                Whether you are visiting Bareilly for business, attending family celebrations, or traveling through Uttar Pradesh, Hotel Carlton provides an unhurried atmosphere, thoughtful front desk assistance, and a peaceful courtyard setting.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#D9C9A8]/50 flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={() => navigate('/about')}
                className="text-xs font-semibold uppercase tracking-widest text-[#2A1D15] hover:text-[#8C6F38] inline-flex items-center gap-2"
              >
                <span>Read About Hotel</span>
                <ArrowRight className="w-4 h-4 text-[#A8884B]" />
              </button>
              <a
                href={`tel:${siteConfig.phoneTel}`}
                className="text-xs font-semibold uppercase tracking-widest text-[#8C6F38] hover:text-[#5A1F24] inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#A8884B]" />
                <span>Call: {siteConfig.phone}</span>
              </a>
            </div>
          </div>

          {/* Image Column with Arched Heritage Mask */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative overflow-hidden rounded-t-[120px] rounded-b-[4px] border border-[#D9C9A8] shadow-md bg-[#FFFDF8] p-2">
                <img
                  src={imageManifest.welcomeCourtyard.src}
                  alt={imageManifest.welcomeCourtyard.alt}
                  width={imageManifest.welcomeCourtyard.width}
                  height={imageManifest.welcomeCourtyard.height}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover rounded-t-[114px] rounded-b-[2px]"
                />
              </div>
              <div className="text-center mt-3">
                <span className="text-xs text-[#2B2B2B]/60 italic font-serif">
                  Hotel courtyard and verandah walkway
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. ROOMS PREVIEW (Alternating Rows, Design Placeholders) */}
      <section className="py-20 bg-[#F1E9DA]/50 border-t border-b border-[#D9C9A8]/60">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8C6F38] mb-2 font-semibold">
              Accommodations
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#2A1D15]">
              Rooms & Suites
            </h2>
            <DiamondDivider className="my-4" />
            <p className="text-sm text-[#2B2B2B]/75 leading-relaxed">
              Carefully furnished accommodations designed for quiet comfort and undisturbed rest.
            </p>
            <p className="text-xs text-[#8C6F38] mt-2 font-medium">
              * Design placeholder – room specifics and current tariffs to be confirmed by hotel reception.
            </p>
          </div>

          <div className="space-y-12">
            {roomsData.map((room, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div 
                  key={room.id}
                  className={`bg-[#FFFDF8] border border-[#D9C9A8] rounded-[3px] overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 items-stretch`}
                >
                  {/* Photo Side */}
                  <div className={`lg:col-span-5 relative min-h-[260px] ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <img
                      src={room.image}
                      alt={room.imageAlt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover min-h-[260px]"
                    />
                  </div>

                  {/* Text Side */}
                  <div className={`lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="text-xs uppercase tracking-widest text-[#8C6F38] font-semibold">
                          {room.occupancyPlaceholder}
                        </span>
                        <span className="text-xs text-[#2B2B2B]/50 font-mono">
                          {room.bedTypePlaceholder}
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-[#2A1D15] mb-3">
                        {room.name}
                      </h3>

                      <p className="text-sm text-[#2B2B2B]/80 leading-relaxed mb-6">
                        {room.description}
                      </p>

                      {/* Clean Unboxed Metadata without pills */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#2B2B2B]/70 mb-6">
                        <span className="font-semibold text-[#2A1D15]">Included Amenities:</span>
                        {room.confirmedAmenitiesIncluded.map((amenity, aIdx) => (
                          <React.Fragment key={amenity}>
                            <span>{amenity}</span>
                            {aIdx < room.confirmedAmenitiesIncluded.length - 1 && (
                              <span aria-hidden="true" className="text-[#A8884B]">·</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#D9C9A8]/40 flex flex-wrap items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => navigate('/book', { roomPreference: room.name })}
                        className="px-5 py-2.5 bg-[#5A1F24] hover:bg-[#6D262C] text-[#FAF6EE] text-xs font-semibold uppercase tracking-widest rounded-[2px] transition-colors cursor-pointer"
                      >
                        Book {room.name}
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate('/rooms')}
                        className="text-xs font-semibold uppercase tracking-wider text-[#2A1D15] hover:text-[#8C6F38] inline-flex items-center gap-1.5"
                      >
                        <span>View All Rooms</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#A8884B]" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. CONFIRMED AMENITIES (6 verified amenities only) */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8C6F38] mb-2 font-semibold">
              Verified Amenities
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#2A1D15] mb-4">
              Guest Amenities & Facilities
            </h2>
            <div className="w-16 h-[2px] bg-[#A8884B] mb-6" />
            <p className="text-sm text-[#2B2B2B]/80 leading-relaxed mb-8">
              At Hotel Carlton, we provide essential, verified facilities to ensure a comfortable stay. Each amenity listed below is confirmed and available for resident guests.
            </p>

            <div className="relative rounded-[3px] overflow-hidden border border-[#D9C9A8] shadow-xs">
              <img
                src={imageManifest.foodFeature.src}
                alt={imageManifest.foodFeature.alt}
                referrerPolicy="no-referrer"
                className="w-full h-64 object-cover"
              />
              <div className="p-3 bg-[#FFFDF8] text-xs text-[#2B2B2B]/75 border-t border-[#D9C9A8]/40 flex items-center justify-between">
                <span>Food & Dining at Hotel Carlton</span>
                <span className="text-[#8C6F38] font-serif italic">Resident Facility</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {amenitiesData.map((amenity) => (
                <div 
                  key={amenity.id}
                  className="bg-[#FFFDF8] border border-[#D9C9A8] p-6 rounded-[3px] shadow-2xs hover:border-[#A8884B] transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rotate-45 bg-[#A8884B]" aria-hidden="true" />
                    <h3 className="text-lg font-serif font-semibold text-[#2A1D15]">
                      {amenity.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[#2B2B2B]/80 leading-relaxed font-sans">
                    {amenity.fullDesc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center sm:text-left">
              <button
                type="button"
                onClick={() => navigate('/amenities')}
                className="px-6 py-3 bg-[#2A1D15] hover:bg-[#5A1F24] text-[#FAF6EE] text-xs font-semibold uppercase tracking-widest rounded-[2px] transition-colors inline-flex items-center gap-2"
              >
                <span>View Full Amenities Details</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D9C9A8]" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 6. WHY STAY AT HOTEL CARLTON (Numbered human editorial list) */}
      <section className="py-20 bg-[#2A1D15] text-[#FAF6EE] border-t border-b border-[#A8884B]/30">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-[#D9C9A8] mb-2 font-medium">
              Guest Benefits
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#FFFDF8]">
              Why Stay at Hotel Carlton
            </h2>
            <DiamondDivider inverted className="my-4" />
            <p className="text-sm text-[#FAF6EE]/80 leading-relaxed">
              Five quiet reasons travelers and visitors choose our Civil Lines address.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {whyStayPoints.map((point) => (
              <div 
                key={point.number}
                className="bg-[#FAF6EE]/5 border border-[#FAF6EE]/15 p-6 rounded-[3px] flex flex-col justify-between hover:border-[#A8884B] transition-colors"
              >
                <div>
                  <span className="text-2xl font-serif font-semibold text-[#A8884B] block mb-3 font-mono">
                    {point.number}
                  </span>
                  <h3 className="text-base font-serif font-semibold text-[#FFFDF8] mb-2">
                    {point.title}
                  </h3>
                  <p className="text-xs text-[#FAF6EE]/75 leading-relaxed font-sans">
                    {point.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. GALLERY PREVIEW */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#8C6F38] mb-1 font-semibold">
              Visual Impressions
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#2A1D15]">
              Hotel Gallery
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/gallery')}
            className="text-xs font-semibold uppercase tracking-widest text-[#2A1D15] hover:text-[#8C6F38] inline-flex items-center gap-2 self-start md:self-auto"
          >
            <span>View Complete Gallery</span>
            <ArrowRight className="w-4 h-4 text-[#A8884B]" />
          </button>
        </div>

        {/* Asymmetrical 3-photo composition */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          <div className="md:col-span-7 rounded-[3px] overflow-hidden border border-[#D9C9A8] relative min-h-[320px] group cursor-pointer" onClick={() => navigate('/gallery')}>
            <img
              src={imageManifest.hero.src}
              alt="Hotel Carlton Facade"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <span className="text-white text-xs font-semibold uppercase tracking-widest">Hotel Facade & Courtyard</span>
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="flex-1 rounded-[3px] overflow-hidden border border-[#D9C9A8] relative min-h-[160px] group cursor-pointer" onClick={() => navigate('/gallery')}>
              <img
                src={imageManifest.foodFeature.src}
                alt={imageManifest.foodFeature.alt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-xs font-semibold uppercase tracking-widest">Food & Dining Service</span>
              </div>
            </div>

            <div className="flex-1 rounded-[3px] overflow-hidden border border-[#D9C9A8] relative min-h-[160px] group cursor-pointer" onClick={() => navigate('/gallery')}>
              <img
                src={imageManifest.roomDeluxe.src}
                alt="Guest room interior"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-xs font-semibold uppercase tracking-widest">Guest Accommodation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. GUEST REVIEWS (CONDITIONAL: renders ONLY if real reviews exist in siteConfig) */}
      {siteConfig.reviews && siteConfig.reviews.length > 0 && (
        <section className="py-20 bg-[#F1E9DA]/50 border-t border-[#D9C9A8]">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8C6F38] mb-2 font-semibold">
              Guest Feedback
            </p>
            <h2 className="text-3xl font-serif font-semibold text-[#2A1D15] mb-8">
              Words From Our Guests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {siteConfig.reviews.map(rev => (
                <div key={rev.id} className="bg-[#FFFDF8] border border-[#D9C9A8] p-6 rounded-[3px]">
                  <p className="text-sm text-[#2B2B2B] italic mb-4 font-serif">"{rev.comment}"</p>
                  <p className="text-xs font-semibold text-[#2A1D15] uppercase tracking-wider">{rev.author} <span className="text-[#2B2B2B]/50 font-normal">({rev.source})</span></p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. LOCATION & MAP */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8C6F38] mb-2 font-semibold">
              Civil Lines, Bareilly
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#2A1D15] mb-4">
              Convenient Location
            </h2>
            <div className="w-16 h-[2px] bg-[#A8884B] mb-6" />
            <p className="text-sm text-[#2B2B2B]/85 leading-relaxed mb-6 font-sans">
              Hotel Carlton is located at 164/A, Malgodam Road in Civil Lines, Bareilly. The property is ideally positioned for guests needing swift transit access while enjoying a calmer residential-commercial quarter.
            </p>
            <ul className="space-y-3 text-xs text-[#2B2B2B]/80 mb-8">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#A8884B]" aria-hidden="true" />
                <span>164/A, Malgodam Rd, Civil Lines, Bareilly, UP 243001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#A8884B]" aria-hidden="true" />
                <span>Telephone: {siteConfig.phone}</span>
              </li>
            </ul>
            <button
              type="button"
              onClick={() => navigate('/location')}
              className="text-xs font-semibold uppercase tracking-widest text-[#2A1D15] hover:text-[#8C6F38] inline-flex items-center gap-2"
            >
              <span>Explore Location Details</span>
              <ArrowRight className="w-4 h-4 text-[#A8884B]" />
            </button>
          </div>

          <div className="lg:col-span-7">
            <MapEmbed />
          </div>
        </div>
      </section>

      {/* 10. REUSABLE BOOKING CTA BAND */}
      <BookingCTABand navigate={navigate} />
    </>
  );
};

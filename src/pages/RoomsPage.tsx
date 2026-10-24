import React from 'react';
import { roomsData, RoomItem } from '../data/roomsData';
import { imageManifest } from '../config/imageManifest';
import { siteConfig } from '../config/siteConfig';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { BookingCTABand } from '../components/BookingCTABand';
import { SeoHead } from '../components/SeoHead';
import { DiamondDivider } from '../components/Ornament';
import { Users, Bed, Check, Phone } from 'lucide-react';

interface RoomsPageProps {
  navigate: (path: string, state?: Record<string, any>) => void;
}

export const RoomsPage: React.FC<RoomsPageProps> = ({ navigate }) => {
  return (
    <>
      <SeoHead
        title="Rooms & Suites – Hotel Carlton | Civil Lines, Bareilly"
        description="Explore rooms and suites at Hotel Carlton in Civil Lines, Bareilly. Comfortable accommodation, confirmed Wi-Fi, air conditioning, and room service."
        canonicalPath="/rooms"
        breadcrumbs={[{ name: "Rooms & Suites", item: "/rooms" }]}
      />

      <Breadcrumbs items={[{ label: "Rooms & Suites", path: "/rooms" }]} navigate={navigate} />

      {/* Header Banner */}
      <section className="bg-[#FAF6EE] py-14 sm:py-20 border-b border-[#D9C9A8]/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[#8C6F38] mb-2 font-semibold">
            Accommodations in Civil Lines
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-[#2A1D15] tracking-tight">
            Rooms & Suites at Hotel Carlton
          </h1>
          <DiamondDivider className="my-4" />
          <p className="text-sm sm:text-base text-[#2B2B2B]/80 max-w-2xl mx-auto leading-relaxed">
            Thoughtfully prepared rooms designed for quiet rest and personal comfort during your stay in Bareilly.
          </p>
          
          <div className="mt-4 p-3 bg-[#FFFDF8] border border-[#D9C9A8] max-w-xl mx-auto text-xs text-[#8C6F38] rounded-[2px]">
            <strong>Notice for guests & commissioners:</strong> Room categories, dimensions, and bedding configurations shown below serve as design placeholders. Final specifications and tariffs are to be confirmed directly by hotel management.
          </div>
        </div>
      </section>

      {/* Room Showcase List */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 space-y-16">
        {roomsData.map((room: RoomItem, index: number) => {
          const isEven = index % 2 === 0;

          return (
            <article 
              key={room.id}
              id={room.slug}
              className="bg-[#FFFDF8] border border-[#D9C9A8] rounded-[3px] overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 items-stretch"
            >
              {/* Photo Presentation */}
              <div className={`lg:col-span-6 relative min-h-[300px] lg:min-h-[420px] ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                <img
                  src={room.image}
                  alt={room.imageAlt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#2A1D15]/85 text-[#FAF6EE] text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-[2px] backdrop-blur-xs">
                  {room.isPlaceholder ? "Design Placeholder" : "Verified Room"}
                </div>
              </div>

              {/* Information Presentation */}
              <div className={`lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                <div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#2B2B2B]/70 mb-3 pb-3 border-b border-[#D9C9A8]/40">
                    <span className="flex items-center gap-1.5 font-medium text-[#2A1D15]">
                      <Users className="w-3.5 h-3.5 text-[#A8884B]" aria-hidden="true" />
                      <span>{room.occupancyPlaceholder}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1.5 font-medium text-[#2A1D15]">
                      <Bed className="w-3.5 h-3.5 text-[#A8884B]" aria-hidden="true" />
                      <span>{room.bedTypePlaceholder}</span>
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#2A1D15] mb-3">
                    {room.name}
                  </h2>

                  <p className="text-sm text-[#2B2B2B]/85 leading-relaxed mb-6 font-sans">
                    {room.description}
                  </p>

                  {/* Confirmed Amenities List */}
                  <div className="mb-6">
                    <h3 className="text-xs uppercase tracking-widest text-[#8C6F38] font-semibold mb-3">
                      Confirmed Amenities Included:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#2B2B2B]/85">
                      {room.confirmedAmenitiesIncluded.map(amenity => (
                        <div key={amenity} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#A8884B] shrink-0" aria-hidden="true" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="pt-6 border-t border-[#D9C9A8]/60 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => navigate('/book', { roomPreference: room.name })}
                    className="px-6 py-3 bg-[#5A1F24] hover:bg-[#6D262C] text-[#FAF6EE] text-xs font-semibold uppercase tracking-widest rounded-[2px] transition-colors cursor-pointer"
                  >
                    Book {room.name}
                  </button>

                  <a
                    href={`tel:${siteConfig.phoneTel}`}
                    className="text-xs font-semibold uppercase tracking-wider text-[#2A1D15] hover:text-[#8C6F38] inline-flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#A8884B]" />
                    <span>Call Desk: {siteConfig.phone}</span>
                  </a>
                </div>

              </div>
            </article>
          );
        })}
      </section>

      <BookingCTABand navigate={navigate} />
    </>
  );
};

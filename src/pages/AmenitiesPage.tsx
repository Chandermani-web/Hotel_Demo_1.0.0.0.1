import React from 'react';
import { amenitiesData } from '../data/amenitiesData';
import { siteConfig } from '../config/siteConfig';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { BookingCTABand } from '../components/BookingCTABand';
import { SeoHead } from '../components/SeoHead';
import { DiamondDivider } from '../components/Ornament';
import { Wifi, Car, Wind, Utensils, Shirt, Phone } from 'lucide-react';

interface AmenitiesPageProps {
  navigate: (path: string) => void;
}

export const AmenitiesPage: React.FC<AmenitiesPageProps> = ({ navigate }) => {
  const getAmenityIcon = (id: string) => {
    switch (id) {
      case 'wifi':
        return <Wifi className="w-5 h-5 text-[#A8884B]" aria-hidden="true" />;
      case 'parking':
        return <Car className="w-5 h-5 text-[#A8884B]" aria-hidden="true" />;
      case 'food-dining':
        return <Utensils className="w-5 h-5 text-[#A8884B]" aria-hidden="true" />;
      case 'air-conditioning':
        return <Wind className="w-5 h-5 text-[#A8884B]" aria-hidden="true" />;
      case 'room-service':
        return <Utensils className="w-5 h-5 text-[#A8884B]" aria-hidden="true" />;
      case 'laundry-service':
        return <Shirt className="w-5 h-5 text-[#A8884B]" aria-hidden="true" />;
      default:
        return <div className="w-2 h-2 rotate-45 bg-[#A8884B]" aria-hidden="true" />;
    }
  };

  return (
    <>
      <SeoHead
        title="Guest Amenities – Hotel Carlton | Civil Lines, Bareilly"
        description="Verified guest amenities at Hotel Carlton in Civil Lines, Bareilly: Food & Dining, Wi-Fi, on-site Parking, Air Conditioning, Laundry, and Room Service."
        canonicalPath="/amenities"
        breadcrumbs={[{ name: "Amenities", item: "/amenities" }]}
      />

      <Breadcrumbs items={[{ label: "Amenities", path: "/amenities" }]} navigate={navigate} />

      {/* Header Banner */}
      <section className="bg-[#FAF6EE] py-14 sm:py-20 border-b border-[#D9C9A8]/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[#8C6F38] mb-2 font-semibold">
            Hotel Services & Facilities
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-[#2A1D15] tracking-tight">
            Confirmed Amenities
          </h1>
          <DiamondDivider className="my-4" />
          <p className="text-sm sm:text-base text-[#2B2B2B]/80 max-w-2xl mx-auto leading-relaxed">
            Essential hospitality amenities provided for resident guests. We present only verified services to ensure clear and trustworthy guest expectations.
          </p>
        </div>
      </section>

      {/* Amenities Grid & Photo Sections */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenitiesData.map((amenity) => (
            <article 
              key={amenity.id}
              className="bg-[#FFFDF8] border border-[#D9C9A8] rounded-[3px] overflow-hidden shadow-2xs flex flex-col justify-between"
            >
              {amenity.image && (
                <div className="h-52 w-full overflow-hidden bg-[#FAF6EE] border-b border-[#D9C9A8]/50">
                  <img
                    src={amenity.image}
                    alt={amenity.imageAlt || amenity.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-[#FAF6EE] border border-[#D9C9A8]/60 rounded-[2px]">
                      {getAmenityIcon(amenity.id)}
                    </div>
                    <h2 className="text-xl font-serif font-semibold text-[#2A1D15]">
                      {amenity.name}
                    </h2>
                  </div>

                  <p className="text-sm text-[#2B2B2B]/85 leading-relaxed font-sans mb-4">
                    {amenity.fullDesc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D9C9A8]/40 flex items-center justify-between text-xs text-[#2B2B2B]/60">
                  <span>Available to resident guests</span>
                  <span className="text-[#8C6F38] font-medium">Verified</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Note on hotel services */}
        <div className="mt-16 p-6 bg-[#FAF6EE] border border-[#D9C9A8] rounded-[3px] max-w-3xl mx-auto text-center">
          <h3 className="text-base font-serif font-semibold text-[#2A1D15] mb-2">
            Have Questions Regarding Specific Facilities?
          </h3>
          <p className="text-xs text-[#2B2B2B]/75 leading-relaxed max-w-xl mx-auto mb-4">
            If you have questions about food service timing, parking arrangements for large vehicles, or specific laundry turnaround times, please speak with our front desk team.
          </p>
          <a
            href={`tel:${siteConfig.phoneTel}`}
            className="text-xs font-semibold uppercase tracking-widest text-[#5A1F24] hover:underline inline-flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Reception: {siteConfig.phone}</span>
          </a>
        </div>
      </section>

      <BookingCTABand navigate={navigate} />
    </>
  );
};

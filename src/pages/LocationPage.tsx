import React from 'react';
import { siteConfig } from '../config/siteConfig';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { BookingCTABand } from '../components/BookingCTABand';
import { SeoHead } from '../components/SeoHead';
import { MapEmbed } from '../components/MapEmbed';
import { DiamondDivider } from '../components/Ornament';
import { MapPin, Navigation, Phone, ExternalLink } from 'lucide-react';

interface LocationPageProps {
  navigate: (path: string) => void;
}

export const LocationPage: React.FC<LocationPageProps> = ({ navigate }) => {
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${siteConfig.name}, ${siteConfig.address.full}`
  )}`;

  // Filter landmarks if configured
  const transitLandmarks = siteConfig.nearbyLandmarks.filter(l => l.category === 'transit');
  const culturalLandmarks = siteConfig.nearbyLandmarks.filter(l => l.category === 'landmark');
  const hospitalLandmarks = siteConfig.nearbyLandmarks.filter(l => l.category === 'hospital');
  const shoppingLandmarks = siteConfig.nearbyLandmarks.filter(l => l.category === 'shopping');

  return (
    <>
      <SeoHead
        title="Location & Directions – Hotel Carlton | Civil Lines, Bareilly"
        description="Find Hotel Carlton at 164/A, Malgodam Rd, Civil Lines, Bareilly, Uttar Pradesh 243001. Location directions, navigation assistance, and transit guidance."
        canonicalPath="/location"
        breadcrumbs={[{ name: "Location", item: "/location" }]}
      />

      <Breadcrumbs items={[{ label: "Location", path: "/location" }]} navigate={navigate} />

      {/* Header Banner */}
      <section className="bg-[#FAF6EE] py-14 sm:py-20 border-b border-[#D9C9A8]/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[#8C6F38] mb-2 font-semibold">
            Address & Transit
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-[#2A1D15] tracking-tight">
            Hotel Carlton in Civil Lines, Bareilly
          </h1>
          <DiamondDivider className="my-4" />
          <p className="text-sm sm:text-base text-[#2B2B2B]/80 max-w-2xl mx-auto leading-relaxed">
            Conveniently situated along Malgodam Road in the established Civil Lines district of Bareilly, Uttar Pradesh.
          </p>
        </div>
      </section>

      {/* Location Details & Map Stage */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Address & Guidance Card */}
          <div className="lg:col-span-5 bg-[#FFFDF8] border border-[#D9C9A8] p-6 sm:p-8 rounded-[3px] shadow-xs">
            <h2 className="text-2xl font-serif font-semibold text-[#2A1D15] mb-4">
              Property Location
            </h2>
            <div className="w-12 h-[2px] bg-[#A8884B] mb-6" />

            <div className="space-y-4 text-sm text-[#2B2B2B]/85 mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#A8884B] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <strong className="block text-[#2A1D15] font-semibold mb-1">Hotel Carlton</strong>
                  <p>{siteConfig.address.street}</p>
                  <p>{siteConfig.address.locality}</p>
                  <p>{siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.postalCode}</p>
                  <p>{siteConfig.address.country}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#D9C9A8]/40">
                <Phone className="w-5 h-5 text-[#A8884B] shrink-0" aria-hidden="true" />
                <div>
                  <span className="block text-xs uppercase tracking-wider text-[#2B2B2B]/60">Reception Desk:</span>
                  <a href={`tel:${siteConfig.phoneTel}`} className="font-mono text-base font-semibold text-[#2A1D15] hover:text-[#5A1F24]">
                    {siteConfig.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-[#2A1D15] hover:bg-[#5A1F24] text-[#FAF6EE] text-xs font-semibold uppercase tracking-widest rounded-[2px] transition-colors flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4 text-[#D9C9A8]" />
                <span>Get Directions in Google Maps</span>
              </a>

              {siteConfig.googleBusinessUrl && (
                <a
                  href={siteConfig.googleBusinessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-transparent border border-[#A8884B] text-[#2A1D15] hover:bg-[#FAF6EE] text-xs font-semibold uppercase tracking-widest rounded-[2px] transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#A8884B]" />
                  <span>Google Business Listing</span>
                </a>
              )}
            </div>

            <p className="text-xs text-[#2B2B2B]/60 mt-6 leading-relaxed pt-4 border-t border-[#D9C9A8]/40">
              For guests arriving by rail or road, please feel free to call our reception desk if you need immediate local transit guidance upon arrival in Bareilly.
            </p>
          </div>

          {/* Interactive Map or Fallback Map Card */}
          <div className="lg:col-span-7">
            <MapEmbed />
          </div>

        </div>

        {/* PREPARED EMPTY SECTIONS: Render ONLY when real data exists in siteConfig.nearbyLandmarks */}
        {transitLandmarks.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#D9C9A8]">
            <h3 className="text-xl font-serif font-semibold text-[#2A1D15] mb-4">Getting Here & Transit</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {transitLandmarks.map((item, idx) => (
                <div key={idx} className="p-4 bg-[#FFFDF8] border border-[#D9C9A8] rounded-[2px]">
                  <p className="font-semibold text-sm text-[#2A1D15]">{item.name}</p>
                  {item.note && <p className="text-xs text-[#2B2B2B]/70 mt-1">{item.note}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {culturalLandmarks.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[#D9C9A8]">
            <h3 className="text-xl font-serif font-semibold text-[#2A1D15] mb-4">Nearby Landmarks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {culturalLandmarks.map((item, idx) => (
                <div key={idx} className="p-4 bg-[#FFFDF8] border border-[#D9C9A8] rounded-[2px]">
                  <p className="font-semibold text-sm text-[#2A1D15]">{item.name}</p>
                  {item.note && <p className="text-xs text-[#2B2B2B]/70 mt-1">{item.note}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {hospitalLandmarks.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[#D9C9A8]">
            <h3 className="text-xl font-serif font-semibold text-[#2A1D15] mb-4">Hospitals & Medical Care</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {hospitalLandmarks.map((item, idx) => (
                <div key={idx} className="p-4 bg-[#FFFDF8] border border-[#D9C9A8] rounded-[2px]">
                  <p className="font-semibold text-sm text-[#2A1D15]">{item.name}</p>
                  {item.note && <p className="text-xs text-[#2B2B2B]/70 mt-1">{item.note}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {shoppingLandmarks.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[#D9C9A8]">
            <h3 className="text-xl font-serif font-semibold text-[#2A1D15] mb-4">Dining & Shopping</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {shoppingLandmarks.map((item, idx) => (
                <div key={idx} className="p-4 bg-[#FFFDF8] border border-[#D9C9A8] rounded-[2px]">
                  <p className="font-semibold text-sm text-[#2A1D15]">{item.name}</p>
                  {item.note && <p className="text-xs text-[#2B2B2B]/70 mt-1">{item.note}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

      </section>

      <BookingCTABand navigate={navigate} />
    </>
  );
};

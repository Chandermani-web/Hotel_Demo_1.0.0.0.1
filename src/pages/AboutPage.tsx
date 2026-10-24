import React from 'react';
import { siteConfig } from '../config/siteConfig';
import { imageManifest } from '../config/imageManifest';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { BookingCTABand } from '../components/BookingCTABand';
import { SeoHead } from '../components/SeoHead';
import { DiamondDivider } from '../components/Ornament';
import { MapPin, Phone, ShieldCheck } from 'lucide-react';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <>
      <SeoHead
        title="About Hotel Carlton – Heritage Hotel in Civil Lines, Bareilly"
        description="Learn about Hotel Carlton, an established 3-star property on Malgodam Road in Civil Lines, Bareilly. Factual history, calm hospitality, and verified guest services."
        canonicalPath="/about"
        breadcrumbs={[{ name: "About", item: "/about" }]}
      />

      <Breadcrumbs items={[{ label: "About", path: "/about" }]} navigate={navigate} />

      {/* Header Banner */}
      <section className="bg-[#FAF6EE] py-14 sm:py-20 border-b border-[#D9C9A8]/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[#8C6F38] mb-2 font-semibold">
            Heritage & Hospitality
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-[#2A1D15] tracking-tight">
            About Hotel Carlton
          </h1>
          <DiamondDivider className="my-4" />
          <p className="text-sm sm:text-base text-[#2B2B2B]/80 max-w-2xl mx-auto leading-relaxed">
            A respected hotel property on Malgodam Road in Civil Lines, Bareilly, dedicated to calm, reliable hospitality.
          </p>
        </div>
      </section>

      {/* Narrative Section 1: The Civil Lines Setting */}
      <section className="py-16 md:py-24 max-w-5xl mx-auto px-6 font-sans">
        <div className="space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-7">
              <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#2A1D15] mb-4">
                Hospitality in Bareilly's Civil Lines
              </h2>
              <div className="w-12 h-[2px] bg-[#A8884B] mb-6" />
              <div className="space-y-4 text-sm text-[#2B2B2B]/85 leading-relaxed">
                <p>
                  Hotel Carlton is situated at 164/A, Malgodam Road in Civil Lines, Bareilly. Civil Lines has long served as a prominent civic, administrative, and residential quarter of Bareilly, known for its tree-lined thoroughfares and relatively quiet setting compared to the bustling inner market squares.
                </p>
                <p>
                  As an established 3-star hotel, Hotel Carlton welcomes visitors traveling for commercial engagements, regional affairs, family ceremonies, and leisure travel across Rohilkhand.
                </p>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="rounded-[3px] overflow-hidden border border-[#D9C9A8] shadow-xs">
                <img
                  src={imageManifest.welcomeGrounds.src}
                  alt="Verandah walkway at Hotel Carlton"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Narrative Section 2: Truthful Hospitality Principles */}
          <div className="p-8 md:p-12 bg-[#FFFDF8] border border-[#D9C9A8] rounded-[3px] shadow-2xs">
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#2A1D15] mb-4 text-center">
              Our Operational Approach
            </h2>
            <DiamondDivider className="my-4" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 text-left">
              <div>
                <h3 className="text-base font-serif font-semibold text-[#2A1D15] mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rotate-45 bg-[#A8884B]" />
                  <span>Quiet Rest</span>
                </h3>
                <p className="text-xs text-[#2B2B2B]/80 leading-relaxed">
                  We believe that the primary virtue of a hotel stay is a peaceful night's rest. Our guest rooms are maintained with clean linens, functional air conditioning, and prompt housekeeping.
                </p>
              </div>

              <div>
                <h3 className="text-base font-serif font-semibold text-[#2A1D15] mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rotate-45 bg-[#A8884B]" />
                  <span>Essential Services</span>
                </h3>
                <p className="text-xs text-[#2B2B2B]/80 leading-relaxed">
                  Rather than making unsubstantiated promises, we focus on confirmed guest necessities: Wi-Fi, on-site parking, swimming pool access, room service, and laundry care.
                </p>
              </div>

              <div>
                <h3 className="text-base font-serif font-semibold text-[#2A1D15] mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rotate-45 bg-[#A8884B]" />
                  <span>Direct Assistance</span>
                </h3>
                <p className="text-xs text-[#2B2B2B]/80 leading-relaxed">
                  Our front desk is staffed with knowledgeable personnel who can assist with check-in queries, local directions, and transport recommendations across Bareilly.
                </p>
              </div>
            </div>
          </div>

          {/* Hotel Identity Card */}
          <div className="bg-[#FAF6EE] border border-[#D9C9A8] p-6 rounded-[3px] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#2B2B2B]/80">
            <div>
              <span className="font-semibold text-[#2A1D15] uppercase tracking-wider block mb-1">
                Property Verification
              </span>
              <span>Hotel Carlton · 3-Star Hotel · 164/A, Malgodam Rd, Civil Lines, Bareilly (UP) 243001</span>
            </div>
            <a
              href={`tel:${siteConfig.phoneTel}`}
              className="px-4 py-2 bg-[#2A1D15] text-[#FAF6EE] rounded-[2px] font-semibold uppercase tracking-wider hover:bg-[#5A1F24] transition-colors shrink-0 inline-flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-[#D9C9A8]" />
              <span>Reception: {siteConfig.phone}</span>
            </a>
          </div>

        </div>
      </section>

      <BookingCTABand navigate={navigate} />
    </>
  );
};

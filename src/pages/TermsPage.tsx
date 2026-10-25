import React from 'react';
import { siteConfig } from '../config/siteConfig';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SeoHead } from '../components/SeoHead';
import { DiamondDivider } from '../components/Ornament';

interface TermsPageProps {
  navigate: (path: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ navigate }) => {
  return (
    <>
      <SeoHead
        title="Terms & Conditions – Hotel Carlton | Civil Lines, Bareilly"
        description="Terms and conditions for guest stays and website use at Hotel Carlton, Civil Lines, Bareilly. Standard template pending hotel legal review."
        canonicalPath="/terms"
        breadcrumbs={[{ name: "Terms & Conditions", item: "/terms" }]}
      />

      <Breadcrumbs items={[{ label: "Terms & Conditions", path: "/terms" }]} navigate={navigate} />

      <section className="py-14 sm:py-20 max-w-4xl mx-auto px-6 font-sans">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#8C6F38] mb-2 font-semibold">
            Operational Guidelines
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#2A1D15]">
            Terms & Conditions
          </h1>
          <DiamondDivider className="my-4" />
          <div className="p-3 bg-[#FAF6EE] border border-[#D9C9A8] text-xs text-[#8C6F38] rounded-[2px] max-w-lg mx-auto">
            * <em>Notice: This standard operational template is subject to review and final endorsement by Hotel Carlton's legal advisor.</em>
          </div>
        </div>

        <div className="bg-[#FFFDF8] border border-[#D9C9A8] p-8 md:p-12 rounded-[3px] shadow-2xs space-y-8 text-sm text-[#2B2B2B]/85 leading-relaxed">
          <div>
            <h2 className="text-xl font-serif font-semibold text-[#2A1D15] mb-2">1. Booking Enquiries vs. Confirmed Reservations</h2>
            <p>
              Submissions made through this website represent requests for availability and estimated tariffs. A reservation is officially confirmed only upon direct agreement with the Hotel Carlton front desk and fulfillment of any required advance confirmation.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-serif font-semibold text-[#2A1D15] mb-2">2. Check-In & Government Identification</h2>
            <p>
              In accordance with government regulations in India, all adult guests must present valid government-issued photographic identification (e.g. Aadhaar Card, Passport, Voter ID, or Driving License) upon check-in. PAN cards are not accepted as identity proof.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-serif font-semibold text-[#2A1D15] mb-2">3. Amenity Usage & Courtyard Conduct</h2>
            <p>
              Use of confirmed amenities—including vehicular parking, wireless internet, and food service—is governed by hotel house rules to ensure the tranquility and safety of all resident guests.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-serif font-semibold text-[#2A1D15] mb-2">4. Cancellations & Tariff Revisions</h2>
            <p>
              Tariffs, seasonal adjustments, and cancellation timelines are administered directly by the hotel reception. For inquiries regarding specific dates, please call {siteConfig.phone}.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

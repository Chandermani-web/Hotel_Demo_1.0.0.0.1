import React from 'react';
import { siteConfig } from '../config/siteConfig';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SeoHead } from '../components/SeoHead';
import { DiamondDivider } from '../components/Ornament';

interface PrivacyPolicyPageProps {
  navigate: (path: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ navigate }) => {
  return (
    <>
      <SeoHead
        title="Privacy Policy – Hotel Carlton | Civil Lines, Bareilly"
        description="Privacy policy and data handling practices for Hotel Carlton in Civil Lines, Bareilly. Standard template pending hotel legal review."
        canonicalPath="/privacy"
        breadcrumbs={[{ name: "Privacy Policy", item: "/privacy" }]}
      />

      <Breadcrumbs items={[{ label: "Privacy Policy", path: "/privacy" }]} navigate={navigate} />

      <section className="py-14 sm:py-20 max-w-4xl mx-auto px-6 font-sans">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#8C6F38] mb-2 font-semibold">
            Legal & Compliance
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#2A1D15]">
            Privacy Policy
          </h1>
          <DiamondDivider className="my-4" />
          <div className="p-3 bg-[#FAF6EE] border border-[#D9C9A8] text-xs text-[#8C6F38] rounded-[2px] max-w-lg mx-auto">
            * <em>Notice: This standard privacy template is subject to review and final endorsement by Hotel Carlton's legal advisor.</em>
          </div>
        </div>

        <div className="bg-[#FFFDF8] border border-[#D9C9A8] p-8 md:p-12 rounded-[3px] shadow-2xs space-y-8 text-sm text-[#2B2B2B]/85 leading-relaxed">
          <div>
            <h2 className="text-xl font-serif font-semibold text-[#2A1D15] mb-2">1. Overview</h2>
            <p>
              Hotel Carlton ("the Hotel", "we", "us") values the privacy of our visitors and guests. This policy explains how we collect and use information when you visit our website or submit a reservation enquiry for our property at 164/A, Malgodam Rd, Civil Lines, Bareilly, Uttar Pradesh.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-serif font-semibold text-[#2A1D15] mb-2">2. Information We Collect</h2>
            <p>
              When submitting an enquiry through our website, you may provide your full name, telephone number, email address, intended stay dates, and room preferences. This information is utilized solely to review room availability and communicate directly with you regarding your stay.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-serif font-semibold text-[#2A1D15] mb-2">3. Data Sharing & Third Parties</h2>
            <p>
              Hotel Carlton does not sell, trade, or transfer your contact details to external marketers. Information is maintained internally for hotel guest liaison and regulatory reporting as mandated by applicable laws in Uttar Pradesh, India.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-serif font-semibold text-[#2A1D15] mb-2">4. Contacting the Hotel</h2>
            <p>
              If you have questions regarding personal information or wish to update your records, please contact our reception at {siteConfig.phone} or visit our front desk in Civil Lines, Bareilly.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

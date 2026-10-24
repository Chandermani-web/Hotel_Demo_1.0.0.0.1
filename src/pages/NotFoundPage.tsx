import React from 'react';
import { siteConfig } from '../config/siteConfig';
import { SeoHead } from '../components/SeoHead';
import { DiamondDivider } from '../components/Ornament';
import { Phone, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  navigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ navigate }) => {
  return (
    <>
      <SeoHead
        title="Page Not Found (404) – Hotel Carlton | Civil Lines, Bareilly"
        description="The requested page could not be located on the official Hotel Carlton website."
        canonicalPath="/404"
      />

      <section className="py-24 sm:py-32 max-w-3xl mx-auto px-6 text-center font-sans">
        <p className="text-xs uppercase tracking-[0.25em] text-[#8C6F38] mb-2 font-semibold font-mono">
          404 Error
        </p>
        <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-[#2A1D15] mb-4">
          Page Not Located
        </h1>
        <DiamondDivider className="my-4" />
        <p className="text-sm text-[#2B2B2B]/80 max-w-md mx-auto leading-relaxed mb-8">
          The page or document you are seeking is unavailable or has moved. Please return to our homepage or contact the front desk for immediate assistance.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#5A1F24] hover:bg-[#6D262C] text-[#FAF6EE] text-xs font-semibold uppercase tracking-widest rounded-[2px] transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 text-[#D9C9A8]" />
            <span>Return to Homepage</span>
          </button>
          
          <a
            href={`tel:${siteConfig.phoneTel}`}
            className="px-6 py-3 bg-[#FFFDF8] border border-[#D9C9A8] hover:bg-[#FAF6EE] text-[#2A1D15] text-xs font-semibold uppercase tracking-widest rounded-[2px] transition-colors inline-flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-[#A8884B]" />
            <span>Call Reception: {siteConfig.phone}</span>
          </a>
        </div>
      </section>
    </>
  );
};

import React, { useState } from 'react';
import { siteConfig } from '../config/siteConfig';
import { faqData } from '../data/faqData';
import { EnquiryForm } from '../components/EnquiryForm';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SeoHead } from '../components/SeoHead';
import { DiamondDivider } from '../components/Ornament';
import { Phone, MessageSquare, MapPin, Mail, ChevronDown, ChevronUp } from 'lucide-react';

interface ContactPageProps {
  navigate: (path: string) => void;
  navigationState?: {
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    roomPreference?: string;
  };
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate, navigationState }) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqData[0]?.id || null);

  const hasWhatsApp = Boolean(siteConfig.whatsappNumber && siteConfig.whatsappNumber.trim() !== "");
  const whatsappUrl = hasWhatsApp
    ? `https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hello Hotel Carlton, I would like to enquire about room availability.")}`
    : null;

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => prev === id ? null : id);
  };

  return (
    <>
      <SeoHead
        title="Contact & Reservations – Hotel Carlton | Civil Lines, Bareilly"
        description="Contact Hotel Carlton in Civil Lines, Bareilly. Phone: 0581 257 4049. Submit room availability enquiries, get directions, and read guest FAQs."
        canonicalPath="/contact"
        breadcrumbs={[{ name: "Contact & Reservations", item: "/contact" }]}
      />

      <Breadcrumbs items={[{ label: "Contact & FAQs", path: "/contact" }]} navigate={navigate} />

      {/* Header Banner */}
      <section className="bg-[#FAF6EE] py-14 sm:py-20 border-b border-[#D9C9A8]/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[#8C6F38] mb-2 font-semibold">
            Direct Communication
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-[#2A1D15] tracking-tight">
            Contact & Reservations
          </h1>
          <DiamondDivider className="my-4" />
          <p className="text-sm sm:text-base text-[#2B2B2B]/80 max-w-2xl mx-auto leading-relaxed">
            Reach our reception desk directly for room availability, tariff inquiries, and special arrival arrangements in Civil Lines, Bareilly.
          </p>
        </div>
      </section>

      {/* Main Grid: Direct Contact Channels & Enquiry Form */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Telephone & Address Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FFFDF8] border border-[#D9C9A8] p-6 sm:p-8 rounded-[3px] shadow-xs">
              <h2 className="text-xl font-serif font-semibold text-[#2A1D15] mb-2">
                Hotel Reception Desk
              </h2>
              <p className="text-xs text-[#2B2B2B]/70 leading-relaxed mb-6">
                Our front desk is your primary direct contact for immediate confirmation and questions.
              </p>

              <div className="space-y-4 text-sm text-[#2B2B2B]/85">
                {/* Telephone */}
                <div className="p-4 bg-[#FAF6EE] border border-[#D9C9A8]/60 rounded-[2px]">
                  <span className="block text-xs uppercase tracking-wider text-[#8C6F38] font-semibold mb-1">
                    Front Desk Telephone
                  </span>
                  <a
                    href={`tel:${siteConfig.phoneTel}`}
                    className="text-xl font-mono font-semibold text-[#2A1D15] hover:text-[#5A1F24] flex items-center gap-2"
                  >
                    <Phone className="w-5 h-5 text-[#A8884B]" aria-hidden="true" />
                    <span>{siteConfig.phone}</span>
                  </a>
                  <p className="text-[11px] text-[#2B2B2B]/60 mt-1">
                    Direct line to hotel reception
                  </p>
                </div>

                {/* WhatsApp if configured */}
                {hasWhatsApp && whatsappUrl && (
                  <div className="p-4 bg-[#FAF6EE] border border-[#D9C9A8]/60 rounded-[2px]">
                    <span className="block text-xs uppercase tracking-wider text-[#8C6F38] font-semibold mb-1">
                      WhatsApp Messaging
                    </span>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-[#2A1D15] hover:text-[#5A1F24] flex items-center gap-2"
                    >
                      <MessageSquare className="w-5 h-5 text-[#A8884B]" aria-hidden="true" />
                      <span>Message Hotel via WhatsApp</span>
                    </a>
                  </div>
                )}

                {/* Email if configured */}
                {siteConfig.email && (
                  <div className="p-4 bg-[#FAF6EE] border border-[#D9C9A8]/60 rounded-[2px]">
                    <span className="block text-xs uppercase tracking-wider text-[#8C6F38] font-semibold mb-1">
                      Email Address
                    </span>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-sm font-semibold text-[#2A1D15] hover:text-[#5A1F24] flex items-center gap-2"
                    >
                      <Mail className="w-5 h-5 text-[#A8884B]" aria-hidden="true" />
                      <span>{siteConfig.email}</span>
                    </a>
                  </div>
                )}

                {/* Physical Address */}
                <div className="pt-2">
                  <span className="block text-xs uppercase tracking-wider text-[#8C6F38] font-semibold mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#A8884B]" aria-hidden="true" />
                    <span>Postal Address</span>
                  </span>
                  <p className="text-xs text-[#2B2B2B]/80 leading-relaxed">
                    {siteConfig.address.full}
                  </p>
                </div>
              </div>
            </div>

            {/* Practical stay guidance note */}
            <div className="p-6 bg-[#FAF6EE] border border-[#D9C9A8] rounded-[3px] text-xs text-[#2B2B2B]/75 leading-relaxed">
              <h3 className="font-semibold text-[#2A1D15] uppercase tracking-wider mb-1">
                Direct Reservation Note
              </h3>
              <p>
                Booking or enquiring directly with Hotel Carlton guarantees direct communication without third-party reservation commissions.
              </p>
            </div>
          </div>

          {/* Right Column: Full Enquiry Form */}
          <div className="lg:col-span-7">
            <EnquiryForm
              initialCheckIn={navigationState?.checkIn}
              initialCheckOut={navigationState?.checkOut}
              initialGuests={navigationState?.guests}
              initialRoomPreference={navigationState?.roomPreference}
            />
          </div>

        </div>
      </section>

      {/* Verified FAQs Section */}
      <section className="py-16 md:py-24 bg-[#F1E9DA]/50 border-t border-[#D9C9A8]">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8C6F38] mb-2 font-semibold">
              Frequently Asked Questions
            </p>
            <h2 className="text-3xl font-serif font-semibold text-[#2A1D15]">
              Common Guest Queries
            </h2>
            <DiamondDivider className="my-4" />
            <p className="text-xs sm:text-sm text-[#2B2B2B]/75 leading-relaxed">
              Factual information regarding hotel policies, amenities, and reservation procedures.
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-[#FFFDF8] border border-[#D9C9A8] rounded-[3px] overflow-hidden shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF6EE]/50 transition-colors"
                  >
                    <span className="font-serif font-semibold text-base sm:text-lg text-[#2A1D15]">
                      {faq.question}
                    </span>
                    <span className="text-[#A8884B] shrink-0">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#2B2B2B]/85 leading-relaxed font-sans border-t border-[#D9C9A8]/30">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </>
  );
};

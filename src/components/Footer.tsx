import React from 'react';
import { Phone, MapPin, Mail, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { DiamondDivider } from './Ornament';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(path);
  };

  const hasSocials = siteConfig.socialLinks && Object.values(siteConfig.socialLinks).some(url => Boolean(url && url.trim() !== ""));

  return (
    <footer className="bg-[#5A1F24] text-[#FAF6EE] pt-16 pb-12 border-t border-[#A8884B]/40">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Brand & Heritage Statement */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-[#D9C9A8] mb-2">Civil Lines, Bareilly</p>
          <h2 className="text-3xl md:text-4xl font-serif tracking-[0.16em] uppercase font-semibold text-[#FFFDF8]">
            {siteConfig.name}
          </h2>
          <DiamondDivider inverted className="my-4" />
          <p className="text-[#FAF6EE]/80 text-sm leading-relaxed">
            Quiet hospitality and comfortable accommodation in the heart of Civil Lines, Bareilly. An established 3-star hotel catering to visiting professionals, families, and travelers.
          </p>
        </div>

        {/* 3-Column Structured Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-10 border-t border-[#FAF6EE]/15 text-sm">
          
          {/* Column 1: Verified Contact Details */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#D9C9A8] mb-4">
              Direct Contact
            </h3>
            <ul className="space-y-3 text-[#FAF6EE]/90">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#A8884B] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{siteConfig.address.full}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#A8884B] shrink-0" aria-hidden="true" />
                <a 
                  href={`tel:${siteConfig.phoneTel}`} 
                  className="hover:text-[#D9C9A8] transition-colors font-mono"
                >
                  {siteConfig.phone}
                </a>
              </li>
              {siteConfig.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#A8884B] shrink-0" aria-hidden="true" />
                  <a 
                    href={`mailto:${siteConfig.email}`} 
                    className="hover:text-[#D9C9A8] transition-colors"
                  >
                    {siteConfig.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#D9C9A8] mb-4">
              Explore Hotel
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-xs tracking-wider uppercase text-[#FAF6EE]/85">
              <li>
                <a href="/" onClick={(e) => handleNavClick('/', e)} className="hover:text-[#FFFDF8] hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="/rooms" onClick={(e) => handleNavClick('/rooms', e)} className="hover:text-[#FFFDF8] hover:underline">
                  Rooms
                </a>
              </li>
              <li>
                <a href="/amenities" onClick={(e) => handleNavClick('/amenities', e)} className="hover:text-[#FFFDF8] hover:underline">
                  Amenities
                </a>
              </li>
              <li>
                <a href="/gallery" onClick={(e) => handleNavClick('/gallery', e)} className="hover:text-[#FFFDF8] hover:underline">
                  Gallery
                </a>
              </li>
              <li>
                <a href="/about" onClick={(e) => handleNavClick('/about', e)} className="hover:text-[#FFFDF8] hover:underline">
                  About
                </a>
              </li>
              <li>
                <a href="/location" onClick={(e) => handleNavClick('/location', e)} className="hover:text-[#FFFDF8] hover:underline">
                  Location
                </a>
              </li>
              <li>
                <a href="/contact" onClick={(e) => handleNavClick('/contact', e)} className="hover:text-[#FFFDF8] hover:underline">
                  Contact & FAQs
                </a>
              </li>
              <li>
                <a href="/manage-booking" onClick={(e) => handleNavClick('/manage-booking', e)} className="text-[#D9C9A8] hover:text-[#FFFDF8] hover:underline font-semibold">
                  Manage Booking
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Direct Booking & Guest Guidance */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#D9C9A8] mb-4">
              Direct Reservations
            </h3>
            <p className="text-xs text-[#FAF6EE]/80 leading-relaxed mb-4">
              Check live demo availability, calculate stay tariffs, and simulate your reservation instantly online.
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="/book"
                onClick={(e) => handleNavClick('/book', e)}
                className="inline-flex items-center justify-center gap-1.5 py-2 px-4 bg-[#FAF6EE] text-[#5A1F24] rounded-[2px] text-xs font-semibold uppercase tracking-wider hover:bg-[#FFFDF8] transition-colors cursor-pointer"
              >
                <span>Book Online (Demo)</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>

              {/* Cleanly display Google Business Profile link only if configured */}
              {siteConfig.googleBusinessUrl && (
                <a
                  href={siteConfig.googleBusinessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#D9C9A8] hover:text-[#FFFDF8] underline underline-offset-4 inline-flex items-center gap-1 mt-1"
                >
                  <span>Google Business Profile</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Social Links — rendered only if configured */}
            {hasSocials && (
              <div className="mt-4 pt-3 border-t border-[#FAF6EE]/15 flex items-center gap-3">
                {siteConfig.socialLinks.facebook && (
                  <a href={siteConfig.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-xs text-[#FAF6EE]/70 hover:text-[#FFFDF8]">Facebook</a>
                )}
                {siteConfig.socialLinks.instagram && (
                  <a href={siteConfig.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-xs text-[#FAF6EE]/70 hover:text-[#FFFDF8]">Instagram</a>
                )}
                {siteConfig.socialLinks.twitter && (
                  <a href={siteConfig.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-xs text-[#FAF6EE]/70 hover:text-[#FFFDF8]">Twitter</a>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 mt-6 border-t border-[#FAF6EE]/15 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FAF6EE]/70 gap-4">
          <p>© {currentYear} {siteConfig.name}, Civil Lines, Bareilly. All rights reserved.</p>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <a href="/privacy" onClick={(e) => handleNavClick('/privacy', e)} className="hover:text-[#FFFDF8] underline">
              Privacy Policy
            </a>
            <span aria-hidden="true">·</span>
            <a href="/terms" onClick={(e) => handleNavClick('/terms', e)} className="hover:text-[#FFFDF8] underline">
              Terms & Conditions
            </a>
            <span aria-hidden="true">·</span>
            <a href="/admin-demo" onClick={(e) => handleNavClick('/admin-demo', e)} className="text-[#D9C9A8]/70 hover:text-[#FFFDF8] text-[11px] underline">
              Admin (Demo)
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

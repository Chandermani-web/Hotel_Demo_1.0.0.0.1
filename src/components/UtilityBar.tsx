import React from 'react';
import { Phone, MapPin, Mail } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const UtilityBar: React.FC = () => {
  return (
    <aside aria-label="Hotel quick contact information" className="hidden md:block bg-[#2A1D15] text-[#FAF6EE] text-xs font-normal border-b border-[#A8884B]/20">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a 
            href={`tel:${siteConfig.phoneTel}`}
            className="flex items-center gap-2 text-[#FAF6EE]/90 hover:text-[#D9C9A8] transition-colors"
            title="Call Hotel Carlton reception"
          >
            <Phone className="w-3.5 h-3.5 text-[#A8884B]" aria-hidden="true" />
            <span className="font-mono tracking-wide">{siteConfig.phone}</span>
          </a>

          {/* Cleanly hides if email is not configured in siteConfig */}
          {siteConfig.email && (
            <a 
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-2 text-[#FAF6EE]/90 hover:text-[#D9C9A8] transition-colors"
              title="Email Hotel Carlton"
            >
              <Mail className="w-3.5 h-3.5 text-[#A8884B]" aria-hidden="true" />
              <span>{siteConfig.email}</span>
            </a>
          )}
        </div>

        <div className="flex items-center gap-2 text-[#FAF6EE]/80">
          <MapPin className="w-3.5 h-3.5 text-[#A8884B]" aria-hidden="true" />
          <span>{siteConfig.address.street}, {siteConfig.address.locality}, {siteConfig.address.city}</span>
        </div>
      </div>
    </aside>
  );
};

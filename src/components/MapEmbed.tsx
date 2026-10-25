import React from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import mapImage from '../assets/images/map.png';

export const MapEmbed: React.FC = () => {
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${siteConfig.name}, ${siteConfig.address.full}`
  )}`;

  return (
    <div className="bg-[#FFFDF8] border border-[#D9C9A8] rounded-[3px] overflow-hidden shadow-xs">
      {siteConfig.mapEmbedUrl && siteConfig.mapEmbedUrl.trim() !== '' ? (
        <div className="w-full h-80 sm:h-96">
          <iframe
            src={siteConfig.mapEmbedUrl}
            title={`Interactive map location for ${siteConfig.name}`}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : (
        /* Truthful, tasteful fallback card when mapEmbedUrl is not configured */
        <div className="relative isolate overflow-hidden p-8 md:p-12 text-center border-b border-[#D9C9A8]/60 flex flex-col items-center justify-center min-h-[260px]">
          <img
            src={mapImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 h-full w-full scale-110 object-cover blur-sm"
          />
          <div className="absolute inset-0 -z-10 bg-[#FAF6EE]/85" aria-hidden="true" />
          <div className="relative z-0 w-12 h-12 rounded-full bg-[#A8884B]/15 flex items-center justify-center text-[#8C6F38] mb-4">
            <MapPin className="w-6 h-6" aria-hidden="true" />
          </div>
          <h3 className="relative z-0 text-xl font-serif font-semibold text-[#2A1D15] mb-2">
            Hotel Carlton Location
          </h3>
          <p className="relative z-0 text-sm text-[#2B2B2B]/80 max-w-md mx-auto leading-relaxed mb-6">
            {siteConfig.address.full}
          </p>
          <div className="relative z-0 flex flex-wrap items-center justify-center gap-3">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#2A1D15] hover:bg-[#5A1F24] text-[#FAF6EE] text-xs font-semibold uppercase tracking-widest rounded-[2px] transition-colors flex items-center gap-2"
            >
              <Navigation className="w-3.5 h-3.5 text-[#D9C9A8]" aria-hidden="true" />
              <span>Get Directions</span>
            </a>
            {siteConfig.googleBusinessUrl && (
              <a
                href={siteConfig.googleBusinessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-transparent border border-[#A8884B] hover:bg-[#FAF6EE] text-[#2A1D15] text-xs font-semibold uppercase tracking-widest rounded-[2px] transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#A8884B]" aria-hidden="true" />
                <span>View Google Profile</span>
              </a>
            )}
          </div>
          <p className="relative z-0 text-[11px] text-[#2B2B2B]/50 mt-4">
            * Interactive map embed URL can be configured directly in site configuration.
          </p>
        </div>
      )}

      {/* Verified address bar underneath */}
      <div className="p-4 sm:p-5 bg-[#FFFDF8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#2B2B2B]/80 border-t border-[#D9C9A8]/40">
        <div className="flex items-center gap-2 font-medium text-[#2A1D15]">
          <MapPin className="w-4 h-4 text-[#A8884B] shrink-0" aria-hidden="true" />
          <span>{siteConfig.address.street}, {siteConfig.address.locality}, {siteConfig.address.city} - {siteConfig.address.postalCode}</span>
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#8C6F38] hover:text-[#5A1F24] font-semibold uppercase tracking-wider inline-flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Open in Google Maps</span>
          <Navigation className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

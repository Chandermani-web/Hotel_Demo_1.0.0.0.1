import React, { useState } from 'react';
import { galleryData, galleryCategories, GalleryItem } from '../data/galleryData';
import { Lightbox } from '../components/Lightbox';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { BookingCTABand } from '../components/BookingCTABand';
import { SeoHead } from '../components/SeoHead';
import { DiamondDivider } from '../components/Ornament';
import { ZoomIn } from 'lucide-react';

interface GalleryPageProps {
  navigate: (path: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ navigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = selectedCategory === 'all'
    ? galleryData
    : galleryData.filter(item => item.category === selectedCategory);

  const openLightbox = (item: GalleryItem) => {
    const index = filteredItems.findIndex(i => i.id === item.id);
    if (index !== -1) {
      setLightboxIndex(index);
    }
  };

  return (
    <>
      <SeoHead
        title="Photo Gallery – Hotel Carlton | Civil Lines, Bareilly"
        description="View photographs of Hotel Carlton in Civil Lines, Bareilly. Explore our heritage facade, guest rooms, swimming pool, and property grounds."
        canonicalPath="/gallery"
        breadcrumbs={[{ name: "Gallery", item: "/gallery" }]}
      />

      <Breadcrumbs items={[{ label: "Gallery", path: "/gallery" }]} navigate={navigate} />

      {/* Header Banner */}
      <section className="bg-[#FAF6EE] py-14 sm:py-20 border-b border-[#D9C9A8]/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[#8C6F38] mb-2 font-semibold">
            Visual Portfolio
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-[#2A1D15] tracking-tight">
            Hotel Gallery
          </h1>
          <DiamondDivider className="my-4" />
          <p className="text-sm sm:text-base text-[#2B2B2B]/80 max-w-2xl mx-auto leading-relaxed">
            Photographic impressions of Hotel Carlton, our heritage architecture, guest quarters, and swimming pool in Civil Lines.
          </p>

          {/* Interactive Filter Controls (Segmented Tabs with functional click handlers) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="Gallery category filters">
            {galleryCategories.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer border ${
                    isActive 
                      ? 'bg-[#5A1F24] text-[#FAF6EE] border-[#5A1F24] shadow-xs' 
                      : 'bg-[#FFFDF8] text-[#2B2B2B]/75 border-[#D9C9A8] hover:text-[#2A1D15] hover:border-[#A8884B]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Editorial Gallery Grid */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => openLightbox(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openLightbox(item);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View photo: ${item.title}`}
              className="group bg-[#FFFDF8] border border-[#D9C9A8] rounded-[3px] overflow-hidden shadow-2xs hover:border-[#A8884B] transition-all cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#A8884B]"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-[#FAF6EE]">
                <img
                  src={item.src}
                  alt={item.alt}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                
                {/* Overlay hover cue */}
                <div className="absolute inset-0 bg-[#2A1D15]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-2.5 bg-[#FAF6EE] text-[#2A1D15] rounded-full shadow-md">
                    <ZoomIn className="w-5 h-5 text-[#5A1F24]" aria-hidden="true" />
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#FFFDF8] border-t border-[#D9C9A8]/50">
                <h3 className="text-sm font-serif font-semibold text-[#2A1D15] mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[#2B2B2B]/70 line-clamp-2 leading-relaxed">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-20 text-center text-[#2B2B2B]/60 text-sm">
            No photographs available in this category.
          </div>
        )}
      </section>

      {/* Accessible Lightbox Modal */}
      {lightboxIndex !== null && (
        <Lightbox
          items={filteredItems}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        />
      )}

      <BookingCTABand navigate={navigate} />
    </>
  );
};

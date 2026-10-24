import React, { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '../data/galleryData';

interface LightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  items,
  currentIndex,
  onClose,
  onNavigate
}) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const currentItem = items[currentIndex];

  useEffect(() => {
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onNavigate((currentIndex - 1 + items.length) % items.length);
      } else if (e.key === 'ArrowRight') {
        onNavigate((currentIndex + 1) % items.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, items.length, onClose, onNavigate]);

  if (!currentItem) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery preview"
      className="fixed inset-0 z-50 bg-[#2A1D15]/95 flex flex-col justify-between p-4 md:p-8"
      onClick={onClose}
    >
      {/* Top Bar with counter and close button */}
      <div 
        className="flex items-center justify-between text-[#FAF6EE] max-w-6xl mx-auto w-full z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-xs uppercase tracking-widest text-[#D9C9A8] font-mono">
          {currentIndex + 1} / {items.length} · {currentItem.title}
        </div>
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close image lightbox"
          className="p-2 text-[#FAF6EE] hover:text-[#D9C9A8] rounded-[2px] border border-[#FAF6EE]/20 hover:border-[#D9C9A8] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#A8884B]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div 
        className="relative flex items-center justify-center flex-1 my-4 max-w-5xl mx-auto w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous button */}
        <button
          type="button"
          onClick={() => onNavigate((currentIndex - 1 + items.length) % items.length)}
          aria-label="Previous image"
          className="absolute left-2 sm:left-4 z-20 p-2 text-[#FAF6EE] bg-[#2A1D15]/60 hover:bg-[#2A1D15] border border-[#FAF6EE]/20 hover:border-[#A8884B] rounded-[2px] transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Display Image */}
        <div className="max-h-[75vh] flex items-center justify-center p-2">
          <img
            src={currentItem.src}
            alt={currentItem.alt}
            referrerPolicy="no-referrer"
            className="max-h-[72vh] max-w-full object-contain rounded-[2px] shadow-2xl border border-[#FAF6EE]/15"
          />
        </div>

        {/* Next button */}
        <button
          type="button"
          onClick={() => onNavigate((currentIndex + 1) % items.length)}
          aria-label="Next image"
          className="absolute right-2 sm:right-4 z-20 p-2 text-[#FAF6EE] bg-[#2A1D15]/60 hover:bg-[#2A1D15] border border-[#FAF6EE]/20 hover:border-[#A8884B] rounded-[2px] transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Caption at bottom */}
      <div 
        className="text-center max-w-2xl mx-auto text-xs text-[#FAF6EE]/80 bg-[#2A1D15]/80 px-4 py-2 border-t border-[#FAF6EE]/15 rounded-[2px]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-serif italic text-sm text-[#FFFDF8] mb-0.5">{currentItem.title}</p>
        <p className="font-sans leading-relaxed">{currentItem.caption}</p>
      </div>
    </div>
  );
};

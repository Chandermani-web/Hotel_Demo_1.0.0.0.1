import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, Phone, CalendarCheck, ShieldCheck, ChevronRight } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentPath, 
  navigate,
  mobileMenuOpen: externalMobileMenuOpen,
  setMobileMenuOpen: externalSetMobileMenuOpen
}) => {
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  const isMenuOpen = externalMobileMenuOpen !== undefined ? externalMobileMenuOpen : internalMenuOpen;
  const setMenuOpen = externalSetMobileMenuOpen || setInternalMenuOpen;

  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Rooms', path: '/rooms' },
    { label: 'Amenities', path: '/amenities' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'About', path: '/about' },
    { label: 'Location', path: '/location' },
    { label: 'Contact', path: '/contact' }
  ];

  // Close mobile menu on Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, setMenuOpen]);

  // Trap focus & lock body scroll when mobile menu is opened
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleNavClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6EE] border-b border-[#D9C9A8]/60 shadow-2xs">
      {/* Top Primary Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Wordmark */}
        <a 
          href="/" 
          onClick={(e) => handleNavClick('/', e)}
          className="text-xl sm:text-2xl lg:text-3xl font-serif tracking-[0.14em] sm:tracking-[0.18em] text-[#2A1D15] uppercase font-semibold whitespace-nowrap shrink-0 hover:text-[#8C6F38] transition-colors"
        >
          Hotel Carlton
        </a>

        {/* Zone 2: Desktop Navigation Links (Visible on Large Screens >= 1024px) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#2B2B2B]/90 tracking-wider uppercase">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleNavClick(link.path, e)}
                className={`py-1 relative whitespace-nowrap shrink-0 transition-colors hover:text-[#2A1D15] ${
                  isActive ? 'text-[#2A1D15] font-semibold' : 'text-[#2B2B2B]/75'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#A8884B]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Mobile/Tablet Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Direct CTA (Desktop and Tablets) */}
          <a
            href="/book"
            onClick={(e) => handleNavClick('/book', e)}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-semibold uppercase tracking-widest text-[#FAF6EE] bg-[#2A1D15] border border-[#2A1D15] rounded-[3px] hover:bg-[#5A1F24] hover:border-[#5A1F24] transition-colors whitespace-nowrap shadow-xs cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-[#D9C9A8]" />
            <span>Book Your Stay</span>
          </a>

          {/* Explicit Mobile & Tablet Menu Trigger (Visible on all screens < 1024px) */}
          <button
            type="button"
            onClick={() => setMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-[#A8884B]/60 bg-[#FFFDF8] text-[#2A1D15] rounded-[3px] text-xs font-semibold tracking-wider uppercase hover:bg-[#F1E9DA] hover:border-[#2A1D15] transition-all cursor-pointer shadow-2xs"
          >
            <Menu className="w-4 h-4 text-[#A8884B]" />
            <span>Menu</span>
          </button>

        </div>

      </div>

      {/* Zone 4: Tablet Navigation Bar (Directly visible on iPad/Tablet screens 768px - 1023px) */}
      <nav 
        aria-label="Tablet navigation" 
        className="hidden md:flex lg:hidden items-center justify-center gap-6 py-2.5 px-6 border-t border-[#D9C9A8]/50 bg-[#F7F2E7]/90 text-xs font-semibold text-[#2B2B2B] tracking-widest uppercase overflow-x-auto no-scrollbar"
      >
        {navLinks.map((link) => {
          const isActive = currentPath === link.path;
          return (
            <a
              key={link.path}
              href={link.path}
              onClick={(e) => handleNavClick(link.path, e)}
              className={`py-1 px-1 relative whitespace-nowrap transition-colors hover:text-[#5A1F24] ${
                isActive ? 'text-[#5A1F24] font-bold' : 'text-[#2B2B2B]/80'
              }`}
            >
              {link.label}
              {isActive && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#A8884B]" />
              )}
            </a>
          );
        })}
      </nav>

      {/* Zone 5: Mobile Quick-Nav Strip (Directly visible on phones < 768px for 1-tap navigation) */}
      <nav 
        aria-label="Mobile quick navigation" 
        className="md:hidden flex items-center gap-4 overflow-x-auto no-scrollbar py-2 px-4 border-t border-[#D9C9A8]/50 bg-[#F7F2E7]/90 text-[11px] font-semibold text-[#2B2B2B] tracking-wider uppercase whitespace-nowrap"
      >
        {navLinks.map((link) => {
          const isActive = currentPath === link.path;
          return (
            <a
              key={link.path}
              href={link.path}
              onClick={(e) => handleNavClick(link.path, e)}
              className={`py-0.5 px-1 relative shrink-0 transition-colors ${
                isActive 
                  ? 'text-[#5A1F24] font-bold border-b-2 border-[#A8884B]' 
                  : 'text-[#2B2B2B]/75 hover:text-[#2A1D15]'
              }`}
            >
              {link.label}
            </a>
          );
        })}
      </nav>

      {/* Full-Screen Accessible Navigation Drawer (Rendered via React Portal outside header stacking context) */}
      {isMenuOpen && typeof document !== 'undefined' && createPortal(
        <div 
          ref={menuRef}
          role="dialog" 
          aria-modal="true" 
          aria-label="Navigation Menu"
          className="fixed inset-0 z-[9999] bg-[#FAF6EE] flex flex-col justify-between p-6 sm:p-8 overflow-y-auto animate-fade-in min-h-screen min-h-[100dvh]"
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[#D9C9A8]/60 pb-5">
            <div>
              <span className="text-xl sm:text-2xl font-serif tracking-[0.16em] uppercase text-[#2A1D15] font-semibold block">
                Hotel Carlton
              </span>
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#8C6F38] block mt-0.5">
                Civil Lines · Bareilly
              </span>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation menu"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#2A1D15]/30 rounded-[3px] text-[#2A1D15] hover:border-[#2A1D15] hover:text-[#8C6F38] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#A8884B] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
              <span className="text-xs uppercase tracking-wider font-semibold">Close</span>
            </button>
          </div>

          {/* Primary Navigation Links */}
          <nav className="flex flex-col gap-3 my-auto py-6" aria-label="Full mobile menu">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => handleNavClick(link.path, e)}
                  className={`flex items-center justify-between py-2 text-2xl sm:text-3xl font-serif tracking-wider uppercase transition-colors border-b border-[#D9C9A8]/30 ${
                    isActive ? 'text-[#5A1F24] font-semibold' : 'text-[#2A1D15] hover:text-[#8C6F38]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {isActive && <span className="w-2 h-2 rounded-full bg-[#A8884B]" />}
                    {link.label}
                  </span>
                  <ChevronRight className={`w-5 h-5 ${isActive ? 'text-[#5A1F24]' : 'text-[#D9C9A8]'}`} />
                </a>
              );
            })}

            {/* Extra Guest Self-Service Links */}
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="/manage-booking"
                onClick={(e) => handleNavClick('/manage-booking', e)}
                className="text-xs font-semibold uppercase tracking-widest text-[#2B2B2B]/75 hover:text-[#5A1F24] py-1.5 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#A8884B]" />
                Manage Existing Reservation
              </a>
            </div>
          </nav>

          {/* Drawer Actions & Hotel Contact */}
          <div className="pt-5 border-t border-[#D9C9A8]/60 flex flex-col gap-3">
            <a
              href="/book"
              onClick={(e) => handleNavClick('/book', e)}
              className="w-full text-center py-3.5 text-xs font-semibold uppercase tracking-widest text-[#FAF6EE] bg-[#5A1F24] hover:bg-[#6D262C] rounded-[3px] transition-colors cursor-pointer shadow-xs"
            >
              Book Your Stay (Demo Simulation)
            </a>
            <a
              href={`tel:${siteConfig.phoneTel}`}
              className="w-full text-center py-3 text-xs font-semibold uppercase tracking-wider text-[#2A1D15] bg-[#FFFDF8] border border-[#2A1D15]/30 rounded-[3px] hover:bg-[#F1E9DA] transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#A8884B]" />
              Call Reception: {siteConfig.phone}
            </a>
            <p className="text-[11px] text-center text-[#2B2B2B]/60 mt-1 font-serif italic">
              {siteConfig.address.full}
            </p>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};

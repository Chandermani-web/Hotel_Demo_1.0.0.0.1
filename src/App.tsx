/**
 * Hotel Carlton – Official Heritage Website
 * Civil Lines, Bareilly, Uttar Pradesh
 */

import React, { useState, useEffect } from 'react';
import { UtilityBar } from './components/UtilityBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileStickyBar } from './components/MobileStickyBar';

import { HomePage } from './pages/HomePage';
import { RoomsPage } from './pages/RoomsPage';
import { AmenitiesPage } from './pages/AmenitiesPage';
import { GalleryPage } from './pages/GalleryPage';
import { AboutPage } from './pages/AboutPage';
import { LocationPage } from './pages/LocationPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { BookPage } from './pages/booking/BookPage';
import { ManageBookingPage } from './pages/booking/ManageBookingPage';
import { AdminDemoPage } from './pages/admin/AdminDemoPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [navigationState, setNavigationState] = useState<Record<string, any> | undefined>(undefined);

  // Synchronize browser popstate (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Clean client-side navigation handler
  const navigate = (path: string, state?: Record<string, any>) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
    }
    setNavigationState(state);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route selector
  const renderCurrentView = () => {
    // Clean trailing slash if not root
    const normalizedPath = currentPath.length > 1 && currentPath.endsWith('/')
      ? currentPath.slice(0, -1)
      : currentPath;

    if (normalizedPath === '/book' || normalizedPath.startsWith('/book/')) {
      return <BookPage navigate={navigate} navigationState={navigationState} />;
    }

    switch (normalizedPath) {
      case '/':
      case '':
        return <HomePage navigate={navigate} />;
      case '/rooms':
        return <RoomsPage navigate={navigate} />;
      case '/amenities':
        return <AmenitiesPage navigate={navigate} />;
      case '/gallery':
        return <GalleryPage navigate={navigate} />;
      case '/about':
        return <AboutPage navigate={navigate} />;
      case '/location':
        return <LocationPage navigate={navigate} />;
      case '/contact':
      case '/faq':
        return <ContactPage navigate={navigate} navigationState={navigationState} />;
      case '/manage-booking':
        return <ManageBookingPage navigate={navigate} navigationState={navigationState} />;
      case '/admin-demo':
        return <AdminDemoPage navigate={navigate} />;
      case '/privacy':
        return <PrivacyPolicyPage navigate={navigate} />;
      case '/terms':
        return <TermsPage navigate={navigate} />;
      default:
        return <NotFoundPage navigate={navigate} />;
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EE] text-[#2B2B2B] pb-16 md:pb-0">
      
      {/* Accessible skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#2A1D15] text-[#FAF6EE] text-xs font-semibold uppercase tracking-wider rounded-[2px] shadow-lg border border-[#A8884B]"
      >
        Skip to main content
      </a>

      {/* Top Utility Bar (Desktop only, verified contact details) */}
      <UtilityBar />

      {/* Main Brand & Navigation Header with visible Tab and Mobile menu bars */}
      <Header 
        currentPath={currentPath} 
        navigate={navigate} 
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Heritage Footer (Oxblood #5A1F24) */}
      <Footer navigate={navigate} />

      {/* Mobile Sticky Action Bar with instant Menu drawer trigger */}
      <MobileStickyBar 
        navigate={navigate} 
        onOpenMenu={() => setMobileMenuOpen(true)}
      />

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { siteConfig } from '../../config/siteConfig';
import { DEMO_CONFIG } from '../../data/demo/policies';
import { demoRooms } from '../../data/demo/rooms';
import { 
  getStoredBookings, 
  updateBookingStatus, 
  resetDemoStore, 
  getStoredEnquiries, 
  StoredEnquiry 
} from '../../lib/booking/store';
import { StoredBooking, BookingStatus } from '../../data/demo/seedBookings';
import { getTodayIso, formatShortDate, formatIndianDate, addDays, getNightsList } from '../../lib/booking/dates';
import { formatINR } from '../../lib/booking/pricing';
import { getBookedRoomsCountForNight } from '../../lib/booking/availability';

import { DemoRibbon } from '../../components/booking/DemoRibbon';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { SeoHead } from '../../components/SeoHead';
import { DiamondDivider } from '../../components/Ornament';

import { 
  Lock, 
  LogOut, 
  Search, 
  Filter, 
  Download, 
  RotateCcw, 
  Calendar, 
  Users, 
  Check, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  FileText, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface AdminDemoPageProps {
  navigate: (path: string, state?: Record<string, any>) => void;
}

const ADMIN_SESSION_KEY = 'carlton_admin_auth_v1';

export const AdminDemoPage: React.FC<AdminDemoPageProps> = ({ navigate }) => {
  // Authentication state (Session based)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    }
    return false;
  });

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Tab: 'dashboard' | 'calendar' | 'enquiries'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'enquiries'>('dashboard');

  // Bookings list state
  const [bookings, setBookings] = useState<StoredBooking[]>([]);
  const [enquiries, setEnquiries] = useState<StoredEnquiry[]>([]);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all'); // 'all' | 'today' | 'upcoming' | 'past'

  // Selected Booking Drawer
  const [selectedBooking, setSelectedBooking] = useState<StoredBooking | null>(null);
  const [resetNotice, setResetNotice] = useState(false);

  const refreshData = () => {
    setBookings(getStoredBookings());
    setEnquiries(getStoredEnquiries());
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      usernameInput.trim() === DEMO_CONFIG.ADMIN_CREDENTIALS.username &&
      passwordInput.trim() === DEMO_CONFIG.ADMIN_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      }
      setLoginError(null);
    } else {
      setLoginError("Invalid demo credentials. Use the credentials provided on screen.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
  };

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    const updated = updateBookingStatus(bookingId, newStatus);
    if (updated) {
      refreshData();
      setSelectedBooking(updated);
    }
  };

  const handleResetData = () => {
    if (window.confirm("Reset all bookings and enquiries back to the default demonstration seed state?")) {
      resetDemoStore();
      refreshData();
      setSelectedBooking(null);
      setResetNotice(true);
      setTimeout(() => setResetNotice(false), 3000);
    }
  };

  // CSV Export utility
  const handleExportCsv = () => {
    const all = getStoredBookings();
    if (all.length === 0) return;

    const headers = [
      "Booking ID",
      "Created Date",
      "Guest Name",
      "Phone",
      "Email",
      "Room",
      "Rooms Count",
      "Check-In",
      "Check-Out",
      "Nights",
      "Adults",
      "Children",
      "Grand Total (INR)",
      "Payment Status",
      "Booking Status"
    ];

    const rows = all.map(b => [
      b.id,
      b.createdAt,
      `"${b.guest.fullName.replace(/"/g, '""')}"`,
      `"${b.guest.phone}"`,
      `"${b.guest.email}"`,
      `"${b.roomName}"`,
      b.roomsCount,
      b.checkIn,
      b.checkOut,
      b.nights,
      b.adults,
      b.children,
      b.pricing.grandTotal,
      `"${b.paymentStatus}"`,
      b.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hotel_carlton_bookings_${getTodayIso()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter Bookings
  const today = getTodayIso();
  const filteredBookings = bookings.filter(b => {
    // Search
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = b.guest.fullName.toLowerCase().includes(q);
      const matchId = b.id.toLowerCase().includes(q);
      const matchPhone = b.guest.phone.includes(q);
      if (!matchName && !matchId && !matchPhone) return false;
    }

    // Status filter
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;

    // Date filter
    if (dateFilter === 'today') {
      if (b.checkIn !== today && b.checkOut !== today) return false;
    } else if (dateFilter === 'upcoming') {
      if (b.checkIn < today) return false;
    } else if (dateFilter === 'past') {
      if (b.checkOut > today) return false;
    }

    return true;
  });

  // KPI Calculations
  const todayArrivals = bookings.filter(b => b.checkIn === today && b.status === 'Confirmed');
  const todayDepartures = bookings.filter(b => b.checkOut === today && b.status === 'Checked-in');
  const inHouseGuests = bookings.filter(b => b.status === 'Checked-in');

  // Month Calendar Grid Dates (Current month, next 14 days)
  const calendarDays = Array.from({ length: 14 }, (_, i) => addDays(today, i));

  // --------------------------------------------------------------------------
  // LOGIN SCREEN
  // --------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF6EE] py-16 px-4 sm:px-6">
        <SeoHead
          title="Admin Demo Login – Hotel Carlton"
          description="Demonstration administration portal for Hotel Carlton, Civil Lines, Bareilly."
          canonicalPath="/admin-demo"
        />
        <DemoRibbon />

        <div className="max-w-md mx-auto mt-8 bg-[#FFFDF8] border border-[#D9C9A8] p-8 rounded-[3px] shadow-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-[#5A1F24]/10 text-[#5A1F24] flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-[11px] uppercase tracking-widest text-[#8C6F38] font-semibold block mb-1">
              Management Portal (Demo)
            </span>
            <h1 className="text-2xl font-serif font-semibold text-[#2A1D15]">
              Hotel Carlton Admin
            </h1>
            <DiamondDivider className="my-2" />
            <p className="text-xs text-[#2B2B2B]/70 leading-relaxed">
              Showcase portal for hotel front desk operators to manage rooms, check-ins, and enquiries.
            </p>
          </div>

          {/* Hardcoded Demo Credentials Display */}
          <div className="p-3 bg-[#FAF6EE] border border-[#A8884B] rounded-[2px] mb-6 text-xs text-[#2A1D15] space-y-1">
            <div className="flex justify-between font-mono">
              <span className="text-[#2B2B2B]/70">Demo Username:</span>
              <strong>{DEMO_CONFIG.ADMIN_CREDENTIALS.username}</strong>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-[#2B2B2B]/70">Demo Password:</span>
              <strong>{DEMO_CONFIG.ADMIN_CREDENTIALS.password}</strong>
            </div>
            <span className="text-[10px] text-[#8C6F38] block pt-1 border-t border-[#D9C9A8]/50">
              * Demonstration only: click login below with prefilled credentials.
            </span>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-[2px]">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-user" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1">
                Username
              </label>
              <input
                id="admin-user"
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="admin"
                className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] p-2 text-sm text-[#2A1D15]"
                required
              />
            </div>

            <div>
              <label htmlFor="admin-pass" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1">
                Password
              </label>
              <input
                id="admin-pass"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="carlton123"
                className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] p-2 text-sm text-[#2A1D15]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#5A1F24] hover:bg-[#6D262C] text-[#FAF6EE] text-xs font-semibold uppercase tracking-widest rounded-[2px] transition-colors cursor-pointer"
            >
              Log In to Admin Demo
            </button>
          </form>

          {/* Quick 1-click test button */}
          <div className="mt-4 pt-3 border-t border-[#D9C9A8]/40 text-center">
            <button
              type="button"
              onClick={() => {
                setUsernameInput(DEMO_CONFIG.ADMIN_CREDENTIALS.username);
                setPasswordInput(DEMO_CONFIG.ADMIN_CREDENTIALS.password);
              }}
              className="text-xs text-[#8C6F38] hover:text-[#5A1F24] underline"
            >
              Fill Demo Credentials Automatically
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // AUTHENTICATED DASHBOARD
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FAF6EE] pb-24">
      <SeoHead
        title="Admin Demonstration – Hotel Carlton | Civil Lines, Bareilly"
        description="Demo management console for Hotel Carlton."
        canonicalPath="/admin-demo"
      />
      <DemoRibbon />

      {/* Admin Subheader Bar */}
      <header className="bg-[#2A1D15] text-[#FAF6EE] border-b border-[#A8884B]/30 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg tracking-wider font-semibold text-[#FAF6EE]">
              Hotel Carlton Reception Desk
            </span>
            <span className="bg-[#5A1F24] text-[10px] font-mono px-2 py-0.5 rounded-[2px] uppercase tracking-wider text-[#D9C9A8]">
              Live Demo
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/book')}
              className="px-3 py-1.5 bg-[#FFFDF8] hover:bg-[#FAF6EE] text-[#2A1D15] text-xs font-semibold uppercase tracking-wider rounded-[2px] flex items-center gap-1.5"
            >
              <span>Add Manual Booking</span>
              <ArrowRight className="w-3 h-3 text-[#5A1F24]" />
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="px-3 py-1.5 bg-[#FAF6EE]/10 hover:bg-[#FAF6EE]/20 border border-[#FAF6EE]/30 text-xs font-medium uppercase tracking-wider text-[#FAF6EE] rounded-[2px] flex items-center gap-1.5"
            >
              <Download className="w-3 h-3" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={handleResetData}
              className="px-3 py-1.5 bg-[#FAF6EE]/10 hover:bg-[#FAF6EE]/20 border border-[#FAF6EE]/30 text-xs font-medium uppercase tracking-wider text-[#FAF6EE] rounded-[2px] flex items-center gap-1.5"
              title="Reset demonstration data"
            >
              <RotateCcw className="w-3 h-3 text-[#D9C9A8]" />
              <span>Reset Demo</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 text-[#FAF6EE]/70 hover:text-white"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {resetNotice && (
        <div className="bg-emerald-800 text-white text-xs py-2 text-center">
          Demonstration data reset to initial seed state.
        </div>
      )}

      {/* Main Admin Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#D9C9A8] mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
              activeTab === 'dashboard'
                ? 'border-[#5A1F24] text-[#5A1F24]'
                : 'border-transparent text-[#2B2B2B]/60 hover:text-[#2A1D15]'
            }`}
          >
            Bookings Dashboard ({bookings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
              activeTab === 'calendar'
                ? 'border-[#5A1F24] text-[#5A1F24]'
                : 'border-transparent text-[#2B2B2B]/60 hover:text-[#2A1D15]'
            }`}
          >
            14-Day Room Availability Grid
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('enquiries')}
            className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
              activeTab === 'enquiries'
                ? 'border-[#5A1F24] text-[#5A1F24]'
                : 'border-transparent text-[#2B2B2B]/60 hover:text-[#2A1D15]'
            }`}
          >
            Website Enquiries ({enquiries.length})
          </button>
        </div>

        {/* ===================================================================== */}
        {/* TAB 1: DASHBOARD                                                      */}
        {/* ===================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#FFFDF8] border border-[#D9C9A8] p-4 rounded-[2px] shadow-2xs">
                <span className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/60 font-semibold block">Today's Arrivals</span>
                <span className="text-2xl font-serif font-bold text-[#2A1D15]">{todayArrivals.length}</span>
                <span className="text-[11px] text-[#2B2B2B]/60 block mt-0.5">Scheduled for check-in</span>
              </div>

              <div className="bg-[#FFFDF8] border border-[#D9C9A8] p-4 rounded-[2px] shadow-2xs">
                <span className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/60 font-semibold block">Today's Departures</span>
                <span className="text-2xl font-serif font-bold text-[#2A1D15]">{todayDepartures.length}</span>
                <span className="text-[11px] text-[#2B2B2B]/60 block mt-0.5">Scheduled for 11:00 AM check-out</span>
              </div>

              <div className="bg-[#FFFDF8] border border-[#D9C9A8] p-4 rounded-[2px] shadow-2xs">
                <span className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/60 font-semibold block">Current In-House</span>
                <span className="text-2xl font-serif font-bold text-emerald-800">{inHouseGuests.length}</span>
                <span className="text-[11px] text-[#2B2B2B]/60 block mt-0.5">Active checked-in parties</span>
              </div>

              <div className="bg-[#FFFDF8] border border-[#D9C9A8] p-4 rounded-[2px] shadow-2xs">
                <span className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/60 font-semibold block">Total Active Bookings</span>
                <span className="text-2xl font-serif font-bold text-[#5A1F24]">{bookings.filter(b => b.status === 'Confirmed').length}</span>
                <span className="text-[11px] text-[#2B2B2B]/60 block mt-0.5">Upcoming confirmed stays</span>
              </div>
            </div>

            {/* Inventory Distribution */}
            <div className="bg-[#FFFDF8] border border-[#D9C9A8] p-4 rounded-[2px] text-xs">
              <span className="font-semibold text-[#2A1D15] uppercase tracking-wider block mb-2">
                Room Physical Capacity & Inventory
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {demoRooms.map(r => (
                  <div key={r.id} className="p-2.5 bg-[#FAF6EE] rounded-[2px] border border-[#D9C9A8]/40 flex justify-between">
                    <div>
                      <strong className="block text-[#2A1D15]">{r.name}</strong>
                      <span className="text-[#2B2B2B]/60">Base rate: {formatINR(r.baseRate)}</span>
                    </div>
                    <span className="font-mono font-semibold text-[#2A1D15]">{r.inventoryCount} Units</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bookings Table Filters & Search */}
            <div className="bg-[#FFFDF8] border border-[#D9C9A8] p-4 rounded-[2px] flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="w-full sm:w-72 relative">
                <Search className="w-4 h-4 text-[#8C6F38] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search guest, ID, phone..."
                  className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] pl-9 pr-3 py-1.5 text-xs text-[#2A1D15]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] px-2.5 py-1.5 text-xs text-[#2A1D15]"
                >
                  <option value="all">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Checked-in">Checked-in</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] px-2.5 py-1.5 text-xs text-[#2A1D15]"
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today's Activity</option>
                  <option value="upcoming">Future Stays</option>
                  <option value="past">Past Stays</option>
                </select>
              </div>
            </div>

            {/* Main Bookings Table */}
            <div className="bg-[#FFFDF8] border border-[#D9C9A8] rounded-[2px] overflow-x-auto shadow-2xs">
              <table className="w-full text-left text-xs text-[#2B2B2B]">
                <thead className="bg-[#FAF6EE] text-[#2A1D15] uppercase tracking-wider font-semibold border-b border-[#D9C9A8]">
                  <tr>
                    <th className="p-3">ID & Date</th>
                    <th className="p-3">Guest Details</th>
                    <th className="p-3">Room Type</th>
                    <th className="p-3">Check-In / Out</th>
                    <th className="p-3">Bill</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9C9A8]/40">
                  {filteredBookings.map(b => (
                    <tr 
                      key={b.id} 
                      onClick={() => setSelectedBooking(b)}
                      className="hover:bg-[#FAF6EE]/60 transition-colors cursor-pointer"
                    >
                      <td className="p-3 font-mono">
                        <span className="font-semibold text-[#5A1F24] block">{b.id}</span>
                        <span className="text-[10px] text-[#2B2B2B]/60">{formatShortDate(b.createdAt)}</span>
                      </td>

                      <td className="p-3">
                        <strong className="text-[#2A1D15] block">{b.guest.fullName}</strong>
                        <span className="text-[11px] text-[#2B2B2B]/70">{b.guest.phone}</span>
                      </td>

                      <td className="p-3">
                        <span className="font-medium text-[#2A1D15] block">{b.roomName}</span>
                        <span className="text-[10px] text-[#2B2B2B]/60">{b.roomsCount} room(s) · {b.nights} night(s)</span>
                      </td>

                      <td className="p-3 font-mono text-[11px]">
                        <span>{formatShortDate(b.checkIn)}</span>
                        <span className="text-[#2B2B2B]/50 block">to {formatShortDate(b.checkOut)}</span>
                      </td>

                      <td className="p-3">
                        <span className="font-mono font-semibold text-[#2A1D15] block">
                          {formatINR(b.pricing.grandTotal)}
                        </span>
                        <span className="text-[10px] text-[#2B2B2B]/60">{b.paymentMethod === 'demo_online' ? 'Online Demo' : 'Pay at Hotel'}</span>
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-[2px] text-[10px] font-semibold uppercase tracking-wider ${
                          b.status === 'Confirmed'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : b.status === 'Checked-in'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : b.status === 'Completed'
                            ? 'bg-neutral-100 text-neutral-800 border border-neutral-300'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                          {b.status}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(b);
                          }}
                          className="px-2.5 py-1 border border-[#D9C9A8] hover:bg-[#FAF6EE] text-[11px] text-[#2A1D15] rounded-[2px]"
                        >
                          View / Edit
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredBookings.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-xs text-[#2B2B2B]/60">
                        No reservations matching criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: 14-DAY CALENDAR GRID                                           */}
        {/* ===================================================================== */}
        {activeTab === 'calendar' && (
          <div className="bg-[#FFFDF8] border border-[#D9C9A8] p-6 rounded-[2px] shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-serif font-semibold text-[#2A1D15]">
                14-Day Room Occupancy & Inventory Grid
              </h2>
              <p className="text-xs text-[#2B2B2B]/70">
                Visual matrix of daily booked rooms vs available physical units across room categories.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border border-[#D9C9A8]">
                <thead>
                  <tr className="bg-[#FAF6EE] text-[#2A1D15] border-b border-[#D9C9A8]">
                    <th className="p-3 text-left border-r border-[#D9C9A8]">Room Type</th>
                    {calendarDays.map(day => (
                      <th key={day} className="p-2 border-r border-[#D9C9A8] min-w-[70px]">
                        <span className="block text-[10px] text-[#2B2B2B]/60">{formatShortDate(day).split(' ')[0]}</span>
                        <span className="font-semibold text-xs">{formatShortDate(day).split(' ').slice(1).join(' ')}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9C9A8]">
                  {demoRooms.map(room => (
                    <tr key={room.id} className="hover:bg-[#FAF6EE]/50">
                      <td className="p-3 text-left font-semibold text-[#2A1D15] border-r border-[#D9C9A8] bg-[#FAF6EE]/30">
                        <div>{room.name}</div>
                        <span className="text-[10px] text-[#2B2B2B]/50 font-normal">Cap: {room.inventoryCount}</span>
                      </td>

                      {calendarDays.map(day => {
                        const booked = getBookedRoomsCountForNight(room.id, day, bookings);
                        const remaining = Math.max(0, room.inventoryCount - booked);
                        const isSoldOut = remaining === 0;

                        return (
                          <td 
                            key={day} 
                            className={`p-2 border-r border-[#D9C9A8] font-mono text-[11px] ${
                              isSoldOut 
                                ? 'bg-red-50 text-red-900 font-bold' 
                                : remaining <= 2 
                                ? 'bg-amber-50 text-amber-900' 
                                : 'text-[#2A1D15]'
                            }`}
                          >
                            <span className="block">{remaining} Avail</span>
                            <span className="text-[9px] text-[#2B2B2B]/50">({booked} bkd)</span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#2B2B2B]/75 pt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-red-100 border border-red-300 inline-block" />
                <span>Sold out (0 available)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-amber-100 border border-amber-300 inline-block" />
                <span>Low inventory (1–2 left)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-white border border-[#D9C9A8] inline-block" />
                <span>Normal availability</span>
              </span>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: WEBSITE ENQUIRIES                                              */}
        {/* ===================================================================== */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div className="bg-[#FFFDF8] border border-[#D9C9A8] p-6 rounded-[2px] shadow-xs">
              <h2 className="text-lg font-serif font-semibold text-[#2A1D15] mb-1">
                Website Contact Enquiries
              </h2>
              <p className="text-xs text-[#2B2B2B]/70 mb-4">
                Submissions from the Contact form are stored here. Use "Convert to Booking" to prefill the reservation flow.
              </p>

              {enquiries.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#2B2B2B]/60 bg-[#FAF6EE] rounded-[2px]">
                  No website enquiries received yet. Submit an enquiry through the Contact page to test integration.
                </div>
              ) : (
                <div className="divide-y divide-[#D9C9A8]/50">
                  {enquiries.map((enq) => (
                    <div key={enq.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <strong className="text-sm text-[#2A1D15]">{enq.fullName}</strong>
                          <span className="font-mono text-[10px] text-[#8C6F38] bg-[#FAF6EE] px-1.5 py-0.5 border border-[#D9C9A8]/40">
                            {enq.id}
                          </span>
                        </div>
                        <p className="text-[#2B2B2B]/80">Phone: {enq.phone} · Email: {enq.email || 'Not specified'}</p>
                        <p className="text-[#2B2B2B]/70">
                          Dates: {enq.checkIn || 'TBD'} to {enq.checkOut || 'TBD'} · Room: {enq.roomPreference} · Guests: {enq.guests}
                        </p>
                        {enq.specialRequests && (
                          <p className="italic text-[#2B2B2B]/60">"{enq.specialRequests}"</p>
                        )}
                        <span className="text-[10px] text-[#2B2B2B]/50 block">Received: {formatShortDate(enq.submittedAt)}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          navigate('/book', {
                            checkIn: enq.checkIn,
                            checkOut: enq.checkOut,
                            guests: enq.guests,
                            roomPreference: enq.roomPreference
                          });
                        }}
                        className="px-4 py-2 bg-[#5A1F24] hover:bg-[#6D262C] text-[#FAF6EE] text-xs font-semibold uppercase tracking-wider rounded-[2px] flex items-center gap-1.5 self-start sm:self-center shrink-0 cursor-pointer"
                      >
                        <span>Convert to Booking</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#D9C9A8]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* DRAWER / MODAL: VIEW & UPDATE BOOKING STATUS                              */}
      {/* ========================================================================= */}
      {selectedBooking && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-label="Booking Details Drawer"
          className="fixed inset-0 z-50 bg-[#2A1D15]/80 flex justify-end backdrop-blur-2xs"
          onClick={() => setSelectedBooking(null)}
        >
          <div 
            className="bg-[#FFFDF8] border-l border-[#D9C9A8] w-full max-w-lg h-full overflow-y-auto p-6 sm:p-8 flex flex-col justify-between shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#D9C9A8]/40 mb-6">
                <div>
                  <span className="text-[11px] font-mono text-[#8C6F38] uppercase tracking-wider">
                    {selectedBooking.id}
                  </span>
                  <h3 className="text-xl font-serif font-semibold text-[#2A1D15]">
                    {selectedBooking.guest.fullName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="p-1 hover:bg-[#FAF6EE] rounded-[2px]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Action Buttons */}
              <div className="p-4 bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] mb-6">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8C6F38] block mb-2">
                  Update Booking Lifecycle Status
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedBooking.id, 'Confirmed')}
                    className={`py-2 px-3 rounded-[2px] font-medium border text-center ${
                      selectedBooking.status === 'Confirmed'
                        ? 'bg-blue-700 text-white border-blue-700'
                        : 'bg-[#FFFDF8] border-[#D9C9A8] text-[#2A1D15] hover:bg-[#EAE2D2]'
                    }`}
                  >
                    Confirmed
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedBooking.id, 'Checked-in')}
                    className={`py-2 px-3 rounded-[2px] font-medium border text-center ${
                      selectedBooking.status === 'Checked-in'
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-[#FFFDF8] border-[#D9C9A8] text-[#2A1D15] hover:bg-[#EAE2D2]'
                    }`}
                  >
                    Check-in Guest
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedBooking.id, 'Completed')}
                    className={`py-2 px-3 rounded-[2px] font-medium border text-center ${
                      selectedBooking.status === 'Completed'
                        ? 'bg-neutral-800 text-white border-neutral-800'
                        : 'bg-[#FFFDF8] border-[#D9C9A8] text-[#2A1D15] hover:bg-[#EAE2D2]'
                    }`}
                  >
                    Check-out / Complete
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedBooking.id, 'Cancelled')}
                    className={`py-2 px-3 rounded-[2px] font-medium border text-center ${
                      selectedBooking.status === 'Cancelled'
                        ? 'bg-red-800 text-white border-red-800'
                        : 'bg-[#FFFDF8] border-red-200 text-red-800 hover:bg-red-50'
                    }`}
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>

              {/* Full Details */}
              <div className="space-y-4 text-xs text-[#2B2B2B]/85">
                <div>
                  <strong className="block text-[#2A1D15] uppercase tracking-wider text-[11px] mb-1">
                    Stay Specifications
                  </strong>
                  <p>Room: <strong>{selectedBooking.roomName}</strong> ({selectedBooking.roomsCount} room(s))</p>
                  <p>Dates: {formatIndianDate(selectedBooking.checkIn)} to {formatIndianDate(selectedBooking.checkOut)} ({selectedBooking.nights} nights)</p>
                  <p>Occupancy: {selectedBooking.adults} Adults, {selectedBooking.children} Children</p>
                </div>

                <div className="pt-2 border-t border-[#D9C9A8]/40">
                  <strong className="block text-[#2A1D15] uppercase tracking-wider text-[11px] mb-1">
                    Contact Details
                  </strong>
                  <p>Phone: {selectedBooking.guest.phone}</p>
                  <p>Email: {selectedBooking.guest.email}</p>
                  {selectedBooking.guest.gstNumber && <p className="font-mono">GSTIN: {selectedBooking.guest.gstNumber}</p>}
                </div>

                <div className="pt-2 border-t border-[#D9C9A8]/40">
                  <strong className="block text-[#2A1D15] uppercase tracking-wider text-[11px] mb-1">
                    Billing & Payment
                  </strong>
                  <p>Total Amount: <strong className="font-mono text-[#5A1F24]">{formatINR(selectedBooking.pricing.grandTotal)}</strong></p>
                  <p>Method: {selectedBooking.paymentMethod}</p>
                  <p>Payment Status: {selectedBooking.paymentStatus}</p>
                  {selectedBooking.pricing.couponApplied && (
                    <p className="text-emerald-800">Coupon: {selectedBooking.pricing.couponApplied} (-{formatINR(selectedBooking.pricing.discountAmount)})</p>
                  )}
                </div>

                {selectedBooking.requests.notes && (
                  <div className="pt-2 border-t border-[#D9C9A8]/40">
                    <strong className="block text-[#2A1D15] uppercase tracking-wider text-[11px] mb-1">
                      Guest Special Requests
                    </strong>
                    <p className="italic">"{selectedBooking.requests.notes}"</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-[#D9C9A8]/40">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="w-full py-2 bg-[#2A1D15] text-[#FAF6EE] text-xs font-semibold uppercase tracking-wider rounded-[2px]"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

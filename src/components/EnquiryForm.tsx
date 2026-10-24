import React, { useState, useEffect } from 'react';
import { CalendarCheck, Phone, CheckCircle2, AlertCircle, Copy } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { roomsData } from '../data/roomsData';
import { saveEnquiry, getStoredEnquiries } from '../lib/booking/store';
import { generateEnquiryId } from '../lib/booking/ids';
import { getTodayIso } from '../lib/booking/dates';

interface EnquiryFormProps {
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: string;
  initialRoomPreference?: string;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  initialCheckIn = '',
  initialCheckOut = '',
  initialGuests = '2',
  initialRoomPreference = ''
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    checkIn: initialCheckIn,
    checkOut: initialCheckOut,
    guests: initialGuests,
    roomPreference: initialRoomPreference || roomsData[0]?.name || '',
    specialRequests: '',
    // Honeypot field for anti-spam (must remain empty)
    hotelSubjectCode: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<typeof formData | null>(null);
  const [enquiryRef, setEnquiryRef] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update if initial props change (e.g. navigated with query params)
  useEffect(() => {
    if (initialCheckIn) setFormData(prev => ({ ...prev, checkIn: initialCheckIn }));
    if (initialCheckOut) setFormData(prev => ({ ...prev, checkOut: initialCheckOut }));
    if (initialGuests) setFormData(prev => ({ ...prev, guests: initialGuests }));
    if (initialRoomPreference) setFormData(prev => ({ ...prev, roomPreference: initialRoomPreference }));
  }, [initialCheckIn, initialCheckOut, initialGuests, initialRoomPreference]);

  /**
   * ISOLATED SUBMISSION HANDLER
   * Connected to demo store and mail client dispatch.
   */
  const dispatchEnquiry = async (data: typeof formData) => {
    // 1. Check honeypot field
    if (data.hotelSubjectCode) {
      console.warn("Spam bot submission blocked via honeypot field.");
      return { success: false, error: "Validation failure" };
    }

    // 2. Validate mandatory fields
    if (!data.fullName.trim() || !data.phone.trim()) {
      return { success: false, error: "Please provide your full name and telephone number." };
    }

    // 3. Generate unique enquiry reference and store in demo system
    const existing = getStoredEnquiries().map(e => e.id);
    const refId = generateEnquiryId(existing);
    setEnquiryRef(refId);

    saveEnquiry({
      id: refId,
      fullName: data.fullName.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: data.guests,
      roomPreference: data.roomPreference,
      specialRequests: data.specialRequests,
      submittedAt: getTodayIso()
    });

    // 4. Isolated dispatch simulation: format mailto link
    const recipientEmail = siteConfig.email || "reservations@hotelcarltonbareilly.com";
    const emailSubject = encodeURIComponent(`Booking Enquiry: ${data.fullName} [${refId}] – ${siteConfig.name}`);
    const emailBody = encodeURIComponent(
      `HOTEL CARLTON RESERVATION ENQUIRY [${refId}]\n\n` +
      `Guest Name: ${data.fullName}\n` +
      `Contact Phone: ${data.phone}\n` +
      `Email: ${data.email || 'Not provided'}\n` +
      `Check-In: ${data.checkIn || 'To be scheduled'}\n` +
      `Check-Out: ${data.checkOut || 'To be scheduled'}\n` +
      `Number of Guests: ${data.guests}\n` +
      `Room Preference: ${data.roomPreference}\n` +
      `Special Requests: ${data.specialRequests || 'None'}\n\n` +
      `Sent via Hotel Carlton Official Website`
    );

    try {
      const mailtoLink = `mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`;
      const tempLink = document.createElement('a');
      tempLink.href = mailtoLink;
      tempLink.style.display = 'none';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    } catch (e) {
      // Ignored
    }

    return { success: true, refId };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await dispatchEnquiry(formData);
      if (result.success) {
        setSubmittedData({ ...formData });
      } else {
        setErrorMessage(result.error || "Unable to send enquiry. Please contact the front desk directly.");
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred. Please call the front desk at 0581 257 4049.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setSubmittedData(null);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      checkIn: '',
      checkOut: '',
      guests: '2',
      roomPreference: roomsData[0]?.name || '',
      specialRequests: '',
      hotelSubjectCode: ''
    });
  };

  if (submittedData) {
    return (
      <div className="bg-[#FFFDF8] border border-[#D9C9A8] p-8 md:p-10 rounded-[3px] text-center shadow-xs">
        <div className="w-14 h-14 bg-[#5A1F24]/10 text-[#5A1F24] rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
        </div>
        
        <h3 className="text-2xl font-serif font-semibold text-[#2A1D15] mb-2">
          Enquiry Received
        </h3>

        {/* Enquiry Reference Tag */}
        {enquiryRef && (
          <div className="max-w-xs mx-auto mb-4 p-2 bg-[#FAF6EE] border border-[#A8884B] rounded-[2px] text-xs">
            <span className="text-[#2B2B2B]/60 uppercase tracking-wider block text-[10px]">Reference Number</span>
            <span className="font-mono font-bold text-sm text-[#5A1F24]">{enquiryRef}</span>
          </div>
        )}
        
        <p className="text-sm text-[#2B2B2B]/80 max-w-md mx-auto leading-relaxed mb-6">
          Thank you, <strong className="text-[#2A1D15] font-semibold">{submittedData.fullName}</strong>. Your enquiry details have been recorded in the hotel reservation system. Our front desk team will contact you at <strong className="text-[#2A1D15] font-semibold">{submittedData.phone}</strong> to confirm availability and discuss tariffs.
        </p>

        {/* Structured summary */}
        <div className="max-w-md mx-auto bg-[#FAF6EE] border border-[#D9C9A8]/60 p-4 text-xs text-left mb-6 space-y-2 rounded-[2px]">
          <div className="flex justify-between border-b border-[#D9C9A8]/40 pb-1">
            <span className="text-[#2B2B2B]/60 uppercase tracking-wider">Room Type:</span>
            <span className="font-semibold text-[#2A1D15]">{submittedData.roomPreference}</span>
          </div>
          <div className="flex justify-between border-b border-[#D9C9A8]/40 pb-1">
            <span className="text-[#2B2B2B]/60 uppercase tracking-wider">Stay Dates:</span>
            <span className="font-semibold text-[#2A1D15]">
              {submittedData.checkIn || 'TBD'} to {submittedData.checkOut || 'TBD'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#2B2B2B]/60 uppercase tracking-wider">Guests:</span>
            <span className="font-semibold text-[#2A1D15]">{submittedData.guests} Guest(s)</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={`tel:${siteConfig.phoneTel}`}
            className="px-5 py-2.5 bg-[#2A1D15] hover:bg-[#5A1F24] text-[#FAF6EE] text-xs font-semibold uppercase tracking-widest rounded-[2px] inline-flex items-center gap-2"
          >
            <Phone className="w-3.5 h-3.5 text-[#D9C9A8]" />
            <span>Call Reception Now</span>
          </a>
          <button
            type="button"
            onClick={resetForm}
            className="px-5 py-2.5 bg-transparent border border-[#A8884B] hover:bg-[#FAF6EE] text-[#2A1D15] text-xs font-semibold uppercase tracking-widest rounded-[2px]"
          >
            Submit Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF8] border border-[#D9C9A8] p-6 sm:p-8 md:p-10 rounded-[3px] shadow-xs">
      <div className="mb-6 pb-4 border-b border-[#D9C9A8]/40">
        <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#2A1D15] mb-1">
          Request Booking / Availability Enquiry
        </h3>
        <p className="text-xs text-[#2B2B2B]/75 leading-relaxed">
          Please submit your anticipated travel dates. Our reception team will review room availability and contact you promptly.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-[2px] flex items-center gap-2" role="alert">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Anti-spam honeypot (visually hidden, ignore for humans) */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="hotelSubjectCode">Leave this field blank</label>
          <input
            type="text"
            id="hotelSubjectCode"
            name="hotelSubjectCode"
            value={formData.hotelSubjectCode}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Row 1: Full Name & Telephone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1">
              Full Name <span className="text-[#5A1F24]">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="e.g. Vikram Malhotra"
              className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] px-3.5 py-2.5 text-sm text-[#2B2B2B] focus:border-[#A8884B] focus:outline-hidden focus:ring-1 focus:ring-[#A8884B]"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1">
              Phone Number <span className="text-[#5A1F24]">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="e.g. 98XXXXXXXX"
              className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] px-3.5 py-2.5 text-sm text-[#2B2B2B] focus:border-[#A8884B] focus:outline-hidden focus:ring-1 focus:ring-[#A8884B]"
            />
          </div>
        </div>

        {/* Row 2: Email & Room Preference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1">
              Email Address <span className="text-[#2B2B2B]/50 font-normal">(Optional)</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] px-3.5 py-2.5 text-sm text-[#2B2B2B] focus:border-[#A8884B] focus:outline-hidden focus:ring-1 focus:ring-[#A8884B]"
            />
          </div>

          <div>
            <label htmlFor="roomPreference" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1">
              Room Preference
            </label>
            <select
              id="roomPreference"
              name="roomPreference"
              value={formData.roomPreference}
              onChange={handleChange}
              className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] px-3.5 py-2.5 text-sm text-[#2B2B2B] focus:border-[#A8884B] focus:outline-hidden focus:ring-1 focus:ring-[#A8884B]"
            >
              {roomsData.map(room => (
                <option key={room.id} value={room.name}>
                  {room.name}
                </option>
              ))}
              <option value="Any Available Room">Any Available Room</option>
            </select>
          </div>
        </div>

        {/* Row 3: Check-in, Check-out, Guests */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="checkIn" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1">
              Check-In Date
            </label>
            <input
              type="date"
              id="checkIn"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] px-3.5 py-2 text-sm text-[#2B2B2B] focus:border-[#A8884B] focus:outline-hidden focus:ring-1 focus:ring-[#A8884B]"
            />
          </div>

          <div>
            <label htmlFor="checkOut" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1">
              Check-Out Date
            </label>
            <input
              type="date"
              id="checkOut"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              min={formData.checkIn}
              className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] px-3.5 py-2 text-sm text-[#2B2B2B] focus:border-[#A8884B] focus:outline-hidden focus:ring-1 focus:ring-[#A8884B]"
            />
          </div>

          <div>
            <label htmlFor="guests" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1">
              Guests
            </label>
            <select
              id="guests"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] px-3.5 py-2 text-sm text-[#2B2B2B] focus:border-[#A8884B] focus:outline-hidden focus:ring-1 focus:ring-[#A8884B]"
            >
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4+">4+ Guests</option>
            </select>
          </div>
        </div>

        {/* Row 4: Special Requests */}
        <div>
          <label htmlFor="specialRequests" className="block text-xs font-semibold uppercase tracking-wider text-[#2A1D15] mb-1">
            Special Requests / Notes <span className="text-[#2B2B2B]/50 font-normal">(Optional)</span>
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            rows={3}
            value={formData.specialRequests}
            onChange={handleChange}
            placeholder="Arrival timing, bed preference, or corporate booking details..."
            className="w-full bg-[#FAF6EE] border border-[#D9C9A8] rounded-[2px] px-3.5 py-2.5 text-sm text-[#2B2B2B] focus:border-[#A8884B] focus:outline-hidden focus:ring-1 focus:ring-[#A8884B] resize-y"
          />
        </div>

        {/* Notice */}
        <div className="pt-2 text-xs text-[#2B2B2B]/70 leading-relaxed border-t border-[#D9C9A8]/40">
          <p>
            * <strong>Please Note:</strong> Submitting this form sends an enquiry to Hotel Carlton. It is not an instant confirmed reservation. Our reservations desk will reach out to confirm your booking and current rates.
          </p>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 bg-[#5A1F24] hover:bg-[#6D262C] text-[#FAF6EE] text-xs font-semibold uppercase tracking-widest rounded-[2px] transition-colors border border-[#5A1F24] shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            <CalendarCheck className="w-4 h-4 text-[#D9C9A8]" aria-hidden="true" />
            <span>{isSubmitting ? "Dispatching Enquiry..." : "Request Booking"}</span>
          </button>
        </div>

      </form>
    </div>
  );
};

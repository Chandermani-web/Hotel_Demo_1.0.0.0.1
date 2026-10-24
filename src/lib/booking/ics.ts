/**
 * Browser-based iCalendar (.ics) generator for Hotel Carlton bookings.
 */

import { StoredBooking } from '../../data/demo/seedBookings';
import { siteConfig } from '../../config/siteConfig';

export function generateIcsCalendarFile(booking: StoredBooking): void {
  const checkInDate = booking.checkIn.replace(/-/g, '');
  const checkOutDate = booking.checkOut.replace(/-/g, '');
  
  // DTSTART check-in 14:00 (2:00 PM), DTEND check-out 11:00 AM
  const startStamp = `${checkInDate}T140000`;
  const endStamp = `${checkOutDate}T110000`;
  const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hotel Carlton Bareilly//Reservation System//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${booking.id}@hotelcarltonbareilly.com`,
    `DTSTAMP:${nowStamp}`,
    `DTSTART:${startStamp}`,
    `DTEND:${endStamp}`,
    `SUMMARY:Stay at Hotel Carlton (${booking.roomName})`,
    `DESCRIPTION:Reservation ID: ${booking.id}\\nGuest: ${booking.guest.fullName}\\nRoom: ${booking.roomName} (${booking.roomsCount} room)\\nCheck-in: 2:00 PM\\nCheck-out: 11:00 AM\\nPhone: ${siteConfig.phone}`,
    `LOCATION:${siteConfig.name}, ${siteConfig.address.full}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${booking.id}_hotel_carlton.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
}

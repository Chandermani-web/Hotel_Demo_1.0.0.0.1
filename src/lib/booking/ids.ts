/**
 * Unique Identifier Generator for Hotel Carlton Booking System
 * Format: CARL-YYMMDD-XXXX
 */

export function generateBookingId(existingIds: string[] = []): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const dateSegment = `${yy}${mm}${dd}`;

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude easily confused 0, O, 1, I
  let id = '';
  let attempts = 0;

  do {
    let randomPart = '';
    for (let i = 0; i < 4; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    id = `CARL-${dateSegment}-${randomPart}`;
    attempts++;
  } while (existingIds.includes(id) && attempts < 100);

  return id;
}

export function generateEnquiryId(existingIds: string[] = []): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const dateSegment = `${yy}${mm}${dd}`;

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  let attempts = 0;

  do {
    let randomPart = '';
    for (let i = 0; i < 4; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    id = `ENQ-${dateSegment}-${randomPart}`;
    attempts++;
  } while (existingIds.includes(id) && attempts < 100);

  return id;
}

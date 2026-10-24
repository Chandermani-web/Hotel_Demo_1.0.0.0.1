/**
 * Date manipulation and validation utilities for Hotel Carlton booking flow.
 */

/**
 * Format a Date object or YYYY-MM-DD string to standard ISO YYYY-MM-DD
 */
export function toIsoDate(date: Date | string): string {
  if (typeof date === 'string') {
    // If already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
  }
  return date.toISOString().split('T')[0];
}

/**
 * Parses YYYY-MM-DD into a local Date object without UTC timezone skew
 */
export function parseLocalIsoDate(isoStr: string): Date {
  const [year, month, day] = isoStr.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0); // Noon prevents DST boundary slips
}

/**
 * Formats date into Indian English format: e.g. "Mon, 3 Nov 2026"
 */
export function formatIndianDate(isoStr: string): string {
  if (!isoStr) return '';
  const date = parseLocalIsoDate(isoStr);
  if (isNaN(date.getTime())) return isoStr;

  const weekday = date.toLocaleDateString('en-IN', { weekday: 'short' });
  const day = date.getDate();
  const month = date.toLocaleDateString('en-IN', { month: 'short' });
  const year = date.getFullYear();

  return `${weekday}, ${day} ${month} ${year}`;
}

/**
 * Formats date into shorter format: e.g. "3 Nov 2026"
 */
export function formatShortDate(isoStr: string): string {
  if (!isoStr) return '';
  const date = parseLocalIsoDate(isoStr);
  if (isNaN(date.getTime())) return isoStr;

  const day = date.getDate();
  const month = date.toLocaleDateString('en-IN', { month: 'short' });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Calculates number of nights between check-in and check-out.
 */
export function calculateNights(checkInIso: string, checkOutIso: string): number {
  if (!checkInIso || !checkOutIso) return 0;
  const inDate = parseLocalIsoDate(checkInIso);
  const outDate = parseLocalIsoDate(checkOutIso);
  const diffTime = outDate.getTime() - inDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Returns array of date strings (YYYY-MM-DD) for every night of the stay.
 * For checkIn '2026-11-01' and checkOut '2026-11-03', returns ['2026-11-01', '2026-11-02'].
 */
export function getNightsList(checkInIso: string, checkOutIso: string): string[] {
  const nights: string[] = [];
  const inDate = parseLocalIsoDate(checkInIso);
  const outDate = parseLocalIsoDate(checkOutIso);

  const cur = new Date(inDate);
  while (cur < outDate) {
    nights.push(toIsoDate(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return nights;
}

/**
 * Checks whether a given night is a weekend night.
 * Policy: Friday and Saturday nights carry weekend surcharge.
 */
export function isWeekendNight(nightIso: string): boolean {
  const date = parseLocalIsoDate(nightIso);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 5 = Friday, 6 = Saturday
  return dayOfWeek === 5 || dayOfWeek === 6;
}

/**
 * Add days to an ISO date string
 */
export function addDays(isoStr: string, days: number): string {
  const date = parseLocalIsoDate(isoStr);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

/**
 * Checks if target ISO date is in the past compared to today (local time).
 */
export function isPastDate(isoStr: string): boolean {
  const todayStr = toIsoDate(new Date());
  return isoStr < todayStr;
}

/**
 * Returns today's ISO date string
 */
export function getTodayIso(): string {
  return toIsoDate(new Date());
}

/**
 * Returns tomorrow's ISO date string
 */
export function getTomorrowIso(): string {
  return addDays(getTodayIso(), 1);
}

/**
 * Checks if two date ranges overlap.
 * Range A: [startA, endA)
 * Range B: [startB, endB)
 */
export function doDatesOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  return startA < endB && endA > startB;
}

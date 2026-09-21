/**
 * UAE & Dubai Real Estate Formatting Utilities
 */

/**
 * Format currency in UAE Dirhams (AED)
 */
export function formatAED(amount: number, options?: { showCode?: boolean; decimals?: number }): string {
  const { showCode = true, decimals = 0 } = options || {};
  const formatted = new Intl.NumberFormat("en-AE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  return showCode ? `AED ${formatted}` : formatted;
}

/**
 * Format area in Square Feet (sq.ft) - standard across Dubai real estate
 */
export function formatSqFt(area: number): string {
  const formatted = new Intl.NumberFormat("en-AE", {
    maximumFractionDigits: 1,
  }).format(area);
  return `${formatted} sq.ft`;
}

/**
 * Format date in Gulf Standard / UAE friendly format (e.g., "21 Sep 2026")
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dubai",
  }).format(d);
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Dubai",
  }).format(d);
}

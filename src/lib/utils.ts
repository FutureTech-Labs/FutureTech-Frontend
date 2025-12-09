import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility: cn()
 * ----------------------------------------
 * Combines multiple className values into a single, optimized string.
 * - Uses `clsx` to conditionally join class names.
 * - Uses `twMerge` to intelligently merge Tailwind classes, 
 *   preventing duplicates or conflicting utilities.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
};

/**
 * Utility: toSentenceCase()
 * ----------------------------------------
 * Converts any string into sentence case.
 * - Trims leading/trailing whitespace.
 * - Lowercases the full string.
 * - Capitalizes only the first character.
 * 
 * Example:
 *   toSentenceCase("hELLO WORLD") → "Hello world"
 */
export function toSentenceCase(str = "") {
  if (!str) return "";
  const trimmed = str.trim().toLowerCase();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

/**
 * Utility: formatCurrencyLKR()
 * ----------------------------------------
 * Formats a number as Sri Lankan Rupees (LKR).
 * - Uses Intl.NumberFormat with `en-LK` locale.
 * - Optionally hides decimal places.
 * - Returns "—" for null / undefined / invalid numbers.
 * 
 * Example:
 *   formatCurrencyLKR(1500) → "Rs 1,500.00"
 *   formatCurrencyLKR(1500, false) → "Rs 1,500"
 */
export function formatCurrencyLKR(amount: number, showCents: boolean = true): string {
  if (amount == null || isNaN(amount)) return "—";

  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(amount);
};

/**
 * Utility: formatReadableDate()
 * ----------------------------------------
 * Converts an ISO date string (e.g. "2025-11-19T08:54:19.463Z")
 * into a clean, human-friendly date like:
 *   "November 19, 2025"
 *
 * - Returns "—" if input is empty or invalid.
 * - Uses `en-US` locale for long month names.
 */
export function formatReadableDate(dateString: string): string {
  if (!dateString) return "—";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Utility: formatLocalDate()
 * ----------------------------------------
 * Converts a Date object into a YYYY-MM-DD local date string.
 * Useful for `<input type="date" />` fields.
 * - Adjusts for local timezone offset to ensure correct day.
 *
 * Example:
 *   formatLocalDate(new Date("2025-02-21T18:00:00Z"))
 *   → "2025-02-21"
 */
// export function formatLocalDate(date?: Date) {
//   if (!date) return "";
//   return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
//     .toISOString()
//     .split("T")[0];
// };

/**
 * Utility: warrantyStringToMonths()
 * ----------------------------------------
 * Converts warranty strings like:
 *   "6 months", "12 months", "no warranty"
 * into a numeric month value.
 *
 * - Returns 0 for "no warranty".
 * - Extracts the first numeric part of the string.
 *
 * Example:
 *   warrantyStringToMonths("24 months") → 24
 */
export const warrantyStringToMonths = (period: string) => {
  if (!period) return 0;
  if (period === "no warranty") return 0;
  return Number(period.split(" ")[0]);
};

/**
 * Utility: computeWarrantyEndDate()
 * ----------------------------------------
 * Computes the warranty expiration date based on:
 *   - sale date
 *   - warranty period (e.g., "6 months")
 *
 * Returns the resulting Date, or null if:
 *   - period is 0
 *   - invalid input provided
 *
 * Example:
 *   computeWarrantyEndDate("2025-01-01", "6 months")
 *   → Date("2025-07-01")
 */
export const computeWarrantyEndDate = (saleDate: string | Date, warrantyPeriod: string) => {
  const months = warrantyStringToMonths(warrantyPeriod);
  if (!months) return null;

  const date = new Date(saleDate);
  date.setMonth(date.getMonth() + months);
  return date;
};

/**
 * Utility: formatDateTime()
 * ----------------------------------------
 * Formats a date string or null into a readable
 * date + time format:
 *   "Jan 25, 2025, 10:14 AM"
 *
 * - Returns "—" for null or invalid dates.
 * - Uses `en-US` locale.
 *
 * Example:
 *   formatDateTime("2025-02-21T10:12:00Z")
 *   → "Feb 21, 2025, 10:12 AM"
 */
export const formatDateTime = (
  date?: string | null,
  options?: { hideTime?: boolean }
) => {
  if (!date) return "—";

  const hideTime = options?.hideTime ?? false;

  const baseOptions: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  // include time only if hideTime = false
  if (!hideTime) {
    baseOptions.hour = "2-digit";
    baseOptions.minute = "2-digit";
  }

  return new Date(date).toLocaleString("en-US", baseOptions);
};



/**
 * Utility: parseUserAgent()
 * ----------------------------------------
 * Converts a long, raw browser user-agent string into a short,
 * human-friendly "OS — Browser" format.
 *
 * Raw user-agents look like:
 *   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 
 *    (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
 *
 * This helper extracts and returns clean values such as:
 *   "Windows 10 — Chrome"
 *   "macOS — Safari"
 *   "Android — Chrome"
 *   "iOS — Safari"
 *
 * - Returns "Unknown device" if UA is empty.
 * - Very lightweight OS + browser detection (no library needed).
 */
export function parseUserAgent(ua: string): string {
  if (!ua) return "Unknown device";

  let os = "Unknown OS";
  let browser = "Unknown Browser";

  // --- Browser Detection ---
  if (ua.includes("Chrome/") && !ua.includes("Edg/")) browser = "Chrome";
  else if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("Safari/") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Firefox/")) browser = "Firefox";

  // Extract Chrome version
  const chromeMatch = ua.match(/Chrome\/(\d+)/);
  const chromeVersion = chromeMatch ? Number(chromeMatch[1]) : null;

  // --- OS Detection ---
  if (ua.includes("Windows NT 10.0")) {
    // Heuristic for Windows 11
    // Windows 11 is generally paired with Chrome 100+ or modern user agents
    if (chromeVersion && chromeVersion >= 100) {
      os = "Windows 11";
    } else {
      os = "Windows 10";
    }
  } else if (ua.includes("Mac OS X")) {
    os = "macOS";
  } else if (ua.includes("Android")) {
    os = "Android";
  } else if (ua.includes("iPhone") || ua.includes("iPad")) {
    os = "iOS";
  }

  return `${os} — ${browser}`;
};

/**
 * normalizeDateRange()
 * ----------------------------------------------
 * Takes a DateRange object and returns:
 * { from: ISO string | "", to: ISO string | "" }
 *
 * - Ensures start-of-day for `from`
 * - Ensures end-of-day for `to`
 * - Prevents timezone shift issues
 */
export function normalizeDateRange(range?: { from?: Date; to?: Date }) {
  if (!range) {
    return { from: "", to: "" };
  }

  let from = "";
  let to = "";

  if (range.from instanceof Date && !isNaN(range.from.getTime())) {
    const start = new Date(range.from);
    start.setHours(0, 0, 0, 0);
    from = start.toISOString();
  }

  if (range.to instanceof Date && !isNaN(range.to.getTime())) {
    const end = new Date(range.to);
    end.setHours(23, 59, 59, 999);
    to = end.toISOString();
  }

  return { from, to };
}


/**
 * normalizeSingleDate()
 * ----------------------------------------------
 * Converts a single Date into ISO start-of-day.
 * Returns "" if invalid.
 */
export function normalizeSingleDate(d?: Date) {
  if (!d || !(d instanceof Date) || isNaN(d.getTime())) return "";

  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  return start.toISOString(); // safe UTC ISO
}


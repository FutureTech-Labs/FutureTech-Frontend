import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility: cn()
 * ----------------------------------------
 * Combines multiple className values into a single string.
 * - Uses clsx to conditionally join classes.
 * - Uses twMerge to intelligently merge Tailwind classes 
 *   (prevents duplicates and conflicts like "p-2 p-4").
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
};

/**
 * Utility: toSentenceCase()
 * ----------------------------------------
 * Converts a string into sentence case.
 * - Trims whitespace.
 * - Converts entire string to lowercase.
 * - Capitalizes the first character.
 * Example: "hELLO WORLD" → "Hello world"
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
 * - Uses Intl.NumberFormat with "en-LK" locale.
 * - Optionally hides cents (decimal places).
 * - Returns "—" for invalid or empty values.
 * Example: 1500 → "Rs 1,500.00"
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
 * Converts an ISO date string (e.g., "2025-11-19T08:54:19.463Z")
 * into a human-friendly format: "November 19, 2025".
 * - Returns "—" for invalid dates or empty input.
 * - Uses "en-US" locale to get full month names.
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

export function formatLocalDate(date?: Date) {
  if (!date) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
};

export const warrantyStringToMonths = (period: string) => {
    if (!period) return 0;
    if (period === "no warranty") return 0;
    return Number(period.split(" ")[0]);
};

export const computeWarrantyEndDate = (saleDate: string | Date, warrantyPeriod: string) => {
    const months = warrantyStringToMonths(warrantyPeriod);
    if (!months) return null;

    const date = new Date(saleDate);
    date.setMonth(date.getMonth() + months);
    return date;
};
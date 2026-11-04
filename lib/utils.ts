import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isValid } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format string tanggal (ISO YYYY-MM-DD atau tahun) menjadi representasi ramah 'MMM yyyy' (e.g. 'Jan 2026').
 */
export function formatExperienceDate(dateStr?: string | null, fallback = ''): string {
  if (!dateStr) return fallback;
  const trimmed = dateStr.trim();
  if (!trimmed) return fallback;

  if (trimmed.toLowerCase() === 'present') return 'Present';

  // Format YYYY-MM-DD atau ISO Timestamp
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    try {
      const d = parseISO(trimmed);
      if (isValid(d)) {
        return format(d, 'MMM yyyy');
      }
    } catch {
      // fallback
    }
  }

  // Jika string hanya tahun (misal '2026')
  if (/^\d{4}$/.test(trimmed)) {
    return trimmed;
  }

  return trimmed;
}

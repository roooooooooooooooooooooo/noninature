import { Language } from '../i18n/dictionaries';

/**
 * Formats a number to Bangladeshi Taka format (e.g. ৳750 or ৳1,250)
 * Uses Bengali numerals when language is 'bn'
 */
export function formatPrice(amount: number, language: Language = 'bn'): string {
  const rounded = Math.round(amount);
  const formattedEn = new Intl.NumberFormat('en-IN').format(rounded);

  if (language === 'bn') {
    const bnNumerals: Record<string, string> = {
      '0': '০',
      '1': '১',
      '2': '২',
      '3': '৩',
      '4': '৪',
      '5': '৫',
      '6': '৬',
      '7': '৭',
      '8': '৮',
      '9': '৯',
    };
    const formattedBn = formattedEn.replace(/[0-9]/g, (digit) => bnNumerals[digit] || digit);
    return `৳${formattedBn}`;
  }

  return `৳${formattedEn}`;
}

/**
 * Formats date into readable string
 */
export function formatDate(dateStr: string, language: Language = 'bn'): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  if (language === 'bn') {
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

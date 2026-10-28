/**
 * Validates a Bangladeshi mobile phone number
 * Accepts formats: 01711223344, +8801711223344, 8801711223344
 */
export function isValidBangladeshPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s-]/g, '');
  // Matches 01[3-9] followed by 8 digits, optionally prefixed by +88 or 88
  const bdRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
  return bdRegex.test(cleaned);
}

/**
 * Normalizes phone number to standard 11-digit format (01XXXXXXXXX)
 */
export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, '');
  if (cleaned.startsWith('+88')) return cleaned.slice(3);
  if (cleaned.startsWith('88')) return cleaned.slice(2);
  return cleaned;
}

/**
 * Validates full name (at least 2 letters)
 */
export function isValidName(name: string): boolean {
  return typeof name === 'string' && name.trim().length >= 2;
}

/**
 * Validates address (at least 5 characters)
 */
export function isValidAddress(address: string): boolean {
  return typeof address === 'string' && address.trim().length >= 5;
}

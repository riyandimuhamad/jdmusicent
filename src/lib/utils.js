/**
 * Formats a number to Indonesian Rupiah (IDR) currency format.
 * @param {number} value - The number to format
 * @param {boolean} includeSymbol - Whether to prepend 'Rp ' symbol
 * @returns {string} Formatted currency string
 */
export function formatIDR(value, includeSymbol = true) {
  if (value === undefined || value === null) return '';
  const formatted = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
  return includeSymbol ? `Rp ${formatted}` : formatted;
}

/**
 * Utility function to conditional merge classes (simplified classNames/clsx wrapper)
 * @param  {...any} classes - List of classNames
 * @returns {string} Concatenated classes
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

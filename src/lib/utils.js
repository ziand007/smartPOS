/**
 * Utility functions for the POS system
 */

// Format currency to Indonesian Rupiah
export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Format date to readable format
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

// Format date to short format (date only)
export function formatDateShort(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

// Generate random barcode
export function generateBarcode() {
  return Math.random().toString().substr(2, 12);
}

// Generate SKU from product name
export function generateSKU(name) {
  const prefix = name.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}-${timestamp}`;
}

// Debounce function for search inputs
export function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Get initials from name
export function getInitials(name) {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Calculate tax amount
export function calculateTax(amount, taxRate) {
  return (amount * taxRate) / 100;
}

// Calculate discount amount
export function calculateDiscount(amount, discountPercent) {
  return (amount * discountPercent) / 100;
}
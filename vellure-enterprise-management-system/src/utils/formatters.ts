/**
 * Utilities for VELLURE Enterprise Management System
 */

export function formatBDT(amount: number): string {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount).replace('BDT', '৳');
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat('en-BD').format(val);
}

export function sanitizeBDPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('880')) {
    return digits;
  }
  if (digits.startsWith('0')) {
    return '88' + digits;
  }
  return '880' + digits;
}

export function buildWhatsAppLink(phone: string, text: string): string {
  const cleanPhone = sanitizeBDPhone(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function getCourierTrackingUrl(courier: string, trackingId: string): string {
  if (courier.toLowerCase().includes('steadfast')) {
    return `https://steadfast.com.bd/tracking/${trackingId}`;
  }
  if (courier.toLowerCase().includes('pathao')) {
    return `https://pathao.com/courier/tracking/?consignment_id=${trackingId}`;
  }
  return `https://vellurefragrances.com/track/${trackingId}`;
}

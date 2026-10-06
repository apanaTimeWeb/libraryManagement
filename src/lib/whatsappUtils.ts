/**
 * WhatsApp utility functions for Library OS
 */

export interface StudentWhatsAppData {
  name: string;
  smartId: string;
  phone: string;
  parentPhone?: string;
  shift: string;
  seat: string;
  locker: string;
  plan: string;
  amountPaid: number;
  totalPayable: number;
  discount: number;
  paymentMode: string;
  transactionId?: string;
  joinDate: string;
  expiryDate: string;
  branch?: string;
}

export function calcExpiryDate(joinDate: Date, plan: string): Date {
  const d = new Date(joinDate);
  switch (plan) {
    case 'Monthly':     d.setMonth(d.getMonth() + 1);       break;
    case 'Quarterly':   d.setMonth(d.getMonth() + 3);       break;
    case 'Half-Yearly': d.setMonth(d.getMonth() + 6);       break;
    case 'Annual':      d.setFullYear(d.getFullYear() + 1); break;
    default:            d.setMonth(d.getMonth() + 1);       break;
  }
  return d;
}

export function formatDateIN(date: Date): string {
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatCurrencyIN(amount: number): string {
  return `Rs.${amount.toLocaleString('en-IN')}`;
}

/**
 * ID Card WhatsApp message — mirrors the printed card layout exactly:
 * Header → Profile → Shift/Seat/Plan/Locker → Validity → Payment
 */
export function formatIdCardMessage(data: StudentWhatsAppData): string {
  const balance = data.totalPayable - data.amountPaid;
  const branch = data.branch ?? 'Main Branch';

  const lines: string[] = [
    `╔═══════════════════════╗`,
    `║  📚 Library OS ║`,
    `║  🏛 ${branch.padEnd(19)}║`,
    `║  🪪  S T U D E N T   I D ║`,
    `╚═══════════════════════╝`,
    ``,
    `👤 *${data.name}*`,
    `🆔 Smart ID: *#${data.smartId}*`,
    `📱 ${data.phone}`,
    ``,
    `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄`,
    `⏰ *Shift :* ${data.shift}`,
    `💺 *Seat  :* ${data.seat}`,
    `📋 *Plan  :* ${data.plan}`,
    `🔐 *Locker:* ${data.locker === 'None' ? 'Not Assigned' : data.locker}`,
    `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄`,
    ``,
    `📅 *Valid From :* ${data.joinDate}`,
    `📅 *Expires On :* *${data.expiryDate}*`,
    ``,
    `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄`,
    `💰 Fees     : ${formatCurrencyIN(data.totalPayable)}`,
    data.discount > 0 ? `🎁 Discount : -${formatCurrencyIN(data.discount)}` : '',
    `✅ Paid     : ${formatCurrencyIN(data.amountPaid)}`,
    `💳 Mode     : ${data.paymentMode}`,
    data.transactionId ? `🧾 Txn ID   : ${data.transactionId}` : '',
    balance > 0
      ? `⚠️ *Balance Due: ${formatCurrencyIN(balance)}*`
      : `✅ *Balance: CLEAR*`,
    ``,
    `╔═══════════════════════╗`,
    `║  ✅ VERIFIED MEMBER   ║`,
    `║  🎓 Happy Studying!   ║`,
    `╚═══════════════════════╝`,
  ].filter(l => l !== null && l !== undefined);

  return lines.filter(l => l.trim() !== '' || lines.indexOf(l) % 3 === 0).join('\n');
}

/**
 * Dues reminder message — for students page action button
 */
export function formatDuesMessage(data: StudentWhatsAppData): string {
  const balance = data.totalPayable - data.amountPaid;
  const branch = data.branch ?? 'Main Branch';

  return [
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `📚 *Library OS*`,
    `📍 ${branch}`,
    `━━━━ FEE STATEMENT ━━━━`,
    ``,
    `👤 *Name:* ${data.name}`,
    `🆔 *Smart ID:* ${data.smartId}`,
    `📱 *Phone:* ${data.phone}`,
    ``,
    `📋 Plan   : ${data.plan}`,
    `⏰ Shift  : ${data.shift}`,
    `💺 Seat   : ${data.seat}`,
    ``,
    `💰 Fees   : ${formatCurrencyIN(data.totalPayable)}`,
    data.discount > 0 ? `🎁 Discount: -${formatCurrencyIN(data.discount)}` : '',
    `✅ Paid   : ${formatCurrencyIN(data.amountPaid)}`,
    ``,
    balance > 0
      ? `⚠️ *DUE AMOUNT: ${formatCurrencyIN(balance)}*\nPlease pay before *${data.expiryDate}*`
      : `✅ *All dues cleared. Thank you!*`,
    ``,
    `📅 Valid: ${data.joinDate} → ${data.expiryDate}`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `📚 Library OS`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
  ].filter(Boolean).join('\n');
}

export function openWhatsApp(phone: string, message: string): void {
  const digits = phone.replace(/\D/g, '');
  const normalized = digits.startsWith('91') && digits.length === 12
    ? digits
    : `91${digits.slice(-10)}`;
  window.open(`https://wa.me/${normalized}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
}

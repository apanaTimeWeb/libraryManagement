/**
 * Thermal Print Utility — Library OS
 * 80mm thermal printer — ESC/POS style via browser popup
 */

export interface ThermalBillData {
  type: 'idcard' | 'receipt' | 'dues';
  shopName?: string;
  branch?: string;
  studentName: string;
  smartId: string;
  phone: string;
  shift?: string;
  seat?: string;
  locker?: string;
  plan?: string;
  joinDate?: string;
  expiryDate?: string;
  billNumber?: string;
  date?: string;
  totalPayable?: number;
  amountPaid?: number;
  discount?: number;
  balance?: number;
  paymentMode?: string;
  transactionId?: string;
}

const W = 42; // character width for 80mm thermal

function ln(): string {
  return '-'.repeat(W);
}

function dln(): string {
  return '='.repeat(W);
}

function center(text: string): string {
  // Truncate if too long
  const t = text.slice(0, W);
  const pad = Math.max(0, Math.floor((W - t.length) / 2));
  return ' '.repeat(pad) + t;
}

function row(label: string, value: string): string {
  // label is fixed 10 chars, value fills the rest
  const lbl = label.slice(0, 10).padEnd(10);
  const maxVal = W - 10 - 1;
  const val = value.slice(0, maxVal);
  return `${lbl} ${val}`;
}

function rowRight(label: string, value: string): string {
  // right-align value
  const lbl = label.slice(0, 10).padEnd(10);
  const maxVal = W - 10 - 1;
  const val = value.slice(0, maxVal).padStart(maxVal);
  return `${lbl} ${val}`;
}

export function buildThermalContent(d: ThermalBillData): string {
  const shop   = (d.shopName ?? 'Library OS').toUpperCase();
  const branch = d.branch ?? 'Main Branch';
  const now    = d.date ?? new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const L: string[] = [];

  // ── HEADER ──
  L.push(dln());
  L.push(center(shop));
  L.push(center(branch));
  L.push(dln());

  if (d.type === 'idcard') {
    L.push(center('STUDENT IDENTITY CARD'));
    L.push(ln());
    L.push('');
    L.push(row('Name     :', d.studentName));
    L.push(row('Smart ID :', '#' + d.smartId));
    L.push(row('Phone    :', d.phone));
    L.push('');
    L.push(ln());
    L.push(center('-- MEMBERSHIP DETAILS --'));
    L.push(ln());
    L.push(row('Shift    :', d.shift ?? '-'));
    L.push(row('Seat     :', d.seat ?? '-'));
    L.push(row('Plan     :', d.plan ?? '-'));
    L.push(row('Locker   :', d.locker === 'None' ? 'Not Assigned' : (d.locker ?? '-')));
    L.push('');
    L.push(ln());
    L.push(center('-- VALIDITY --'));
    L.push(ln());
    L.push(row('Valid From:', d.joinDate ?? '-'));
    L.push(row('Expires  :', d.expiryDate ?? '-'));
    L.push('');
    L.push(dln());
    L.push(center('** VERIFIED MEMBER **'));
    L.push(center('Show at entry or scan QR'));
    L.push(dln());
    L.push(center('Happy Studying! All the best!'));
  }

  if (d.type === 'receipt') {
    const billNo = d.billNumber ?? 'N/A';
    const fees   = d.totalPayable ?? 0;
    const paid   = d.amountPaid  ?? 0;
    const disc   = d.discount    ?? 0;
    const bal    = d.balance     ?? (fees - paid);

    L.push(center('FEE RECEIPT'));
    L.push(ln());
    L.push(row('Receipt  :', billNo));
    L.push(row('Date     :', now));
    L.push(ln());
    L.push(row('Name     :', d.studentName));
    L.push(row('Smart ID :', '#' + d.smartId));
    L.push(row('Phone    :', d.phone));
    L.push(ln());
    L.push(row('Plan     :', d.plan   ?? '-'));
    L.push(row('Shift    :', d.shift  ?? '-'));
    L.push(row('Seat     :', d.seat   ?? '-'));
    L.push(ln());
    L.push(rowRight('Fees     :', `Rs.${fees.toLocaleString('en-IN')}`));
    if (disc > 0) L.push(rowRight('Discount :', `-Rs.${disc.toLocaleString('en-IN')}`));
    L.push(rowRight('PAID     :', `Rs.${paid.toLocaleString('en-IN')}`));
    L.push(dln());
    L.push(rowRight(bal > 0 ? 'BALANCE  :' : 'STATUS   :', bal > 0 ? `Rs.${bal.toLocaleString('en-IN')} DUE` : 'CLEAR'));
    L.push(dln());
    L.push(row('Mode     :', d.paymentMode ?? '-'));
    if (d.transactionId) L.push(row('Txn ID   :', d.transactionId));
    L.push('');
    L.push(center('Payment Received & Confirmed'));
    L.push(center('Thank You! Keep Studying!'));
    L.push(ln());
    L.push(center('Library OS'));
  }

  if (d.type === 'dues') {
    const fees = d.totalPayable ?? 0;
    const paid = d.amountPaid  ?? 0;
    const bal  = d.balance     ?? (fees - paid);

    L.push(center('DUE NOTICE'));
    L.push(ln());
    L.push(row('Date     :', now));
    L.push(ln());
    L.push(row('Name     :', d.studentName));
    L.push(row('Smart ID :', '#' + d.smartId));
    L.push(row('Shift    :', d.shift ?? '-'));
    L.push(row('Seat     :', d.seat  ?? '-'));
    L.push(ln());
    L.push(rowRight('Total    :', `Rs.${fees.toLocaleString('en-IN')}`));
    L.push(rowRight('Paid     :', `Rs.${paid.toLocaleString('en-IN')}`));
    L.push(dln());
    L.push(center(`** DUE: Rs.${bal.toLocaleString('en-IN')} **`));
    L.push(dln());
    L.push(center(`Pay before: ${d.expiryDate ?? '-'}`));
    L.push('');
    L.push(center('Please clear dues to avoid'));
    L.push(center('seat suspension.'));
    L.push(ln());
    L.push(center('Library OS'));
  }

  L.push('');
  L.push('');

  return L.join('\n');
}

/**
 * Opens thermal-style print popup — 80mm monospace
 * Works with browser print dialog + physical thermal printers
 */
export function printThermal(data: ThermalBillData): void {
  const content = buildThermalContent(data);
  // Escape HTML special chars
  const safe = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Receipt — Library OS</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    html, body {
      width: 80mm;
      background: #fff;
      color: #000;
    }
    body {
      font-family: 'Courier New', Courier, monospace;
      font-size: 12px;
      line-height: 1.6;
      padding: 6mm 4mm 10mm 4mm;
    }
    pre {
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
      white-space: pre;
      word-break: break-all;
    }
    @page {
      size: 80mm auto;
      margin: 0;
    }
    @media print {
      html, body { width: 80mm; }
      body { padding: 2mm; }
    }
  </style>
</head>
<body>
<pre>${safe}</pre>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=340,height=640,scrollbars=yes,resizable=yes');
  if (win) {
    win.document.open();
    win.document.write(html);
    win.document.close();
    // Wait for fonts/layout to settle before printing
    win.onload = () => {
      setTimeout(() => {
        win.focus();
        win.print();
      }, 300);
    };
    // Fallback if onload doesn't fire
    setTimeout(() => {
      try { win.focus(); win.print(); } catch { /* already printed */ }
    }, 800);
  }
}

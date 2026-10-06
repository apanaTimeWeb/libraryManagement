// (Seats & Shifts)/admin_seats_shifts_lockers_components/gridTheme.ts
// ⚠️ NO hardcoded values here — all values come from seat_shift.css via CSS custom properties
import { themeQuartz } from 'ag-grid-community';

const v = (name: string): string =>
  typeof window !== 'undefined'
    ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    : '';

export const gridTheme = themeQuartz.withParams({
  backgroundColor:       'var(--bg-card)',
  foregroundColor:       'var(--text-primary)',
  headerBackgroundColor: 'var(--bg-glass)',
  headerTextColor:       'var(--text-secondary)',
  borderColor:           'var(--border)',
  rowBorder:             true,
  oddRowBackgroundColor: 'transparent',
  rowHoverColor:         'var(--bg-glass-hover)',
  fontFamily:            "'Inter', sans-serif",
  fontSize:              13,
  wrapperBorder:         false,
  wrapperBorderRadius:   0,
});

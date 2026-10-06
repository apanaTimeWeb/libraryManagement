// (finance)/admin_finance_components/gridTheme.ts
// ⚠️ NO hardcoded values here — all values come from finance.css via CSS custom properties
// Per features.md: "Zero JS files need to be touched" when changing AG Grid colors
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

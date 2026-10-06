// admin/admin_reusable_components/gridTheme.ts
// ⚠️ NO hardcoded values here — all values come from admin.css
import { themeQuartz } from 'ag-grid-community';

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

import { themeQuartz } from 'ag-grid-community';

const v = (name: string) =>
  typeof window !== 'undefined'
    ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    : '';

export const gridTheme = themeQuartz.withParams({
  backgroundColor:       v('--ag-bg'),
  foregroundColor:       v('--ag-fg'),
  headerBackgroundColor: v('--ag-header-bg'),
  headerTextColor:       v('--ag-header-text'),
  borderColor:           v('--ag-border'),
  rowBorder:             true,
  oddRowBackgroundColor: v('--ag-odd-row-bg'),
  rowHoverColor:         v('--ag-row-hover'),
  fontFamily:            v('--ag-font'),
  fontSize:              13,
  wrapperBorder:         false,
  wrapperBorderRadius:   0,
});

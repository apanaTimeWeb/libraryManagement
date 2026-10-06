export const SHIFT_TABS = ['All', 'Morning', 'Evening', 'Full Day'];

export const LEGEND_ITEMS = [
  { cls: 'ss-legend-dot--success',     label: 'Free' },
  { cls: 'ss-legend-dot--danger',      label: 'Occupied' },
  { cls: 'ss-legend-dot--warning',     label: 'Expiring ≤7 days' },
  { cls: 'ss-legend-dot--maintenance', label: 'Maintenance' },
];

export const SHIFT_BADGE: Record<string, string> = {
  Morning:  'ss-badge ss-badge--primary',
  Evening:  'ss-badge ss-badge--success',
  'Full Day':'ss-badge ss-badge--info',
};

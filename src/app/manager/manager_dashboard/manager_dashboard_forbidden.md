# Forbidden Patterns in Manager Dashboard

- **Do NOT** add module-specific operations (like student admission forms) directly into the dashboard. Link to the respective modules instead.
- **Do NOT** bypass `manager_dashboard_api.ts` to fetch data inline.
- **Do NOT** use full-page generic spinners; use skeleton loaders for the dashboard KPI cards and tables.
- **Do NOT** place any `useState` or `"use client"` in the root `page.tsx` file.

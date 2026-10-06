# Forbidden Patterns in Manager CRM

- **Do NOT** use `useState` for API data; strictly use `manager_crm_store.ts` (Zustand).
- **Do NOT** embed large form state logic in components; use `react-hook-form` paired with `zod`.
- **Do NOT** fetch API data inline within components. Use `useEnquiries.ts`.
- **Do NOT** mix Kanban view markup with Table view markup in a single file. Keep them completely separated in `_components`.

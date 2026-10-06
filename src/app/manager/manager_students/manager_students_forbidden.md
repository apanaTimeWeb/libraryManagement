# Forbidden Patterns in Manager Students

- **Do NOT** add global authentication logic here.
- **Do NOT** import dependencies or components from the billing/finance module directly; use shared utilities if necessary.
- **Do NOT** make inline API calls inside UI components. Always use `manager_students_api.ts` and a custom hook.
- **Do NOT** use native `<select>` for large datasets (use a searchable dropdown popover).
- **Do NOT** bypass the server component data fetching flow.

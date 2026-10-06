# Admin Module Forbidden Patterns

- **Do NOT** use barrel files (`index.ts`). Always use absolute imports directly to the file.
- **Do NOT** hardcode any URLs for `fetch`. Always use `admin_url_config.ts`.
- **Do NOT** define interfaces in component files. Put them in `admin_types/admin_types.ts`.
- **Do NOT** mix complex logic with JSX. If logic is complex, move it to `use[ComponentName].ts`.
- **Do NOT** use relative imports like `../../`. Use `@/app/admin/...`.
- **Do NOT** hardcode array data like `NAV` in `.tsx` files. Move to `admin_constants.ts`.

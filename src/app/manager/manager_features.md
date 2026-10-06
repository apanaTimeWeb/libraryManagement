# Library OS - Manager Features

## Directory Structure
The `manager` directory has been fully refactored into a strictly micro-modular, AI-friendly architecture based on the rules in `frontend_development_instruction.md`.

Every module (e.g. `manager_dashboard`, `manager_students`) contains isolated sub-folders:
- `[moduleName]_api/`: Dedicated API fetch logic, ensuring no inline fetch wrappers in components.
- `[moduleName]_components/`: View-only React components.
- `[moduleName]_hooks/`: Complex data fetching and multi-step state logic.
- `[moduleName]_types.ts`: Centralized interfaces for API payloads and component props.
- `[moduleName]_constants.ts`: Hardcoded dropdowns and default static data.
- `[moduleName]_forbidden.md`: Specific anti-patterns for the module.

## Centralized State & Flow
- **URLs**: All URLs are managed centrally in `manager_url_config.ts`. Do not hardcode strings.
- **Server vs Client**: Top-level `page.tsx` files are strictly Server Components containing `ErrorBoundary` wrappers. All interactive logic is delegated to `*Client.tsx` components.
- **Data Flow**: `API → Custom Hook → Client Component`. This guarantees Extreme Isolation.

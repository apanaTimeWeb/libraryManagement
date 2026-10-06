# Admin Module Architecture & Features Map

This document serves as the **AI-Context Map** (per Rule 13) for the completely refactored `admin` module. It defines the strict folder structure, data flow, and boundaries of this highly isolated Enterprise-Grade application shell.

## 📁 Directory Structure & Philosophy

The entire `admin` module is built on the philosophy of **Extreme Isolation**. Every sub-module (`admin_system`, `admin_crm`, etc.) operates as its own independent domain.

### Core Foundation (Root)
- `admin_url_config.ts`: The central registry for all routes and endpoints. **NO HARDCODED URLs** exist outside this file.
- `admin_api/admin_api.ts`: The dedicated API fetcher for the global admin shell.
- `admin_types/admin_types.ts`: Global TypeScript interfaces used across the shell.
- `admin_constants/admin_constants.ts`: Hardcoded layout data (Sidebar navigation, KPI lists).
- `admin_context/AdminContext.tsx`: The global state for the layout (e.g., branch selection).

### Sub-Module Blueprint (`admin_[featureName]`)
Every sub-module follows an identical, strict internal architecture. If you are instructed to modify the "System Settings", you only need to look inside `admin_system/`.

Each sub-module contains:
- `page.tsx` & `layout.tsx`: **Server Components** for initial data fetching and layout boundaries.
- `loading.tsx` & `error.tsx`: Native Next.js loading skeletons and error boundaries.
- `[modName]_api/`: Dedicated fetch functions isolated to this feature.
- `[modName]_types/`: Interfaces and Zod schemas (No `any` types).
- `[modName]_constants/`: Extracted dropdowns, default values, and magic strings.
- `[modName]_store/`: Zustand stores for managing asynchronous state (replacing prop-drilling).
- `[modName]_forbidden/`: A markdown file explaining what AI should *not* do in this module.

### Component Micro-Modularization (`_components/`)
Instead of a flat `components/` directory, every sub-module has a `[modName]_components/` folder. 
Inside this folder, every component has its own hyper-descriptive folder (e.g., `AdminSystemBadge/AdminSystemBadge.tsx`). 

## 🔄 Strict Data Flow Rules

1. **State Management**:
   - **React Context**: Used ONLY for synchronous, rare-changing UI state (like `AdminContext`).
   - **Zustand (`_store.ts`)**: Used for ALL async data, API responses, and heavy shared state.
   - **Local `useState`**: Used only for isolated component state (like a dropdown toggle).
2. **API Mutations**:
   - Do NOT use optimistic updates for destructive/financial actions. Wait for the `2xx` backend response, then update the Zustand store directly to trigger the UI update (Pessimistic UI).
3. **Responsibility Headers**:
   - Every `.tsx` file contains a `// RESPONSIBILITY:` and `// DATA FLOW:` header. Do not alter these without fundamentally changing the component's purpose.

## 🚫 AI Forbidden Patterns

1. **No Relative Imports**: Always use absolute paths (`@/app/admin/...`).
2. **No Inline Tailwind Colors**: Use CSS variables mapped in `tailwind.config.ts`.
3. **No Barrel Files**: Never use `index.ts`. Always import the exact file path.
4. **No Magic Strings**: Extract them to `_constants`.

---
*Future AI Sessions: When asked to build a new feature or fix a bug in the Admin panel, locate the specific `admin_[feature]` folder, strictly utilize its internal `_api`, `_types`, and `_components` folders, and never leak logic into the global root.*

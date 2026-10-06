# Forbidden Patterns in Manager Seats/Shifts/Lockers

- **Do NOT** use local `useState` for API fetching; always use `manager_seats_shifts_lockers_store.ts` (Zustand).
- **Do NOT** embed complex modal logic directly in the main page component. Extract Modals and Overlays into `_components`.
- **Do NOT** use inline styles or raw Tailwind color codes for the Seat Grid.

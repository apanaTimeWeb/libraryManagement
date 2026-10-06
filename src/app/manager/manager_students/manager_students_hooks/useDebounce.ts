import { useState, useEffect } from 'react';

// RESPONSIBILITY: Provides a debounced value for search inputs to prevent excessive re-renders/API calls.

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  // Refetch when value or delay changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

import { useState, useEffect, useMemo } from 'react';
import { useSeatsStore } from '../manager_seats_shifts_lockers_context/manager_seats_shifts_lockers_store';
import type { SeatData } from '../manager_seats_shifts_lockers_types';

/**
 * Custom hook to fetch and filter seat matrix data.
 * DATA FLOW: API → useSeatMatrix → SeatMatrixClient
 */
export function useSeatMatrix() {
  const { seatsData, status, error, fetchData } = useSeatsStore();
  
  const [activeTab, setActiveTab] = useState('All');
  const [selectedSeat, setSelectedSeat] = useState<SeatData | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Fetch data on mount if idle, dependencies included to satisfy linter
  useEffect(() => {
    if (status === 'idle') {
      fetchData();
    }
  }, [status, fetchData]);

  const visible = useMemo(() => {
    if (activeTab === 'All') return seatsData;
    return seatsData.filter(s => s.shift === activeTab || s.status === 'free' || s.status === 'maintenance');
  }, [seatsData, activeTab]);

  const freeCount = useMemo(() => visible.filter(s => s.status === 'free').length, [visible]);

  return {
    status,
    error,
    visible,
    freeCount,
    activeTab, setActiveTab,
    selectedSeat, setSelectedSeat,
    date, setDate
  };
}

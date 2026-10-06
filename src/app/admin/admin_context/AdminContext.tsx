'use client';

// RESPONSIBILITY: Provides global admin state like selectedBranch.
// DATA FLOW: AdminRoute -> AdminProvider -> Any Admin Component

import React, { createContext, useContext, useState, useMemo } from 'react';
import { AdminContextType } from '../admin_types/admin_types';

const AdminContext = createContext<AdminContextType>({
  selectedBranch: 'Main Branch',
  setSelectedBranch: () => {},
});

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [selectedBranch, setSelectedBranch] = useState('Main Branch');
  
  // Rule 66: Strict memoization for Contexts
  const contextValue = useMemo(() => ({
    selectedBranch,
    setSelectedBranch,
  }), [selectedBranch]);

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}

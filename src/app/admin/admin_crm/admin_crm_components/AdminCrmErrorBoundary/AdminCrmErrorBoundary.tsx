'use client';

// RESPONSIBILITY: Typed Error Boundary component specific to the admin_crm module.
// DATA FLOW: Error -> AdminCrmErrorBoundary -> Fallback UI

import React from 'react';

interface Props { children: React.ReactNode; }
interface State { hasError: boolean; }

export class AdminCrmErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="p-4 text-red-500">Module specific error occurred.</div>;
    return this.props.children;
  }
}

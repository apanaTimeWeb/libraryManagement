'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

// RESPONSIBILITY: Catches errors exclusively within the Manager CRM module.

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ManagerCrmErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Manager CRM:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-[var(--bg-card)] rounded-lg border border-[var(--border)]">
          <h2 className="text-[var(--danger)] text-xl font-bold mb-2">CRM Module Error</h2>
          <p className="text-[var(--text-secondary)] mb-4">{this.state.error?.message || 'An unexpected error occurred in the CRM module.'}</p>
          <button
            className="mgr-btn-primary"
            onClick={() => this.setState({ hasError: false, error: undefined })}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

'use client';

import { useRouter } from 'next/navigation';
import type { DashboardSeatData } from '../manager_dashboard_types';
import { SEAT_CLASS } from '../manager_dashboard_constants';
import { MANAGER_ROUTES } from '../../manager_url_config';

// RESPONSIBILITY: Renders the seat matrix visual grid and handles routing to student list with seat filter.

interface DashboardSeatMatrixProps {
  seatData: DashboardSeatData[];
}

export function DashboardSeatMatrix({ seatData }: DashboardSeatMatrixProps) {
  const router = useRouter();

  if (!seatData || seatData.length === 0) return null;

  return (
    <div className="mgr-card">
      <div className="mgr-card-header">
        <h2 className="mgr-section-title">Mini Seat Matrix — Today&apos;s Shifts</h2>
      </div>
      <div className="mgr-card-body">
        <div className="mgr-seat-grid">
          {seatData.map((seat) => (
            <div
              key={seat.id}
              className={`mgr-seat-cell ${SEAT_CLASS[seat.status] || ''}`}
              onClick={() => router.push(`${MANAGER_ROUTES.STUDENTS}?seat=${seat.id}`)}
            >
              {seat.id}
            </div>
          ))}
        </div>
        <div className="mgr-seat-legend">
          <div className="mgr-seat-legend-item">
            <div className="mgr-seat-legend-dot mgr-seat-legend-dot--available" />
            Available
          </div>
          <div className="mgr-seat-legend-item">
            <div className="mgr-seat-legend-dot mgr-seat-legend-dot--occupied" />
            Occupied
          </div>
          <div className="mgr-seat-legend-item">
            <div className="mgr-seat-legend-dot mgr-seat-legend-dot--expiring" />
            Expiring Soon
          </div>
        </div>
      </div>
    </div>
  );
}

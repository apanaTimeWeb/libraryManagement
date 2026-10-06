import { SeatMatrixClient } from '../manager_seats_shifts_lockers_components/SeatMatrixClient';
import { ManagerSeatsErrorBoundary } from '../manager_seats_shifts_lockers_components/ManagerSeatsErrorBoundary';

// RESPONSIBILITY: Strict Server Component for Seat Matrix.

export default function SeatMatrixPage() {
  return (
    <ManagerSeatsErrorBoundary>
      <SeatMatrixClient />
    </ManagerSeatsErrorBoundary>
  );
}

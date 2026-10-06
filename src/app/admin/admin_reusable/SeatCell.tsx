'use client';

interface SeatCellProps {
  id: string;
  status: 'free' | 'occupied' | 'expiring' | 'maintenance';
  occupant?: string;
  shift?: string;
  expiry?: string;
  onClick?: () => void;
}

/** Returns a CSS class name for the shift badge — no hex or inline colors */
function getShiftClass(shift: string): string {
  const map: Record<string, string> = {
    Morning: 'admin-shift-morning',
    Evening: 'admin-shift-evening',
    Night:   'admin-shift-night',
  };
  return map[shift] ?? 'admin-shift-default';
}

export default function SeatCell({ id, status, occupant, shift, expiry, onClick }: SeatCellProps) {
  return (
    <div
      className={`seat-${status} group relative w-16 h-16 rounded-xl flex items-center justify-center cursor-pointer transition-transform hover:scale-105`}
      onClick={onClick}
    >
      <span className="font-bold text-xs">{id}</span>

      {/* Tooltip — Name + Shift badge + Expires */}
      <div className="admin-seat-tooltip">
        {occupant ? (
          <>
            <span className="admin-seat-name">{occupant}</span>
            {shift && <span className={getShiftClass(shift)}>{shift}</span>}
            {expiry && (
              <span className={status === 'expiring' ? 'admin-seat-expiring' : 'admin-seat-expiry'}>
                Expires: {expiry}
              </span>
            )}
          </>
        ) : (
          <span className="admin-seat-empty">
            {status === 'free' ? 'Free — click to assign' : 'Under Maintenance'}
          </span>
        )}
      </div>
    </div>
  );
}

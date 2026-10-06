import { Phone, CalendarDays, CheckCircle, User, Clock } from 'lucide-react';
import { maskPhone } from '../reusable/types';
import type { Enquiry } from '../manager_crm_types';

// RESPONSIBILITY: Renders an individual Kanban card. No API calls.

function FollowUpBadge({ isOverdue, isToday, isUpcoming }: Pick<Enquiry, 'isOverdue' | 'isToday' | 'isUpcoming'>) {
  if (isOverdue) return <span className="crm-badge crm-badge--danger"><Clock size={10} /> Overdue</span>;
  if (isToday) return <span className="crm-badge crm-badge--warning"><Clock size={10} /> Today</span>;
  if (isUpcoming) return <span className="crm-badge crm-badge--success"><Clock size={10} /> Upcoming</span>;
  return null;
}

interface KanbanCardProps {
  enq: Enquiry;
  colClass: string;
  onClick: () => void;
}

export function KanbanCard({ enq, colClass, onClick }: KanbanCardProps) {
  return (
    <div className={`crm-kanban-card ${colClass}`} onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClick()}>
      <div className="crm-card-name-block">
        <p className="crm-card-name">{enq.name}</p>
        <p className="crm-card-phone">
          <Phone size={11} />
          {maskPhone(enq.phone)}
        </p>
      </div>
      <div className="crm-card-badges">
        <span className="crm-badge crm-badge--info">{enq.shift}</span>
        <FollowUpBadge isOverdue={enq.isOverdue} isToday={enq.isToday} isUpcoming={enq.isUpcoming} />
      </div>
      <div className="crm-card-footer">
        <span className="crm-card-footer-item"><CalendarDays size={11} />{enq.addedDate}</span>
        {enq.convertedDate && (
          <span className="crm-card-footer-converted"><CheckCircle size={11} />{enq.convertedDate}</span>
        )}
        <span className="crm-card-footer-item"><User size={11} />{enq.handledBy.split(' ')[0]}</span>
      </div>
    </div>
  );
}

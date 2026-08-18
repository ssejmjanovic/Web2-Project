import { Clock, MapPin, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Activity, ActivityStatus } from '../../models/travel';
import { formatCurrency } from '../../utils/format';

const statusStyles: Record<ActivityStatus, string> = {
  Planned: 'bg-sky-light text-sky-deep',
  Reserved: 'bg-amber-100 text-amber-700',
  Completed: 'bg-grass-light text-grass-deep',
  Cancelled: 'bg-red-100 text-red-700',
};

interface ActivityItemProps {
  activity: Activity;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ActivityItem({ activity, onEdit, onDelete }: ActivityItemProps) {
  return (
    <div className="rounded-xl border border-sky-aero/25 bg-white/60 p-3 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-display font-bold text-ink">{activity.name}</h4>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${statusStyles[activity.status]}`}
          >
            {activity.status}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-ink-light mt-1 flex-wrap">
          {activity.time && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-aero" />
              {activity.time}
            </span>
          )}

          {activity.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-grass" />
              {activity.location}
            </span>
          )}

          {activity.estimatedCost !== null && (
            <span>{formatCurrency(activity.estimatedCost)}</span>
          )}
        </div>

        {activity.description && (
          <p className="text-sm text-ink-light mt-1">{activity.description}</p>
        )}
      </div>

      <div className="flex gap-2 shrink-0">
        {onEdit && (
          <Button variant="secondary" onClick={onEdit} className="px-3 py-1.5">
            <Pencil className="w-4 h-4" />
          </Button>
        )}
        {onDelete && (
          <Button variant="danger" onClick={onDelete} className="px-3 py-1.5">
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
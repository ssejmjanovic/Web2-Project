import { CalendarDays, Trash2, User as UserIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import type { TravelPlanSummary } from '../../models/travel';
import { formatCurrency, formatDate } from '../../utils/format';

interface AdminPlanRowProps {
    plan: TravelPlanSummary;
    ownerLabel: string;
    busy: boolean;
    onDelete: () => void;
}

export function AdminPlanRow({ plan, ownerLabel, busy, onDelete }: AdminPlanRowProps) {
  return (
    <div className="rounded-xl border border-sky-aero/25 bg-white/60 p-3 flex items-center justify-between gap-3 flex-wrap">
      <div className="min-w-0">
        <h4 className="font-display font-bold text-ink">{plan.name}</h4>

        <p className="flex items-center gap-1.5 text-xs text-ink-light mt-1">
          <UserIcon className="w-3.5 h-3.5 text-grass" />
          {ownerLabel}
        </p>

        <p className="flex items-center gap-1.5 text-xs text-ink-light mt-0.5">
          <CalendarDays className="w-3.5 h-3.5 text-sky-aero" />
          {formatDate(plan.startDate)} — {formatDate(plan.endDate)} ·{' '}
          {plan.destinationCount} destinations · {plan.activityCount} activities
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs text-ink-light">
          {formatCurrency(plan.totalExpenses)} / {formatCurrency(plan.budget)}
        </span>

        <Button
          variant="danger"
          onClick={onDelete}
          disabled={busy}
          className="px-3 py-1.5"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
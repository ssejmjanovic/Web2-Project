import { CalendarDays, Trash2, Wallet } from 'lucide-react';
import { Button } from '../ui/Button';
import type { TravelPlan } from '../../models/travel';
import { formatCurrency, formatDate } from '../../utils/format';

interface PlanHeaderProps {
  plan: TravelPlan;
  onDelete: () => void;
}

export function PlanHeader({ plan, onDelete }: PlanHeaderProps) {
  return (
    <div className="glass-card p-6 mb-6">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h1 className="font-display text-2xl font-black text-sky-deep">
            {plan.name}
          </h1>
          {plan.description && (
            <p className="text-sm text-ink-light mt-1">{plan.description}</p>
          )}
        </div>

        <Button variant="danger" onClick={onDelete} className="px-3 py-1.5 shrink-0">
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-ink-light mb-4">
        <CalendarDays className="w-4 h-4 text-sky-aero" />
        {formatDate(plan.startDate)} — {formatDate(plan.endDate)}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Budget" value={formatCurrency(plan.budget)} />
        <Stat label="Spent" value={formatCurrency(plan.totalExpenses)} />
        <Stat
          label="Remaining"
          value={formatCurrency(plan.remainingBudget)}
          highlight={plan.remainingBudget < 0}
        />
      </div>

      {plan.notes && (
        <p className="text-sm text-ink-light mt-4 border-t border-sky-aero/20 pt-3">
          {plan.notes}
        </p>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl bg-white/60 border border-sky-aero/20 px-3 py-2">
      <div className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-ink-light">
        <Wallet className="w-3 h-3" />
        {label}
      </div>
      <div
        className={`font-display font-black ${highlight ? 'text-red-600' : 'text-sky-deep'}`}
      >
        {value}
      </div>
    </div>
  );
}
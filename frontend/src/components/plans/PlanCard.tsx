import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Wallet } from 'lucide-react';
import type { TravelPlanSummary } from '../../models/travel';
import { formatCurrency, formatDate } from '../../utils/format';

export function PlanCard({ plan }: { plan: TravelPlanSummary }) {
  const spentPercent =
    plan.budget > 0
      ? Math.min(100, Math.round((plan.totalExpenses / plan.budget) * 100))
      : 0;

  return (
    <Link
      to={`/travel-plans/${plan.id}`}
      className="glass-card block p-5 transition-transform hover:-translate-y-0.5"
    >
      <h3 className="font-display font-black text-lg text-sky-deep mb-1">
        {plan.name}
      </h3>

      {plan.description && (
        <p className="text-sm text-ink-light mb-3 line-clamp-2">{plan.description}</p>
      )}

      <div className="flex items-center gap-1.5 text-xs text-ink-light mb-1">
        <CalendarDays className="w-3.5 h-3.5 text-sky-aero" />
        {formatDate(plan.startDate)} — {formatDate(plan.endDate)}
      </div>

      <div className="flex items-center gap-1.5 text-xs text-ink-light mb-3">
        <MapPin className="w-3.5 h-3.5 text-grass" />
        {plan.destinationCount} destinations · {plan.activityCount} activities
      </div>

      <div className="flex items-center justify-between text-xs mb-1">
        <span className="flex items-center gap-1.5 text-ink-light">
          <Wallet className="w-3.5 h-3.5 text-sky-aero" />
          {formatCurrency(plan.totalExpenses)} of {formatCurrency(plan.budget)}
        </span>
        <span
          className={plan.remainingBudget < 0 ? 'text-red-600 font-bold' : 'text-grass-deep'}
        >
          {formatCurrency(plan.remainingBudget)} left
        </span>
      </div>

      <div className="h-1.5 rounded-full bg-chrome overflow-hidden">
        <div
          className={`h-full ${spentPercent >= 100 ? 'bg-red-500' : 'bg-sky-aero'}`}
          style={{ width: `${spentPercent}%` }}
        />
      </div>
    </Link>
  );
}
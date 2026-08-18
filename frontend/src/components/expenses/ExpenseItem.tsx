import { CalendarDays, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Expense } from '../../models/travel';
import { formatCurrency, formatDate } from '../../utils/format';

interface ExpenseItemProps {
  expense: Expense;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
  return (
    <div className="rounded-xl border border-sky-aero/25 bg-white/60 p-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-display font-bold text-ink">{expense.name}</h4>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-light text-sky-deep">
            {expense.category}
          </span>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-ink-light mt-1">
          <CalendarDays className="w-3.5 h-3.5 text-sky-aero" />
          {formatDate(expense.date)}
        </p>

        {expense.description && (
          <p className="text-sm text-ink-light mt-1">{expense.description}</p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="font-display font-black text-sky-deep">
          {formatCurrency(expense.amount)}
        </span>

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
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseItem } from './ExpenseItem';
import { Button } from '../ui/Button';
import type { Expense, ExpenseInput } from '../../models/travel';
import { expenseService } from '../../services/expenseService';
import { formatCurrency } from '../../utils/format';
import { getErrorMessage } from '../../utils/getErrorMessage';

interface ExpensesTabProps {
  planId: number;
  expenses: Expense[];
  totalExpenses: number;
  remainingBudget: number;
  onChanged: () => void;
}

function toInput(expense: Expense): ExpenseInput {
  return {
    name: expense.name,
    category: expense.category,
    amount: expense.amount,
    date: expense.date.slice(0, 10),
    description: expense.description ?? '',
  };
}

function totalsByCategory(expenses: Expense[]): { category: string; total: number }[] {
  const totals: Record<string, number> = {};

  for (const expense of expenses) {
    totals[expense.category] = (totals[expense.category] ?? 0) + expense.amount;
  }

  return Object.entries(totals)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

export function ExpensesTab({
  planId,
  expenses,
  totalExpenses,
  remainingBudget,
  onChanged,
}: ExpensesTabProps) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categoryTotals = totalsByCategory(expenses);

  const handleCreate = async (values: ExpenseInput) => {
    await expenseService.create(planId, values);
    setAdding(false);
    onChanged();
  };

  const handleUpdate = async (id: number, values: ExpenseInput) => {
    await expenseService.update(planId, id, values);
    setEditingId(null);
    onChanged();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this expense?')) {
      return;
    }

    try {
      await expenseService.remove(planId, id);
      onChanged();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-black text-sky-deep">Expenses</h3>

        {!adding && (
          <Button onClick={() => setAdding(true)} className="px-4 py-2 text-sm">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/60 border border-sky-aero/20 px-4 py-3">
          <p className="text-[11px] uppercase tracking-wide text-ink-light">Total spent</p>
          <p className="font-display font-black text-sky-deep text-lg">
            {formatCurrency(totalExpenses)}
          </p>
        </div>

        <div className="rounded-xl bg-white/60 border border-sky-aero/20 px-4 py-3">
          <p className="text-[11px] uppercase tracking-wide text-ink-light">Remaining</p>
          <p
            className={`font-display font-black text-lg ${
              remainingBudget < 0 ? 'text-red-600' : 'text-grass-deep'
            }`}
          >
            {formatCurrency(remainingBudget)}
          </p>
        </div>
      </div>

      {categoryTotals.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categoryTotals.map((entry) => (
            <span
              key={entry.category}
              className="text-xs rounded-full bg-sky-light text-sky-deep px-3 py-1"
            >
              {entry.category}: <strong>{formatCurrency(entry.total)}</strong>
            </span>
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {adding && (
        <ExpenseForm
          submitLabel="Add expense"
          onSubmit={handleCreate}
          onCancel={() => setAdding(false)}
        />
      )}

      {expenses.length === 0 && !adding && (
        <p className="text-sm text-ink-light py-4 text-center">No expenses yet.</p>
      )}

      <div className="flex flex-col gap-2">
        {expenses.map((expense) =>
          editingId === expense.id ? (
            <ExpenseForm
              key={expense.id}
              initialValues={toInput(expense)}
              submitLabel="Save changes"
              onSubmit={(values) => handleUpdate(expense.id, values)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onEdit={() => setEditingId(expense.id)}
              onDelete={() => handleDelete(expense.id)}
            />
          ),
        )}
      </div>
    </div>
  );
}
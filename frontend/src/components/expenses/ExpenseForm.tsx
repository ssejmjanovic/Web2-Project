import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { TextArea } from '../ui/TextArea';
import type { ExpenseCategory, ExpenseInput } from '../../models/travel';
import { getErrorMessage } from '../../utils/getErrorMessage';

const emptyExpense: ExpenseInput = {
  name: '',
  category: 'Other',
  amount: 0,
  date: '',
  description: '',
};

const categoryOptions: { value: ExpenseCategory; label: string }[] = [
  { value: 'Transport', label: 'Transport' },
  { value: 'Accommodation', label: 'Accommodation' },
  { value: 'Food', label: 'Food' },
  { value: 'Tickets', label: 'Tickets' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Other', label: 'Other' },
];

interface ExpenseFormProps {
  initialValues?: ExpenseInput;
  submitLabel: string;
  onSubmit: (values: ExpenseInput) => Promise<void>;
  onCancel: () => void;
}

export function ExpenseForm({
  initialValues = emptyExpense,
  submitLabel,
  onSubmit,
  onCancel,
}: ExpenseFormProps) {
  const [form, setForm] = useState<ExpenseInput>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: name === 'amount' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (form.amount <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit(form);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-sky-aero/30 bg-white/60 p-4 flex flex-col gap-3"
    >
      <Input
        label="Expense"
        name="name"
        required
        maxLength={200}
        value={form.name}
        onChange={handleChange}
      />

      <div className="grid sm:grid-cols-3 gap-3">
        <Select
          label="Category"
          name="category"
          options={categoryOptions}
          value={form.category}
          onChange={handleChange}
        />
        <Input
          label="Amount (EUR)"
          name="amount"
          type="number"
          min={0.01}
          step={0.01}
          required
          value={form.amount}
          onChange={handleChange}
        />
        <Input
          label="Date"
          name="date"
          type="date"
          required
          value={form.date}
          onChange={handleChange}
        />
      </div>

      <TextArea
        label="Description"
        name="description"
        maxLength={1000}
        value={form.description}
        onChange={handleChange}
      />

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
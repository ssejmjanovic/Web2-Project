import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import type { TravelPlanInput } from '../../models/travel';
import { getErrorMessage } from '../../utils/getErrorMessage';

const emptyPlan: TravelPlanInput = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  budget: 0,
  notes: '',
};

interface PlanFormProps {
  initialValues?: TravelPlanInput;
  submitLabel: string;
  onSubmit: (values: TravelPlanInput) => Promise<void>;
  onCancel?: () => void;
}

export function PlanForm({
  initialValues = emptyPlan,
  submitLabel,
  onSubmit,
  onCancel,
}: PlanFormProps) {
  const [form, setForm] = useState<TravelPlanInput>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: name === 'budget' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (form.endDate < form.startDate) {
      setError('End date cannot be before start date.');
      return;
    }

    if (form.budget < 0) {
      setError('Budget cannot be negative.');
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
    <form onSubmit={handleSubmit} className="glass-card p-6 flex flex-col gap-4">
      <Input
        label="Trip name"
        name="name"
        required
        maxLength={200}
        value={form.name}
        onChange={handleChange}
      />

      <TextArea
        label="Description"
        name="description"
        maxLength={2000}
        value={form.description}
        onChange={handleChange}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start date"
          name="startDate"
          type="date"
          required
          value={form.startDate}
          onChange={handleChange}
        />

        <Input
          label="End date"
          name="endDate"
          type="date"
          required
          value={form.endDate}
          onChange={handleChange}
        />
      </div>

      <Input
        label="Budget (EUR)"
        name="budget"
        type="number"
        min={0}
        step={0.01}
        required
        value={form.budget}
        onChange={handleChange}
      />

      <TextArea
        label="Notes"
        name="notes"
        maxLength={2000}
        value={form.notes}
        onChange={handleChange}
      />

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}

        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
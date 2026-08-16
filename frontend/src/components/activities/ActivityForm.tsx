import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { TextArea } from '../ui/TextArea';
import type { ActivityInput, ActivityStatus } from '../../models/travel';
import { getErrorMessage } from '../../utils/getErrorMessage';

const emptyActivity: ActivityInput = {
  name: '',
  date: '',
  time: null,
  location: '',
  description: '',
  estimatedCost: null,
  status: 'Planned',
};

const statusOptions: { value: ActivityStatus; label: string }[] = [
  { value: 'Planned', label: 'Planned' },
  { value: 'Reserved', label: 'Reserved' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

interface ActivityFormProps {
  initialValues?: ActivityInput;
  submitLabel: string;
  onSubmit: (values: ActivityInput) => Promise<void>;
  onCancel: () => void;
}

export function ActivityForm({
  initialValues = emptyActivity,
  submitLabel,
  onSubmit,
  onCancel,
}: ActivityFormProps) {
  const [form, setForm] = useState<ActivityInput>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === 'estimatedCost'
          ? value === ''
            ? null
            : Number(value)
          : name === 'time'
            ? value === ''
              ? null
              : value
            : value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
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
        label="Activity"
        name="name"
        required
        maxLength={200}
        value={form.name}
        onChange={handleChange}
      />

      <div className="grid sm:grid-cols-2 gap-3">
        <Input
          label="Date"
          name="date"
          type="date"
          required
          value={form.date}
          onChange={handleChange}
        />
        <Input
          label="Time (optional)"
          name="time"
          type="time"
          value={form.time ?? ''}
          onChange={handleChange}
        />
        <Input
          label="Location"
          name="location"
          maxLength={300}
          value={form.location}
          onChange={handleChange}
        />
        <Input
          label="Estimated cost (optional)"
          name="estimatedCost"
          type="number"
          min={0}
          step={0.01}
          value={form.estimatedCost ?? ''}
          onChange={handleChange}
        />
      </div>

      <Select
        label="Status"
        name="status"
        options={statusOptions}
        value={form.status}
        onChange={handleChange}
      />

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
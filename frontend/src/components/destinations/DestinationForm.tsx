import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import type { DestinationInput } from '../../models/travel';
import { getErrorMessage } from '../../utils/getErrorMessage';

const emptyDestination: DestinationInput = {
  name: '',
  location: '',
  arrivalDate: '',
  departureDate: '',
  description: '',
  notes: '',
};

interface DestinationFormProps {
  initialValues?: DestinationInput;
  submitLabel: string;
  onSubmit: (values: DestinationInput) => Promise<void>;
  onCancel: () => void;
}

export function DestinationForm({
  initialValues = emptyDestination,
  submitLabel,
  onSubmit,
  onCancel,
}: DestinationFormProps) {
  const [form, setForm] = useState<DestinationInput>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (form.departureDate < form.arrivalDate) {
      setError('Departure date cannot be before arrival date.');
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
      <div className="grid sm:grid-cols-2 gap-3">
        <Input
          label="Name"
          name="name"
          required
          maxLength={200}
          value={form.name}
          onChange={handleChange}
        />
        <Input
          label="Location"
          name="location"
          required
          maxLength={300}
          value={form.location}
          onChange={handleChange}
        />
        <Input
          label="Arrival"
          name="arrivalDate"
          type="date"
          required
          value={form.arrivalDate}
          onChange={handleChange}
        />
        <Input
          label="Departure"
          name="departureDate"
          type="date"
          required
          value={form.departureDate}
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
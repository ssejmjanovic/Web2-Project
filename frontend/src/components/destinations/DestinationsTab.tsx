import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DestinationForm } from './DestinationForm';
import { DestinationItem } from './DestinationItem';
import { Button } from '../ui/Button';
import type { Destination, DestinationInput } from '../../models/travel';
import { destinationService } from '../../services/destinationService';
import { getErrorMessage } from '../../utils/getErrorMessage';

interface DestinationsTabProps {
  planId: number;
  destinations: Destination[];
  onChanged: () => void;
}

function toInput(destination: Destination): DestinationInput {
  return {
    name: destination.name,
    location: destination.location,
    arrivalDate: destination.arrivalDate.slice(0, 10),
    departureDate: destination.departureDate.slice(0, 10),
    description: destination.description ?? '',
    notes: destination.notes ?? '',
  };
}

export function DestinationsTab({ planId, destinations, onChanged }: DestinationsTabProps) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (values: DestinationInput) => {
    await destinationService.create(planId, values);
    setAdding(false);
    onChanged();
  };

  const handleUpdate = async (id: number, values: DestinationInput) => {
    await destinationService.update(planId, id, values);
    setEditingId(null);
    onChanged();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this destination?')) {
      return;
    }

    try {
      await destinationService.remove(planId, id);
      onChanged();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="glass-card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-black text-sky-deep">Destinations</h3>

        {!adding && (
          <Button onClick={() => setAdding(true)} className="px-4 py-2 text-sm">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {adding && (
        <DestinationForm
          submitLabel="Add destination"
          onSubmit={handleCreate}
          onCancel={() => setAdding(false)}
        />
      )}

      {destinations.length === 0 && !adding && (
        <p className="text-sm text-ink-light py-4 text-center">
          No destinations yet.
        </p>
      )}

      {destinations.map((destination) =>
        editingId === destination.id ? (
          <DestinationForm
            key={destination.id}
            initialValues={toInput(destination)}
            submitLabel="Save changes"
            onSubmit={(values) => handleUpdate(destination.id, values)}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <DestinationItem
            key={destination.id}
            destination={destination}
            onEdit={() => setEditingId(destination.id)}
            onDelete={() => handleDelete(destination.id)}
          />
        ),
      )}
    </div>
  );
}
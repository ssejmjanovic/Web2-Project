import { useState } from 'react';
import type { FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { ChecklistItemRow } from './ChecklistItemRow';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { ChecklistItem } from '../../models/travel';
import { checklistService } from '../../services/checklistService';
import { getErrorMessage } from '../../utils/getErrorMessage';

interface ChecklistTabProps {
  planId: number;
  items: ChecklistItem[];
  onChanged: () => void;
}

export function ChecklistTab({ planId, items, onChanged }: ChecklistTabProps) {
  const [newItemName, setNewItemName] = useState('');
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const completedCount = items.filter((item) => item.isCompleted).length;
  const percent = items.length > 0
    ? Math.round((completedCount / items.length) * 100)
    : 0;

  const handleAdd = async (event: FormEvent) => {
    event.preventDefault();

    const name = newItemName.trim();

    if (!name) {
      return;
    }

    setAdding(true);
    setError(null);

    try {
      await checklistService.create(planId, { name, isCompleted: false });
      setNewItemName('');
      onChanged();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (item: ChecklistItem) => {
    setBusyId(item.id);
    setError(null);

    try {
      await checklistService.update(planId, item.id, {
        name: item.name,
        isCompleted: !item.isCompleted,
      });
      onChanged();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this item?')) {
      return;
    }

    try {
      await checklistService.remove(planId, id);
      onChanged();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display font-black text-sky-deep">Checklist</h3>
        <span className="text-xs text-ink-light">
          {completedCount} of {items.length} done
        </span>
      </div>

      <div className="h-2 rounded-full bg-chrome overflow-hidden">
        <div
          className="h-full bg-grass transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <form onSubmit={handleAdd} className="flex items-end gap-2">
        <Input
          label="New item"
          maxLength={300}
          placeholder="Passport, travel insurance, charger..."
          value={newItemName}
          onChange={(event) => setNewItemName(event.target.value)}
          className="flex-1"
        />

        <Button type="submit" disabled={adding} className="px-4 py-2.5 shrink-0">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </form>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {items.length === 0 && (
        <p className="text-sm text-ink-light py-4 text-center">
          Nothing on the list yet.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <ChecklistItemRow
            key={item.id}
            item={item}
            busy={busyId === item.id}
            onToggle={() => handleToggle(item)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
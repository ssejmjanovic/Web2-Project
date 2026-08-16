import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ActivityForm } from './ActivityForm';
import { ActivityItem } from './ActivityItem';
import { Button } from '../ui/Button';
import type { Activity, ActivityInput } from '../../models/travel';
import { activityService } from '../../services/activityService';
import { formatDate } from '../../utils/format';
import { getErrorMessage } from '../../utils/getErrorMessage';

interface ActivitiesTabProps {
  planId: number;
  activities: Activity[];
  onChanged: () => void;
}

function toInput(activity: Activity): ActivityInput {
  return {
    name: activity.name,
    date: activity.date.slice(0, 10),
    time: activity.time,
    location: activity.location ?? '',
    description: activity.description ?? '',
    estimatedCost: activity.estimatedCost,
    status: activity.status,
  };
}

function groupByDay(activities: Activity[]): Record<string, Activity[]> {
  const grouped: Record<string, Activity[]> = {};

  for (const activity of activities) {
    const day = activity.date.slice(0, 10);

    if (!grouped[day]) {
      grouped[day] = [];
    }

    grouped[day].push(activity);
  }

  return grouped;
}

export function ActivitiesTab({ planId, activities, onChanged }: ActivitiesTabProps) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const grouped = groupByDay(activities);
  const days = Object.keys(grouped).sort();

  const handleCreate = async (values: ActivityInput) => {
    await activityService.create(planId, values);
    setAdding(false);
    onChanged();
  };

  const handleUpdate = async (id: number, values: ActivityInput) => {
    await activityService.update(planId, id, values);
    setEditingId(null);
    onChanged();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this activity?')) {
      return;
    }

    try {
      await activityService.remove(planId, id);
      onChanged();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-black text-sky-deep">Activities by day</h3>

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
        <ActivityForm
          submitLabel="Add activity"
          onSubmit={handleCreate}
          onCancel={() => setAdding(false)}
        />
      )}

      {days.length === 0 && !adding && (
        <p className="text-sm text-ink-light py-4 text-center">No activities yet.</p>
      )}

      {days.map((day) => (
        <div key={day}>
          <h4 className="font-display font-bold text-sm text-sky-deep mb-2">
            {formatDate(day)}
          </h4>

          <div className="flex flex-col gap-2">
            {grouped[day].map((activity) =>
              editingId === activity.id ? (
                <ActivityForm
                  key={activity.id}
                  initialValues={toInput(activity)}
                  submitLabel="Save changes"
                  onSubmit={(values) => handleUpdate(activity.id, values)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  onEdit={() => setEditingId(activity.id)}
                  onDelete={() => handleDelete(activity.id)}
                />
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
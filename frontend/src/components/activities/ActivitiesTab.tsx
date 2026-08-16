import { useState } from 'react';
import { ActivityForm } from './ActivityForm';
import { ActivityItem } from './ActivityItem';
import { Button } from '../ui/Button';
import type { Activity, ActivityInput } from '../../models/travel';
import { activityService } from '../../services/activityService';
import { formatDate } from '../../utils/format';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { CalendarDays, List, Plus } from 'lucide-react';
import { ActivityCalendar } from './ActivityCalendar';

interface ActivitiesTabProps {
  planId: number;
  activities: Activity[];
  planStartDate: string;
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

export function ActivitiesTab({ planId, activities, planStartDate, onChanged }: ActivitiesTabProps) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');

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
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="font-display font-black text-sky-deep">
          {view === 'list' ? 'Activities by day' : 'Calendar'}
        </h3>

        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-sky-aero/30 bg-white/60 p-0.5">
            <button
              type="button"
              onClick={() => setView('list')}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                view === 'list' ? 'btn-aero' : 'text-ink-light'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              List
            </button>

            <button
              type="button"
              onClick={() => setView('calendar')}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                view === 'calendar' ? 'btn-aero' : 'text-ink-light'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              Calendar
            </button>
          </div>

          {!adding && (
            <Button onClick={() => setAdding(true)} className="px-4 py-2 text-sm">
              <Plus className="w-4 h-4" />
              Add
            </Button>
          )}
        </div>
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

      {view === 'calendar' ? (
        <ActivityCalendar activities={activities} initialMonth={planStartDate} />
      ) : (
        <>
          {days.length === 0 && !adding && (
            <p className="text-sm text-ink-light py-4 text-center">
              No activities yet.
            </p>
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
        </>
      )}
    </div>
  );
}
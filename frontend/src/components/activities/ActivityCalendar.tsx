import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import type { Activity } from '../../models/travel';

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface ActivityCalendarProps {
  activities: Activity[];
  initialMonth: string;
}

export function ActivityCalendar({ activities, initialMonth }: ActivityCalendarProps) {
  const [month, setMonth] = useState<Date>(() => startOfMonth(parseISO(initialMonth)));

  const gridStart = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const activitiesForDay = (day: Date) =>
    activities.filter((activity) => isSameDay(parseISO(activity.date), day));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMonth(subMonths(month, 1))}
          className="rounded-full border border-sky-aero/30 bg-white/60 p-1.5 hover:bg-white"
        >
          <ChevronLeft className="w-4 h-4 text-sky-deep" />
        </button>

        <h4 className="font-display font-black text-sky-deep">
          {format(month, 'MMMM yyyy')}
        </h4>

        <button
          type="button"
          onClick={() => setMonth(addMonths(month, 1))}
          className="rounded-full border border-sky-aero/30 bg-white/60 p-1.5 hover:bg-white"
        >
          <ChevronRight className="w-4 h-4 text-sky-deep" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekdayLabels.map((label) => (
          <div
            key={label}
            className="text-[11px] font-bold text-ink-light text-center uppercase"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayActivities = activitiesForDay(day);
          const inMonth = isSameMonth(day, month);

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[84px] rounded-lg border p-1.5 ${
                inMonth
                  ? 'bg-white/60 border-sky-aero/20'
                  : 'bg-white/20 border-transparent opacity-50'
              }`}
            >
              <div className="text-xs font-bold text-ink-light mb-1">
                {format(day, 'd')}
              </div>

              <div className="flex flex-col gap-1">
                {dayActivities.slice(0, 3).map((activity) => (
                  <div
                    key={activity.id}
                    title={activity.name}
                    className="truncate rounded bg-sky-light px-1 py-0.5 text-[10px] text-sky-deep"
                  >
                    {activity.time ? `${activity.time} ` : ''}
                    {activity.name}
                  </div>
                ))}

                {dayActivities.length > 3 && (
                  <span className="text-[10px] text-ink-light">
                    +{dayActivities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
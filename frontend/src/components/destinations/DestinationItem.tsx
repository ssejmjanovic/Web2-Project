import { CalendarDays, MapPin, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Destination } from '../../models/travel';
import { formatDate } from '../../utils/format';

interface DestinationItemProps {
  destination: Destination;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function DestinationItem({ destination, onEdit, onDelete }: DestinationItemProps) {
  return (
    <div className="rounded-xl border border-sky-aero/25 bg-white/60 p-4 flex items-start justify-between gap-4">
      <div>
        <h4 className="font-display font-bold text-ink">{destination.name}</h4>

        <p className="flex items-center gap-1.5 text-xs text-ink-light mt-1">
          <MapPin className="w-3.5 h-3.5 text-grass" />
          {destination.location}
        </p>

        <p className="flex items-center gap-1.5 text-xs text-ink-light mt-1">
          <CalendarDays className="w-3.5 h-3.5 text-sky-aero" />
          {formatDate(destination.arrivalDate)} — {formatDate(destination.departureDate)}
        </p>

        {destination.description && (
          <p className="text-sm text-ink-light mt-2">{destination.description}</p>
        )}
      </div>

      <div className="flex gap-2 shrink-0">
        {onEdit && (
          <Button variant="secondary" onClick={onEdit} className="px-3 py-1.5">
            <Pencil className="w-4 h-4" />
          </Button>
        )}
        {onDelete && (
          <Button variant="danger" onClick={onDelete} className="px-3 py-1.5">
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
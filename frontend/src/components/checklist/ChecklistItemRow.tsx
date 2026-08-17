import { CheckSquare, Square, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import type { ChecklistItem } from '../../models/travel';

interface ChecklistItemRowProps {
  item: ChecklistItem;
  busy: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export function ChecklistItemRow({
  item,
  busy,
  onToggle,
  onDelete,
}: ChecklistItemRowProps) {
  return (
    <div className="rounded-xl border border-sky-aero/25 bg-white/60 p-3 flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onToggle}
        disabled={busy}
        className="flex items-center gap-2 text-left min-w-0 disabled:opacity-50"
      >
        {item.isCompleted ? (
          <CheckSquare className="w-5 h-5 text-grass shrink-0" />
        ) : (
          <Square className="w-5 h-5 text-chrome-dark shrink-0" />
        )}

        <span
          className={`text-sm ${
            item.isCompleted ? 'line-through text-ink-light' : 'text-ink'
          }`}
        >
          {item.name}
        </span>
      </button>

      <Button variant="danger" onClick={onDelete} className="px-3 py-1.5 shrink-0">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
import { Loader2 } from 'lucide-react';

export function Spinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-ink-light">
      <Loader2 className="w-5 h-5 animate-spin text-sky-aero" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
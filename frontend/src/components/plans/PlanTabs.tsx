import { CalendarDays, CheckSquare, MapPin, Wallet } from 'lucide-react';

export type PlanTabKey = 'destinations' | 'activities' | 'expenses' | 'checklist';

const tabs: { key: PlanTabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'destinations', label: 'Destinations', icon: <MapPin className="w-4 h-4" /> },
  { key: 'activities', label: 'Activities', icon: <CalendarDays className="w-4 h-4" /> },
  { key: 'expenses', label: 'Expenses', icon: <Wallet className="w-4 h-4" /> },
  { key: 'checklist', label: 'Checklist', icon: <CheckSquare className="w-4 h-4" /> },
];

interface PlanTabsProps {
  active: PlanTabKey;
  onChange: (tab: PlanTabKey) => void;
}

export function PlanTabs({ active, onChange }: PlanTabsProps) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-display font-bold whitespace-nowrap transition-all ${
            active === tab.key
              ? 'btn-aero'
              : 'bg-white/60 text-ink-light border border-sky-aero/25 hover:bg-white'
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
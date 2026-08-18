import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Eye, Pencil, Plane } from 'lucide-react';
import { ActivitiesTab } from '../components/activities/ActivitiesTab';
import { ChecklistTab } from '../components/checklist/ChecklistTab';
import { DestinationsTab } from '../components/destinations/DestinationsTab';
import { ExpensesTab } from '../components/expenses/ExpensesTab';
import { PlanHeader } from '../components/plans/PlanHeader';
import { PlanTabs } from '../components/plans/PlanTabs';
import type { PlanTabKey } from '../components/plans/PlanTabs';
import { Spinner } from '../components/ui/Spinner';
import type { ShareAccessLevel } from '../models/sharing';
import type { TravelPlan } from '../models/travel';
import { setActiveShareToken } from '../services/shareToken';
import { sharingService } from '../services/sharingService';
import { travelPlanService } from '../services/travelPlanService';
import { getErrorMessage } from '../utils/getErrorMessage';


export function SharedPlan() {
    const {token} = useParams<{token: string}>();

    const [plan, setPlan] = useState<TravelPlan | null>(null);
    const [accessLevel, setAccessLevel] = useState<ShareAccessLevel>('View');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<PlanTabKey>('destinations');
    const [reloadToken, setReloadToken] = useState(0);

    const reload = () => setReloadToken((value) => value+1);

    useEffect(() => {
        if (!token) {
            return;
        }

        setActiveShareToken(token);

        const load = async () => {
            try {
                const validation = await sharingService.validate(token);

                if (!validation.isValid) {
                    setError(validation.reason ?? 'This share link is not valid.');
                    return;
                }

                setAccessLevel(validation.accessLevel);
                setPlan (await travelPlanService.getById(validation.travelPlanId));
            } catch (err) {
                setError(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };

        load();

        return () => setActiveShareToken(null);
    }, [token, reloadToken]);

    const canEdit = accessLevel === 'Edit';

    return (
    <div className="min-h-screen">
      <header className="bg-white/70 backdrop-blur border-b border-sky-aero/20">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 font-display font-black text-sky-deep">
            <Plane className="w-5 h-5" />
            Travel Planner
          </span>

          <span
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
              canEdit ? 'bg-amber-100 text-amber-700' : 'bg-sky-light text-sky-deep'
            }`}
          >
            {canEdit ? <Pencil className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            Shared link · {canEdit ? 'can edit' : 'view only'}
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {loading && <Spinner />}

        {!loading && (error || !plan) && (
          <div className="glass-card p-10 text-center">
            <p className="font-display font-bold text-ink mb-1">Link unavailable</p>
            <p className="text-sm text-ink-light">{error ?? 'Plan not found.'}</p>
          </div>
        )}

        {!loading && plan && (
          <>
            <PlanHeader plan={plan} />

            <PlanTabs active={activeTab} showSharing={false} onChange={setActiveTab} />

            {activeTab === 'destinations' && (
              <DestinationsTab
                planId={plan.id}
                destinations={plan.destinations}
                canEdit={canEdit}
                onChanged={reload}
              />
            )}

            {activeTab === 'activities' && (
              <ActivitiesTab
                planId={plan.id}
                activities={plan.activities}
                planStartDate={plan.startDate}
                canEdit={canEdit}
                onChanged={reload}
              />
            )}

            {activeTab === 'expenses' && (
              <ExpensesTab
                planId={plan.id}
                expenses={plan.expenses}
                totalExpenses={plan.totalExpenses}
                remainingBudget={plan.remainingBudget}
                canEdit={canEdit}
                onChanged={reload}
              />
            )}

            {activeTab === 'checklist' && (
              <ChecklistTab
                planId={plan.id}
                items={plan.checklistItems}
                canEdit={canEdit}
                onChanged={reload}
              />
            )}
          </>
        )}
      </main>
    </div>
  );


}
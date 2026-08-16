import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlanHeader } from '../components/plans/PlanHeader';
import { PlanTabs } from '../components/plans/PlanTabs';
import type { PlanTabKey } from '../components/plans/PlanTabs';
import { Spinner } from '../components/ui/Spinner';
import type { TravelPlan } from '../models/travel';
import { travelPlanService } from '../services/travelPlanService';
import { getErrorMessage } from '../utils/getErrorMessage';
import { DestinationsTab } from '../components/destinations/DestinationsTab';
import { ActivitiesTab } from '../components/activities/ActivitiesTab';

export function PlanDetail() {
  const { id } = useParams<{ id: string }>();
  const planId = Number(id);
  const navigate = useNavigate();

  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<PlanTabKey>('destinations');
  const [reloadToken, setReloadToken] = useState(0);

  const reload = () => setReloadToken((token) => token + 1);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await travelPlanService.getById(planId);
        setPlan(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [planId, reloadToken]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this plan and everything in it?')) {
      return;
    }

    try {
      await travelPlanService.remove(planId);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error || !plan) {
    return (
      <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
        {error ?? 'Plan not found.'}
      </p>
    );
  }

  return (
    <div>
      <PlanHeader plan={plan} onDelete={handleDelete} />

      <PlanTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === 'destinations' && (
        <DestinationsTab
          planId={plan.id}
          destinations={plan.destinations}
          onChanged={reload}
        />
      )}
      {activeTab === 'activities' && (
        <ActivitiesTab
          planId={plan.id}
          activities={plan.activities}
          planStartDate={plan.startDate}
          onChanged={reload}
        />
      )}
      {activeTab === 'expenses' && <TabPlaceholder name="Expenses" />}
      {activeTab === 'checklist' && <TabPlaceholder name="Checklist" />}

    </div>
  );
}

function TabPlaceholder({ name }: { name: string }) {
  return (
    <div className="glass-card p-8 text-center text-sm text-ink-light">
      {name} coming next.
    </div>
  );
}
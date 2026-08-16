import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PlanCard } from '../components/plans/PlanCard';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import type { TravelPlanSummary } from '../models/travel';
import { travelPlanService } from '../services/travelPlanService';
import { getErrorMessage } from '../utils/getErrorMessage';

export function Dashboard() {
  const { user } = useAuth();

  const [plans, setPlans] = useState<TravelPlanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await travelPlanService.getAll();
        setPlans(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-black text-sky-deep">
            Your travel plans
          </h1>
          <p className="text-sm text-ink-light">
            Welcome back, {user?.firstName}.
          </p>
        </div>

        <Link to="/travel-plans/new" className="btn-aero px-5 py-2.5 text-sm">
          <Plus className="w-4 h-4" />
          New plan
        </Link>
      </div>

      {loading && <Spinner />}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {!loading && !error && plans.length === 0 && (
        <div className="glass-card p-10 text-center">
          <p className="font-display font-bold text-ink mb-1">No plans yet</p>
          <p className="text-sm text-ink-light">
            Create your first travel plan to get started.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}
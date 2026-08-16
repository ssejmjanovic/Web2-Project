import { useNavigate } from 'react-router-dom';
import { PlanForm } from '../components/plans/PlanForm';
import type { TravelPlanInput } from '../models/travel';
import { travelPlanService } from '../services/travelPlanService';

export function CreatePlan() {
  const navigate = useNavigate();

  const handleCreate = async (values: TravelPlanInput) => {
    const created = await travelPlanService.create(values);
    navigate(`/travel-plans/${created.id}`);
  };

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-black text-sky-deep mb-4">
        New travel plan
      </h1>

      <PlanForm
        submitLabel="Create plan"
        onSubmit={handleCreate}
        onCancel={() => navigate('/dashboard')}
      />
    </div>
  );
}
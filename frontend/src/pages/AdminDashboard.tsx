import { useEffect, useState } from 'react';
import { AdminPlanRow } from '../components/admin/AdminPlanRow';
import { UserRow } from '../components/admin/UserRow';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../models/user';
import type { TravelPlanSummary } from '../models/travel';
import { travelPlanService } from '../services/travelPlanService';
import { userService } from '../services/userService';
import { getErrorMessage } from '../utils/getErrorMessage';

export function AdminDashboard() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<TravelPlanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyUserId, setBusyUserId] = useState<number | null>(null);
  const [busyPlanId, setBusyPlanId] = useState<number | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [userData, planData] = await Promise.all([
          userService.getAll(),
          travelPlanService.getAllForAdmin(),
        ]);

        setUsers(userData);
        setPlans(planData);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [reloadToken]);

  const reload = () => setReloadToken((value) => value + 1);

  const usersById = new Map(users.map((user) => [user.id, user]));

  const ownerLabel = (plan: TravelPlanSummary) => {
    const owner = usersById.get(plan.userId);
    return owner
      ? `${owner.firstName} ${owner.lastName} · ${owner.email}`
      : `User #${plan.userId}`;
  };

  const handleToggleRole = async (user: User) => {
    setBusyUserId(user.id);
    setError(null);

    try {
      await userService.updateRole(user.id, user.role === 'Admin' ? 'User' : 'Admin');
      reload();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyUserId(null);
    }
  };

  const handleToggleStatus = async (user: User) => {
    setBusyUserId(user.id);
    setError(null);

    try {
      await userService.updateStatus(user.id, !user.isActive);
      reload();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyUserId(null);
    }
  };

  const handleDeletePlan = async (plan: TravelPlanSummary) => {
    if (!window.confirm(`Delete "${plan.name}" and everything in it?`)) {
      return;
    }

    setBusyPlanId(plan.id);
    setError(null);

    try {
      await travelPlanService.remove(plan.id);
      reload();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyPlanId(null);
    }
  };

  const adminCount = users.filter((user) => user.role === 'Admin').length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-black text-sky-deep">
          Administration
        </h1>
        <p className="text-sm text-ink-light">
          {users.length} accounts · {adminCount} admins · {plans.length} travel plans
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {loading && <Spinner />}

      {!loading && (
        <>
          <section>
            <h2 className="font-display font-black text-sky-deep mb-3">
              User accounts
            </h2>

            <div className="flex flex-col gap-2">
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  isCurrentUser={user.id === currentUser?.id}
                  busy={busyUserId === user.id}
                  onToggleRole={() => handleToggleRole(user)}
                  onToggleStatus={() => handleToggleStatus(user)}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display font-black text-sky-deep mb-3">
              All travel plans
            </h2>

            {plans.length === 0 && (
              <p className="text-sm text-ink-light py-4 text-center">
                No travel plans in the system.
              </p>
            )}

            <div className="flex flex-col gap-2">
              {plans.map((plan) => (
                <AdminPlanRow
                  key={plan.id}
                  plan={plan}
                  ownerLabel={ownerLabel(plan)}
                  busy={busyPlanId === plan.id}
                  onDelete={() => handleDeletePlan(plan)}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
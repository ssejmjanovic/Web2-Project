import { useEffect, useState } from 'react';
import { UserRow } from '../components/admin/UserRow';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../models/user';
import { userService } from '../services/userService';
import { getErrorMessage } from '../utils/getErrorMessage';

export function AdminDashboard() {
  const {user: currentUser } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await userService.getAll();
        setUsers(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [reloadToken]);

  const reload = () => setReloadToken((value) => value + 1);

  const handleToggleRole = async (user: User) => {
    setBusyId(user.id);
    setError(null);

    try {
      await userService.updateRole(user.id, user.role === 'Admin' ? 'User' : 'Admin');
      reload();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleStatus = async (user: User) => {
    setBusyId(user.id);
    setError(null);
    try {
      await userService.updateStatus(user.id, !user.isActive);
      reload();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const adminCount = users.filter((user) => user.role === 'Admin').length;
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-black text-sky-deep">
          Administration
        </h1>
        <p className="text-sm text-ink-light">
          {users.length} accounts · {adminCount} admins
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      {loading && <Spinner />}

      <div className="flex flex-col gap-2">
        {users.map((user) => (
          <UserRow
            key={user.id}
            user={user}
            isCurrentUser={user.id === currentUser?.id}
            busy={busyId === user.id}
            onToggleRole={() => handleToggleRole(user)}
            onToggleStatus={() => handleToggleStatus(user)}
          />
        ))}
      </div>
    </div>
  );
}
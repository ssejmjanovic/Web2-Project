import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export function Dashboard() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/70 backdrop-blur rounded-2xl shadow-lg p-8">
        <h1 className="font-display text-2xl font-black text-sky-deep mb-2">
          Hello, {user?.firstName}
        </h1>
        <p className="text-sm text-ink-light mb-1">{user?.email}</p>
        <p className="text-sm text-ink-light mb-6">
          Role: {user?.role} {isAdmin && '(admin)'}
        </p>

        <Button variant="secondary" onClick={logout}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
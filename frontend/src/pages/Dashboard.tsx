import { useAuth } from '../hooks/useAuth';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl shadow-lg p-8">
      <h1 className="font-display text-2xl font-black text-sky-deep mb-2">
        Hello, {user?.firstName}
      </h1>
      <p className="text-sm text-ink-light">{user?.email}</p>
    </div>
  );
}
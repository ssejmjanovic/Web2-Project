import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Plane, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/Button';

export function Layout({children}: {children: ReactNode}) {
    const {user, isAdmin, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b border-sky-aero/20">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 font-display font-black text-sky-deep"
          >
            <Plane className="w-5 h-5" />
            Travel Planner
          </Link>

          <nav className="flex items-center gap-4">
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 text-sm font-bold text-ink-light hover:text-sky-deep"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin
              </Link>
            )}

            <Link
              to="/profile"
              className="hidden sm:inline text-sm text-ink-light hover:text-sky-deep"
            >
              {user?.firstName} {user?.lastName}
            </Link>

            <Button variant="secondary" onClick={handleLogout} className="px-3 py-1.5">
              <LogOut className="w-4 h-4" />
              Sign out
            </Button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
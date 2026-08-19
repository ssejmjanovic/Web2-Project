import { ShieldCheck, ShieldOff, UserCheck, UserX } from 'lucide-react';
import { Button } from '../ui/Button';
import type { User } from '../../models/user';
import { formatDate } from '../../utils/format';

interface UserRowProps {
    user: User;
    isCurrentUser: boolean;
    busy: boolean;
    onToggleRole: () => void;
    onToggleStatus: () => void;
}

export function UserRow({user, isCurrentUser, busy, onToggleRole, onToggleStatus}: UserRowProps) {
    return (
    <div className="rounded-xl border border-sky-aero/25 bg-white/60 p-3 flex items-center justify-between gap-3 flex-wrap">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-display font-bold text-ink">
            {user.firstName} {user.lastName}
          </h4>

          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              user.role === 'Admin'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-sky-light text-sky-deep'
            }`}
          >
            {user.role}
          </span>

          {!user.isActive && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
              Deactivated
            </span>
          )}

          {isCurrentUser && (
            <span className="text-[11px] text-ink-light">(you)</span>
          )}
        </div>

        <p className="text-xs text-ink-light mt-1">{user.email}</p>
        <p className="text-[11px] text-ink-light">
          Joined {formatDate(user.createdAt)}
        </p>
      </div>

      <div className="flex gap-2 shrink-0">
        <Button
          variant="secondary"
          onClick={onToggleRole}
          disabled={busy || isCurrentUser}
          className="px-3 py-1.5 text-xs"
        >
          {user.role === 'Admin' ? (
            <>
              <ShieldOff className="w-4 h-4" />
              Make user
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Make admin
            </>
          )}
        </Button>

        <Button
          variant={user.isActive ? 'danger' : 'primary'}
          onClick={onToggleStatus}
          disabled={busy || isCurrentUser}
          className="px-3 py-1.5 text-xs"
        >
          {user.isActive ? (
            <>
              <UserX className="w-4 h-4" />
              Deactivate
            </>
          ) : (
            <>
              <UserCheck className="w-4 h-4" />
              Activate
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { ShareLinkItem } from './ShareLinkItem';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Spinner } from '../ui/Spinner';
import type { Share, ShareAccessLevel } from '../../models/sharing';
import { sharingService } from '../../services/sharingService';
import { getErrorMessage } from '../../utils/getErrorMessage';

const accessOptions: { value: ShareAccessLevel; label: string }[] = [
  { value: 'View', label: 'View only' },
  { value: 'Edit', label: 'Can edit' },
];

const expiryOptions = [
  { value: '24', label: '24 hours' },
  { value: '168', label: '7 days' },
  { value: '720', label: '30 days' },
];

export function ShareTab({ planId }: { planId: number }) {
  const [shares, setShares] = useState<Share[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [accessLevel, setAccessLevel] = useState<ShareAccessLevel>('View');
  const [expiresInHours, setExpiresInHours] = useState('168');
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await sharingService.getForPlan(planId);
        setShares(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [planId, reloadToken]);

  const handleCreate = async () => {
    setCreating(true);
    setError(null);

    try {
      await sharingService.create({
        travelPlanId: planId,
        accessLevel,
        expiresInHours: Number(expiresInHours),
      });
      setReloadToken((token) => token + 1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (token: string) => {
    if (!window.confirm('Revoke this link? Anyone using it will lose access immediately.')) {
      return;
    }

    try {
      await sharingService.revoke(token);
      setReloadToken((value) => value + 1);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const activeShares = shares.filter((share) => !share.isRevoked);

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      <div>
        <h3 className="font-display font-black text-sky-deep">Share this plan</h3>
        <p className="text-sm text-ink-light mt-1">
          Anyone with the link can open this plan without an account.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 items-end">
        <Select
          label="Access"
          options={accessOptions}
          value={accessLevel}
          onChange={(event) => setAccessLevel(event.target.value as ShareAccessLevel)}
        />

        <Select
          label="Expires in"
          options={expiryOptions}
          value={expiresInHours}
          onChange={(event) => setExpiresInHours(event.target.value)}
        />

        <Button onClick={handleCreate} disabled={creating} className="px-4 py-2.5">
          <Plus className="w-4 h-4" />
          {creating ? 'Creating...' : 'Create link'}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {loading && <Spinner />}

      {!loading && activeShares.length === 0 && (
        <p className="text-sm text-ink-light py-4 text-center">No active links.</p>
      )}

      <div className="flex flex-col gap-2">
        {activeShares.map((share) => (
          <ShareLinkItem
            key={share.token}
            share={share}
            onRevoke={() => handleRevoke(share.token)}
          />
        ))}
      </div>
    </div>
  );
}
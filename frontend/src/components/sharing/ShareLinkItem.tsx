import { useState } from 'react';
import { Check, Copy, QrCode, Trash2 } from 'lucide-react';
import QRCode from 'react-qr-code';
import { Button } from '../ui/Button';
import type { Share } from '../../models/sharing';
import { formatDate } from '../../utils/format';

interface ShareLinkItemProps {
  share: Share;
  onRevoke: () => void;
}

export function ShareLinkItem({ share, onRevoke }: ShareLinkItemProps) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const url = `${window.location.origin}/shared/${share.token}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-sky-aero/25 bg-white/60 p-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              share.accessLevel === 'Edit'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-sky-light text-sky-deep'
            }`}
          >
            {share.accessLevel}
          </span>

          <p className="text-xs text-ink-light mt-1 truncate max-w-[280px]" title={url}>
            {url}
          </p>

          <p className="text-[11px] text-ink-light mt-0.5">
            {share.expiresAtUtc
              ? `Expires ${formatDate(share.expiresAtUtc)}`
              : 'Never expires'}
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <Button variant="secondary" onClick={handleCopy} className="px-3 py-1.5">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>

          <Button
            variant="secondary"
            onClick={() => setShowQr((value) => !value)}
            className="px-3 py-1.5"
          >
            <QrCode className="w-4 h-4" />
          </Button>

          <Button variant="danger" onClick={onRevoke} className="px-3 py-1.5">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showQr && (
        <div className="mt-3 flex justify-center bg-white rounded-xl p-4">
          <QRCode value={url} size={160} />
        </div>
      )}
    </div>
  );
}
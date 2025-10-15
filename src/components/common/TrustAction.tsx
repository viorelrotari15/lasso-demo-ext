import React from 'react';

type TrustActionProps = {
  isTrusted: boolean;
  onTrust: () => void;
  compact?: boolean;
};

export function TrustAction({ isTrusted, onTrust, compact = false }: TrustActionProps) {
  if (isTrusted) {
    return (
      <span className={compact ? 'text-[10px] text-green-700 dark:text-green-300' : 'text-xs text-green-600 dark:text-green-400 font-medium'}>
        Trusted
      </span>
    );
  }

  return (
    <button
      className={compact ? 'text-[10px] px-2 py-0.5 rounded bg-blue-600 text-white hover:bg-blue-700' : 'text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700'}
      onClick={onTrust}
      title="Trust this email for 24 hours"
    >
      Trust 24h
    </button>
  );
}



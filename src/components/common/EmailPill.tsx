import React from 'react';

type EmailPillProps = {
  email: string;
  isTrusted: boolean;
  compact?: boolean;
};

export function EmailPill({ email, isTrusted, compact = false }: EmailPillProps) {
  const padding = compact ? 'px-1 py-0.5' : 'px-2 py-1';
  const base = `${padding} rounded text-xs font-mono`;
  const color = isTrusted
    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';

  return <span className={`${base} ${color}`}>{email}</span>;
}



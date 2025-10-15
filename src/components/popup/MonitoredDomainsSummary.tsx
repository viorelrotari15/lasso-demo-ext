import React from 'react';

type MonitoredDomainsSummaryProps = {
  count: number;
};

export function MonitoredDomainsSummary({ count }: MonitoredDomainsSummaryProps) {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3 mb-3">
      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
        Only monitoring {count} configured domain{count !== 1 ? 's' : ''}
      </p>
    </div>
  );
}



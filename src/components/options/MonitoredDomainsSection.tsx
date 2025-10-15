import React from 'react';
import { SectionHeader } from '../common/SectionHeader';

type MonitoredDomainsSectionProps = {
  monitoredDomains: string[];
  newDomain: string;
  onNewDomainChange: (value: string) => void;
  onAddDomain: () => void;
  onRemoveDomain: (domain: string) => void;
};

export function MonitoredDomainsSection({
  monitoredDomains,
  newDomain,
  onNewDomainChange,
  onAddDomain,
  onRemoveDomain
}: MonitoredDomainsSectionProps) {
  return (
    <div className="mb-8">
      <SectionHeader
        title="Monitored Domains"
        description="Add domains where you want email detection to be active. The extension will only monitor these specific domains for security."
        className="mb-4"
      />

      <div className="flex gap-2 mb-4">
        <input
          className="border rounded px-3 py-2 flex-1 bg-white dark:bg-gray-800"
          value={newDomain}
          onChange={(e) => onNewDomainChange(e.target.value)}
          placeholder="Enter domain (e.g., example.com)"
          onKeyPress={(e) => e.key === 'Enter' && onAddDomain()}
        />
        <button
          className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          onClick={onAddDomain}
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {monitoredDomains.map((domain, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded">
            <span className="text-sm">{domain}</span>
            <button
              className="text-red-600 hover:text-red-800 text-sm"
              onClick={() => onRemoveDomain(domain)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}



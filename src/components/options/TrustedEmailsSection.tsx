import React from 'react';
import { type TrustedEmailEntry } from '../../types/email';
import { SectionHeader } from '../common/SectionHeader';

type TrustedEmailsSectionProps = {
  trustedEmails: TrustedEmailEntry[];
  onUntrustEmail: (email: string) => void;
  onClearAllTrusted: () => void;
};

export function TrustedEmailsSection({
  trustedEmails,
  onUntrustEmail,
  onClearAllTrusted
}: TrustedEmailsSectionProps) {
  return (
    <div className="mb-8">
      <SectionHeader
        title={`Trusted Emails (${trustedEmails.length})`}
        description="Emails that are trusted for 24 hours and won't be anonymized or logged when detected again."
        className="mb-4"
        actionsRight={trustedEmails.length > 0 ? (
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
            onClick={onClearAllTrusted}
          >
            Clear All Trusted
          </button>
        ) : null}
      />

      {trustedEmails.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded text-center">
          <p className="text-gray-500">No trusted emails yet</p>
        </div>
      ) : (
        <>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {trustedEmails.map((trusted, index) => (
              <div key={index} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-green-800 dark:text-green-200">
                      {trusted.email}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Expires: {new Date(trusted.expiresAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    className="ml-4 text-red-600 hover:text-red-800 text-sm font-medium"
                    onClick={() => onUntrustEmail(trusted.email)}
                    title="Remove trust"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}



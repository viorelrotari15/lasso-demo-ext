import React from 'react';
import { type EmailIssue, type TrustedEmailEntry } from '../../types/email';
import { EmailPill } from '../common/EmailPill';
import { TrustAction } from '../common/TrustAction';
import { SectionHeader } from '../common/SectionHeader';

type EmailDetectionsSectionProps = {
  emailIssues: EmailIssue[];
  trustedEmails: TrustedEmailEntry[];
  onDeleteIssue: (id: string) => void;
  onClearAll: () => void;
  onTrustEmail24h: (email: string) => void;
  onExport: (issues: EmailIssue[]) => void;
};

export function EmailDetectionsSection({
  emailIssues,
  trustedEmails,
  onDeleteIssue,
  onClearAll,
  onTrustEmail24h,
  onExport
}: EmailDetectionsSectionProps) {
  return (
    <div className="mb-8">
      <SectionHeader
        title={`Email Detections (${emailIssues.length})`}
        description="Manage detected email addresses. You can delete individual detections or clear all data."
        className="mb-4"
        actionsRight={emailIssues.length > 0 ? (
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
              onClick={onClearAll}
            >
              Clear All
            </button>
            <button
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 text-sm"
              onClick={() => onExport(emailIssues)}
            >
              Export JSON
            </button>
          </div>
        ) : null}
      />

      {emailIssues.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded text-center">
          <p className="text-gray-500">No email detections yet</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {emailIssues.map((issue) => (
              <div key={issue.id} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {issue.emails.length} email(s) detected
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {new Date(issue.timestamp).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 truncate" title={issue.url}>
                      URL: {issue.url}
                    </p>
                  </div>
                  <button
                    className="ml-4 text-red-600 hover:text-red-800 text-sm font-medium"
                    onClick={() => onDeleteIssue(issue.id)}
                    title="Delete this detection"
                  >
                    Delete
                  </button>
                </div>

                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Detected Emails:</p>
                  <div className="flex flex-col gap-2">
                    {issue.emails.map((email: string, emailIndex: number) => {
                      const isTrusted = trustedEmails.some(t => t.email === email);
                      return (
                        <div key={emailIndex} className="flex items-center justify-between gap-2">
                          <EmailPill email={email} isTrusted={isTrusted} />
                          <TrustAction isTrusted={isTrusted} onTrust={() => onTrustEmail24h(email)} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}



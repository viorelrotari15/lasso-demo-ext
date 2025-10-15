import React from 'react';
import { type EmailIssue } from '../../types/email';
import { EmailPill } from '../common/EmailPill';
import { TrustAction } from '../common/TrustAction';

type EmailIssuesListProps = {
  emailIssues: EmailIssue[];
  trustedEmails: string[];
  onTrustEmail24h: (email: string) => void;
  onDeleteIssue: (id: string) => void;
};

export function EmailIssuesList({ emailIssues, trustedEmails, onTrustEmail24h, onDeleteIssue }: EmailIssuesListProps) {
  if (emailIssues.length === 0) {
    return <p className="text-xs text-gray-500">No email detections yet</p>;
  }

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {emailIssues.slice(-5).map((issue) => (
        <div key={issue.id} className="text-xs bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="font-medium">{issue.emails.length} email(s) detected</p>
              <p className="text-gray-600 dark:text-gray-400 truncate">{issue.url}</p>
              <p className="text-gray-500">{new Date(issue.timestamp).toLocaleString()}</p>
              <div className="mt-1">
                <p className="text-gray-700 dark:text-gray-300 font-medium">Emails:</p>
                <div className="flex flex-col gap-1 mt-1 w-full">
                  {issue.emails.map((email: string, emailIndex: number) => {
                    const isTrusted = trustedEmails.includes(email);
                    return (
                      <div key={emailIndex} className="flex items-center justify-between gap-2">
                        <EmailPill email={email} isTrusted={isTrusted} compact />
                        <TrustAction isTrusted={isTrusted} onTrust={() => onTrustEmail24h(email)} compact />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <button
              className="ml-2 text-red-600 hover:text-red-800 text-xs"
              onClick={() => onDeleteIssue(issue.id)}
              title="Delete this detection"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}



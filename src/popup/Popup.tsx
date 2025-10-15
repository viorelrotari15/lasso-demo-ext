import React, { useState, useEffect } from 'react';
import { getTrustedEmails as getTrustedEmailsMsg, trustEmail as trustEmailMsg } from '../messages/messages';
import { getMonitoredDomains, getEmailIssuesLocal, setEmailIssuesLocal } from '../storage/browser/browser';
import browser from 'webextension-polyfill';
import { type EmailIssue } from '../types/email';
import { MonitoredDomainsSummary } from '../components/popup/MonitoredDomainsSummary';
import { EmailIssuesList } from '../components/popup/EmailIssuesList';
import { SectionHeader } from '../components/common/SectionHeader';

export function Popup() {
  const [emailIssues, setEmailIssues] = useState<EmailIssue[]>([]);
  const [monitoredDomains, setMonitoredDomains] = useState<string[]>([]);
  const [trustedEmails, setTrustedEmails] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const [issues, domains, trustedEntries] = await Promise.all([
        getEmailIssuesLocal(),
        getMonitoredDomains(),
        getTrustedEmailsMsg()
      ]);
      setEmailIssues(issues);
      setMonitoredDomains(domains);
      setTrustedEmails(trustedEntries.map(e => e.email));
    })();
  }, []);

  const openOptions = () => {
    browser.runtime.openOptionsPage();
  };

  const deleteEmailIssue = async (id: string) => {
    const updatedIssues = emailIssues.filter((issue) => issue.id !== id);
    await setEmailIssuesLocal(updatedIssues);
    setEmailIssues(updatedIssues);
  };

  const clearAllEmails = async () => {
    if (confirm('Are you sure you want to clear all email detections?')) {
      await setEmailIssuesLocal([]);
      setEmailIssues([]);
    }
  };

  const refreshTrusted = async () => {
    try {
      const entries = await getTrustedEmailsMsg();
      setTrustedEmails(entries.map(e => e.email));
    } catch {}
  };

  const trustEmail24h = async (email: string) => {
    try {
      await trustEmailMsg(email, 24 * 60 * 60 * 1000);
      await refreshTrusted();
    } catch {}
  };

  return (
    <div className="w-80 p-4 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-xl font-semibold mb-3">Lasso Demo Extension</h1>
      
      <div className="mb-4">
        <MonitoredDomainsSummary count={monitoredDomains.length} />
      </div>

      <div className="mb-4">
        <SectionHeader
          title={`Email Detections (${emailIssues.length})`}
          className="mb-2"
          actionsRight={emailIssues.length > 0 ? (
            <button
              className="text-xs text-red-600 hover:text-red-800"
              onClick={clearAllEmails}
            >
              Clear All
            </button>
          ) : null}
        />
        <EmailIssuesList
          emailIssues={emailIssues}
          trustedEmails={trustedEmails}
          onTrustEmail24h={trustEmail24h}
          onDeleteIssue={deleteEmailIssue}
        />
      </div>

      <div className="space-y-2">
        <button
          className="w-full px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
          onClick={openOptions}
        >
          Open Settings
        </button>
        <button
          className="w-full px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
          onClick={() => window.close()}
        >
          Close
        </button>
      </div>
    </div>
  );
}
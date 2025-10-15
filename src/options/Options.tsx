import React, { useState, useEffect } from 'react';
import { 
  getTrustedEmails as getTrustedEmailsMsg,
  trustEmail as trustEmailMsg,
  untrustEmail as untrustEmailMsg,
  getEmailIssues as getEmailIssuesMsg
} from '../messages/messages';
import {
  getMonitoredDomains,
  setMonitoredDomains as setMonitoredDomainsStorage,
  setEmailIssuesLocal
} from '../storage/browser/browser';
import { exportEmails } from '../utils/export-emails';
import { type EmailIssue, type TrustedEmailEntry } from '../types/email';
import { MonitoredDomainsSection } from '../components/options/MonitoredDomainsSection';
import { TrustedEmailsSection } from '../components/options/TrustedEmailsSection';
import { EmailDetectionsSection } from '../components/options/EmailDetectionsSection';

export function Options() {
  const [monitoredDomains, setMonitoredDomains] = useState<string[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [emailIssues, setEmailIssues] = useState<EmailIssue[]>([]);
  const [trustedEmails, setTrustedEmails] = useState<TrustedEmailEntry[]>([]);

  useEffect(() => {
    (async () => {
      const domains = await getMonitoredDomains();
      setMonitoredDomains(domains);
    })();
    loadTrustedEmails();
    loadEmailIssues();
  }, []);

  const loadTrustedEmails = async () => {
    try {
      const trusted = await getTrustedEmailsMsg();
      setTrustedEmails(trusted);
    } catch (err) {
      console.error('Failed to load trusted emails:', err);
    }
  };

  const save = async () => {
    await setMonitoredDomainsStorage(monitoredDomains);
    alert('Settings saved! Please reload the extension for domain changes to take effect.');
  };

  const loadEmailIssues = async () => {
    try {
      const issues = await getEmailIssuesMsg();
      setEmailIssues(issues);
    } catch (err) {
      console.error('Failed to load email issues:', err);
    }
  };

  const addDomain = () => {
    if (newDomain.trim() && !monitoredDomains.includes(newDomain.trim())) {
      setMonitoredDomains([...monitoredDomains, newDomain.trim()]);
      setNewDomain('');
    }
  };

  const removeDomain = (domain: string) => {
    setMonitoredDomains(monitoredDomains.filter(d => d !== domain));
  };

  const deleteEmailIssue = async (id: string) => {
    const updatedIssues = emailIssues.filter((issue) => issue.id !== id);
    await setEmailIssuesLocal(updatedIssues);
    setEmailIssues(updatedIssues);
  };

  const clearAllEmails = async () => {
    if (confirm('Are you sure you want to clear all email detections? This action cannot be undone.')) {
      await setEmailIssuesLocal([]);
      setEmailIssues([]);
    }
  };

  const trustEmail24h = async (email: string) => {
    try {
      await trustEmailMsg(email, 24 * 60 * 60 * 1000);
      await loadTrustedEmails();
    } catch (err) {
      console.error('Failed to trust email:', err);
    }
  };

  const untrustEmail = async (email: string) => {
    try {
      await untrustEmailMsg(email);
      await loadTrustedEmails();
    } catch (err) {
      console.error('Failed to untrust email:', err);
    }
  };

  const clearAllTrusted = async () => {
    if (confirm('Are you sure you want to remove all trusted emails?')) {
      try {
        for (const trusted of trustedEmails) {
          await untrustEmailMsg(trusted.email);
        }
        await loadTrustedEmails();
      } catch (err) {
        console.error('Failed to clear trusted emails:', err);
      }
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-semibold mb-6">Lasso Demo Extension Settings</h1>
      
      <MonitoredDomainsSection
        monitoredDomains={monitoredDomains}
        newDomain={newDomain}
        onNewDomainChange={setNewDomain}
        onAddDomain={addDomain}
        onRemoveDomain={removeDomain}
      />

      <TrustedEmailsSection
        trustedEmails={trustedEmails}
        onUntrustEmail={untrustEmail}
        onClearAllTrusted={clearAllTrusted}
      />

      <EmailDetectionsSection
        emailIssues={emailIssues}
        trustedEmails={trustedEmails}
        onDeleteIssue={deleteEmailIssue}
        onClearAll={clearAllEmails}
        onTrustEmail24h={trustEmail24h}
        onExport={exportEmails}
      />

      <div className="mt-6">
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          onClick={save}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}

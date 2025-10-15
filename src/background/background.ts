import browser from 'webextension-polyfill';
import { getEmailIssuesLocal, setTrustedEmailsLocal } from '../storage/browser/browser';
import {
  detectEmails,
  anonymizeEmails,
  isEmailTrusted,
  trustEmailForDuration,
  cleanupExpiredTrusted,
  logEmailIssue
} from './utils/emails';
import { type TrustedEmailEntry } from '../types/email';
interface CapturedRequestMessage {
  type: 'captured-request';
  url: string;
  method: string;
  body: string;
}

browser.runtime.onInstalled.addListener(async () => {
  await browser.storage.local.set({ 
    installedAt: Date.now(),
    monitoredDomains: [
      'chatgpt.com',
    ],
    trusted_emails: [] as TrustedEmailEntry[]
  });
});

browser.runtime.onMessage.addListener(async (msg: unknown, _sender: unknown) => {
  if (
    typeof msg === 'object' &&
    msg !== null &&
    'type' in msg
  ) {
    const message = msg as { type: string };
    
    if (message.type === 'captured-request') {
      const requestMsg = msg as CapturedRequestMessage;
      const emails = detectEmails(requestMsg.body);
      
      if (emails.length > 0) {
        const trustChecks = await Promise.all(emails.map(e => isEmailTrusted(e)));
        const untrustedEmails = emails.filter((e, idx) => !trustChecks[idx]);

        if (untrustedEmails.length > 0) {
          await logEmailIssue(requestMsg.url, untrustedEmails);
        }

        if (untrustedEmails.length === 0) {
          return { hasEmails: true, sanitizedBody: requestMsg.body, emails, anonymized: [] };
        }

        const sanitizedBody = anonymizeEmails(requestMsg.body, untrustedEmails);
        return {
          hasEmails: true,
          sanitizedBody,
          emails,
          anonymized: untrustedEmails
        };
      }
      
      return { hasEmails: false };
    }
    
    if (message.type === 'get-email-issues') {
      try {
        const issues = await getEmailIssuesLocal();
        return { issues };
      } catch (err) {
        console.error("[Extension] Failed to retrieve email issues:", err);
        return { issues: [] };
      }
    }

    if (message.type === 'trust-email') {
      const { email, ttlMs } = msg as { type: 'trust-email'; email: string; ttlMs?: number };
      const duration = typeof ttlMs === 'number' ? ttlMs : 24 * 60 * 60 * 1000;
      await trustEmailForDuration(email, duration);
      return { ok: true };
    }

    if (message.type === 'untrust-email') {
      const { email } = msg as { type: 'untrust-email'; email: string };
      const entries = await cleanupExpiredTrusted();
      const filtered = entries.filter(e => e.email.toLowerCase() !== email.toLowerCase());
      await setTrustedEmailsLocal(filtered);
      return { ok: true };
    }

    if (message.type === 'get-trusted-emails') {
      const entries = await cleanupExpiredTrusted();
      return { trusted: entries };
    }
  }
});

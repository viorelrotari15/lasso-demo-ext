import browser from 'webextension-polyfill';
import { type TrustedEmailEntry, type EmailIssue, isEmailIssue, isTrustedEmailEntry } from '../../types/email';

export type LocalGetResult<K extends string> = Record<K, unknown>;

export async function getLocal<K extends string>(keys: K | readonly K[]): Promise<LocalGetResult<K>> {
  const res = await browser.storage.local.get(keys as any);
  return res as LocalGetResult<K>;
}

export async function setLocal(obj: Record<string, unknown>): Promise<void> {
  await browser.storage.local.set(obj);
}

export async function getMonitoredDomains(): Promise<string[]> {
  const res = await browser.storage.local.get('monitoredDomains');
  const domains = Array.isArray((res as Record<string, unknown>).monitoredDomains)
    ? (res as Record<string, unknown>).monitoredDomains as string[]
    : [];
  return domains;
}

export async function setMonitoredDomains(domains: string[]): Promise<void> {
  await browser.storage.local.set({ monitoredDomains: domains });
}

export async function getEmailIssuesLocal(): Promise<EmailIssue[]> {
  const res = await browser.storage.local.get('chatgpt_email_issues');
  const raw = Array.isArray((res as Record<string, unknown>).chatgpt_email_issues)
    ? (res as Record<string, unknown>).chatgpt_email_issues as unknown[]
    : [];
    
  const normalized: EmailIssue[] = raw
    .map((item) => {
      if (isEmailIssue(item)) return item;
      if (item && typeof item === 'object') {
        const obj = item as Record<string, unknown>;
        const timestamp = typeof obj.timestamp === 'string' ? obj.timestamp : new Date().toISOString();
        const emails = Array.isArray(obj.emails) ? (obj.emails as unknown[]).filter((e) => typeof e === 'string') as string[] : [];
        const url = typeof obj.url === 'string' ? obj.url : '';
        if (emails.length > 0 && url) {
          const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
          return { id, timestamp, emails, url } as EmailIssue;
        }
      }
      return null;
    })
    .filter((v): v is EmailIssue => Boolean(v));
  return normalized;
}

export async function setEmailIssuesLocal(issues: EmailIssue[]): Promise<void> {
  await browser.storage.local.set({ chatgpt_email_issues: issues });
}

export async function getTrustedEmailsLocal(): Promise<TrustedEmailEntry[]> {
  const res = await browser.storage.local.get('trusted_emails');
  const entries = Array.isArray((res as Record<string, unknown>).trusted_emails)
    ? (res as Record<string, unknown>).trusted_emails as TrustedEmailEntry[]
    : [];
  return entries.filter(isTrustedEmailEntry);
}

export async function setTrustedEmailsLocal(entries: TrustedEmailEntry[]): Promise<void> {
  await browser.storage.local.set({ trusted_emails: entries });
}

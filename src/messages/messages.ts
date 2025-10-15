import browser from 'webextension-polyfill';
import { type TrustedEmailEntry, type EmailIssue, isTrustedEmailEntry, isEmailIssue } from '../types/email';

type GetTrustedResponse = { trusted: TrustedEmailEntry[] };
type GetIssuesResponse = { issues: EmailIssue[] };

export async function getTrustedEmails(): Promise<TrustedEmailEntry[]> {
  const res = await browser.runtime.sendMessage({ type: 'get-trusted-emails' });
  const data = res as Partial<GetTrustedResponse>;
  const trusted = Array.isArray(data?.trusted) ? data.trusted : [];
  return trusted.filter(isTrustedEmailEntry);
}

export async function trustEmail(email: string, ttlMs?: number): Promise<void> {
  await browser.runtime.sendMessage({ type: 'trust-email', email, ttlMs });
}

export async function untrustEmail(email: string): Promise<void> {
  await browser.runtime.sendMessage({ type: 'untrust-email', email });
}

export async function getEmailIssues(): Promise<EmailIssue[]> {
  const res = await browser.runtime.sendMessage({ type: 'get-email-issues' });
  const data = res as Partial<GetIssuesResponse>;
  const issues = Array.isArray(data?.issues) ? data.issues : [];
  return issues.filter(isEmailIssue);
}

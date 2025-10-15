import {
  getTrustedEmailsLocal,
  setTrustedEmailsLocal,
  getEmailIssuesLocal,
  setEmailIssuesLocal,
} from '../../storage/browser/browser';
import { type TrustedEmailEntry, type EmailIssue } from '../../types/email';

export function detectEmails(text: string) {
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
  return text.match(emailRegex) || [];
}

export function anonymizeEmails(text: string, emails: string[]) {
  let sanitized = text;
  for (const email of emails) {
    sanitized = sanitized.split(email).join("[EMAIL_ADDRESS]");
  }
  return sanitized;
}

export async function getTrustedEmails(): Promise<TrustedEmailEntry[]> {
  return await getTrustedEmailsLocal();
}

export async function cleanupExpiredTrusted(): Promise<TrustedEmailEntry[]> {
  const now = Date.now();
  const entries = await getTrustedEmails();
  const filtered = entries.filter(e => e.expiresAt > now);
  if (filtered.length !== entries.length) {
    await setTrustedEmailsLocal(filtered);
  }
  return filtered;
}

export async function isEmailTrusted(email: string) {
  const entries = await cleanupExpiredTrusted();
  return entries.some(e => e.email.toLowerCase() === email.toLowerCase());
}

export async function trustEmailForDuration(email: string, durationMs: number) {
  const now = Date.now();
  const entries = await cleanupExpiredTrusted();
  const without = entries.filter(e => e.email.toLowerCase() !== email.toLowerCase());
  const updated: TrustedEmailEntry[] = [
    ...without,
    { email, expiresAt: now + durationMs }
  ];
  await setTrustedEmailsLocal(updated);
}

export async function logEmailIssue(url: string, emails: string[]) {
  const prevIssues: EmailIssue[] = await getEmailIssuesLocal();
  prevIssues.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    timestamp: new Date().toISOString(),
    emails,
    url,
  });
  const limited = prevIssues.slice(-100);
  await setEmailIssuesLocal(limited);
}



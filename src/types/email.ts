export interface TrustedEmailEntry {
  email: string;
  expiresAt: number;
}

export interface EmailIssue {
  id: string;
  timestamp: string;
  emails: string[];
  url: string;
}

export function isTrustedEmailEntry(value: unknown): value is TrustedEmailEntry {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.email === 'string' && typeof obj.expiresAt === 'number';
}

export function isEmailIssue(value: unknown): value is EmailIssue {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' && obj.id.length > 0 &&
    typeof obj.timestamp === 'string' &&
    Array.isArray(obj.emails) &&
    typeof obj.url === 'string'
  );
}



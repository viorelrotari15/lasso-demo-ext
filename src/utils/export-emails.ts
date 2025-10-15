import { type EmailIssue } from '../types/email';

export const exportEmails = (emailIssues: EmailIssue[]) => {
    const dataStr = JSON.stringify(emailIssues, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `email-detections-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
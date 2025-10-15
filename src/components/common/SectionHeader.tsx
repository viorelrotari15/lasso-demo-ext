import React, { type ReactNode } from 'react';

type SectionHeaderProps = {
  title: string;
  description?: string;
  actionsRight?: ReactNode;
  className?: string;
};

export function SectionHeader({ title, description, actionsRight, className }: SectionHeaderProps) {
  return (
    <div className={className ?? 'mb-4'}>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">{title}</h2>
        {actionsRight}
      </div>
      {description ? (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{description}</p>
      ) : null}
    </div>
  );
}



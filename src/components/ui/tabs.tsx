'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  badge?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab, onChange, className }) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    if (onChange) onChange(id);
  };

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className={cn('w-full', className)}>
      <div className="flex border-b border-border overflow-x-auto no-scrollbar gap-2">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                'flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap',
                isActive
                  ? 'border-gold text-gold font-semibold'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
              )}
            >
              {tab.label}
              {tab.badge && (
                <span className={cn('text-xs px-1.5 py-0.5 rounded-full', isActive ? 'bg-gold/20 text-gold' : 'bg-elevated text-text-muted')}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="py-4">{activeContent}</div>
    </div>
  );
};

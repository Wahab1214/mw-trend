'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ items, allowMultiple = false, className }) => {
  const [openIds, setOpenIds] = React.useState<string[]>([]);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn('divide-y divide-border border-y border-border', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className="py-3">
            <button
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between text-left font-medium text-text-primary hover:text-gold transition-colors py-1"
            >
              <span className="text-sm font-semibold">{item.title}</span>
              <ChevronDown
                className={cn('h-4 w-4 shrink-0 text-text-muted transition-transform duration-200', isOpen && 'rotate-180 text-gold')}
              />
            </button>
            {isOpen && <div className="pt-2 pb-1 text-sm text-text-secondary leading-relaxed animate-in fade-in-50 duration-200">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
};

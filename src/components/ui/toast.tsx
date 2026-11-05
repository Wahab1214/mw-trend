'use client';

import * as React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = React.useCallback(
    (toast: Omit<ToastMessage, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = { ...toast, id };
      setToasts((prev) => [...prev, newToast]);

      const duration = toast.duration || 4000;
      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const success = React.useCallback((message: string, title?: string) => showToast({ type: 'success', message, title }), [showToast]);
  const error = React.useCallback((message: string, title?: string) => showToast({ type: 'error', message, title }), [showToast]);
  const info = React.useCallback((message: string, title?: string) => showToast({ type: 'info', message, title }), [showToast]);
  const warning = React.useCallback((message: string, title?: string) => showToast({ type: 'warning', message, title }), [showToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast, success, error, info, warning }}>
      {children}
      {/* Toast viewport */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl bg-surface transition-all animate-in slide-in-from-bottom-3 duration-200',
              t.type === 'success' && 'border-status-success/30 text-text-primary',
              t.type === 'error' && 'border-status-danger/30 text-text-primary',
              t.type === 'info' && 'border-status-info/30 text-text-primary',
              t.type === 'warning' && 'border-status-warning/30 text-text-primary'
            )}
          >
            <div className="shrink-0 mt-0.5">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-status-success" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-status-danger" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-status-info" />}
              {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-status-warning" />}
            </div>
            <div className="flex-1 text-sm">
              {t.title && <h5 className="font-semibold text-text-primary">{t.title}</h5>}
              <p className="text-xs text-text-secondary">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 text-text-muted hover:text-text-primary p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

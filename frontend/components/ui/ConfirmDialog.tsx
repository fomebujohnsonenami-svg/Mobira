'use client';

import React from 'react';
import { AlertTriangle, Trash2, X, AlertCircle, Info } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
  children,
}) => {
  const iconConfig = {
    danger: {
      icon: Trash2,
      bg: 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900',
      buttonBg: 'bg-rose-600 hover:bg-rose-700 text-white',
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900',
      buttonBg: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    info: {
      icon: Info,
      bg: 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900',
      buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
  };

  const currentIcon = iconConfig[variant];
  const IconComponent = currentIcon.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${currentIcon.bg}`}
          >
            <IconComponent className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {children && <div className="mt-2">{children}</div>}

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-navy-850">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="text-xs font-semibold"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
            className={`text-xs font-bold ${currentIcon.buttonBg}`}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

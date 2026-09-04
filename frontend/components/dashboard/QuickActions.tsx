'use client';

import React from 'react';
import Link from 'next/link';
import { Send, QrCode, ShieldCheck, Plus, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface QuickActionsProps {
  onOpenSendModal?: () => void;
  onOpenReceiveModal?: () => void;
  onOpenVerifyModal?: () => void;
  onOpenCreateListModal?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onOpenSendModal,
  onOpenReceiveModal,
  onOpenVerifyModal,
  onOpenCreateListModal,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 1. [ PAY ] */}
      <Button
        variant="primary"
        onClick={onOpenSendModal}
        className="text-xs font-black uppercase tracking-wider py-2 px-3.5 bg-yellow-500 hover:bg-yellow-400 text-navy-950 shadow-elevated gap-1.5"
      >
        <Send className="w-3.5 h-3.5 text-navy-950 fill-current" />
        [ PAY ]
      </Button>

      {/* 2. [ RECEIVE ] */}
      <Button
        variant="outline"
        onClick={onOpenReceiveModal}
        className="text-xs font-black uppercase tracking-wider py-2 px-3.5 border-slate-300 dark:border-navy-700 hover:border-yellow-500 gap-1.5"
      >
        <QrCode className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" />
        [ RECEIVE ]
      </Button>

      {/* 3. [ VERIFY BUSINESS ] */}
      <Button
        variant="outline"
        onClick={onOpenVerifyModal}
        className="text-xs font-black uppercase tracking-wider py-2 px-3.5 border-slate-300 dark:border-navy-700 hover:border-blue-500 gap-1.5"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        [ VERIFY BUSINESS ]
      </Button>

      {/* 4. [ CREATE PAYMENT LIST ] */}
      {onOpenCreateListModal ? (
        <Button
          variant="outline"
          onClick={onOpenCreateListModal}
          className="text-xs font-black uppercase tracking-wider py-2 px-3.5 border-slate-300 dark:border-navy-700 hover:border-yellow-500 gap-1.5"
        >
          <ListTodo className="w-3.5 h-3.5 text-yellow-500" />
          [ CREATE PAYMENT LIST ]
        </Button>
      ) : (
        <Link href="/payment-lists">
          <Button
            variant="outline"
            className="text-xs font-black uppercase tracking-wider py-2 px-3.5 border-slate-300 dark:border-navy-700 hover:border-yellow-500 gap-1.5"
          >
            <ListTodo className="w-3.5 h-3.5 text-yellow-500" />
            [ CREATE PAYMENT LIST ]
          </Button>
        </Link>
      )}
    </div>
  );
};

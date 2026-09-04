import React from 'react';
import { Card } from '@/components/ui/Card';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

export interface CashflowChartProps {
  monthlyTrends: Array<{
    month: string;
    disbursements?: number;
    collections?: number;
    disbursed?: number;
    collected?: number;
  }>;
}

export const CashflowChart: React.FC<CashflowChartProps> = ({ monthlyTrends }) => {
  const maxVal = Math.max(
    ...monthlyTrends.map((t) => {
      const d = t.disbursements ?? t.disbursed ?? 0;
      const c = t.collections ?? t.collected ?? 0;
      return Math.max(d, c);
    }),
    1000000
  );

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-navy-800">
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-navy-950 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-yellow-500" />
            Monthly Cashflow Velocity
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Disbursement volume vs. collections received
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-yellow-500" />
            <span className="text-slate-700 dark:text-slate-300">Collections (RECEIVE)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-navy-900 dark:bg-slate-300" />
            <span className="text-slate-700 dark:text-slate-300">Disbursements (PAY)</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-6 gap-3 sm:gap-6 items-end h-52 pt-6">
        {monthlyTrends.map((trend) => {
          const cVal = trend.collections ?? trend.collected ?? 0;
          const dVal = trend.disbursements ?? trend.disbursed ?? 0;
          const collPct = Math.round((cVal / maxVal) * 100);
          const disbPct = Math.round((dVal / maxVal) * 100);

          return (
            <div key={trend.month} className="flex flex-col items-center h-full justify-end group">
              <div className="flex items-end gap-1 sm:gap-2 w-full justify-center h-full">
                {/* Collected Bar (Yellow) */}
                <div
                  style={{ height: `${collPct}%` }}
                  className="w-3 sm:w-5 bg-yellow-500 rounded-t transition-all group-hover:brightness-110"
                  title={`Collected: ${formatCurrency(cVal)}`}
                />
                {/* Disbursed Bar (Deep Blue / Light Slate) */}
                <div
                  style={{ height: `${disbPct}%` }}
                  className="w-3 sm:w-5 bg-navy-900 dark:bg-slate-200 rounded-t transition-all group-hover:brightness-110"
                  title={`Disbursed: ${formatCurrency(dVal)}`}
                />
              </div>
              <span className="mt-2 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">
                {trend.month}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

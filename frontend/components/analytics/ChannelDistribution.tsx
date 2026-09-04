import React from 'react';
import { Card } from '@/components/ui/Card';
import { PieChart } from 'lucide-react';
import { formatCurrency, formatChannelName } from '@/lib/formatters';

export interface ChannelDistributionProps {
  channels: Array<{
    name?: string;
    channel?: string;
    volume: number;
    percentage: number;
    color?: string;
  }>;
}

export const ChannelDistribution: React.FC<ChannelDistributionProps> = ({ channels }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-navy-800">
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-navy-950 dark:text-slate-100 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-yellow-500" />
            Rail Volume Breakdown
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Diversification across MTN MoMo, Orange Money, and Bank EFT
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {channels.map((ch, idx) => {
          const label = ch.name || ch.channel || `Rail ${idx + 1}`;
          const isMoMo = label.toUpperCase().includes('MOMO');
          const isOrange = label.toUpperCase().includes('ORANGE');

          return (
            <div key={label} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-navy-950 dark:text-slate-200">
                  {formatChannelName(label)}
                </span>
                <span className="font-black text-navy-950 dark:text-slate-100 tabular-nums">
                  {formatCurrency(ch.volume)}{' '}
                  <span className="text-slate-500 font-normal">({ch.percentage}%)</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-navy-950 overflow-hidden">
                <div
                  style={{ width: `${ch.percentage}%` }}
                  className={`h-full rounded-full ${
                    isMoMo
                      ? 'bg-yellow-500'
                      : isOrange
                      ? 'bg-amber-600'
                      : 'bg-navy-800 dark:bg-slate-300'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

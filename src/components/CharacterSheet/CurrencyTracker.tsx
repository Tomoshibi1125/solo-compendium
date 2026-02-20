import React, { useState } from 'react';
import { Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Currency {
  cp: number;
  sp: number;
  ep: number;
  gp: number;
  pp: number;
}

interface CurrencyTrackerProps {
  currency: Currency;
  onUpdate: (currency: Currency) => void;
  isEditing: boolean;
}

const COIN_INFO: { key: keyof Currency; label: string; color: string; abbr: string }[] = [
  { key: 'pp', label: 'Platinum', color: 'text-slate-300 border-slate-300', abbr: 'PP' },
  { key: 'gp', label: 'Gold', color: 'text-yellow-500 border-yellow-400', abbr: 'GP' },
  { key: 'ep', label: 'Electrum', color: 'text-blue-300 border-blue-300', abbr: 'EP' },
  { key: 'sp', label: 'Silver', color: 'text-gray-400 border-gray-400', abbr: 'SP' },
  { key: 'cp', label: 'Copper', color: 'text-orange-600 border-orange-400', abbr: 'CP' },
];

export function CurrencyTracker({ currency, onUpdate, isEditing }: CurrencyTrackerProps) {
  const handleChange = (key: keyof Currency, value: number) => {
    onUpdate({ ...currency, [key]: Math.max(0, value) });
  };

  const totalGP =
    currency.pp * 10 +
    currency.gp +
    currency.ep * 0.5 +
    currency.sp * 0.1 +
    currency.cp * 0.01;

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
          <Coins className="h-4 w-4" /> Currency
        </h2>
        <span className="text-xs text-muted-foreground">
          ≈ {totalGP.toFixed(1)} GP total
        </span>
      </div>

      <div className="flex gap-2">
        {COIN_INFO.map(({ key, label, color, abbr }) => (
          <div key={key} className="flex-1 text-center">
            <div className={cn('text-[10px] font-semibold', color)}>{abbr}</div>
            {isEditing ? (
              <input
                type="number"
                min="0"
                value={currency[key]}
                onChange={(e) => handleChange(key, parseInt(e.target.value) || 0)}
                className="w-full px-1 py-0.5 border rounded text-center text-sm font-mono"
                aria-label={`${label} pieces`}
              />
            ) : (
              <div className="text-sm font-mono font-bold">{currency[key]}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Coffee, 
  Laptop, 
  Wifi, 
  Utensils, 
  Building, 
  Plane, 
  Car, 
  ShieldAlert, 
  Sparkles, 
  Zap, 
  Check, 
  Plus, 
  ArrowRight,
  ClipboardPaste,
  Tag
} from 'lucide-react';
import { NomadExpense } from '../../types';
import { NOMAD_CURRENCIES, getCurrency } from '../../data/currencies';

interface SmartExpenseQuickLoggerProps {
  currentCity?: string;
  onAddExpense: (expense: NomadExpense) => void;
  onPrefillModal?: (preset: {
    description: string;
    amount: string;
    currency: string;
    category: NomadExpense['category'];
    isDeductible: boolean;
  }) => void;
}

interface QuickExpensePreset {
  id: string;
  icon: React.ReactNode;
  label: string;
  defaultAmount: number;
  currency: string;
  category: NomadExpense['category'];
  isDeductible: boolean;
  notes: string;
}

export const SmartExpenseQuickLogger: React.FC<SmartExpenseQuickLoggerProps> = ({
  currentCity = 'Canggu, Bali',
  onAddExpense,
  onPrefillModal
}) => {
  const [smartPasteText, setSmartPasteText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick 1-Tap nomad expense presets
  const presets: QuickExpensePreset[] = [
    {
      id: 'cafe-coffee',
      icon: <Coffee className="w-3.5 h-3.5 text-amber-600" />,
      label: 'Cafe Work Session',
      defaultAmount: 4.5,
      currency: 'USD',
      category: 'Coworking & Cafes',
      isDeductible: true,
      notes: 'Espresso & laptop work session'
    },
    {
      id: 'coworking-day',
      icon: <Laptop className="w-3.5 h-3.5 text-orange-600" />,
      label: 'Coworking Day Pass',
      defaultAmount: 20,
      currency: 'USD',
      category: 'Coworking & Cafes',
      isDeductible: true,
      notes: 'High-speed fiber & standing desk'
    },
    {
      id: 'esim-data',
      icon: <Wifi className="w-3.5 h-3.5 text-blue-600" />,
      label: 'eSIM 5GB Data',
      defaultAmount: 14,
      currency: 'USD',
      category: 'Tech & Subscriptions',
      isDeductible: true,
      notes: 'Regional digital nomad eSIM package'
    },
    {
      id: 'street-food',
      icon: <Utensils className="w-3.5 h-3.5 text-emerald-600" />,
      label: 'Local Meal / Lunch',
      defaultAmount: 6.5,
      currency: 'USD',
      category: 'Food & Groceries',
      isDeductible: false,
      notes: 'Fresh nomad lunch'
    },
    {
      id: 'grab-ride',
      icon: <Car className="w-3.5 h-3.5 text-purple-600" />,
      label: 'Grab / Uber Scooter',
      defaultAmount: 4.5,
      currency: 'USD',
      category: 'Flights & Transit',
      isDeductible: false,
      notes: 'Transit to coworking'
    },
    {
      id: 'coliving-week',
      icon: <Building className="w-3.5 h-3.5 text-indigo-600" />,
      label: 'Coliving Room (Wk)',
      defaultAmount: 210,
      currency: 'USD',
      category: 'Accommodation',
      isDeductible: false,
      notes: 'Private room with ensuite'
    },
    {
      id: 'flight-hub',
      icon: <Plane className="w-3.5 h-3.5 text-cyan-600" />,
      label: 'Nomad Flight Transit',
      defaultAmount: 165,
      currency: 'USD',
      category: 'Flights & Transit',
      isDeductible: true,
      notes: 'Transit between digital nomad hubs'
    },
    {
      id: 'visa-fee',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />,
      label: 'Visa Extension / Stamp',
      defaultAmount: 45,
      currency: 'USD',
      category: 'Health & Visas',
      isDeductible: false,
      notes: 'Immigration extension fee'
    },
  ];

  const handle1TapLog = (preset: QuickExpensePreset) => {
    const curr = getCurrency(preset.currency);
    const amountUSD = Math.round(preset.defaultAmount * curr.rateInUSD);

    const newExpense: NomadExpense = {
      id: `exp-${Date.now()}`,
      description: preset.label,
      amount: preset.defaultAmount,
      currency: preset.currency,
      amountUSD,
      category: preset.category,
      isDeductible: preset.isDeductible,
      date: new Date().toISOString().split('T')[0],
      notes: `${preset.notes} • 1-Tap Quick-Logged in ${currentCity}`,
    };

    onAddExpense(newExpense);
    setToastMessage(`⚡ Quick-logged "${preset.label}" ($${amountUSD} USD)`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleParseAndFill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smartPasteText.trim()) return;

    const raw = smartPasteText.trim();
    let detectedCurrency = 'USD';
    let detectedAmount = 0;
    let detectedCategory: NomadExpense['category'] = 'Food & Groceries';
    let isDeductible = false;

    // Check currency
    const upper = raw.toUpperCase();
    if (upper.includes('EUR') || raw.includes('€')) detectedCurrency = 'EUR';
    else if (upper.includes('GBP') || raw.includes('£')) detectedCurrency = 'GBP';
    else if (upper.includes('THB') || raw.includes('฿')) detectedCurrency = 'THB';
    else if (upper.includes('IDR') || raw.includes('RP')) detectedCurrency = 'IDR';
    else if (upper.includes('MXN') || raw.includes('PESOS')) detectedCurrency = 'MXN';
    else if (upper.includes('VND') || raw.includes('₫')) detectedCurrency = 'VND';
    else {
      // Find matching currency from currencies list
      for (const c of NOMAD_CURRENCIES) {
        if (upper.includes(c.code)) {
          detectedCurrency = c.code;
          break;
        }
      }
    }

    // Extract first number (with optional decimal)
    const numMatch = raw.match(/(?:[\$€£฿]|USD|EUR|GBP|THB|IDR)?\s*([0-9]+(?:[.,][0-9]{1,2})?)/i);
    if (numMatch && numMatch[1]) {
      detectedAmount = parseFloat(numMatch[1].replace(',', '.'));
    }

    // Detect category & deductibility
    const lower = raw.toLowerCase();
    if (lower.includes('cowork') || lower.includes('wework') || lower.includes('selina') || lower.includes('desk') || lower.includes('day pass')) {
      detectedCategory = 'Coworking & Cafes';
      isDeductible = true;
    } else if (lower.includes('coffee') || lower.includes('cafe') || lower.includes('starbucks') || lower.includes('espresso') || lower.includes('matcha')) {
      detectedCategory = 'Coworking & Cafes';
      isDeductible = true;
    } else if (lower.includes('esim') || lower.includes('airalo') || lower.includes('sim') || lower.includes('wifi') || lower.includes('vpn') || lower.includes('starlink')) {
      detectedCategory = 'Tech & Subscriptions';
      isDeductible = true;
    } else if (lower.includes('grab') || lower.includes('uber') || lower.includes('flight') || lower.includes('scooter') || lower.includes('train') || lower.includes('taxi')) {
      detectedCategory = 'Flights & Transit';
    } else if (lower.includes('airbnb') || lower.includes('hotel') || lower.includes('hostel') || lower.includes('rent') || lower.includes('coliving')) {
      detectedCategory = 'Accommodation';
    } else if (lower.includes('visa') || lower.includes('immigration') || lower.includes('stamp') || lower.includes('passport')) {
      detectedCategory = 'Health & Visas';
    } else if (lower.includes('gym') || lower.includes('surf') || lower.includes('yoga') || lower.includes('massage')) {
      detectedCategory = 'Wellness & Leisure';
    }

    // Clean description
    let cleanDesc = raw
      .replace(/^(paid|spent|bought|received|bank:?|alert:?)\s*/i, '')
      .replace(/(?:[\$€£฿]|USD|EUR|GBP|THB|IDR)?\s*[0-9]+(?:[.,][0-9]{1,2})?/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanDesc) cleanDesc = 'Nomad Expense';

    if (onPrefillModal) {
      onPrefillModal({
        description: cleanDesc,
        amount: detectedAmount > 0 ? detectedAmount.toString() : '20',
        currency: detectedCurrency,
        category: detectedCategory,
        isDeductible,
      });
      setSmartPasteText('');
    } else {
      // Auto-log directly
      const curr = getCurrency(detectedCurrency);
      const amountUSD = Math.round((detectedAmount || 20) * curr.rateInUSD);
      const newExpense: NomadExpense = {
        id: `exp-${Date.now()}`,
        description: cleanDesc,
        amount: detectedAmount || 20,
        currency: detectedCurrency,
        amountUSD,
        category: detectedCategory,
        isDeductible,
        date: new Date().toISOString().split('T')[0],
        notes: `Auto-parsed from: "${raw}"`,
      };
      onAddExpense(newExpense);
      setToastMessage(`⚡ Auto-parsed & logged "${cleanDesc}" (${detectedCurrency} ${detectedAmount || 20})`);
      setSmartPasteText('');
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 leading-tight">
              1-Tap Nomad Quick Logger
            </h4>
            <p className="text-[10px] text-slate-500">
              Zero manual typing • Instant logging with standard nomad categories
            </p>
          </div>
        </div>

        {toastMessage && (
          <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold rounded-lg animate-in fade-in">
            {toastMessage}
          </span>
        )}
      </div>

      {/* 1-Tap Chips */}
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => handle1TapLog(preset)}
            className="group px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-orange-50/80 border border-slate-200 hover:border-orange-300 text-slate-700 text-xs font-medium transition-all flex items-center gap-1.5 active:scale-95 shadow-2xs"
            title={`Click to 1-tap log ${preset.label} ($${preset.defaultAmount})`}
          >
            {preset.icon}
            <span>{preset.label}</span>
            <span className="text-[10px] text-slate-600 group-hover:text-orange-600 font-bold">
              ${preset.defaultAmount}
            </span>
          </button>
        ))}
      </div>

      {/* Smart Paste / Bank Notification Parser Box */}
      <form onSubmit={handleParseAndFill} className="pt-1 border-t border-slate-100 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={smartPasteText}
            onChange={(e) => setSmartPasteText(e.target.value)}
            placeholder='Paste bank SMS or text: e.g. "Paid 18.50 EUR at Copenhagen Coffee Lab"'
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-orange-500 transition-colors"
          />
          <ClipboardPaste className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <button
          type="submit"
          disabled={!smartPasteText.trim()}
          className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 shadow-xs transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Auto-Parse & Fill</span>
          <span className="sm:hidden">Parse</span>
        </button>
      </form>
    </div>
  );
};

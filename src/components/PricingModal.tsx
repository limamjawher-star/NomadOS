import React, { useState } from 'react';
import { 
  Crown, 
  Check, 
  X, 
  MapPin, 
  Globe, 
  Bell, 
  Calendar, 
  BarChart3, 
  Tag, 
  Download, 
  ShieldCheck, 
  Scale, 
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { NomadUser } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: NomadUser;
  onUpgradePro: (plan: 'yearly' | 'monthly') => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpgradePro,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');
  const [promoCode, setPromoCode] = useState('');
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'NOMAD2026' || code === 'ORANGE' || code === 'PRO2026') {
      setDiscountPercent(100);
      setPromoSuccess('Code applied! 100% OFF Pro Access.');
    } else if (code === 'NOMAD50') {
      setDiscountPercent(50);
      setPromoSuccess('50% OFF applied!');
    } else {
      setPromoError('Invalid promo code. Try NOMAD2026');
    }
  };

  const handleUpgrade = () => {
    onUpgradePro(selectedPlan);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1600);
  };

  const basePrice = selectedPlan === 'yearly' ? 79.99 : 9.99;
  const finalPrice = discountPercent > 0 
    ? (basePrice * (1 - discountPercent / 100)).toFixed(2)
    : basePrice.toFixed(2);

  return (
    <div id="pricing-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        id="pricing-modal-card"
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-black text-xs shadow-md shadow-orange-500/20">
              👑
            </span>
            <span className="text-xs font-black text-orange-600 uppercase tracking-widest">
              NomadOS Pro
            </span>
          </div>
          <button
            id="pricing-close-btn"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Header Banner */}
          <div className="flex flex-col items-center text-center space-y-2.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/30">
              <Crown className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">Upgrade to Premium</h2>
            <p className="text-xs text-stone-500 max-w-sm leading-relaxed">
              Travel smarter. Manage visas, tax residency, expenses, and multi-country trips with no limits.
            </p>
          </div>

          {/* 10 Feature Pills in 2 Columns matching screenshot */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="flex items-start gap-2 p-2 rounded-xl bg-stone-50 border border-stone-100">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-snug">
                <span className="font-bold text-stone-900">Unlimited trips</span>
                <p className="text-stone-400">free: up to 5</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-xl bg-stone-50 border border-stone-100">
              <Globe className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-snug">
                <span className="font-bold text-stone-900">Unlimited visas</span>
                <p className="text-stone-400">free: up to 3</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-xl bg-stone-50 border border-stone-100">
              <Bell className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-snug">
                <span className="font-bold text-stone-900">Smart reminders</span>
                <p className="text-stone-400">visa, tax & docs</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-xl bg-stone-50 border border-stone-100">
              <Calendar className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-snug">
                <span className="font-bold text-stone-900">Day-by-day stops</span>
                <p className="text-stone-400">attachments & coliving</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-xl bg-stone-50 border border-stone-100">
              <BarChart3 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-snug">
                <span className="font-bold text-stone-900">Burn rate trends</span>
                <p className="text-stone-400">multi-currency stats</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-xl bg-stone-50 border border-stone-100">
              <Tag className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-snug">
                <span className="font-bold text-stone-900">Custom categories</span>
                <p className="text-stone-400">for business & life</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-xl bg-stone-50 border border-stone-100">
              <Download className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-snug">
                <span className="font-bold text-stone-900">CSV & PDF export</span>
                <p className="text-stone-400">accountant ready</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-xl bg-stone-50 border border-stone-100">
              <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-snug">
                <span className="font-bold text-stone-900">City rankings PRO</span>
                <p className="text-stone-400">full safety & speed data</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-xl bg-stone-50 border border-stone-100">
              <Scale className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-snug">
                <span className="font-bold text-stone-900">Tax residency tool</span>
                <p className="text-stone-400">50+ countries tracked</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-xl bg-stone-50 border border-stone-100">
              <SlidersHorizontal className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-snug">
                <span className="font-bold text-stone-900">Per-stop budgets</span>
                <p className="text-stone-400">full nomad discovery</p>
              </div>
            </div>
          </div>

          {/* 7-day free trial banner */}
          <div className="p-3 rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500 text-white text-xs">
                ⭐
              </span>
              <span className="text-xs font-bold text-orange-950">Try 7 days free</span>
            </div>
            <span className="text-[11px] font-semibold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
              No commitment · Cancel anytime
            </span>
          </div>

          {/* Plan Selector */}
          <div className="space-y-3">
            {/* Yearly */}
            <div
              onClick={() => setSelectedPlan('yearly')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedPlan === 'yearly'
                  ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20 shadow-sm'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === 'yearly' ? 'border-orange-500' : 'border-stone-300'
                }`}>
                  {selectedPlan === 'yearly' && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-stone-900">Yearly</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-500 text-white tracking-wider">
                      SAVE 33%
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">$6.66 / month billed annually</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-stone-900">$79.99</span>
                <span className="text-xs text-stone-500">/year</span>
              </div>
            </div>

            {/* Monthly */}
            <div
              onClick={() => setSelectedPlan('monthly')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedPlan === 'monthly'
                  ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20 shadow-sm'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === 'monthly' ? 'border-orange-500' : 'border-stone-300'
                }`}>
                  {selectedPlan === 'monthly' && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                </div>
                <div>
                  <span className="text-sm font-bold text-stone-900">Monthly</span>
                  <p className="text-xs text-stone-500">Flexible month-to-month</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-stone-900">$9.99</span>
                <span className="text-xs text-stone-500">/mo</span>
              </div>
            </div>
          </div>

          {/* Promo Code Toggle */}
          <div>
            {!showPromoInput ? (
              <button
                type="button"
                onClick={() => setShowPromoInput(true)}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1.5"
              >
                🏷️ Have a promo code?
              </button>
            ) : (
              <div className="space-y-2 pt-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code (e.g. NOMAD2026)"
                    className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold uppercase text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl"
                  >
                    Apply
                  </button>
                </div>
                {promoSuccess && <p className="text-[11px] text-emerald-600 font-bold">{promoSuccess}</p>}
                {promoError && <p className="text-[11px] text-rose-500 font-semibold">{promoError}</p>}
              </div>
            )}
          </div>

          {/* CTA Button */}
          <div className="pt-2">
            <button
              id="pricing-upgrade-cta-btn"
              onClick={handleUpgrade}
              disabled={isSuccess}
              className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] text-sm"
            >
              {isSuccess ? (
                <>
                  <Check className="w-5 h-5 text-white" />
                  <span>Welcome to NomadOS Pro! 🎉</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>
                    Get {selectedPlan === 'yearly' ? 'Yearly' : 'Monthly'} — ${finalPrice}
                    {selectedPlan === 'yearly' ? '/yr' : '/mo'}
                  </span>
                </>
              )}
            </button>
            <p className="text-[11px] text-stone-400 text-center mt-2">
              Billed securely. Renews automatically. Cancel anytime in one click.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

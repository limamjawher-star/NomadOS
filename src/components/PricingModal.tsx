import React, { useState } from 'react';
import { 
  Crown, 
  Check, 
  X, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Globe2, 
  Tag, 
  Minus,
  CheckCircle2
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
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly'>('yearly');
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
      setPromoSuccess('100% OFF Code Applied!');
    } else if (code === 'NOMAD50') {
      setDiscountPercent(50);
      setPromoSuccess('50% OFF Applied!');
    } else {
      setPromoError('Invalid promo code');
    }
  };

  const handleUpgrade = () => {
    onUpgradePro(billingCycle);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  const basePrice = billingCycle === 'yearly' ? 79.99 : 9.99;
  const finalPrice = discountPercent > 0 
    ? (basePrice * (1 - discountPercent / 100)).toFixed(2)
    : basePrice.toFixed(2);

  if (isSuccess) {
    return (
      <div id="pricing-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
        <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-center space-y-4 animate-in zoom-in-95">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
            <Crown className="w-8 h-8 animate-bounce" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">Welcome to NomadOS Pro!</h3>
            <p className="text-xs text-slate-500">All limits removed and pro features unlocked.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="pricing-overlay" 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="pricing-modal-card"
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative animate-in zoom-in-95 max-h-[92vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          id="pricing-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="pt-6 pb-2 px-6 text-center space-y-1 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold mb-1">
            <Crown className="w-3.5 h-3.5" />
            <span>NomadOS Plans</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-display tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Use the Free version with limited features, or unlock everything with Pro.
          </p>
        </div>

        {/* Side-by-side Plan Cards */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          {/* 1. FREE PLAN CARD */}
          <div className="rounded-3xl p-5 border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">Free Plan</span>
                {!user.isPro ? (
                  <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[10px] font-bold">
                    Current Plan
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold">
                    Basic
                  </span>
                )}
              </div>

              <div>
                <span className="text-3xl font-extrabold text-slate-900 font-display">$0</span>
                <span className="text-xs text-slate-500 ml-1">/ forever</span>
              </div>

              <p className="text-[11px] text-slate-500">
                Basic tools for casual remote trips with limited features.
              </p>

              {/* Free Feature List */}
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Up to 3 saved trips</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1 km Nomad Radar range</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Basic expense tracking</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Minus className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>No Schengen overstay guard</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Minus className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>No FEIE tax deduction shield</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Minus className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>No offline mode on flights</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              {!user.isPro ? 'Keep Free Plan' : 'Downgrade to Free'}
            </button>
          </div>

          {/* 2. PRO PLAN CARD (Highlighted) */}
          <div className="rounded-3xl p-5 border-2 border-orange-500 bg-orange-50/20 shadow-md flex flex-col justify-between space-y-4 relative">
            <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
              Unlimited Access
            </span>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-orange-500" />
                  <span>NomadOS Pro</span>
                </span>
              </div>

              {/* Billing Toggle (Yearly vs Monthly) */}
              <div className="grid grid-cols-2 p-1 bg-white rounded-xl border border-orange-200 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`py-1.5 rounded-lg transition-all text-center ${
                    billingCycle === 'yearly'
                      ? 'bg-orange-500 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Yearly (-33%)
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`py-1.5 rounded-lg transition-all text-center ${
                    billingCycle === 'monthly'
                      ? 'bg-orange-500 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Monthly
                </button>
              </div>

              {/* Pro Price */}
              <div>
                {billingCycle === 'yearly' ? (
                  <div>
                    <span className="text-3xl font-extrabold text-slate-900 font-display">
                      ${discountPercent > 0 ? finalPrice : '79.99'}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">/ year ($6.66/mo)</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-3xl font-extrabold text-slate-900 font-display">
                      ${discountPercent > 0 ? finalPrice : '9.99'}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">/ month</span>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-orange-700 font-medium">
                Everything unlimited for full-time digital nomads.
              </p>

              {/* Pro Feature List */}
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                  <span><strong>Unlimited</strong> trips & itineraries</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                  <span><strong>25 km</strong> 360° Nomad Live Radar</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>Schengen 90/180 Overstay Guard</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>FEIE $126.5k Tax & deductions engine</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>100% Offline mode on flights</span>
                </div>
              </div>
            </div>

            {/* Pro Upgrade Action */}
            <button
              id="pricing-upgrade-cta-btn"
              type="button"
              onClick={handleUpgrade}
              className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 flex items-center justify-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>
                Upgrade to Pro — ${finalPrice}{billingCycle === 'yearly' ? '/yr' : '/mo'}
              </span>
            </button>
          </div>
        </div>

        {/* Promo code & footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs shrink-0">
          <div>
            {!showPromoInput ? (
              <button
                type="button"
                onClick={() => setShowPromoInput(true)}
                className="text-[11px] font-medium text-slate-500 hover:text-orange-600 flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                <span>Have a promo code? (try NOMAD2026)</span>
              </button>
            ) : (
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Code (e.g. NOMAD2026)"
                  className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs uppercase text-slate-900 focus:outline-none focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-2.5 py-1 bg-slate-800 text-white text-xs font-semibold rounded-lg"
                >
                  Apply
                </button>
                {promoSuccess && <span className="text-[10px] text-emerald-600 font-bold self-center">{promoSuccess}</span>}
              </div>
            )}
          </div>

          <span className="text-[11px] text-slate-400">
            Cancel anytime in 1 click
          </span>
        </div>
      </div>
    </div>
  );
};

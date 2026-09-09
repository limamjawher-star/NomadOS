import React, { useState } from 'react';
import { 
  Smartphone, 
  Monitor, 
  QrCode, 
  Download, 
  Check, 
  Copy, 
  Sparkles, 
  X, 
  Globe, 
  ShieldCheck, 
  Plane, 
  Calculator,
  Compass
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface WelcomeMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: () => void;
}

export const WelcomeMobileModal: React.FC<WelcomeMobileModalProps> = ({
  isOpen,
  onClose,
  onOpenApp,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [activeMode, setActiveMode] = useState<'both' | 'mobile' | 'web'>('both');

  if (!isOpen) return null;

  const liveUrl = typeof window !== 'undefined' ? window.location.origin : 'https://nomados.app';

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(liveUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    }
  };

  return (
    <div
      id="welcome-mobile-app-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-stone-200/90 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Hero Banner */}
        <div className="relative bg-gradient-to-tr from-stone-900 via-stone-850 to-stone-900 p-6 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
                <Compass className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-white tracking-tight">
                    Nomad<span className="text-orange-400">OS</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold uppercase tracking-wider">
                    Live & Ready
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-0.5">
                  Web App & Installable Mobile App
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>

          <div className="mt-4 relative z-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white font-display leading-tight">
              Welcome to Your Nomad Operating System
            </h2>
            <p className="text-xs text-stone-300 mt-1 max-w-md font-normal leading-relaxed">
              Designed for remote workers, digital nomads, and frequent travelers. Use it right now on your browser or install it directly on your mobile home screen.
            </p>
          </div>
        </div>

        {/* Mode Selector / Overview */}
        <div className="p-5 space-y-4">
          
          {/* Dual Options Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Mobile App Option */}
            <div className="p-4 rounded-xl border border-stone-200/90 bg-stone-50/70 hover:bg-stone-50 hover:border-orange-300 transition-all flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-orange-600">
                    <Smartphone className="w-4 h-4" strokeWidth={1.75} />
                    <span className="text-xs font-semibold uppercase tracking-wider">Mobile App</span>
                  </div>
                  <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                    iOS & Android
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-stone-900 mt-2 font-display">
                  Home Screen Install
                </h3>
                <p className="text-xs text-stone-600 mt-1 font-normal leading-relaxed">
                  Standalone mobile experience with offline calculators, quick logging, and native bottom navigation.
                </p>
              </div>

              <div>
                {isInstalled ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium py-1.5">
                    <Check className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />
                    <span>App already installed on this device</span>
                  </div>
                ) : isInstallable ? (
                  <button
                    onClick={handleInstallClick}
                    className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium text-xs py-2 px-3 rounded-xl shadow-xs transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span>Install Mobile App Now</span>
                  </button>
                ) : isIOS ? (
                  <div className="text-[11px] text-stone-600 bg-white p-2.5 rounded-lg border border-stone-200/80 space-y-1">
                    <span className="font-semibold text-stone-800 block">How to install on iPhone:</span>
                    <span>1. Tap Safari <strong>Share</strong> button.</span><br />
                    <span>2. Select <strong>Add to Home Screen</strong>.</span>
                  </div>
                ) : (
                  <div className="text-[11px] text-stone-600 bg-white p-2 rounded-lg border border-stone-200/80">
                    <span>Scan with mobile phone to install instantly</span>
                  </div>
                )}
              </div>
            </div>

            {/* Web App Option */}
            <div className="p-4 rounded-xl border border-stone-200/90 bg-stone-50/70 hover:bg-stone-50 hover:border-orange-300 transition-all flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-stone-700">
                    <Monitor className="w-4 h-4 text-stone-600" strokeWidth={1.75} />
                    <span className="text-xs font-semibold uppercase tracking-wider">Web Workspace</span>
                  </div>
                  <span className="text-[10px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200/80">
                    Live Today
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-stone-900 mt-2 font-display">
                  Desktop & Tablet View
                </h3>
                <p className="text-xs text-stone-600 mt-1 font-normal leading-relaxed">
                  Full dual-column command center, financial models, trip management, and multi-country tax trackers.
                </p>
              </div>

              <button
                onClick={() => {
                  onOpenApp();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs py-2 px-3 rounded-xl transition cursor-pointer"
              >
                <Monitor className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>Open Web App</span>
              </button>
            </div>
          </div>

          {/* QR Code & Share Link Section */}
          <div className="p-3.5 rounded-xl border border-stone-200/90 bg-white space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-orange-600" strokeWidth={1.75} />
                <span>Open on your Mobile Phone</span>
              </span>
              <span className="text-[10px] text-stone-400 font-medium">Point phone camera</span>
            </div>

            <div className="flex items-center gap-3">
              {/* SVG QR Code Illustration */}
              <div className="w-16 h-16 bg-stone-50 border border-stone-200 rounded-lg p-1.5 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-stone-800 fill-current">
                  {/* Outer corner markers */}
                  <rect x="5" y="5" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" rx="4"/>
                  <rect x="13" y="13" width="12" height="12" rx="2"/>
                  <rect x="67" y="5" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" rx="4"/>
                  <rect x="75" y="13" width="12" height="12" rx="2"/>
                  <rect x="5" y="67" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" rx="4"/>
                  <rect x="13" y="75" width="12" height="12" rx="2"/>
                  {/* Pattern dots */}
                  <rect x="42" y="10" width="8" height="8" rx="1"/>
                  <rect x="52" y="20" width="8" height="8" rx="1"/>
                  <rect x="42" y="32" width="8" height="8" rx="1"/>
                  <rect x="10" y="42" width="8" height="8" rx="1"/>
                  <rect x="22" y="52" width="8" height="8" rx="1"/>
                  <rect x="42" y="45" width="16" height="16" rx="2" fill="#ea580c"/>
                  <rect x="68" y="42" width="8" height="8" rx="1"/>
                  <rect x="80" y="52" width="8" height="8" rx="1"/>
                  <rect x="68" y="68" width="8" height="8" rx="1"/>
                  <rect x="80" y="80" width="8" height="8" rx="1"/>
                  <rect x="42" y="75" width="8" height="8" rx="1"/>
                  <rect x="52" y="85" width="8" height="8" rx="1"/>
                </svg>
              </div>

              {/* URL and Copy button */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-stone-500 truncate font-mono">
                  {liveUrl}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <button
                    onClick={handleCopyUrl}
                    className="inline-flex items-center gap-1 text-xs font-medium text-stone-700 hover:text-orange-600 bg-stone-100 hover:bg-stone-200/80 px-2.5 py-1 rounded-lg transition cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" strokeWidth={1.75} />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-stone-500" strokeWidth={1.75} />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                  <span className="text-[11px] text-stone-400">
                    Works in Safari, Chrome & Samsung Internet
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Feature Checklist */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
              <span className="text-[10px] text-stone-500 uppercase font-medium block">Schengen 90/180</span>
              <span className="text-xs font-semibold text-emerald-700">Live Tracker</span>
            </div>
            <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
              <span className="text-[10px] text-stone-500 uppercase font-medium block">Tax Residency</span>
              <span className="text-xs font-semibold text-orange-600">183-Day Guard</span>
            </div>
            <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
              <span className="text-[10px] text-stone-500 uppercase font-medium block">Offline Storage</span>
              <span className="text-xs font-semibold text-stone-800">Auto-Cached</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-200/80 flex items-center justify-between">
          <span className="text-[11px] text-stone-400 font-normal">
            App Store & Google Play native wrappers coming soon
          </span>

          <button
            onClick={() => {
              onOpenApp();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium text-xs shadow-xs transition cursor-pointer"
          >
            Start Exploring
          </button>
        </div>

      </div>
    </div>
  );
};

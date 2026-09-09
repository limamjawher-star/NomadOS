import React, { useState } from 'react';
import { Download, Smartphone, Check, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'primary' | 'minimal' | 'chip';
  onOpenMobileGuide?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'minimal',
  onOpenMobileGuide,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running in standalone mode on home screen
  if (isInstalled) {
    return (
      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
        <Check className="w-3 h-3 text-emerald-600" strokeWidth={1.75} />
        <span>Installed App</span>
      </span>
    );
  }

  const handleAction = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome && onOpenMobileGuide) {
        onOpenMobileGuide();
      }
    } else if (isIOS) {
      if (onOpenMobileGuide) {
        onOpenMobileGuide();
      } else {
        setShowIOSGuide(true);
      }
    } else if (onOpenMobileGuide) {
      onOpenMobileGuide();
    }
  };

  const buttonStyle =
    variant === 'primary'
      ? 'bg-orange-600 hover:bg-orange-700 text-white font-medium text-xs px-3.5 py-2 rounded-xl shadow-xs'
      : variant === 'chip'
      ? 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200/80 font-medium text-[11px] px-2.5 py-1 rounded-full'
      : 'text-stone-600 hover:text-orange-600 hover:bg-stone-100 font-medium text-xs px-2.5 py-1.5 rounded-lg border border-stone-200/80';

  return (
    <>
      <button
        id="pwa-install-header-btn"
        onClick={handleAction}
        className={`flex items-center gap-1.5 transition-all cursor-pointer ${buttonStyle} ${className}`}
        title="Install NomadOS App"
      >
        {isInstallable ? (
          <Download className="w-3.5 h-3.5 text-orange-600" strokeWidth={1.75} />
        ) : (
          <Smartphone className="w-3.5 h-3.5 text-orange-600" strokeWidth={1.75} />
        )}
        <span>{isInstallable ? 'Install App' : 'Get Mobile App'}</span>
      </button>

      {showIOSGuide && (
        <div
          id="ios-pwa-guide-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center">
                  <Smartphone className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <h3 className="text-sm font-semibold text-stone-900">Install on iPhone & iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-stone-600">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700 font-semibold text-[10px]">
                  1
                </span>
                <p>
                  Tap the Safari <strong>Share</strong> icon (the square with an arrow pointing up) at the bottom toolbar.
                </p>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700 font-semibold text-[10px]">
                  2
                </span>
                <p>
                  Scroll down the menu and tap <strong>Add to Home Screen</strong>.
                </p>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700 font-semibold text-[10px]">
                  3
                </span>
                <p>
                  Tap <strong>Add</strong> in the top-right corner. NomadOS will launch like a native mobile app!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-stone-900 py-2.5 text-xs font-semibold text-white hover:bg-stone-800 transition cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

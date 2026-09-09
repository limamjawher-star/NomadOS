import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from 'lucide-react';

interface DeviceSimulatorProps {
  deviceMode: 'web' | 'ios' | 'android';
  children: React.ReactNode;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  deviceMode,
  children,
}) => {
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // When viewed on an actual mobile device or in 'web' mode, render native full-bleed
  if (deviceMode === 'web' || isMobileScreen) {
    return (
      <div className="w-full min-h-screen bg-stone-50 flex flex-col">
        {children}
      </div>
    );
  }

  if (deviceMode === 'ios') {
    return (
      <div className="py-6 px-2 sm:px-6 flex justify-center items-start min-h-screen bg-stone-900/90 backdrop-blur-md">
        {/* iPhone Chassis on Desktop */}
        <div className="relative w-full max-w-[420px] rounded-[50px] border-[12px] border-stone-900 bg-white shadow-2xl overflow-hidden ring-1 ring-white/20 flex flex-col min-h-[850px] max-h-[92vh]">
          {/* Status Bar & Dynamic Island */}
          <div className="bg-white/95 backdrop-blur-md px-7 pt-3.5 pb-2 flex items-center justify-between z-30 shrink-0 select-none border-b border-stone-100">
            <span className="text-[13px] font-bold text-stone-900 tracking-tight">9:41</span>
            {/* Dynamic Island pill */}
            <div className="w-24 h-6 bg-black rounded-full flex items-center justify-center gap-2 px-2 shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500/90" />
              <div className="w-2 h-2 rounded-full bg-stone-800" />
            </div>
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-stone-900">
              <span className="text-[10px] font-mono font-bold text-stone-600">5G</span>
              <Battery className="w-4 h-4 fill-stone-900" strokeWidth={1.75} />
            </div>
          </div>

          {/* Screen Content Container with inner scroll */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative bg-stone-50">
            {children}
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="bg-white/95 backdrop-blur-md py-2 flex justify-center z-30 shrink-0 select-none">
            <div className="w-32 h-1 bg-stone-900/80 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // Android Pixel frame on Desktop
  return (
    <div className="py-6 px-2 sm:px-6 flex justify-center items-start min-h-screen bg-stone-900/90 backdrop-blur-md">
      {/* Android Chassis */}
      <div className="relative w-full max-w-[420px] rounded-[44px] border-[10px] border-stone-900 bg-white shadow-2xl overflow-hidden ring-1 ring-white/20 flex flex-col min-h-[850px] max-h-[92vh]">
        {/* Status Bar & Camera punchhole */}
        <div className="bg-white/95 backdrop-blur-md px-6 pt-2.5 pb-2 flex items-center justify-between z-30 shrink-0 select-none border-b border-stone-100">
          <span className="text-xs font-semibold text-stone-900">9:41</span>
          {/* Centered punchhole */}
          <div className="w-3.5 h-3.5 bg-black rounded-full border border-stone-700 shadow-inner" />
          <div className="flex items-center gap-1.5 text-xs text-stone-900 font-medium">
            <Wifi className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span className="text-[11px]">98%</span>
          </div>
        </div>

        {/* Screen Content Container with inner scroll */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative bg-stone-50">
          {children}
        </div>

        {/* Android Gesture Navigation Line */}
        <div className="bg-white/95 backdrop-blur-md py-2.5 flex justify-center z-30 shrink-0 select-none">
          <div className="w-20 h-1 bg-stone-500 rounded-full" />
        </div>
      </div>
    </div>
  );

};

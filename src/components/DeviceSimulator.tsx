import React from 'react';
import { Smartphone, Monitor, Globe, Shield, Wifi, Battery, Sparkles } from 'lucide-react';

interface DeviceSimulatorProps {
  deviceMode: 'web' | 'ios' | 'android';
  children: React.ReactNode;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  deviceMode,
  children,
}) => {
  if (deviceMode === 'web') {
    return (
      <div className="w-full min-h-screen">
        {children}
      </div>
    );
  }

  if (deviceMode === 'ios') {
    return (
      <div className="py-6 px-2 sm:px-6 flex justify-center items-start min-h-screen bg-stone-900/90 backdrop-blur-md">
        {/* iPhone Chassis */}
        <div className="relative w-full max-w-[420px] rounded-[54px] border-[12px] border-stone-800 bg-white shadow-2xl overflow-hidden ring-1 ring-stone-700/50 flex flex-col min-h-[850px] max-h-[92vh]">
          {/* Status Bar & Dynamic Island */}
          <div className="bg-white/95 backdrop-blur-md px-7 pt-3 pb-2 flex items-center justify-between z-30 shrink-0 select-none border-b border-stone-100">
            <span className="text-[13px] font-black text-stone-900 tracking-tight">17:53</span>
            {/* Dynamic Island pill */}
            <div className="w-24 h-6 bg-stone-950 rounded-full flex items-center justify-center gap-2 px-2 shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500/80" />
              <div className="w-2 h-2 rounded-full bg-stone-800" />
            </div>
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-stone-900">
              <span className="text-[11px] font-mono">5G</span>
              <Battery className="w-4 h-4 fill-stone-900" />
            </div>
          </div>

          {/* Screen Content Container with inner scroll */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative bg-[#fafafa]">
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

  // Android Pixel frame
  return (
    <div className="py-6 px-2 sm:px-6 flex justify-center items-start min-h-screen bg-stone-900/90 backdrop-blur-md">
      {/* Android Chassis */}
      <div className="relative w-full max-w-[420px] rounded-[44px] border-[10px] border-stone-800 bg-white shadow-2xl overflow-hidden ring-1 ring-stone-700/50 flex flex-col min-h-[850px] max-h-[92vh]">
        {/* Status Bar & Camera punchhole */}
        <div className="bg-white/95 backdrop-blur-md px-6 pt-2.5 pb-2 flex items-center justify-between z-30 shrink-0 select-none border-b border-stone-100">
          <span className="text-xs font-bold text-stone-900">17:53</span>
          {/* Centered punchhole */}
          <div className="w-3.5 h-3.5 bg-stone-950 rounded-full border border-stone-800 shadow-inner" />
          <div className="flex items-center gap-1.5 text-xs text-stone-900 font-bold">
            <Wifi className="w-3.5 h-3.5" />
            <span>98%</span>
          </div>
        </div>

        {/* Screen Content Container with inner scroll */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative bg-[#fafafa]">
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

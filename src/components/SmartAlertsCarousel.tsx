import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  AlertCircle,
  Clock, 
  FileText, 
  Plane, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Globe
} from 'lucide-react';

export type AlertBadgeIconType = 'schengen' | 'visa' | 'doc' | 'trip' | 'passport';

export interface SmartAlertItem {
  id: string;
  category: 'visa' | 'schengen' | 'doc' | 'trip' | 'passport';
  pillLabel: string;
  badgeType: AlertBadgeIconType;
  title: string;
  message: string;
  timeLabel: string;
  actionText?: string;
}

export const SMART_ALERTS_DATA: SmartAlertItem[] = [
  {
    id: 'alert-schengen',
    category: 'schengen',
    pillLabel: 'Schengen overstay',
    badgeType: 'schengen',
    title: 'Schengen overstay risk',
    message: "You'll exceed the 90/180 limit by 5 days at your next entry. Adjust your plans.",
    timeLabel: 'now',
    actionText: 'Adjust dates in Calculator',
  },
  {
    id: 'alert-visa-expiry',
    category: 'visa',
    pillLabel: 'Visa expiry',
    badgeType: 'visa',
    title: 'Vietnam e-Visa expires in 13 days',
    message: 'Your 90-day single entry visa expires on May 20. Renew online or confirm international flight departure.',
    timeLabel: '2m ago',
    actionText: 'Open Vietnam Visa Portal',
  },
  {
    id: 'alert-pending-docs',
    category: 'doc',
    pillLabel: 'Pending docs',
    badgeType: 'doc',
    title: '6 documents pending across 3 visas',
    message: 'Missing onward flight ticket for Bali B213 VoA and proof of funds for DTV renewal.',
    timeLabel: '1h ago',
    actionText: 'Review Nomad Vault',
  },
  {
    id: 'alert-trip-reminders',
    category: 'trip',
    pillLabel: 'Trip reminders',
    badgeType: 'trip',
    title: 'Mexico City workation starts in 28 days',
    message: 'Check Roma Norte coliving reservation and FMM immigration waiver validity.',
    timeLabel: '3h ago',
    actionText: 'View Trip Itinerary',
  },
  {
    id: 'alert-passport',
    category: 'passport',
    pillLabel: 'Passport alerts',
    badgeType: 'passport',
    title: 'Passport validity verified (2.5 years remaining)',
    message: 'All ASEAN and Schengen borders require minimum 6 months validity. Your document is safe.',
    timeLabel: 'Yesterday',
    actionText: 'View Passport Card',
  },
];

const renderAlertIcon = (type: AlertBadgeIconType, className = 'w-4 h-4') => {
  switch (type) {
    case 'schengen':
      return <AlertCircle className={`${className} text-rose-500`} />;
    case 'visa':
      return <AlertTriangle className={`${className} text-amber-500`} />;
    case 'doc':
      return <FileText className={`${className} text-orange-500`} />;
    case 'trip':
      return <Plane className={`${className} text-sky-400`} />;
    case 'passport':
      return <ShieldCheck className={`${className} text-emerald-400`} />;
    default:
      return <Bell className={`${className} text-orange-500`} />;
  }
};

interface SmartAlertsCarouselProps {
  onActionClick?: (item: SmartAlertItem) => void;
  className?: string;
}

export const SmartAlertsCarousel: React.FC<SmartAlertsCarouselProps> = ({
  onActionClick,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeAlert = SMART_ALERTS_DATA[currentIndex];

  const handleSelectCategory = (index: number) => {
    setCurrentIndex(index);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SMART_ALERTS_DATA.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SMART_ALERTS_DATA.length) % SMART_ALERTS_DATA.length);
  };

  return (
    <div className={`space-y-6 max-w-xl mx-auto ${className}`}>
      {/* Interactive Push Notification Banner */}
      <div className="relative group">
        <div 
          id="smart-push-notification-card"
          className="bg-slate-950 text-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-800 transition-all duration-300 transform hover:scale-[1.01]"
        >
          {/* Header row */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-orange-600/30">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-200 text-sm tracking-tight">NomadOS</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-medium">{activeAlert.timeLabel}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                aria-label="Previous alert"
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next alert"
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                {renderAlertIcon(activeAlert.badgeType, 'w-4 h-4')}
              </div>
              <h4 className="text-base font-extrabold text-white tracking-tight">
                {activeAlert.title}
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal pl-8">
              {activeAlert.message}
            </p>
          </div>

          {/* Action button */}
          {activeAlert.actionText && (
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Auto-synced from live trip rules</span>
              <button
                onClick={() => onActionClick && onActionClick(activeAlert)}
                className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
              >
                <span>{activeAlert.actionText}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dots Pagination */}
      <div className="flex items-center justify-center gap-2 py-1">
        {SMART_ALERTS_DATA.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectCategory(idx)}
            aria-label={`Go to alert ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIndex
                ? 'w-6 h-2 bg-orange-600'
                : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>

      {/* Pill buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {SMART_ALERTS_DATA.map((item, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectCategory(idx)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                isActive
                  ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-500/25 scale-105'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <span className="shrink-0">{renderAlertIcon(item.badgeType, 'w-3.5 h-3.5')}</span>
              <span>{item.pillLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

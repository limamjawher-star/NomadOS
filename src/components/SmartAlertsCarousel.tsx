import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Plane, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export interface SmartAlertItem {
  id: string;
  category: 'visa' | 'schengen' | 'doc' | 'trip' | 'passport';
  pillLabel: string;
  pillIcon: string;
  pillColor: string;
  badgeType: '🔴' | '⚠️' | '📋' | '✈️' | '🛡️';
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
    pillIcon: '🔴',
    pillColor: 'text-rose-600 bg-rose-50 border-rose-200',
    badgeType: '🔴',
    title: 'Schengen overstay risk',
    message: "You'll exceed the 90/180 limit by 5 days at your next entry. Adjust your plans.",
    timeLabel: 'now',
    actionText: 'Adjust dates in Calculator',
  },
  {
    id: 'alert-visa-expiry',
    category: 'visa',
    pillLabel: 'Visa expiry',
    pillIcon: '⚠️',
    pillColor: 'text-amber-600 bg-amber-50 border-amber-200',
    badgeType: '⚠️',
    title: 'Vietnam e-Visa expires in 13 days',
    message: 'Your 90-day single entry visa expires on May 20. Renew online or confirm international flight departure.',
    timeLabel: '2m ago',
    actionText: 'Open Vietnam Visa Portal',
  },
  {
    id: 'alert-pending-docs',
    category: 'doc',
    pillLabel: 'Pending docs',
    pillIcon: '📋',
    pillColor: 'text-purple-600 bg-purple-50 border-purple-200',
    badgeType: '📋',
    title: '6 documents pending across 3 visas',
    message: 'Missing onward flight ticket for Bali B213 VoA and proof of funds for DTV renewal.',
    timeLabel: '1h ago',
    actionText: 'Review Nomad Vault',
  },
  {
    id: 'alert-trip-reminders',
    category: 'trip',
    pillLabel: 'Trip reminders',
    pillIcon: '✈️',
    pillColor: 'text-blue-600 bg-blue-50 border-blue-200',
    badgeType: '✈️',
    title: 'Mexico City workation starts in 28 days',
    message: 'Check Roma Norte coliving reservation and FMM immigration waiver validity.',
    timeLabel: '3h ago',
    actionText: 'View Trip Itinerary',
  },
  {
    id: 'alert-passport',
    category: 'passport',
    pillLabel: 'Passport alerts',
    pillIcon: '🛡️',
    pillColor: 'text-teal-600 bg-teal-50 border-teal-200',
    badgeType: '🛡️',
    title: 'Passport validity verified (2.5 years remaining)',
    message: 'All ASEAN and Schengen borders require minimum 6 months validity. Your document is safe.',
    timeLabel: 'Yesterday',
    actionText: 'View Passport Card',
  },
];

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
      {/* Interactive Push Notification Banner (matching screenshot 7) */}
      <div className="relative group">
        <div 
          id="smart-push-notification-card"
          className="bg-[#18181b] text-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-800 transition-all duration-300 transform hover:scale-[1.01]"
        >
          {/* Header row */}
          <div className="flex items-center justify-between text-xs text-stone-400 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-purple-600/30">
                🌐
              </div>
              <span className="font-bold text-stone-200 text-sm">NomadOS</span>
              <span className="text-stone-500">•</span>
              <span className="text-stone-400">{activeAlert.timeLabel}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                aria-label="Previous alert"
                className="w-7 h-7 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next alert"
                className="w-7 h-7 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-sm">{activeAlert.badgeType}</span>
              <h4 className="text-base font-extrabold text-white tracking-tight">
                {activeAlert.title}
              </h4>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed font-normal">
              {activeAlert.message}
            </p>
          </div>

          {/* Action button */}
          {activeAlert.actionText && (
            <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between">
              <span className="text-[11px] text-stone-400 font-medium">Auto-synced from live trip rules</span>
              <button
                onClick={() => onActionClick && onActionClick(activeAlert)}
                className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
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
                ? 'w-6 h-2 bg-purple-600'
                : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
            }`}
          />
        ))}
      </div>

      {/* Pill buttons (matching Screenshot 7) */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {SMART_ALERTS_DATA.map((item, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectCategory(idx)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                isActive
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/25 scale-105'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
              }`}
            >
              <span>{item.pillIcon}</span>
              <span>{item.pillLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

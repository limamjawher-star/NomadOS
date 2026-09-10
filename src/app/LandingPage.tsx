import React, { useState } from 'react';
import { 
  Globe, 
  ArrowRight, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Bell, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Clock, 
  Plane, 
  ChevronRight, 
  FileText, 
  Smartphone, 
  Monitor, 
  Star,
  ExternalLink,
  Plus,
  Flame,
  AlertTriangle,
  Crown,
  MessageSquare,
  Coffee,
  Laptop,
  Beer,
  Palmtree,
  Activity,
  PartyPopper,
  Building2
} from 'lucide-react';
import { NomadState } from '../types';
import { SmartAlertsCarousel } from '../components/feedback/SmartAlertsCarousel';
import { DayItineraryView } from '../features/travel/DayItineraryView';
import { MultiStopTripView } from '../features/travel/MultiStopTripView';
import { CountryFlag } from '../components/ui/CountryFlag';

interface LandingPageProps {
  state: NomadState;
  onLaunchApp: (tab?: 'home' | 'travel' | 'finance' | 'explore' | 'social' | 'me') => void;
  onOpenPricing: () => void;
  onOpenAuth: () => void;
  onOpenOnboarding: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  state,
  onLaunchApp,
  onOpenPricing,
  onOpenAuth,
  onOpenOnboarding,
}) => {
  const [activeFeatureTab, setActiveFeatureTab] = useState<'command' | 'visas' | 'trips' | 'daily' | 'expenses' | 'community'>('command');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="nomados-landing-page" className="min-h-screen bg-[#fafaf9] text-stone-900 selection:bg-orange-600 selection:text-white">
      {/* 1. Header (matching Screenshot 1 & 9) */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-semibold text-lg shadow-xs">
            <Globe className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <span className="text-lg font-semibold tracking-tight text-stone-900">
            NomadOS
          </span>
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-stone-600">
          <button onClick={() => scrollToSection('section-command')} className="hover:text-orange-600 transition-colors cursor-pointer">
            Features
          </button>
          <button onClick={() => scrollToSection('section-how-it-works')} className="hover:text-orange-600 transition-colors cursor-pointer">
            How it works
          </button>
          <button onClick={() => scrollToSection('section-community')} className="hover:text-orange-600 transition-colors cursor-pointer">
            Community
          </button>
          <button onClick={() => scrollToSection('section-alerts')} className="hover:text-orange-600 transition-colors cursor-pointer">
            Security & Alerts
          </button>
          <button onClick={onOpenPricing} className="hover:text-orange-600 transition-colors cursor-pointer">
            Pricing
          </button>
        </nav>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenAuth}
            className="px-3.5 sm:px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          >
            Sign in
          </button>
          <button
            onClick={() => onLaunchApp('home')}
            id="landing-launch-app-btn"
            className="px-4 sm:px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-full shadow-xs flex items-center gap-1.5 transition-all transform active:scale-95 cursor-pointer"
          >
            <span>Launch App</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </header>

      {/* 2. Hero Section (matching Screenshot 1 & 9) */}
      <section className="pt-12 sm:pt-20 pb-16 px-4 sm:px-8 max-w-6xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-orange-700 text-xs font-semibold tracking-wider uppercase animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" strokeWidth={1.75} />
          <span>THE APP THAT TRAVELS WITH YOU</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold text-stone-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
          One app . <span className="text-orange-600">Every country</span> . <span className="text-stone-900">Every visa</span> . <span className="text-orange-600">Every adventure</span> .
        </h1>

        <p className="text-sm sm:text-base text-stone-500 max-w-2xl mx-auto font-normal leading-relaxed">
          Built by nomads who got tired of juggling 5 different apps and still overstaying visas.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onLaunchApp('home')}
            id="hero-get-app-btn"
            className="px-6 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-full shadow-xs flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
          >
            <span>Launch NomadOS</span>
            <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
          </button>
          <button
            onClick={() => onLaunchApp('travel')}
            className="px-6 py-3.5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-semibold text-sm rounded-full shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Interactive Demo</span>
            <ExternalLink className="w-4 h-4 text-stone-400" strokeWidth={1.75} />
          </button>
        </div>

        {/* Feature Interactive Showcase Bar */}
        <div className="pt-8 max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-stone-100/80 rounded-2xl border border-stone-200/80">
            <button
              onClick={() => setActiveFeatureTab('command')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeFeatureTab === 'command'
                  ? 'bg-white text-orange-700 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              1. Command Center
            </button>
            <button
              onClick={() => setActiveFeatureTab('visas')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFeatureTab === 'visas'
                  ? 'bg-white text-orange-700 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              2. Visa Tracking
            </button>
            <button
              onClick={() => setActiveFeatureTab('trips')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFeatureTab === 'trips'
                  ? 'bg-white text-orange-700 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              3. Trip Planning
            </button>
            <button
              onClick={() => setActiveFeatureTab('daily')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFeatureTab === 'daily'
                  ? 'bg-white text-orange-700 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              4. Day-by-Day AI
            </button>
            <button
              onClick={() => setActiveFeatureTab('expenses')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFeatureTab === 'expenses'
                  ? 'bg-white text-orange-700 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              5. Expenses
            </button>
            <button
              onClick={() => setActiveFeatureTab('community')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFeatureTab === 'community'
                  ? 'bg-white text-orange-700 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              6. Meetups
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Preview Mockup */}
        <div className="relative pt-6 max-w-xl mx-auto">
          {/* Floating Callout Badges (matching Screenshot 1) */}
          <div className="absolute -top-1 left-2 sm:-left-12 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-white rounded-full text-xs font-semibold shadow-md shadow-amber-500/20 animate-bounce">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-100" strokeWidth={1.75} />
            <span>Visa expires in 13 days</span>
          </div>

          <div className="absolute top-16 right-2 sm:-right-12 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 bg-orange-600 text-white rounded-full text-xs font-semibold shadow-md shadow-orange-600/20">
            <Plane className="w-3.5 h-3.5 text-orange-100" strokeWidth={1.75} />
            <span>Next: Mexico City in 28d</span>
          </div>

          {/* Phone Frame Container */}
          <div className="bg-white rounded-[2.5rem] p-4 sm:p-5 border-4 border-stone-800/90 shadow-xl relative text-left">
            {/* Status bar */}
            <div className="flex items-center justify-between text-xs font-medium text-stone-500 pb-3 border-b border-stone-100">
              <span>17:53</span>
              <div className="w-16 h-3 bg-stone-900 rounded-full mx-auto" />
              <span>5G · 98%</span>
            </div>

            {/* Content per feature tab */}
            <div className="pt-4 max-h-[540px] overflow-y-auto no-scrollbar space-y-4">
              {activeFeatureTab === 'command' && (
                <div className="space-y-4">
                  {/* Top Bar inside mockup */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-medium text-xs">
                        <Globe className="w-4 h-4" strokeWidth={1.75} />
                      </div>
                      <span className="font-semibold text-stone-900 text-sm">NomadOS</span>
                    </div>
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-semibold rounded-full flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-700" strokeWidth={1.75} />
                      <span>PRO</span>
                    </span>
                  </div>

                  {/* 4 Cards Grid (matching Screenshot 1) */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 flex flex-col justify-between h-24">
                      <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-orange-600" strokeWidth={1.75} /> Location</span>
                        <ChevronRight className="w-3 h-3 text-stone-400" strokeWidth={1.75} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-stone-900 text-sm">Bali</h4>
                        <p className="text-[11px] text-stone-400 font-normal">Indonesia</p>
                      </div>
                    </div>

                    <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 flex flex-col justify-between h-24">
                      <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                        <span className="flex items-center gap-1"><Plane className="w-3 h-3 text-orange-600" strokeWidth={1.75} /> Next Trip</span>
                        <ChevronRight className="w-3 h-3 text-stone-400" strokeWidth={1.75} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-stone-900 text-sm">28 days</h4>
                        <div className="flex items-center gap-1 mt-0.5">
                          <CountryFlag code="MX" name="Mexico" size="xs" />
                          <p className="text-[11px] text-stone-400 font-normal">Mexico City</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 flex flex-col justify-between h-24">
                      <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-orange-600" strokeWidth={1.75} /> Visa</span>
                        <ChevronRight className="w-3 h-3 text-stone-400" strokeWidth={1.75} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-rose-600 text-sm">13 days</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <p className="text-[11px] text-stone-400 font-normal">e-Visa (90 days)</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 flex flex-col justify-between h-24">
                      <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                        <span className="flex items-center gap-1"><DollarSign className="w-3 h-3 text-orange-600" strokeWidth={1.75} /> Spent</span>
                        <ChevronRight className="w-3 h-3 text-stone-400" strokeWidth={1.75} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-stone-900 text-sm">€586</h4>
                        <p className="text-[10px] text-orange-600 font-medium">View insights →</p>
                      </div>
                    </div>
                  </div>

                  {/* 4 days streak widget (matching Screenshot 1) */}
                  <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500 fill-orange-500" strokeWidth={1.75} />
                      <span className="font-semibold text-stone-900">4 days streak</span>
                    </div>
                    <span className="text-stone-400 font-normal text-[11px]">Best: 4 days · Verified</span>
                  </div>

                  {/* Alerts accordion (matching Screenshot 1) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" strokeWidth={1.75} />
                        <span>Alerts</span>
                      </div>
                      <span className="text-stone-400 text-[11px] font-normal">Show less ▾</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs">
                      <span className="px-1.5 py-0.5 bg-rose-600 text-white rounded text-[10px] font-semibold">
                        ACTION
                      </span>
                      <span className="font-medium text-rose-900 text-[11px]">
                        Your Thailand Visa Exemption has expired
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs">
                      <span className="px-1.5 py-0.5 bg-amber-500 text-white rounded text-[10px] font-semibold">
                        WARNING
                      </span>
                      <span className="font-medium text-amber-900 text-[11px]">
                        Your Vietnam e-Visa (90 days) expires in 13 days
                      </span>
                    </div>
                  </div>

                  {/* Nomads nearby founder (matching Screenshot 1) */}
                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
                        alt="Eva"
                        className="w-9 h-9 rounded-full object-cover border border-orange-300"
                      />
                      <div>
                        <h5 className="text-xs font-semibold text-stone-900">Eva Fernandez</h5>
                        <p className="text-[10px] text-orange-600 font-medium">NomadOS Founder · Bali</p>
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs">
                      <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </div>
                  </div>
                </div>
              )}

              {activeFeatureTab === 'visas' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-stone-900">Visas & Documents</h4>
                    <span className="text-[11px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                      Indonesia: 2 days left
                    </span>
                  </div>

                  {/* 3 Status pills */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-orange-50 rounded-xl border border-orange-200">
                      <span className="text-stone-500 text-[10px] block font-normal">Active</span>
                      <span className="font-semibold text-orange-700 text-sm">2</span>
                    </div>
                    <div className="p-2 bg-amber-50 rounded-xl border border-amber-200">
                      <span className="text-stone-500 text-[10px] block font-normal">Expiring</span>
                      <span className="font-semibold text-amber-700 text-sm">1</span>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200">
                      <span className="text-stone-500 text-[10px] block font-normal">Overstay</span>
                      <span className="font-semibold text-emerald-700 text-sm">0</span>
                    </div>
                  </div>

                  {/* Schengen 90/180 Calculator Box */}
                  <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-900">Schengen Calculator</span>
                      <span className="px-2 py-0.5 bg-orange-600 text-white font-semibold text-[10px] rounded-full">
                        90/180
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-emerald-600">80 D left · 10/90 used</p>
                    <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                      <div className="w-[12%] h-full bg-emerald-500 rounded-full" />
                    </div>
                  </div>

                  {/* Pending docs card */}
                  <div className="p-3 bg-orange-50/70 rounded-2xl border border-orange-200 flex items-center justify-between text-xs">
                    <div>
                      <h5 className="font-semibold text-stone-900">6 PENDING across 3 visa(s)</h5>
                      <p className="text-[10px] text-orange-700 font-normal">Flight out of Indonesia, bank statement for DTV</p>
                    </div>
                    <span className="text-orange-700 text-xs font-medium">→</span>
                  </div>
                </div>
              )}

              {activeFeatureTab === 'trips' && (
                <MultiStopTripView />
              )}

              {activeFeatureTab === 'daily' && (
                <DayItineraryView activities={state.dayActivities || []} />
              )}

              {activeFeatureTab === 'expenses' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-900">Europe Summer Workation</span>
                    <span className="text-orange-600 font-medium">€4,410 left</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <span className="text-[10px] text-stone-400 block font-medium">TRIP TOTAL</span>
                      <span className="text-base font-semibold text-stone-900">€1,890</span>
                      <span className="text-[10px] text-stone-500 block font-normal">12 expenses</span>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <span className="text-[10px] text-stone-400 block font-medium">THIS MONTH</span>
                      <span className="text-base font-semibold text-stone-900">€1,420</span>
                      <span className="text-[10px] text-stone-500 block font-normal">7 expenses</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-stone-800">Flight to BKK · Bangkok</span>
                      <span className="font-semibold text-stone-900">$850</span>
                    </div>
                    <div className="flex items-center justify-between text-stone-500">
                      <span className="font-normal">Pasta Trastevere · Rome</span>
                      <span className="font-medium text-stone-800">€38</span>
                    </div>
                    <div className="flex items-center justify-between text-stone-500">
                      <span className="font-normal">Apartment 5 nights · Rome</span>
                      <span className="font-medium text-stone-800">€420</span>
                    </div>
                  </div>
                </div>
              )}

              {activeFeatureTab === 'community' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-stone-900 text-sm">Nomad Meetups</h4>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-medium rounded-full text-[10px] flex items-center gap-1">
                      <Users className="w-3 h-3" strokeWidth={1.75} />
                      <span>12 nearby</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Coffee', icon: Coffee },
                      { label: 'Laptop', icon: Laptop },
                      { label: 'Drinks', icon: Beer },
                      { label: 'Beach', icon: Palmtree },
                      { label: 'Yoga', icon: Activity }
                    ].map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <span key={item.label} className="px-2 py-1 bg-stone-100 rounded-lg font-medium text-stone-700 text-[11px] flex items-center gap-1">
                          <ItemIcon className="w-3 h-3 text-stone-500" strokeWidth={1.75} />
                          <span>{item.label}</span>
                        </span>
                      );
                    })}
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                    <h5 className="font-semibold text-stone-900 flex items-center gap-1.5">
                      <Coffee className="w-3.5 h-3.5 text-amber-600" strokeWidth={1.75} />
                      <span>Cowork & Specialty Coffee</span>
                    </h5>
                    <p className="text-[11px] text-stone-500 font-normal">Today · 14:00 · Zenita Specialty Cafe Canggu</p>
                    <span className="inline-block text-[10px] font-medium text-orange-600">8 nomads attending</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom launcher button inside phone */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-400 font-medium">NomadOS v2.4 Live Sync</span>
              <button
                onClick={() => onLaunchApp(activeFeatureTab === 'command' ? 'home' : 'travel')}
                className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-medium text-xs rounded-full flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Try In-App</span>
                <ArrowRight className="w-3 h-3" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section 1: Command Center (Screenshot 1) */}
      <section id="section-command" className="py-16 px-4 sm:px-8 border-t border-stone-200/80 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full uppercase tracking-wider">
              COMMAND CENTER
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              Your nomad life at a glance
            </h2>
            <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
              Open the app and see your location, visa days left, spending, and what's coming next.
            </p>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-600" />
                <span className="text-xs font-medium text-stone-800">Visa status</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-600" />
                <span className="text-xs font-medium text-stone-800">Next trip countdown</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-600" />
                <span className="text-xs font-medium text-stone-800">Budget snapshot</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-600" />
                <span className="text-xs font-medium text-stone-800">Smart alerts</span>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onLaunchApp('home')}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium text-xs rounded-full shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Command Center</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-medium text-stone-400 block tracking-wider">LOCATION</span>
                <h4 className="text-lg font-semibold text-stone-900 mt-1">Bali, Indonesia</h4>
                <span className="text-xs text-stone-400 font-normal">Asia / Jakarta</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-medium text-stone-400 block tracking-wider">NEXT TRIP</span>
                <h4 className="text-lg font-semibold text-stone-900 mt-1">28 days</h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <CountryFlag code="MX" name="Mexico" size="xs" />
                  <span className="text-xs text-orange-600 font-medium">Mexico City</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-medium text-stone-400 block tracking-wider">VISA</span>
                <h4 className="text-lg font-semibold text-rose-600 mt-1">13 days left</h4>
                <span className="text-xs text-stone-400 font-normal">e-Visa 90d</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-medium text-stone-400 block tracking-wider">SPENT THIS MONTH</span>
                <h4 className="text-lg font-semibold text-stone-900 mt-1">€586</h4>
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={1.75} />
                  <span>Within budget</span>
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" strokeWidth={1.75} />
                <div>
                  <h5 className="font-semibold text-xs text-stone-900">4 days streak</h5>
                  <p className="text-[11px] text-stone-400 font-normal">Logged expenses and itinerary daily</p>
                </div>
              </div>
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                Best: 4 days
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section 2: Visa Tracking (Screenshot 2) */}
      <section id="section-visas" className="py-16 px-4 sm:px-8 border-t border-stone-200/80 bg-[#fafaf9]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-orange-700 tracking-wider">Visas & Vault</span>
              <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-600" strokeWidth={1.75} />
                <span>2 days left in Indonesia</span>
              </span>
            </div>

            <div className="bg-orange-50/80 rounded-2xl p-4 border border-orange-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <h4 className="font-semibold text-stone-900">Schengen 90/180 Day Counter</h4>
                <span className="px-2 py-0.5 bg-orange-600 text-white font-semibold text-[10px] rounded-full">
                  90/180
                </span>
              </div>
              <p className="text-xs text-orange-700 font-medium">
                80 days remaining in Schengen zone · 10 days used in Portugal
              </p>
              <div className="w-full h-2 bg-orange-200 rounded-full overflow-hidden">
                <div className="w-[11%] h-full bg-orange-600 rounded-full" />
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-xs text-stone-900">Indonesia Visa on Arrival (B213)</h5>
                  <p className="text-[11px] text-stone-500 font-normal">Entry: Apr 06 · 28/30 days used</p>
                </div>
                <span className="text-[10px] font-medium text-rose-600 bg-rose-100 px-2 py-1 rounded-md">
                  Extend / Exit
                </span>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-xs text-stone-900">Thailand Visa Exemption</h5>
                  <p className="text-[11px] text-stone-500 font-normal">Tourist 30-day waiver · Ready</p>
                </div>
                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 space-y-4">
            <span className="inline-block px-3 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full uppercase tracking-wider">
              NEVER OVERSTAY AGAIN
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              Visa tracking that actually works
            </h2>
            <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
              Track all visas, calculate your Schengen 90/180 days, and get alerts before expiry.
            </p>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <div className="p-3 bg-white rounded-2xl border border-stone-200 flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-orange-600" />
                <span className="text-xs font-medium text-stone-800">Schengen calculator</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-stone-200 flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-orange-600" />
                <span className="text-xs font-medium text-stone-800">Auto expiry alerts</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-stone-200 flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-orange-600" />
                <span className="text-xs font-medium text-stone-800">Global coverage</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-stone-200 flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-orange-600" />
                <span className="text-xs font-medium text-stone-800">Document storage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section 3: Trip Planning (Screenshot 3) */}
      <section id="section-trips" className="py-16 px-4 sm:px-8 border-t border-stone-200/80 bg-white">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-block px-3 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full uppercase tracking-wider">
              TRIP PLANNING
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              Plan adventures, not just trips
            </h2>
            <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
              Plan trips across multiple countries, set budgets per stop, and collaborate with travel partners in real time.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="px-3 py-1 bg-stone-100 rounded-full text-xs font-medium text-stone-700">• Multi-country itineraries</span>
              <span className="px-3 py-1 bg-stone-100 rounded-full text-xs font-medium text-stone-700">• Per-stop budgets</span>
              <span className="px-3 py-1 bg-stone-100 rounded-full text-xs font-medium text-stone-700">• Collaborative planning</span>
              <span className="px-3 py-1 bg-stone-100 rounded-full text-xs font-medium text-stone-700">• Visa requirements auto-loaded</span>
            </div>
          </div>

          {/* Interactive Multi-Stop Trip View Component */}
          <div className="bg-[#fafaf9] rounded-3xl p-6 border border-stone-200/90 shadow-xs max-w-3xl mx-auto">
            <MultiStopTripView />
          </div>
        </div>
      </section>

      {/* 6. Section 4: Day-by-Day Planning (Screenshot 4) */}
      <section id="section-daily" className="py-16 px-4 sm:px-8 border-t border-stone-200/80 bg-[#fafaf9]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-block px-3 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full uppercase tracking-wider">
              DAY-BY-DAY PLANNING
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              Your day, perfectly planned
            </h2>
            <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
              Build your own itinerary for each day, or let the AI create plans for you. Attach Maps pins, tickets, and any documents directly to each activity.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="px-3 py-1 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-700 shadow-xs">• AI-generated day plans</span>
              <span className="px-3 py-1 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-700 shadow-xs">• Custom daily schedule</span>
              <span className="px-3 py-1 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-700 shadow-xs">• Attach documents</span>
              <span className="px-3 py-1 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-700 shadow-xs">• Maps pin per activity</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs max-w-2xl mx-auto">
            <DayItineraryView activities={state.dayActivities || []} />
          </div>
        </div>
      </section>

      {/* 7. Section 5: Expense Tracking (Screenshot 5) */}
      <section id="section-expenses" className="py-16 px-4 sm:px-8 border-t border-stone-200/80 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full uppercase tracking-wider">
              EXPENSE TRACKING
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              Know exactly where your money goes
            </h2>
            <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
              Log expenses in any currency with automatic conversion. See breakdowns by country, category, or trip.
            </p>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-600" />
                <span className="text-xs font-medium text-stone-800">150+ currencies</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-600" />
                <span className="text-xs font-medium text-stone-800">Category breakdown</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-600" />
                <span className="text-xs font-medium text-stone-800">Per-country analytics</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-600" />
                <span className="text-xs font-medium text-stone-800">Trip-based tracking</span>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onLaunchApp('travel')}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium text-xs rounded-full shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>Try Currency & Expenses</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          {/* Expense Mockup Card (Screenshot 5) */}
          <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-stone-200 text-stone-700 font-medium rounded-lg">Trip</span>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-600" strokeWidth={1.75} />
                  <span className="font-semibold text-stone-900">Europe Summer Workation</span>
                  <span className="text-[10px] text-stone-400">▾</span>
                </div>
              </div>
              <span className="font-semibold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full">
                €4,410 left
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[10px] font-medium text-stone-400 block tracking-wider">TRIP TOTAL</span>
                <h4 className="text-xl font-semibold text-stone-900 mt-1">€1,890</h4>
                <span className="text-xs text-stone-400 font-normal">12 expenses</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[10px] font-medium text-stone-400 block tracking-wider">THIS MONTH</span>
                <h4 className="text-xl font-semibold text-stone-900 mt-1">€1,420</h4>
                <span className="text-xs text-stone-400 font-normal">7 expenses</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <span className="text-xs font-semibold text-stone-700 block">Recent Expenses</span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div>
                    <h5 className="font-semibold text-stone-900">Flight to BKK</h5>
                    <p className="text-[11px] text-stone-400 font-normal">Bangkok · Transport</p>
                  </div>
                  <span className="font-semibold text-stone-900">$850</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div>
                    <h5 className="font-semibold text-stone-900">Pasta Trastevere</h5>
                    <p className="text-[11px] text-stone-400 font-normal">Rome · Food & Dining</p>
                  </div>
                  <span className="font-semibold text-stone-900">€38</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-stone-900">Apartment 5 nights</h5>
                    <p className="text-[11px] text-stone-400 font-normal">Rome · Housing</p>
                  </div>
                  <span className="font-semibold text-stone-900">€420</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Section 6: Community (Screenshot 6) */}
      <section id="section-community" className="py-16 px-4 sm:px-8 border-t border-stone-200/80 bg-[#fafaf9]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-block px-3 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full uppercase tracking-wider">
              COMMUNITY
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              Find your people, wherever you land
            </h2>
            <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
              See other nomads near you on a map. Create and join local meetups. Share tips and experiences with a global community of nomads.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="px-3 py-1 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-700 shadow-xs">• Nomads near you</span>
              <span className="px-3 py-1 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-700 shadow-xs">• Local meetups & events</span>
              <span className="px-3 py-1 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-700 shadow-xs">• Community feed</span>
              <span className="px-3 py-1 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-700 shadow-xs">• Direct messaging</span>
            </div>
          </div>

          {/* Community Preview */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs max-w-3xl mx-auto space-y-5">
            {/* Filter tags matching Screenshot 6 */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: 'Coffee', icon: Coffee },
                { label: 'Laptop', icon: Laptop },
                { label: 'Drinks', icon: Beer },
                { label: 'Party', icon: PartyPopper },
                { label: 'Beach', icon: Palmtree },
                { label: 'Yoga', icon: Activity },
                { label: 'Co-living', icon: Building2 },
                { label: 'Meetups', icon: Users }
              ].map((item) => {
                const ItemIcon = item.icon;
                return (
                  <span
                    key={item.label}
                    className="px-3 py-1.5 bg-stone-50 hover:bg-orange-50 border border-stone-200 rounded-full text-xs font-medium text-stone-700 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <ItemIcon className="w-3.5 h-3.5 text-stone-500" strokeWidth={1.75} />
                    <span>{item.label}</span>
                  </span>
                );
              })}
            </div>

            {/* Simulated interactive map graphic */}
            <div className="relative h-64 rounded-2xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 overflow-hidden p-6 flex flex-col justify-between text-white border border-stone-800">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live GPS Radar · Lisbon & Bali
                </span>
                <span className="text-xs font-medium text-orange-300">12 Nomads Nearby</span>
              </div>

              {/* Map pins */}
              <div className="relative flex-1 flex items-center justify-center">
                <div className="absolute top-6 left-12 p-2 bg-orange-600 rounded-xl shadow-xs flex items-center gap-1.5 text-xs font-medium animate-bounce">
                  <Coffee className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>Specialty Cafe Meet</span>
                </div>
                <div className="absolute bottom-4 right-16 p-2 bg-orange-500 rounded-xl shadow-xs flex items-center gap-1.5 text-xs font-medium">
                  <Laptop className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>Coworking Sprint</span>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-white/40 bg-orange-500/50 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-white animate-pulse" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-300 pt-2 border-t border-white/10">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" strokeWidth={1.75} />
                  <span>Currently synced to: {state.currentCity}</span>
                </span>
                <button
                  onClick={() => onLaunchApp('social')}
                  className="text-orange-300 hover:text-white font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Open Radar & Meetups</span>
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Section 7: Always in the Loop (Screenshot 7) */}
      <section id="section-alerts" className="py-16 px-4 sm:px-8 border-t border-stone-200/80 bg-white">
        <div className="max-w-5xl mx-auto space-y-8 text-center">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="inline-block px-3 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full uppercase tracking-wider">
              ALWAYS IN THE LOOP
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              Smart alerts, right on time
            </h2>
            <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
              NomadOS watches your visas, trips and documents 24/7 — so you never get caught off guard.
            </p>
          </div>

          {/* Interactive Push Notification Carousel */}
          <SmartAlertsCarousel onActionClick={() => onLaunchApp('travel')} />
        </div>
      </section>

      {/* 10. Section 8: Get Started in Minutes (Screenshot 8) */}
      <section id="section-how-it-works" className="py-16 px-4 sm:px-8 border-t border-stone-200/80 bg-[#fafaf9]">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-block px-3 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full uppercase tracking-wider">
              GET STARTED IN MINUTES
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              Up and running before your next boarding call
            </h2>
          </div>

          {/* 3 Step Cards (matching Screenshot 8) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-orange-300 transition-all">
              <div className="space-y-2">
                <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-semibold text-sm">
                  1
                </span>
                <h3 className="text-lg font-semibold text-stone-900">Download free</h3>
                <p className="text-xs text-stone-500 leading-relaxed font-normal">
                  Available on iOS and Android. Free forever plan — no credit card required to begin your travels.
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-medium text-orange-600">
                <span>iOS · Android · Web</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-orange-300 transition-all">
              <div className="space-y-2">
                <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-semibold text-sm">
                  2
                </span>
                <h3 className="text-lg font-semibold text-stone-900">Set your profile</h3>
                <p className="text-xs text-stone-500 leading-relaxed font-normal">
                  Your nationality and where you are right now. Takes 30 seconds. Automatic visa calculations configure immediately.
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-medium text-orange-600">
                <span>30-second setup</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-orange-300 transition-all">
              <div className="space-y-2">
                <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-semibold text-sm">
                  3
                </span>
                <h3 className="text-lg font-semibold text-stone-900">Start living</h3>
                <p className="text-xs text-stone-500 leading-relaxed font-normal">
                  Plan trips, track visas, log expenses, and connect with nomads around you. Everything in one seamless OS.
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-medium text-orange-600">
                <span>Never overstay again</span>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => onLaunchApp('home')}
              className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm rounded-full shadow-xs inline-flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <span>Launch NomadOS Workspace</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="py-12 px-4 sm:px-8 bg-white border-t border-stone-200 text-stone-500 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-semibold text-sm shadow-xs">
              <Globe className="w-4 h-4 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <span className="font-semibold text-stone-900 text-sm block">NomadOS</span>
              <span className="text-[11px] text-stone-400">The operating system for modern remote workers</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium">
            <button onClick={() => onLaunchApp('home')} className="hover:text-stone-900 cursor-pointer transition-colors">Command Center</button>
            <button onClick={() => onLaunchApp('travel')} className="hover:text-stone-900 cursor-pointer transition-colors">Visa Vault</button>
            <button onClick={() => onLaunchApp('explore')} className="hover:text-stone-900 cursor-pointer transition-colors">Explore Cities</button>
            <button onClick={() => onLaunchApp('social')} className="hover:text-stone-900 cursor-pointer transition-colors">Community Map</button>
            <button onClick={onOpenPricing} className="hover:text-stone-900 cursor-pointer transition-colors">Pro Pricing</button>
          </div>

          <div className="text-center sm:text-right text-[11px] text-stone-400">
            © 2026 NomadOS. Built for global nomads.
          </div>
        </div>
      </footer>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Sparkles, 
  Camera, 
  MapPin, 
  Calendar, 
  Check, 
  ChevronRight, 
  X, 
  Plane, 
  FileText, 
  DollarSign, 
  Users, 
  Clock, 
  Bell, 
  ArrowRight,
  RefreshCw,
  Lightbulb,
  Compass
} from 'lucide-react';
import { NomadState, NomadUser } from '../types';
import { COUNTRIES } from '../data/countries';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: NomadState;
  onUpdateUser: (updated: Partial<NomadUser>) => void;
  onSetCity: (city: string) => void;
  onAddEvent: (title: string, date: string, city: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  state,
  onUpdateUser,
  onSetCity,
  onAddEvent,
}) => {
  // 1: Identity, 2: Photo, 3: Nomad Life Config, 4: First choice, 5: Join Map, 6: Create Meetup, 7: All Set
  const [step, setStep] = useState<number>(1);
  const [tag, setTag] = useState(state.user.tag || '@jawher');
  const [nationality, setNationality] = useState(state.user.nationality || 'Argentina');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Non-binary' | 'Prefer not to say'>(state.user.gender || 'Male');
  const [avatarUrl, setAvatarUrl] = useState(state.user.avatarUrl);
  const [firstAction, setFirstAction] = useState<string>('trip');
  const [currentLocation, setCurrentLocation] = useState(state.currentCity || 'Lisbon');

  if (!isOpen) return null;

  const handleNextStep1 = () => {
    onUpdateUser({
      tag: tag.startsWith('@') ? tag : `@${tag}`,
      nationality,
      gender,
    });
    setStep(2);
  };

  const handleNextStep2 = () => {
    onUpdateUser({ avatarUrl });
    setStep(3);
  };

  const handleNextStep3 = () => {
    setStep(4);
  };

  const handleSelectFirstAction = (actionId: string) => {
    setFirstAction(actionId);
    if (actionId === 'social') {
      setStep(5);
    } else {
      setStep(5);
    }
  };

  const handleJoinMap = () => {
    if (currentLocation.trim()) {
      onSetCity(currentLocation);
    }
    setStep(6);
  };

  const handleFinish = () => {
    onClose();
  };

  return (
    <div id="onboarding-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        id="onboarding-card"
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-stone-200/80 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-orange-500 text-white font-bold text-xs shadow-xs">
              N
            </span>
            <span className="text-sm font-semibold text-stone-900 tracking-tight">NomadOS Setup</span>
          </div>
          <button
            id="onboarding-close-btn"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Dynamic Step Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: Identity */}
          {step === 1 && (
            <div id="onboarding-step-1" className="space-y-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
                  <span className="text-2xl font-semibold">@</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">Set up your identity</h2>
                <p className="text-sm text-stone-500 max-w-xs leading-relaxed">
                  Choose a unique @tag and your nationality — used across the global nomad community.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Your @tag <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="onboarding-tag-input"
                      type="text"
                      value={tag}
                      onChange={(e) => setTag(e.target.value.toLowerCase().replace(/[^a-z0-9_@]/g, ''))}
                      placeholder="@yourtag"
                      className="w-full pl-4 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm"
                    />
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">Lowercase letters, numbers and _ only</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Nationality <span className="text-orange-500">*</span>
                  </label>
                  <select
                    id="onboarding-nationality-select"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm"
                  >
                    <option value="" disabled>Select nationality</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Gender <span className="text-orange-500">*</span>
                  </label>
                  <select
                    id="onboarding-gender-select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Step indicator & button */}
              <div className="pt-4 flex items-center justify-between border-t border-stone-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-2 rounded-full bg-orange-500" />
                  <div className="w-2 h-2 rounded-full bg-stone-200" />
                  <div className="w-2 h-2 rounded-full bg-stone-200" />
                </div>
                <button
                  id="onboarding-step-1-btn"
                  onClick={handleNextStep1}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all text-sm"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Profile photo */}
          {step === 2 && (
            <div id="onboarding-step-2" className="space-y-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
                  <Camera className="w-7 h-7" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">Add a profile photo</h2>
                <p className="text-sm text-stone-500 max-w-xs leading-relaxed">
                  Choose a picture so other nomads recognize you in coworking spaces and meetups.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center py-4 space-y-3">
                <div className="relative group">
                  <input 
                    type="file" 
                    id="avatar-upload" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setAvatarUrl(event.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }} 
                  />
                  <label htmlFor="avatar-upload" className="cursor-pointer block relative">
                    <img
                      src={avatarUrl}
                      alt="Nomad Avatar"
                      className="w-28 h-28 rounded-full object-cover border-4 border-orange-500/20 shadow-md ring-4 ring-orange-500/10"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const randomAvatars = [
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
                    ];
                    const next = randomAvatars[(randomAvatars.indexOf(avatarUrl) + 1) % randomAvatars.length];
                    setAvatarUrl(next);
                  }}
                  className="text-xs font-medium text-orange-600 hover:text-orange-700 bg-orange-50 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 text-orange-600" />
                  <span>Shuffle photo avatar</span>
                </button>
                <span className="text-[11px] text-stone-400 font-normal">JPG, PNG or WebP · Max 5MB</span>
              </div>

              <div className="bg-orange-50/60 border border-orange-200/60 rounded-2xl p-4 text-xs text-orange-900 leading-relaxed flex items-start gap-2.5 font-normal">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span><span className="font-semibold">Pro tip:</span> Nomads with photos get 3x more replies to local coffee chats and coworking invitations.</span>
              </div>

              {/* Step indicator & button */}
              <div className="pt-4 flex items-center justify-between border-t border-stone-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-stone-200" />
                  <div className="w-6 h-2 rounded-full bg-orange-500" />
                  <div className="w-2 h-2 rounded-full bg-stone-200" />
                </div>
                <button
                  id="onboarding-step-2-btn"
                  onClick={handleNextStep2}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl shadow-xs transition-all text-sm cursor-pointer"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Configure Nomad Life */}
          {step === 3 && (
            <div id="onboarding-step-3" className="space-y-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">Configure your nomad life</h2>
                <p className="text-sm text-stone-500 max-w-sm leading-relaxed">
                  Two quick steps and NomadOS will already be working for you — visa alerts, expense tracking, and your next trip ready to go.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3.5 text-center flex flex-col items-center justify-center space-y-1.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-stone-800">Visa countdown</span>
                </div>

                <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3.5 text-center flex flex-col items-center justify-center space-y-1.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-stone-800">Smart alerts</span>
                </div>

                <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3.5 text-center flex flex-col items-center justify-center space-y-1.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-stone-800">Your currency</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col items-center space-y-3">
                <button
                  id="onboarding-step-3-btn"
                  onClick={handleNextStep3}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl shadow-xs transition-all text-sm cursor-pointer"
                >
                  Let's go <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="text-xs font-medium text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                >
                  I'll explore on my own
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: What do you want to do first? */}
          {step === 4 && (
            <div id="onboarding-step-4" className="space-y-6">
              <div className="text-center space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">What do you want to do first?</h2>
                <p className="text-xs text-stone-500 font-normal">You can always do the rest later.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleSelectFirstAction('trip')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-36 ${
                    firstAction === 'trip'
                      ? 'border-orange-500 bg-orange-50/50 shadow-sm ring-2 ring-orange-500/20'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Plane className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Plan a trip</h4>
                    <p className="text-[11px] text-stone-500 leading-snug mt-0.5">
                      Multi-country itinerary, budgets & stops.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectFirstAction('visa')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-36 ${
                    firstAction === 'visa'
                      ? 'border-orange-500 bg-orange-50/50 shadow-sm ring-2 ring-orange-500/20'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Track a visa</h4>
                    <p className="text-[11px] text-stone-500 leading-snug mt-0.5">
                      Countdowns & alerts before anything expires.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectFirstAction('expense')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-36 ${
                    firstAction === 'expense'
                      ? 'border-orange-500 bg-orange-50/50 shadow-sm ring-2 ring-orange-500/20'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Log an expense</h4>
                    <p className="text-[11px] text-stone-500 leading-snug mt-0.5">
                      Multi-currency dashboard in your home currency.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectFirstAction('social')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-36 ${
                    firstAction === 'social'
                      ? 'border-orange-500 bg-orange-50/50 shadow-sm ring-2 ring-orange-500/20'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Meet nomads nearby</h4>
                    <p className="text-[11px] text-stone-500 leading-snug mt-0.5">
                      Discover meetups and remote peers near you.
                    </p>
                  </div>
                </button>
              </div>

              <div className="pt-2">
                <button
                  id="onboarding-step-4-btn"
                  onClick={() => setStep(5)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all text-sm"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Join the nomad map */}
          {step === 5 && (
            <div id="onboarding-step-5" className="space-y-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
                  <MapPin className="w-7 h-7" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">Join the nomad map</h2>
                <p className="text-sm text-stone-500 max-w-sm leading-relaxed">
                  Tell us where you are to connect with nomads nearby.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  <span>Where are you right now?</span>
                  <span className="text-orange-500">*</span>
                </label>
                <input
                  id="onboarding-location-input"
                  type="text"
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  placeholder="e.g. Lisbon, Chiang Mai, Bansko, Canggu"
                  className="w-full px-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm"
                />
                <p className="text-[11px] text-stone-400">Nomads nearby will be able to find you on the map.</p>
              </div>

              <div className="pt-4 flex flex-col space-y-2">
                <button
                  id="onboarding-join-map-btn"
                  onClick={handleJoinMap}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all text-sm"
                >
                  Join the map
                </button>
                <button
                  onClick={() => setStep(6)}
                  className="text-xs font-medium text-stone-400 hover:text-stone-600 py-1.5"
                >
                  Skip for now
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Added! Setup more */}
          {step === 6 && (
            <div id="onboarding-step-6" className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
                  <Check className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">Added! Want to set up more?</h2>
                <p className="text-xs text-stone-500">Your profile is initialized and ready on NomadOS.</p>
              </div>

              {/* Status badge */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                    <Compass className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-stone-800">On the nomad map</h5>
                    <p className="text-[11px] text-stone-500">{currentLocation}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <Check className="w-3.5 h-3.5" /> Active
                </span>
              </div>

              {/* Progress bar */}
              <div className="bg-orange-50/70 border border-orange-200/70 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-orange-900">Setup progress</span>
                  <span className="font-bold text-orange-600">2 of 3 completed</span>
                </div>
                <div className="w-full h-2.5 bg-orange-200/50 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full transition-all duration-500 w-2/3" />
                </div>
                <p className="text-[11px] text-orange-800/80">Complete one more thing to finish setup (1/2 done)</p>
              </div>

              <div className="pt-2 flex flex-col space-y-2">
                <button
                  id="onboarding-finish-btn"
                  onClick={handleFinish}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all text-sm"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

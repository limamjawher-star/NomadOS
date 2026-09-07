import React, { useState } from 'react';
import { 
  Crown, 
  Share2, 
  Settings, 
  Edit3, 
  MapPin, 
  Globe, 
  Plus, 
  Check, 
  X, 
  Users, 
  Heart, 
  Plane, 
  Compass, 
  LogOut,
  Sparkles,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { NomadUser, NomadState } from '../types';
import { CountryFlag } from './CountryFlag';

interface ProfileTabProps {
  state: NomadState;
  onUpdateUser: (updated: Partial<NomadUser>) => void;
  onOpenPricing: () => void;
  onOpenAuth: () => void;
  onAddCountryVisited: (countryCode: string) => void;
}

const ALL_COUNTRIES = [
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
];

export const ProfileTab: React.FC<ProfileTabProps> = ({
  state,
  onUpdateUser,
  onOpenPricing,
  onOpenAuth,
  onAddCountryVisited,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(state.user.name);
  const [editTag, setEditTag] = useState(state.user.tag);
  const [editProfession, setEditProfession] = useState(state.user.profession);
  const [editBio, setEditBio] = useState(state.user.bio);
  const [isAddCountryOpen, setIsAddCountryOpen] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: editName,
      tag: editTag.startsWith('@') ? editTag : `@${editTag}`,
      profession: editProfession,
      bio: editBio,
    });
    setIsEditing(false);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 1500);
  };

  return (
    <div id="profile-view" className="space-y-6 pb-28 max-w-2xl mx-auto px-4 pt-4">
      {/* Top Bar matching screenshot */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-900 tracking-tight font-display">PROFILE</h2>
        <div className="flex items-center gap-2">
          {!state.user.isPro ? (
            <button
              onClick={onOpenPricing}
              className="px-3.5 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black rounded-full shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all hover:from-orange-600 hover:to-amber-600"
            >
              <Crown className="w-3.5 h-3.5 text-amber-200" /> <span>Upgrade Pro</span>
            </button>
          ) : (
            <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black rounded-full flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>PRO</span>
            </span>
          )}

          <button
            onClick={handleShare}
            className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-full shadow-sm transition-colors"
            title="Share Profile"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAuth}
            className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-full shadow-sm transition-colors"
            title="Account Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {shareSuccess && (
        <div className="p-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Link copied to clipboard!</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <img
            src={state.user.avatarUrl}
            alt={state.user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-orange-500/20 shadow-md ring-4 ring-orange-500/10"
          />
          {state.user.isPro && (
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-amber-500 to-orange-600 text-white p-1 rounded-full shadow-md text-xs flex items-center justify-center">
              <Crown className="w-3 h-3" />
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-black text-slate-900 font-display">{state.user.name}</h3>
          <p className="text-xs font-bold text-orange-600 mt-0.5">{state.user.tag}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">{state.user.profession}</p>
        </div>

        {/* Location and Nationality pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200/80">
            <MapPin className="w-3.5 h-3.5 text-orange-500" /> {state.currentCity}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200/80">
            <CountryFlag code="AR" name="Argentina" size="xs" />
            <span>{state.user.nationality}</span>
          </span>
        </div>

        <p className="text-xs text-slate-500 max-w-md leading-relaxed">
          {state.user.bio}
        </p>

        <button
          onClick={() => setIsEditing(true)}
          className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-200/80"
        >
          <Edit3 className="w-3.5 h-3.5 text-slate-600" /> Edit Profile
        </button>
      </div>

      {/* 4 Stat Cards in 2x2 Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm text-center">
          <Globe className="w-4 h-4 text-orange-600 mx-auto mb-1" />
          <p className="text-lg font-black text-slate-900 font-display">{state.user.countriesVisited.length}</p>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Countries</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm text-center">
          <Plane className="w-4 h-4 text-orange-600 mx-auto mb-1" />
          <p className="text-lg font-black text-slate-900 font-display">{state.trips.length}</p>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trips</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm text-center">
          <Users className="w-4 h-4 text-orange-600 mx-auto mb-1" />
          <p className="text-lg font-black text-slate-900 font-display">{state.user.followersCount}</p>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Followers</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm text-center">
          <Heart className="w-4 h-4 text-orange-600 mx-auto mb-1" />
          <p className="text-lg font-black text-slate-900 font-display">{state.user.followingCount}</p>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Following</span>
        </div>
      </div>

      {/* Profile Completion Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider font-display">
            Profile {state.user.profileCompletion}% complete
          </h4>
          <span className="text-xs font-bold text-orange-600">3 tasks</span>
        </div>

        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500" 
            style={{ width: `${state.user.profileCompletion}%` }}
          />
        </div>

        <div className="space-y-1.5 pt-1 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span>Write a short bio</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span>Set your profession ({state.user.profession || 'Not set'})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span>Log your first upcoming trip</span>
          </div>
        </div>
      </div>

      {/* Countries Visited / Passport Stamps */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-black text-slate-900 font-display">Countries Visited</h4>
          <button
            onClick={() => setIsAddCountryOpen(true)}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            + Add country
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {state.user.countriesVisited.map((code) => {
            const countryInfo = ALL_COUNTRIES.find(c => c.code === code) || { code, name: code };
            return (
              <div
                key={code}
                className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm flex flex-col items-center text-center space-y-1.5"
              >
                <CountryFlag code={code} name={countryInfo.name} size="md" />
                <span className="text-xs font-bold text-slate-800 truncate w-full">{countryInfo.name}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase font-display">{countryInfo.code}</span>
              </div>
            );
          })}

          <button
            onClick={() => setIsAddCountryOpen(true)}
            className="rounded-2xl p-3 border-2 border-dashed border-slate-200 hover:border-orange-400 hover:bg-orange-50/20 text-slate-400 hover:text-orange-600 transition-all flex flex-col items-center justify-center space-y-1 min-h-[86px]"
          >
            <Plus className="w-5 h-5 text-orange-500" />
            <span className="text-xs font-bold">+ Add country</span>
          </button>
        </div>
      </div>

      {/* Add Country Picker Modal */}
      {isAddCountryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 font-display">Add Country Stamp</h4>
              <button
                onClick={() => setIsAddCountryOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1">
              {ALL_COUNTRIES.map((country) => {
                const isVisited = state.user.countriesVisited.includes(country.code);
                return (
                  <button
                    key={country.code}
                    onClick={() => {
                      if (!isVisited) {
                        onAddCountryVisited(country.code);
                      }
                      setIsAddCountryOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl flex items-center justify-between text-xs font-bold transition-colors ${
                      isVisited
                        ? 'bg-slate-100 text-slate-400 cursor-default'
                        : 'hover:bg-orange-50 text-slate-800 hover:text-orange-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CountryFlag code={country.code} name={country.name} size="xs" />
                      <span>{country.name}</span>
                    </div>
                    {isVisited ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                        <Check className="w-3 h-3" /> Visited
                      </span>
                    ) : (
                      <Plus className="w-4 h-4 text-orange-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-black text-slate-900 font-display">Edit Profile</h4>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  @Tag
                </label>
                <input
                  type="text"
                  required
                  value={editTag}
                  onChange={(e) => setEditTag(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Profession / Title
                </label>
                <input
                  type="text"
                  value={editProfession}
                  onChange={(e) => setEditProfession(e.target.value)}
                  placeholder="e.g. Developer, Designer, Founder"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell nomads about your adventures..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/20"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

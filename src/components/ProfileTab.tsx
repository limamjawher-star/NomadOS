import React, { useState } from 'react';
import { 
  Crown, 
  Share2, 
  Settings, User, 
  Edit3, 
  MapPin, 
  Globe, 
  Plus, 
  Check, 
  X, 
  Users, 
  Plane, 
  LogOut,
  CheckCircle2,
  Download
} from 'lucide-react';
import { NomadUser, NomadState } from '../types';
import { CountryFlag } from './CountryFlag';

interface ProfileTabProps {
  state: NomadState;
  onUpdateUser: (updated: Partial<NomadUser>) => void;
  onOpenPricing: () => void;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onAddCountryVisited: (countryCode: string) => void;
  onViewLanding?: () => void;
}

const ALL_COUNTRIES = [
  { code: 'AR', name: 'Argentina' },
  { code: 'PT', name: 'Portugal' },
  { code: 'ES', name: 'Spain' },
  { code: 'FR', name: 'France' },
  { code: 'TH', name: 'Thailand' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'CO', name: 'Colombia' },
  { code: 'MX', name: 'Mexico' },
];

export const ProfileTab: React.FC<ProfileTabProps> = ({
  state,
  onUpdateUser,
  onOpenPricing,
  onOpenAuth,
  onSignOut,
  onAddCountryVisited,
  onViewLanding,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(state.user.name);
  const [editTag, setEditTag] = useState(state.user.tag);
  const [editProfession, setEditProfession] = useState(state.user.profession);
  const [editBio, setEditBio] = useState(state.user.bio);
  const [isAddCountryOpen, setIsAddCountryOpen] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);

  const handleExportData = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `nomados-backup-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setExportNotice(true);
      setTimeout(() => setExportNotice(false), 2500);
    } catch (e) {
      console.error('Export error', e);
    }
  };

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
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-stone-900 tracking-tight font-display">User Passport</h2>
          <p className="text-xs text-stone-500 font-normal">Digital nomad profile & credentials</p>
        </div>
        <div className="flex items-center gap-2">
          {state.user.isPro ? (
            <span className="px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full border border-orange-200 flex items-center gap-1">
              <Crown className="w-3 h-3 text-orange-600" strokeWidth={1.75} />
              <span>PRO</span>
            </span>
          ) : (
            <button
              onClick={onOpenPricing}
              className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-full shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Crown className="w-3 h-3" strokeWidth={1.75} />
              <span>Upgrade</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className="p-2 bg-white border border-stone-200/80 text-stone-600 hover:text-stone-900 rounded-full shadow-xs transition-colors cursor-pointer"
            title="Share Profile"
          >
            <Share2 className="w-4 h-4" strokeWidth={1.75} />
          </button>

          <button
            onClick={onOpenAuth}
            className="p-2 bg-white border border-stone-200/80 text-stone-600 hover:text-stone-900 rounded-full shadow-xs transition-colors cursor-pointer"
            title="Account Settings"
          >
            <Settings className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {shareSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />
          <span>Link copied to clipboard!</span>
        </div>
      )}

      {/* Profile Hero Card */}
      <div className="bg-white rounded-xl p-6 border border-stone-200/80 shadow-xs flex flex-col items-center text-center space-y-4">
        <div className="relative">
          {state.user.avatarUrl && state.user.avatarUrl.trim() !== '' ? (
            <img
              src={state.user.avatarUrl}
              alt={state.user.name || 'Nomad'}
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-full object-cover border-4 border-orange-500/20 shadow-sm ring-4 ring-orange-500/10 bg-stone-100"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.querySelector('.avatar-fallback')?.classList.remove('hidden');
              }}
            />
          ) : null}
          
          <div className={`avatar-fallback w-24 h-24 rounded-full border-4 border-orange-500/20 shadow-sm ring-4 ring-orange-500/10 bg-stone-100 flex items-center justify-center text-stone-400 ${state.user.avatarUrl && state.user.avatarUrl.trim() !== '' ? 'hidden' : ''}`}>
            {state.user.name ? (
              <span className="text-3xl font-bold text-stone-600">{state.user.name.charAt(0).toUpperCase()}</span>
            ) : (
              <User className="w-10 h-10" strokeWidth={2} />
            )}
          </div>

          {state.user.isPro && (
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-amber-500 to-orange-600 text-white p-1.5 rounded-full shadow-xs text-xs flex items-center justify-center">
              <Crown className="w-3.5 h-3.5" strokeWidth={1.75} />
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold text-stone-900 font-display tracking-tight">
            {state.user.name || 'Digital Nomad'}
          </h3>
          {state.user.tag && <p className="text-xs font-semibold text-orange-600 mt-0.5">{state.user.tag}</p>}
          <p className="text-xs text-stone-600 font-normal mt-1">{state.user.profession || 'Explorer'}</p>
        </div>

        {/* Location and Nationality pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {(state.currentCity || state.currentCountry) && (
            <span className="flex items-center gap-1.5 text-xs font-medium bg-stone-100 text-stone-700 px-3 py-1 rounded-full border border-stone-200/80">
              <MapPin className="w-3.5 h-3.5 text-orange-500" strokeWidth={1.75} />
              <span>{[state.currentCity, state.currentCountry].filter(Boolean).join(', ')}</span>
            </span>
          )}
          {state.user.nationalityCode && (
            <span className="flex items-center gap-1.5 text-xs font-medium bg-stone-100 text-stone-700 px-3 py-1 rounded-full border border-stone-200/80">
              <CountryFlag code={state.user.nationalityCode} name={state.user.nationality || 'Nationality'} size="xs" />
              <span>{state.user.nationality || 'Unknown'}</span>
            </span>
          )}
        </div>

        {state.user.bio && (
          <p className="text-xs text-stone-500 max-w-md leading-relaxed font-normal">
            {state.user.bio}
          </p>
        )}

        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200/80 text-stone-800 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-stone-200/80 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5 text-stone-600" strokeWidth={1.75} /> Edit Profile
        </button>
      </div>

      {/* 4 Stat Cards in 2x2 / 4-Col Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs text-center flex flex-col justify-between min-h-[6.5rem]">
          <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">Countries</span>
          <p className="text-xl font-semibold text-stone-900 font-display mt-1">
            {state.user.countriesVisited.length}
          </p>
          <span className="text-[10px] text-orange-600 font-medium flex items-center justify-center gap-1">
            <Globe className="w-3 h-3" strokeWidth={1.75} />
            <span>Stamped</span>
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs text-center flex flex-col justify-between min-h-[6.5rem]">
          <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">Total Trips</span>
          <p className="text-xl font-semibold text-stone-900 font-display mt-1">
            {state.trips.length}
          </p>
          <span className="text-[10px] text-stone-500 font-medium flex items-center justify-center gap-1">
            <Plane className="w-3 h-3" strokeWidth={1.75} />
            <span>Completed</span>
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs text-center flex flex-col justify-between min-h-[6.5rem]">
          <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">Nomad Days</span>
          <p className="text-xl font-semibold text-stone-900 font-display mt-1">
            {state.trips.length > 0 
              ? state.trips.reduce((total, trip) => {
                  const days = Math.max(0, Math.ceil((new Date(trip.departureDate).getTime() - new Date(trip.arrivalDate).getTime()) / (1000 * 60 * 60 * 24)));
                  return total + (isNaN(days) ? 0 : days);
                }, 0)
              : 0}d
          </p>
          <span className="text-[10px] text-emerald-600 font-medium flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3 h-3" strokeWidth={1.75} />
            <span>Track record</span>
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs text-center flex flex-col justify-between min-h-[6.5rem]">
          <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">Community</span>
          <p className="text-xl font-semibold text-stone-900 font-display mt-1">
            {state.user.followersCount}
          </p>
          <span className="text-[10px] text-stone-500 font-medium flex items-center justify-center gap-1">
            <Users className="w-3 h-3" strokeWidth={1.75} />
            <span>Connections</span>
          </span>
        </div>
      </div>

      {/* Profile Completion Card */}
      <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider font-display">
            Profile {state.user.profileCompletion}% complete
          </h4>
          <span className="text-xs font-semibold text-orange-600">3 tasks remaining</span>
        </div>

        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-orange-500 rounded-full transition-all duration-500" 
            style={{ width: `${state.user.profileCompletion}%` }}
          />
        </div>

        <div className="space-y-1.5 pt-1 text-xs text-stone-600 font-normal">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
            <span>Write a short bio</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
            <span>Set your profession ({state.user.profession || 'Not set'})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
            <span>Log your first upcoming trip</span>
          </div>
        </div>
      </div>

      {/* NomadOS Pro Membership Promo Card */}
      <div className="bg-orange-50/50 rounded-xl p-5 border border-orange-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-semibold shadow-xs shrink-0">
              <Crown className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-stone-900 leading-tight">
                  {state.user.isPro ? 'NomadOS Pro Active' : 'Free Plan'}
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-semibold">
                  {state.user.isPro ? 'PRO ACTIVE' : 'UPGRADE AVAILABLE'}
                </span>
              </div>
              <p className="text-[11px] text-stone-600 font-normal mt-0.5">
                {state.user.isPro
                  ? 'All Schengen legal tracking, FEIE tax engine, and 360° radar active'
                  : 'Includes 3 trips, 1km radar range, and basic expense tracking'}
              </p>
            </div>
          </div>

          {!state.user.isPro ? (
            <button
              onClick={onOpenPricing}
              className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
            >
              Upgrade
            </button>
          ) : (
            <span className="text-xs font-normal text-stone-500">Plan: {state.user.subscriptionPlan}</span>
          )}
        </div>
      </div>

      {/* Countries Visited / Passport Stamps */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-stone-900 font-display">Countries Visited</h4>
          <button
            onClick={() => setIsAddCountryOpen(true)}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
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
                className="bg-white rounded-xl p-3 border border-stone-200/80 shadow-xs flex flex-col items-center text-center space-y-1.5"
              >
                <CountryFlag code={code} name={countryInfo.name} size="md" />
                <span className="text-xs font-medium text-stone-800 truncate w-full">{countryInfo.name}</span>
                <span className="text-[10px] text-stone-400 font-semibold uppercase font-display">{countryInfo.code}</span>
              </div>
            );
          })}

          <button
            onClick={() => setIsAddCountryOpen(true)}
            className="rounded-xl p-3 border-2 border-dashed border-stone-200 hover:border-orange-400 hover:bg-orange-50/20 text-stone-400 hover:text-orange-600 transition-colors flex flex-col items-center justify-center space-y-1 min-h-[86px] cursor-pointer"
          >
            <Plus className="w-5 h-5 text-orange-500" strokeWidth={1.75} />
            <span className="text-xs font-semibold">+ Add country</span>
          </button>
        </div>
      </div>

      {/* Export Feedback Notice */}
      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200/80 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />
            <span>NomadOS data exported successfully! Download started.</span>
          </div>
        </div>
      )}

      {/* System, Preferences & Simulation Settings */}
      <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs space-y-4">
        <h4 className="text-sm font-semibold text-stone-900 font-display">App Preferences & Workspace</h4>

        <div className="space-y-2.5">
          {/* Landing Page Preview */}
          {onViewLanding && (
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between hover:bg-orange-50/50 hover:border-orange-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-semibold shrink-0">
                  <Globe className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-stone-900">NomadOS Landing Page</h5>
                  <p className="text-[11px] text-stone-500 font-normal">Preview marketing website & public showcases</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onViewLanding}
                className="px-3 py-1.5 bg-white border border-stone-200/80 hover:border-orange-400 text-stone-700 hover:text-orange-600 rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer"
              >
                View
              </button>
            </div>
          )}

          {/* Export Data Backup */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between hover:bg-stone-100/60 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold shrink-0">
                <Download className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div>
                <h5 className="text-xs font-semibold text-stone-900">Export Nomad Data (JSON)</h5>
                <p className="text-[11px] text-stone-500 font-normal">Full backup of expenses, visas & planned trips</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportData}
              className="px-3 py-1.5 bg-white border border-stone-200/80 hover:border-emerald-400 text-stone-700 hover:text-emerald-700 rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            >
              Export
            </button>
          </div>

          {/* Switch Account / Auth Modal */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-stone-200 text-stone-700 flex items-center justify-center font-semibold shrink-0">
                <LogOut className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div>
                <h5 className="text-xs font-semibold text-stone-900">Account Session</h5>
                <p className="text-[11px] text-stone-500 font-normal">Manage your active connection</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onSignOut}
                className="px-3 py-1.5 bg-white border border-red-200/80 hover:border-red-400 text-red-600 rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer"
              >
                Sign Out
              </button>
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-3 py-1.5 bg-white border border-stone-200/80 hover:border-stone-400 text-stone-700 rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Country Picker Modal */}
      {isAddCountryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-xl p-5 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-stone-900 font-display">Add Country Stamp</h4>
              <button
                onClick={() => setIsAddCountryOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
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
                    className={`w-full p-2.5 rounded-xl flex items-center justify-between text-xs font-medium transition-colors cursor-pointer ${
                      isVisited
                        ? 'bg-stone-100 text-stone-400 cursor-default'
                        : 'hover:bg-orange-50 text-stone-800 hover:text-orange-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CountryFlag code={country.code} name={country.name} size="xs" />
                      <span>{country.name}</span>
                    </div>
                    {isVisited ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                        <Check className="w-3 h-3" strokeWidth={1.75} /> Visited
                      </span>
                    ) : (
                      <Plus className="w-4 h-4 text-orange-500" strokeWidth={1.75} />
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
          <div className="w-full max-w-md bg-white rounded-xl p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-stone-900 font-display">Edit Profile</h4>
              <button
                onClick={() => setIsEditing(false)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200/80 rounded-xl text-xs font-normal text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-1">
                  @Tag
                </label>
                <input
                  type="text"
                  required
                  value={editTag}
                  onChange={(e) => setEditTag(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200/80 rounded-xl text-xs font-normal text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-1">
                  Profession / Title
                </label>
                <input
                  type="text"
                  value={editProfession}
                  onChange={(e) => setEditProfession(e.target.value)}
                  placeholder="e.g. Developer, Designer, Founder"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200/80 rounded-xl text-xs font-normal text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell nomads about your adventures..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200/80 rounded-xl text-xs font-normal text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-xs shadow-xs cursor-pointer transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200/80 text-stone-700 font-semibold rounded-xl text-xs cursor-pointer transition-colors"
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

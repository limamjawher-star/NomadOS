import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Wifi,
  Zap,
  Coffee,
  Building2,
  Utensils,
  Wine,
  Navigation,
  Star,
  Clock,
  ShieldCheck,
  Volume2,
  VolumeX,
  Plus,
  Compass,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Filter,
  SlidersHorizontal,
  X,
  Share2,
  Check,
  AlertTriangle
} from 'lucide-react';
import { WorkSpot, WorkSpotReview } from '../types';
import { WORK_SPOTS_DATA, CITY_COORDINATE_PRESETS } from '../data/workSpotsData';
import { calculateHaversineDistanceKm, formatDistance } from '../utils/geoUtils';
import { WorkSpotDetailModal } from './WorkSpotDetailModal';

interface NearbyWorkSpotsProps {
  currentCity?: string;
  onAddStopToTrip?: (spot: WorkSpot) => void;
  onAddToDayItinerary?: (spot: WorkSpot) => void;
  onSelectSpot?: (spot: WorkSpot) => void;
}

export const NearbyWorkSpots: React.FC<NearbyWorkSpotsProps> = ({
  currentCity = 'Canggu, Bali',
  onAddStopToTrip,
  onAddToDayItinerary,
  onSelectSpot
}) => {
  // User Coordinates State (Defaults to Canggu, Bali or Lisbon depending on profile)
  const defaultCoords = useMemo(() => {
    return { lat: -8.6500, lng: 115.1350, label: 'Canggu, Bali (Default Base)' };
  }, []);

  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number; label: string }>(defaultCoords);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'coworking' | 'cafe' | 'restaurant' | 'bar'>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'wifi' | 'rating' | 'price'>('distance');
  const [filterHighSpeedOnly, setFilterHighSpeedOnly] = useState(false);
  const [filterPlugsOnly, setFilterPlugsOnly] = useState(false);
  const [filterQuietOnly, setFilterQuietOnly] = useState(false);
  const [filterGeneratorOnly, setFilterGeneratorOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Workspots local state (to allow user-submitted reviews & speed reports)
  const [spots, setSpots] = useState<WorkSpot[]>(WORK_SPOTS_DATA);

  // Selected spot modal
  const [selectedSpotForDetails, setSelectedSpotForDetails] = useState<WorkSpot | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Browser Geolocation Function (Zero API key needed!)
  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({
          lat: latitude,
          lng: longitude,
          label: `GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
        });
        setIsLocating(false);
        showToast('📍 Live GPS location detected! Distances updated.');
      },
      (error) => {
        setIsLocating(false);
        console.warn('Geolocation error:', error);
        setLocationError('Could not retrieve live GPS. You can choose a nomad hub preset below.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Switch to City Preset
  const handleSelectPreset = (key: string) => {
    const preset = CITY_COORDINATE_PRESETS[key];
    if (preset) {
      setUserCoords({
        lat: preset.lat,
        lng: preset.lng,
        label: `${preset.label}, ${preset.country}`
      });
      setLocationError(null);
      showToast(`Switched location to ${preset.label}`);
    }
  };

  // Compute distances and sort
  const computedSpots = useMemo(() => {
    let list = spots.map((s) => {
      const distanceKm = calculateHaversineDistanceKm(
        userCoords.lat,
        userCoords.lng,
        s.lat,
        s.lng
      );
      return {
        ...s,
        distanceKm
      };
    });

    // Category filter
    if (activeCategory !== 'all') {
      list = list.filter((s) => s.category === activeCategory);
    }

    // Search query with typo tolerance and aliases
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const aliases: Record<string, string[]> = {
        'coffe': ['coffee', 'cafe', 'roast', 'brew', 'espresso', 'cappuccino', 'matcha', 'latte'],
        'coffee': ['coffe', 'cafe', 'roast', 'brew', 'espresso', 'cappuccino', 'barista', 'latte', 'v60'],
        'cafe': ['coffee', 'coffe', 'bakery', 'roastery', 'espresso', 'pour-over'],
        'bar': ['cocktail', 'wine', 'beer', 'taproom', 'drinks', 'sunset', 'night', 'spirits', 'lounge'],
        'cocktail': ['bar', 'drinks', 'mixology', 'sunset', 'wine'],
        'restaurant': ['dining', 'food', 'bistro', 'brunch', 'dinner', 'lunch', 'kitchen', 'dishes'],
        'cowork': ['coworking', 'workspace', 'desk', 'office'],
        'coworking': ['cowork', 'workspace', 'desk', 'office'],
        'wifi': ['internet', 'fiber', 'speed', 'mbps', 'fast'],
      };

      const matchText = (text?: string) => {
        if (!text) return false;
        const t = text.toLowerCase();
        if (t.includes(q)) return true;
        for (const [key, syns] of Object.entries(aliases)) {
          if (q.includes(key) || key.includes(q)) {
            if (syns.some((syn) => t.includes(syn))) return true;
          }
        }
        return false;
      };

      list = list.filter(
        (s) =>
          matchText(s.name) ||
          matchText(s.category) ||
          matchText(s.city) ||
          matchText(s.country) ||
          matchText(s.address) ||
          matchText(s.foodAndCoffee) ||
          s.tags.some((t) => matchText(t))
      );
    }

    // Special feature filters
    if (filterHighSpeedOnly) {
      list = list.filter((s) => s.wifiSpeedMbps >= 150);
    }
    if (filterPlugsOnly) {
      list = list.filter((s) => s.powerOutlets.includes('Plentiful'));
    }
    if (filterQuietOnly) {
      list = list.filter((s) => s.noiseLevel.includes('Silent') || s.noiseLevel.includes('Quiet'));
    }
    if (filterGeneratorOnly) {
      list = list.filter((s) => s.hasBackupPower);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'distance') {
        return (a.distanceKm || 0) - (b.distanceKm || 0);
      }
      if (sortBy === 'wifi') {
        return b.wifiSpeedMbps - a.wifiSpeedMbps;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'price') {
        return (a.dayPassUSD || 0) - (b.dayPassUSD || 0);
      }
      return 0;
    });

    return list;
  }, [
    spots,
    userCoords,
    activeCategory,
    searchQuery,
    filterHighSpeedOnly,
    filterPlugsOnly,
    filterQuietOnly,
    filterGeneratorOnly,
    sortBy
  ]);

  const handleOpenSpotDetails = (spot: WorkSpot) => {
    if (onSelectSpot) {
      onSelectSpot(spot);
    }
    setSelectedSpotForDetails(spot);
  };

  const handleSaveReviewFromModal = (spotId: string, review: WorkSpotReview) => {
    const updatedSpots = spots.map((sp) => {
      if (sp.id === spotId) {
        const updatedReviews = [review, ...sp.reviews];
        const avgRating = Number(
          (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
        );
        return {
          ...sp,
          rating: avgRating,
          reviewCount: sp.reviewCount + 1,
          wifiSpeedMbps: Math.max(sp.wifiSpeedMbps, review.wifiRating >= 5 ? 120 : 80),
          reviews: updatedReviews
        };
      }
      return sp;
    });

    setSpots(updatedSpots);
    const updatedSelected = updatedSpots.find((s) => s.id === spotId);
    if (updatedSelected) {
      setSelectedSpotForDetails(updatedSelected);
    }
    showToast('✨ Thank you! Your Wi-Fi speed & review have been posted.');
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Unified Command & Search Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-4">
        {/* Top Row: Title + Location Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-stone-900 tracking-tight">
                Workspaces & Cafes
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-xs font-medium border border-stone-200/80">
                {computedSpots.length} verified
              </span>
            </div>
            <p className="text-xs text-stone-500 font-normal mt-0.5">
              Verified internet speeds, power outlets & remote-work atmosphere
            </p>
          </div>

          {/* Location Controls: Clean City Dropdown + Near Me GPS */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <select
                value={
                  Object.keys(CITY_COORDINATE_PRESETS).find((k) =>
                    userCoords.label.includes(CITY_COORDINATE_PRESETS[k].label)
                  ) || 'bali'
                }
                onChange={(e) => handleSelectPreset(e.target.value)}
                className="appearance-none pl-8 pr-8 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              >
                {Object.entries(CITY_COORDINATE_PRESETS).map(([key, preset]) => (
                  <option key={key} value={key}>
                    {preset.label}, {preset.country}
                  </option>
                ))}
              </select>
              <MapPin className="w-3.5 h-3.5 text-orange-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={handleDetectCurrentLocation}
              disabled={isLocating}
              title="Find closest spots using your browser GPS"
              className="px-3 py-2 bg-stone-900 hover:bg-stone-800 active:scale-95 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <Navigation className={`w-3.5 h-3.5 text-orange-400 ${isLocating ? 'animate-spin' : ''}`} strokeWidth={1.75} />
              <span>{isLocating ? 'Locating...' : 'Near Me'}</span>
            </button>
          </div>
        </div>

        {locationError && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-normal flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" strokeWidth={1.75} />
              <span>{locationError}</span>
            </div>
            <button
              onClick={() => setLocationError(null)}
              className="text-amber-700 hover:text-amber-900 text-xs font-semibold ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Compass className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, neighborhood, or tags..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto appearance-none pl-3 pr-8 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
            >
              <option value="distance">Closest First</option>
              <option value="wifi">Fastest Wi-Fi</option>
              <option value="rating">Highest Rated</option>
              <option value="price">Day Pass Price</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Category Tabs & Quick Must-Haves */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1 border-t border-slate-100">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All', count: spots.length },
              { id: 'cafe', label: 'Cafes & Roasteries', icon: Coffee },
              { id: 'bar', label: 'Bars & Sunset Lounges', icon: Wine },
              { id: 'restaurant', label: 'Restaurants & Bistros', icon: Utensils },
              { id: 'coworking', label: 'Coworking Hubs', icon: Building2 }
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} strokeWidth={1.75} />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setFilterHighSpeedOnly(!filterHighSpeedOnly)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 whitespace-nowrap border ${
                filterHighSpeedOnly
                  ? 'bg-orange-50 border-orange-300 text-orange-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Wifi className="w-3 h-3 text-orange-500" strokeWidth={1.75} />
              <span>150+ Mbps</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterPlugsOnly(!filterPlugsOnly)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 whitespace-nowrap border ${
                filterPlugsOnly
                  ? 'bg-amber-50 border-amber-300 text-amber-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Zap className="w-3 h-3 text-amber-500" strokeWidth={1.75} />
              <span>Plugs</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterQuietOnly(!filterQuietOnly)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 whitespace-nowrap border ${
                filterQuietOnly
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <VolumeX className="w-3 h-3 text-emerald-600" strokeWidth={1.75} />
              <span>Quiet</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterGeneratorOnly(!filterGeneratorOnly)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 whitespace-nowrap border ${
                filterGeneratorOnly
                  ? 'bg-sky-50 border-sky-300 text-sky-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-sky-600" strokeWidth={1.75} />
              <span>Generator</span>
            </button>

            {(filterHighSpeedOnly || filterPlugsOnly || filterQuietOnly || filterGeneratorOnly) && (
              <button
                type="button"
                onClick={() => {
                  setFilterHighSpeedOnly(false);
                  setFilterPlugsOnly(false);
                  setFilterQuietOnly(false);
                  setFilterGeneratorOnly(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                title="Clear filters"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs font-medium text-stone-500 px-1">
        <span>Found {computedSpots.length} verified workspaces nearby</span>
        {toastMessage && (
          <span className="text-orange-600 font-medium animate-in fade-in">
            {toastMessage}
          </span>
        )}
      </div>

      {/* Spot Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {computedSpots.map((spot) => (
          <div
            key={spot.id}
            className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden hover:shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Photo & Distance Header */}
              <div
                onClick={() => handleOpenSpotDetails(spot)}
                className="relative h-44 w-full bg-slate-950 overflow-hidden cursor-pointer group-hover:opacity-95 transition-opacity"
              >
                <img
                  src={spot.photoUrl}
                  alt={spot.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-black/20" />

                {/* Distance Badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border border-white/15">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" strokeWidth={1.75} />
                  <span>{formatDistance(spot.distanceKm || 0)}</span>
                </div>

                {/* Category & Price Badge - Standardized Neutral Dark Pill Style */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium capitalize bg-slate-900/90 text-white backdrop-blur-md border border-white/15">
                    {spot.category}
                  </span>
                  {spot.dayPassUSD !== undefined && spot.dayPassUSD > 0 && (
                    <span className="bg-slate-900/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-medium border border-white/15">
                      ${spot.dayPassUSD}/day
                    </span>
                  )}
                  {spot.dayPassUSD === 0 && (
                    <span className="bg-emerald-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-medium border border-white/15">
                      Free Entry
                    </span>
                  )}
                </div>

                {/* Bottom title on photo */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white text-base font-semibold font-display drop-shadow-sm truncate">
                    {spot.name}
                  </h3>
                  <p className="text-white/85 text-xs truncate drop-shadow-xs font-normal">
                    {spot.address}
                  </p>
                </div>
              </div>

              {/* Verified Wi-Fi Connection Box */}
              <div className="p-4 space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                      <Wifi className="w-4 h-4" strokeWidth={1.75} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">
                          {spot.wifiSpeedMbps} Mbps
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          {spot.wifiReliability}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-normal">
                        {spot.wifiSpeedText}
                      </p>
                    </div>
                  </div>

                  {spot.hasBackupPower && (
                    <div className="text-right">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/60 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-sky-600" strokeWidth={1.75} />
                        Generator
                      </span>
                    </div>
                  )}
                </div>

                {/* Key Spec Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" strokeWidth={1.75} />
                    <div className="truncate">
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Outlets</p>
                      <p className="font-semibold text-slate-800 truncate">{spot.powerOutlets}</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center gap-2">
                    {spot.noiseLevel.includes('Silent') ? (
                      <VolumeX className="w-3.5 h-3.5 text-emerald-500 shrink-0" strokeWidth={1.75} />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-sky-500 shrink-0" strokeWidth={1.75} />
                    )}
                    <div className="truncate">
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Acoustics</p>
                      <p className="font-semibold text-slate-800 truncate">{spot.noiseLevel}</p>
                    </div>
                  </div>
                </div>

                {/* Coffee & Food Highlight */}
                <div className="text-xs text-slate-600 line-clamp-1 flex items-center gap-1.5 font-normal">
                  <Coffee className="w-3.5 h-3.5 text-amber-600 shrink-0" strokeWidth={1.75} />
                  <span className="truncate">{spot.foodAndCoffee}</span>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {spot.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  {spot.tags.length > 3 && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      +{spot.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" strokeWidth={1.75} />
                  <span className="text-xs font-semibold text-slate-900">{spot.rating}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-normal">({spot.reviewCount})</span>
              </div>

              <div className="flex items-center gap-1.5">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    `${spot.name}, ${spot.address}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open Turn-by-Turn Directions in Google Maps"
                  className="px-2.5 sm:px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-full text-xs flex items-center gap-1 sm:gap-1.5 transition-colors active-press shrink-0"
                >
                  <Navigation className="w-3.5 h-3.5 text-orange-500" strokeWidth={1.75} />
                  <span>Directions</span>
                </a>

                {/* View Details & Specs */}
                <button
                  type="button"
                  onClick={() => handleOpenSpotDetails(spot)}
                  className="px-3 sm:px-3.5 py-2 bg-slate-900 hover:bg-orange-500 text-white font-semibold rounded-full text-xs flex items-center gap-1 sm:gap-1.5 shadow-xs transition-colors active-press shrink-0"
                >
                  <span className="hidden xs:inline sm:inline">All Details</span>
                  <span className="xs:hidden sm:hidden">Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {computedSpots.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No workspaces matched your filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try loosening the must-have filters or select a different nomad hub preset like Bali, Lisbon, Tokyo, or CDMX.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
              setFilterHighSpeedOnly(false);
              setFilterPlugsOnly(false);
              setFilterQuietOnly(false);
              setFilterGeneratorOnly(false);
            }}
            className="px-4 py-2 bg-orange-500 text-white font-bold rounded-xl text-xs"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Comprehensive Venue, Coffee, Bar & Dining Details Modal */}
      {selectedSpotForDetails && (
        <WorkSpotDetailModal
          spot={selectedSpotForDetails}
          onClose={() => setSelectedSpotForDetails(null)}
          onAddStopToTrip={onAddStopToTrip}
          onAddToDayItinerary={onAddToDayItinerary}
          onSaveReview={handleSaveReviewFromModal}
        />
      )}
    </div>
  );
};

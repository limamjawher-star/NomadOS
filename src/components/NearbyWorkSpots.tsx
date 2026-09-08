import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Wifi,
  Zap,
  Coffee,
  Building2,
  Utensils,
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
  Check
} from 'lucide-react';
import { WorkSpot, WorkSpotReview } from '../types';
import { WORK_SPOTS_DATA, CITY_COORDINATE_PRESETS } from '../data/workSpotsData';
import { calculateHaversineDistanceKm, formatDistance } from '../utils/geoUtils';

interface NearbyWorkSpotsProps {
  currentCity?: string;
  onAddStopToTrip?: (spot: WorkSpot) => void;
  onAddToDayItinerary?: (spot: WorkSpot) => void;
}

export const NearbyWorkSpots: React.FC<NearbyWorkSpotsProps> = ({
  currentCity = 'Canggu, Bali',
  onAddStopToTrip,
  onAddToDayItinerary
}) => {
  // User Coordinates State (Defaults to Canggu, Bali or Lisbon depending on profile)
  const defaultCoords = useMemo(() => {
    return { lat: -8.6500, lng: 115.1350, label: 'Canggu, Bali (Default Base)' };
  }, []);

  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number; label: string }>(defaultCoords);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'coworking' | 'cafe' | 'restaurant'>('all');
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
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New review form
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewWifiMbps, setNewReviewWifiMbps] = useState(120);
  const [newReviewNoise, setNewReviewNoise] = useState<'Quiet Focus' | 'Moderate / Cafe Ambience' | 'Lively' | 'Zoom Friendly'>('Quiet Focus');
  const [newReviewComment, setNewReviewComment] = useState('');

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
        'coffe': ['coffee', 'cafe', 'roast', 'brew', 'espresso', 'cappuccino', 'matcha'],
        'coffee': ['coffe', 'cafe', 'roast', 'brew', 'espresso', 'cappuccino', 'barista'],
        'cafe': ['coffee', 'coffe', 'bakery', 'roastery', 'espresso'],
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

  // Handle Add New Review
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpotForDetails) return;

    const newReview: WorkSpotReview = {
      id: `rev-user-${Date.now()}`,
      author: newReviewAuthor.trim() || 'Nomad Explorer',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      rating: newReviewRating,
      wifiRating: newReviewWifiMbps >= 100 ? 5 : 4,
      noiseLevel: newReviewNoise,
      comment: newReviewComment.trim() || 'Tested the connection on laptop, smooth and reliable work session.',
      date: 'Just now',
      verifiedNomad: true
    };

    const updatedSpots = spots.map((sp) => {
      if (sp.id === selectedSpotForDetails.id) {
        const updatedReviews = [newReview, ...sp.reviews];
        const avgRating = Number(
          (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
        );
        return {
          ...sp,
          rating: avgRating,
          reviewCount: sp.reviewCount + 1,
          wifiSpeedMbps: Math.max(sp.wifiSpeedMbps, newReviewWifiMbps),
          reviews: updatedReviews
        };
      }
      return sp;
    });

    setSpots(updatedSpots);
    const updatedSelected = updatedSpots.find((s) => s.id === selectedSpotForDetails.id);
    if (updatedSelected) {
      setSelectedSpotForDetails(updatedSelected);
    }

    setIsReviewModalOpen(false);
    setNewReviewComment('');
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
              <h2 className="text-xl font-black text-slate-900 font-display tracking-tight">
                Workspaces & Cafes
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200/60">
                {computedSpots.length} verified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
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
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold rounded-2xl text-xs flex items-center gap-1.5 transition-all shadow-sm shrink-0"
            >
              <Navigation className={`w-3.5 h-3.5 text-orange-400 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'Near Me'}</span>
            </button>
          </div>
        </div>

        {locationError && (
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center justify-between">
            <span>⚠️ {locationError}</span>
            <button
              onClick={() => setLocationError(null)}
              className="text-amber-700 hover:text-amber-900 text-xs font-bold ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Compass className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, neighborhood, or tags..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 transition-all"
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
              className="w-full sm:w-auto appearance-none pl-3 pr-8 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
            >
              <option value="distance">📍 Closest First</option>
              <option value="wifi">⚡ Fastest Wi-Fi</option>
              <option value="rating">⭐ Highest Rated</option>
              <option value="price">🏷️ Day Pass Price</option>
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
              { id: 'coworking', label: 'Coworking', icon: Building2 },
              { id: 'cafe', label: 'Cafes', icon: Coffee },
              { id: 'restaurant', label: 'Restaurants', icon: Utensils }
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />}
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
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap border ${
                filterHighSpeedOnly
                  ? 'bg-orange-50 border-orange-300 text-orange-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Wifi className="w-3 h-3 text-orange-500" />
              <span>150+ Mbps</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterPlugsOnly(!filterPlugsOnly)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap border ${
                filterPlugsOnly
                  ? 'bg-amber-50 border-amber-300 text-amber-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Plugs</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterQuietOnly(!filterQuietOnly)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap border ${
                filterQuietOnly
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <VolumeX className="w-3 h-3 text-emerald-600" />
              <span>Quiet</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterGeneratorOnly(!filterGeneratorOnly)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap border ${
                filterGeneratorOnly
                  ? 'bg-sky-50 border-sky-300 text-sky-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-sky-600" />
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
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                title="Clear filters"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
        <span>Found {computedSpots.length} verified workspaces nearby</span>
        {toastMessage && (
          <span className="text-orange-600 font-extrabold animate-in fade-in">
            {toastMessage}
          </span>
        )}
      </div>

      {/* Spot Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {computedSpots.map((spot) => (
          <div
            key={spot.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Photo & Distance Header */}
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  src={spot.photoUrl}
                  alt={spot.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                {/* Distance Badge */}
                <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  <span>{formatDistance(spot.distanceKm || 0)}</span>
                </div>

                {/* Category & Price Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span
                    className={`px-2.5 py-1 rounded-xl text-xs font-black capitalize backdrop-blur-md shadow-md ${
                      spot.category === 'coworking'
                        ? 'bg-orange-500/90 text-white'
                        : spot.category === 'cafe'
                        ? 'bg-amber-500/90 text-white'
                        : 'bg-rose-500/90 text-white'
                    }`}
                  >
                    {spot.category}
                  </span>
                  {spot.dayPassUSD !== undefined && spot.dayPassUSD > 0 && (
                    <span className="bg-emerald-600/90 backdrop-blur-md text-white px-2 py-1 rounded-xl text-xs font-black">
                      ${spot.dayPassUSD}/day
                    </span>
                  )}
                  {spot.dayPassUSD === 0 && (
                    <span className="bg-blue-600/90 backdrop-blur-md text-white px-2 py-1 rounded-xl text-xs font-black">
                      Free Entry
                    </span>
                  )}
                </div>

                {/* Bottom title on photo */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white text-base font-black font-display drop-shadow-md truncate">
                    {spot.name}
                  </h3>
                  <p className="text-white/85 text-xs truncate drop-shadow">
                    {spot.address}
                  </p>
                </div>
              </div>

              {/* Verified Wi-Fi Connection Box */}
              <div className="p-4 space-y-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100/90 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-black shrink-0">
                      <Wifi className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {spot.wifiSpeedMbps} Mbps
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {spot.wifiReliability}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {spot.wifiSpeedText}
                      </p>
                    </div>
                  </div>

                  {spot.hasBackupPower && (
                    <div className="text-right">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-100 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-sky-600" />
                        Generator
                      </span>
                    </div>
                  )}
                </div>

                {/* Key Spec Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <div className="truncate">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Outlets</p>
                      <p className="font-bold text-slate-800 truncate">{spot.powerOutlets}</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center gap-2">
                    {spot.noiseLevel.includes('Silent') ? (
                      <VolumeX className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    )}
                    <div className="truncate">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Acoustics</p>
                      <p className="font-bold text-slate-800 truncate">{spot.noiseLevel}</p>
                    </div>
                  </div>
                </div>

                {/* Coffee & Food Highlight */}
                <div className="text-xs text-slate-600 line-clamp-1 flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">{spot.foodAndCoffee}</span>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {spot.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                  {spot.tags.length > 3 && (
                    <span className="text-[10px] text-slate-400 font-bold">
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
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-xs font-black text-slate-900">{spot.rating}</span>
                </div>
                <span className="text-[11px] text-slate-400">({spot.reviewCount})</span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* 100% Free Google Maps Directions (No API key needed!) */}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    `${spot.name}, ${spot.address}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open Turn-by-Turn Directions in Google Maps"
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-orange-500" />
                  <span>Directions</span>
                </a>

                {/* View Reviews & Test Wifi */}
                <button
                  type="button"
                  onClick={() => setSelectedSpotForDetails(spot)}
                  className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <span>Reviews ({spot.reviews.length})</span>
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

      {/* Place Details & Community Reviews Modal */}
      {selectedSpotForDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            {/* Header Image */}
            <div className="relative h-48 w-full bg-slate-100">
              <img
                src={selectedSpotForDetails.photoUrl}
                alt={selectedSpotForDetails.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <button
                onClick={() => setSelectedSpotForDetails(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-lg bg-orange-500 text-white text-[10px] font-black uppercase">
                    {selectedSpotForDetails.category}
                  </span>
                  <span className="text-xs font-bold text-white/90">
                    📍 {formatDistance(selectedSpotForDetails.distanceKm || 0)} from you
                  </span>
                </div>
                <h3 className="text-xl font-black font-display drop-shadow">
                  {selectedSpotForDetails.name}
                </h3>
                <p className="text-xs text-white/80 font-medium">
                  {selectedSpotForDetails.address}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-6">
              {/* Live Wi-Fi & Productivity Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-100">
                  <div className="flex items-center gap-1.5 text-orange-600 mb-1">
                    <Wifi className="w-4 h-4" />
                    <span className="text-[11px] font-extrabold uppercase">Internet</span>
                  </div>
                  <p className="text-lg font-black text-slate-900">
                    {selectedSpotForDetails.wifiSpeedMbps} Mbps
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {selectedSpotForDetails.wifiSpeedText}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100">
                  <div className="flex items-center gap-1.5 text-amber-600 mb-1">
                    <Zap className="w-4 h-4" />
                    <span className="text-[11px] font-extrabold uppercase">Power Plugs</span>
                  </div>
                  <p className="text-sm font-black text-slate-900 truncate">
                    {selectedSpotForDetails.powerOutlets}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {selectedSpotForDetails.hasBackupPower ? 'Backup generator ready' : 'Standard mains'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
                    <Volume2 className="w-4 h-4" />
                    <span className="text-[11px] font-extrabold uppercase">Noise / Calls</span>
                  </div>
                  <p className="text-sm font-black text-slate-900 truncate">
                    {selectedSpotForDetails.noiseLevel}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {selectedSpotForDetails.seatingErgonomics}
                  </p>
                </div>
              </div>

              {/* Hours & Amenities */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Hours: {selectedSpotForDetails.openingHours}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                  <Coffee className="w-4 h-4 text-amber-500" />
                  <span>Menu: {selectedSpotForDetails.foodAndCoffee}</span>
                </div>
              </div>

              {/* Action Strip: Free Google Maps directions + Add to Itinerary */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    `${selectedSpotForDetails.name}, ${selectedSpotForDetails.address}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Navigation className="w-4 h-4 text-orange-400" />
                  <span>Open Directions (Free Maps)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>

                {onAddToDayItinerary && (
                  <button
                    type="button"
                    onClick={() => {
                      onAddToDayItinerary(selectedSpotForDetails);
                      showToast(`Added ${selectedSpotForDetails.name} to Day Itinerary!`);
                    }}
                    className="py-3 px-4 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold rounded-2xl text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-orange-600" />
                    <span>Add to Itinerary</span>
                  </button>
                )}
              </div>

              {/* Verified Nomad Reviews Header */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-slate-900 text-base font-display">
                      Nomad Reviews & Speed Reports ({selectedSpotForDetails.reviews.length})
                    </h4>
                    <p className="text-xs text-slate-500">
                      Real feedback on Wi-Fi speeds, plug access, and noise levels.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(true)}
                    className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Report Wi-Fi / Review</span>
                  </button>
                </div>

                {/* Review Items */}
                <div className="space-y-3">
                  {selectedSpotForDetails.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.avatarUrl}
                            alt={rev.author}
                            className="w-7 h-7 rounded-full object-cover border border-slate-300"
                          />
                          <div>
                            <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                              <span>{rev.author}</span>
                              {rev.verifiedNomad && (
                                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-bold">
                                  Verified Nomad
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-slate-400">{rev.date}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-600 font-semibold">
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 flex items-center gap-1">
                          <Wifi className="w-3 h-3 text-orange-500" />
                          {rev.wifiRating}/5 Wi-Fi
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 flex items-center gap-1">
                          <Volume2 className="w-3 h-3 text-sky-500" />
                          {rev.noiseLevel}
                        </span>
                      </div>

                      <p className="text-slate-700 leading-relaxed font-normal">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      {isReviewModalOpen && selectedSpotForDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Wifi className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm font-display">
                  Report Wi-Fi Speed & Review
                </h4>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Help your fellow digital nomads by sharing your measured download speed and workplace comfort at{' '}
              <strong className="text-slate-800">{selectedSpotForDetails.name}</strong>.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Name / Tag</label>
                <input
                  type="text"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="e.g. Alex (Backend Dev)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Overall Rating (1-5)</label>
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 - Great Workspot)</option>
                    <option value={3}>⭐⭐⭐ (3 - Average)</option>
                    <option value={2}>⭐⭐ (2 - Below Average)</option>
                    <option value={1}>⭐ (1 - Not Recommended)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tested Speed (Mbps)</label>
                  <input
                    type="number"
                    value={newReviewWifiMbps}
                    onChange={(e) => setNewReviewWifiMbps(Number(e.target.value))}
                    min={5}
                    max={1000}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Noise / Zoom Environment</label>
                <select
                  value={newReviewNoise}
                  onChange={(e) => setNewReviewNoise(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900"
                >
                  <option value="Quiet Focus">Quiet Focus (Whisper / Headphones)</option>
                  <option value="Moderate / Cafe Ambience">Moderate / Cafe Ambience</option>
                  <option value="Zoom Friendly">Zoom Friendly (Calls Allowed)</option>
                  <option value="Lively">Lively (Busy & Social)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Review Comments</label>
                <textarea
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Share details on outlet availability, coffee quality, chair comfort, air conditioning..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

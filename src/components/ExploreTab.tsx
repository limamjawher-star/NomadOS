import React, { useState } from 'react';
import { 
  Building2, 
  Globe, 
  Search, 
  Wifi, 
  DollarSign, 
  Sun, 
  Shield, 
  Heart, 
  Plus, 
  Eye, 
  Check, 
  SlidersHorizontal,
  Lock,
  Sparkles,
  MapPin,
  Zap,
  Compass,
  Star,
  X,
  Coffee
} from 'lucide-react';
import { NomadCity, TripDestination, NomadState } from '../types';
import { EXPLORE_CITIES } from '../data/defaultData';
import { CountryFlag } from './CountryFlag';
import { GoogleNomadMap } from './GoogleNomadMap';
import { NearbyWorkSpots } from './NearbyWorkSpots';

interface ExploreTabProps {
  state?: NomadState;
  onAddCityToTrip: (city: NomadCity) => void;
  onOpenPricing: () => void;
  isPro: boolean;
}

export const ExploreTab: React.FC<ExploreTabProps> = ({
  state,
  onAddCityToTrip,
  onOpenPricing,
  isPro,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'workspaces' | 'cities' | 'countries' | 'map'>('workspaces');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCityForModal, setSelectedCityForModal] = useState<NomadCity | null>(null);
  const [addedCityId, setAddedCityId] = useState<string | null>(null);

  // Filter logic
  const filteredCities = EXPLORE_CITIES.filter((city) => {
    const matchesSearch = 
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || city.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const handleAddStop = (city: NomadCity) => {
    onAddCityToTrip(city);
    setAddedCityId(city.id);
    setTimeout(() => {
      setAddedCityId(null);
    }, 1500);
  };

  return (
    <div id="explore-view" className="space-y-5 pb-28 max-w-4xl mx-auto px-4 pt-4">
      {/* Subtab Toggle */}
      <div className="flex bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner">
        <button
          onClick={() => setActiveSubTab('workspaces')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'workspaces'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Coffee className={`w-4 h-4 ${activeSubTab === 'workspaces' ? 'text-orange-500' : 'text-slate-400'}`} />
          <span className="truncate">Workspaces</span>
        </button>
        <button
          onClick={() => setActiveSubTab('cities')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'cities'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className={`w-4 h-4 ${activeSubTab === 'cities' ? 'text-orange-500' : 'text-slate-400'}`} />
          <span className="truncate">Hubs</span>
        </button>
        <button
          onClick={() => setActiveSubTab('countries')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'countries'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Globe className={`w-4 h-4 ${activeSubTab === 'countries' ? 'text-orange-500' : 'text-slate-400'}`} />
          <span className="truncate">Visa Guides</span>
        </button>
        <button
          onClick={() => setActiveSubTab('map')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'map'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <MapPin className={`w-4 h-4 ${activeSubTab === 'map' ? 'text-orange-500' : 'text-slate-400'}`} />
          <span className="truncate">Google Map</span>
        </button>
      </div>

      {activeSubTab === 'workspaces' && (
        <NearbyWorkSpots currentCity={state?.currentCity} />
      )}

      {activeSubTab === 'map' && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 font-display">
              Google Maps Explorer
            </h2>
            <p className="text-xs text-slate-500">
              Interactive Google Map of nomad coworking hubs, roasteries, and live sunset meetups worldwide.
            </p>
          </div>
          <GoogleNomadMap
            state={state || ({} as any)}
            onAddStopFromMap={(cityName, country) => {
              const matched = EXPLORE_CITIES.find(c => c.name.toLowerCase().includes(cityName.toLowerCase()));
              if (matched) {
                handleAddStop(matched);
              } else {
                handleAddStop({
                  id: `city-${Date.now()}`,
                  name: cityName,
                  country: country || 'Global',
                  countryCode: 'UN',
                  region: 'Global Hub',
                  costPerMonthUSD: 1800,
                  internetSpeedMbps: 120,
                  nomadScore: 88,
                  weather: '26°C Sunny',
                  weatherTempC: 26,
                  safetyScore: 85,
                  funScore: 90,
                  coworkingSpacesCount: 15,
                  highlights: ['Fast fiber', 'Co-living available'],
                });
              }
            }}
          />
        </div>
      )}

      {(activeSubTab === 'cities' || activeSubTab === 'countries') && (
        <>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 font-display">
              {activeSubTab === 'cities' ? 'Top Digital Nomad Cities' : 'Country Nomad Visa Guides'}
            </h2>
            <p className="text-xs text-slate-500">
              Curated global hubs with verified fiber speeds, living expenses, and legal visa rules.
            </p>
          </div>

      {/* 4 Highlight Cards in 2x2 grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div 
          onClick={() => setSearchQuery('Pokhara')}
          className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">$650/mo</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">Best for budget</p>
          <h4 className="text-sm font-black text-slate-900 font-display group-hover:text-orange-600 transition-colors flex items-center gap-1.5 mt-0.5">
            <span>Pokhara</span>
            <CountryFlag code="NP" name="Nepal" size="xs" />
          </h4>
        </div>

        <div 
          onClick={() => setSearchQuery('Seoul')}
          className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded-md">180 Mbps</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">Fastest 5G & WiFi</p>
          <h4 className="text-sm font-black text-slate-900 font-display group-hover:text-orange-600 transition-colors flex items-center gap-1.5 mt-0.5">
            <span>Seoul</span>
            <CountryFlag code="KR" name="South Korea" size="xs" />
          </h4>
        </div>

        <div 
          onClick={() => setSearchQuery('New York')}
          className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-md">220+ Spaces</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">Top Coworking Hub</p>
          <h4 className="text-sm font-black text-slate-900 font-display group-hover:text-orange-600 transition-colors flex items-center gap-1.5 mt-0.5">
            <span>New York</span>
            <CountryFlag code="US" name="United States" size="xs" />
          </h4>
        </div>

        <div 
          onClick={() => setSearchQuery('Canggu')}
          className="bg-white rounded-2xl p-3 border border-orange-100 bg-gradient-to-br from-orange-50/40 to-amber-50/20 shadow-sm hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-orange-700 bg-orange-100/80 px-1.5 py-0.5 rounded-md">Top Hub</span>
          </div>
          <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider mt-2">Best Community</p>
          <h4 className="text-sm font-black text-slate-900 font-display group-hover:text-orange-600 transition-colors flex items-center gap-1.5 mt-0.5">
            <span>Canggu, Bali</span>
            <CountryFlag code="ID" name="Indonesia" size="xs" />
          </h4>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cities, countries, visa types..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs font-medium text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-slate-700 font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Region & Pro Filter Pills */}
        <div className="flex items-center justify-between overflow-x-auto gap-2 py-1 scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            {['All', 'Asia', 'Europe', 'North America', 'South America'].map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedRegion === region
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenPricing}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition-all shrink-0"
          >
            <Lock className="w-3 h-3" /> Filters PRO
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
          <span>Showing {filteredCities.length} of {EXPLORE_CITIES.length} verified destinations</span>
          <span>Ranked by NomadOS Score</span>
        </div>
      </div>

      {/* Photographic Cities List Cards */}
      <div className="space-y-4">
        {filteredCities.map((city, index) => (
          <div
            key={city.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-md hover:border-orange-300 transition-all group"
          >
            {/* Visual Cover Photo Banner */}
            <div className="relative h-40 sm:h-44 w-full bg-slate-900 overflow-hidden">
              <img
                src={city.imageUrl || "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=80"}
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/20" />

              {/* Floating Top Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-xl bg-black/50 backdrop-blur-md border border-white/20 text-white text-[11px] font-black">
                  #{index + 1}
                </span>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-500/90 backdrop-blur-md text-white text-xs font-black shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>{city.nomadScore}/100 Score</span>
                </div>
              </div>

              {/* Overlaid Title on Photo */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight font-display drop-shadow-sm">
                    {city.name}
                  </h3>
                  <p className="text-xs text-slate-200 font-medium mt-0.5">
                    {city.country} · {city.region}
                  </p>
                </div>
                <div className="text-right bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10">
                  <span className="text-sm font-black text-white">${city.costPerMonthUSD}</span>
                  <span className="text-[10px] text-slate-300 block leading-none">/month</span>
                </div>
              </div>
            </div>

            {/* Body Info */}
            <div className="p-4 space-y-3">
              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Wifi className="w-3.5 h-3.5 text-orange-500" />
                  <span className="font-bold">{city.internetSpeedMbps} Mbps</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-bold">{city.weatherTempC}°C · {city.weather.split(' ')[0]}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-bold">{city.safetyScore}% Safety</span>
                </div>
              </div>

              {/* Highlights tags */}
              <div className="flex flex-wrap gap-1.5">
                {city.bestTag && (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-orange-50 border border-orange-100 text-orange-700 px-2.5 py-0.5 rounded-md">
                    <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                    <span>Best for {city.bestTag}</span>
                  </span>
                )}
                {city.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-medium bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md"
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleAddStop(city)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                    addedCityId === city.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 active:scale-98'
                  }`}
                >
                  {addedCityId === city.id ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Itinerary!
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> Add to Trip Itinerary
                    </>
                  )}
                </button>

                <button
                  onClick={() => setSelectedCityForModal(city)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>City Intel</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
        </>
      )}

      {/* City Details Modal */}
      {selectedCityForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Hero Banner */}
            <div className="relative h-48 w-full bg-slate-900">
              <img
                src={selectedCityForModal.imageUrl || "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=80"}
                alt={selectedCityForModal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <button
                onClick={() => setSelectedCityForModal(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center text-sm font-bold backdrop-blur-md"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-[10px] font-black uppercase text-orange-300 tracking-wider">
                  Verified Destination Intelligence
                </span>
                <h3 className="text-2xl font-black text-white font-display">
                  {selectedCityForModal.name}, {selectedCityForModal.country}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Nomad Score: {selectedCityForModal.nomadScore}/100 · {selectedCityForModal.coworkingSpacesCount} registered coworking spaces
                </p>
              </div>
            </div>

            <div className="p-5 space-y-4 pt-0">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">Estimated Monthly Burn</span>
                  <p className="text-lg font-black text-slate-900 mt-1 font-display">${selectedCityForModal.costPerMonthUSD} USD</p>
                  <span className="text-[10px] text-slate-500">Includes 1BR apartment, food & coworking</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">Average Internet Speed</span>
                  <p className="text-lg font-black text-orange-600 mt-1 font-display">{selectedCityForModal.internetSpeedMbps} Mbps</p>
                  <span className="text-[10px] text-emerald-600 font-bold">Fast enough for 4K video calls</span>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Nomad Insights & Tips</h5>
                <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
                  <p>• <strong>Visa Compliance:</strong> Check 90/180-day limits or dedicated digital nomad permits before booking flights.</p>
                  <p>• <strong>Neighborhoods:</strong> Stick to walking-distance hubs with fiber connectivity and 24/7 cafe access.</p>
                  <p>• <strong>Community:</strong> Active local Telegram and WhatsApp channels for weekly meetups and coworking sprints.</p>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    handleAddStop(selectedCityForModal);
                    setSelectedCityForModal(null);
                  }}
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/20"
                >
                  Add {selectedCityForModal.name} to my next trip
                </button>
                <button
                  onClick={() => setSelectedCityForModal(null)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

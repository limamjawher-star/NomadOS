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
  MapPin
} from 'lucide-react';
import { NomadCity, TripDestination } from '../types';
import { EXPLORE_CITIES } from '../data/defaultData';

interface ExploreTabProps {
  onAddCityToTrip: (city: NomadCity) => void;
  onOpenPricing: () => void;
  isPro: boolean;
}

export const ExploreTab: React.FC<ExploreTabProps> = ({
  onAddCityToTrip,
  onOpenPricing,
  isPro,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'cities' | 'countries'>('cities');
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
    <div id="explore-view" className="space-y-6 pb-24 max-w-2xl mx-auto px-4 pt-4">
      {/* Subtab Toggle matching competitor */}
      <div className="flex bg-stone-100 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveSubTab('cities')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
            activeSubTab === 'cities'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Building2 className={`w-4 h-4 ${activeSubTab === 'cities' ? 'text-orange-500' : 'text-stone-400'}`} />
          <span>Cities</span>
        </button>
        <button
          onClick={() => setActiveSubTab('countries')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
            activeSubTab === 'countries'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Globe className={`w-4 h-4 ${activeSubTab === 'countries' ? 'text-orange-500' : 'text-stone-400'}`} />
          <span>Countries</span>
        </button>
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-xl font-black text-stone-900">
          {activeSubTab === 'cities' ? 'Top Nomad Cities' : 'Country Nomad Guides'}
        </h2>
        <p className="text-xs text-stone-500">
          Discover top cities and verified country nomad visa guides.
        </p>
      </div>

      {/* 4 Highlight Cards in 2x2 grid matching screenshot */}
      <div className="grid grid-cols-2 gap-3">
        <div 
          onClick={() => setSearchQuery('Pokhara')}
          className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-sm hover:border-orange-300 transition-all cursor-pointer"
        >
          <span className="text-xs">💰</span>
          <p className="text-[11px] text-stone-400 font-bold uppercase tracking-wider mt-1">Best for budget</p>
          <h4 className="text-sm font-black text-stone-900 mt-0.5">Pokhara 🇳🇵</h4>
          <span className="text-xs font-bold text-orange-600">$650/mo</span>
        </div>

        <div 
          onClick={() => setSearchQuery('Seoul')}
          className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-sm hover:border-orange-300 transition-all cursor-pointer"
        >
          <span className="text-xs">⚡</span>
          <p className="text-[11px] text-stone-400 font-bold uppercase tracking-wider mt-1">Best for fast WiFi</p>
          <h4 className="text-sm font-black text-stone-900 mt-0.5">Seoul 🇰🇷</h4>
          <span className="text-xs font-bold text-orange-600">180 Mbps</span>
        </div>

        <div 
          onClick={() => setSearchQuery('New York')}
          className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-sm hover:border-orange-300 transition-all cursor-pointer"
        >
          <span className="text-xs">📍</span>
          <p className="text-[11px] text-stone-400 font-bold uppercase tracking-wider mt-1">Best coworking</p>
          <h4 className="text-sm font-black text-stone-900 mt-0.5">New York 🇺🇸</h4>
          <span className="text-xs font-bold text-orange-600">220+ Spaces</span>
        </div>

        <div 
          onClick={() => setSearchQuery('Canggu')}
          className="bg-white rounded-2xl p-3.5 border border-orange-200 bg-orange-50/20 shadow-sm hover:border-orange-400 transition-all cursor-pointer"
        >
          <span className="text-xs">🧡</span>
          <p className="text-[11px] text-orange-500 font-bold uppercase tracking-wider mt-1">Best community</p>
          <h4 className="text-sm font-black text-stone-900 mt-0.5">Canggu 🇮🇩</h4>
          <span className="text-xs font-bold text-orange-600">Top Hub</span>
        </div>
      </div>

      {/* Filter & Search Bar matching screenshot */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cities, countries, tags..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-2xl text-xs font-medium text-stone-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-xs text-stone-400 hover:text-stone-700"
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
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenPricing}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors shrink-0"
          >
            <Lock className="w-3 h-3" /> Filters PRO
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-stone-400 font-semibold px-1">
          <span>Showing {filteredCities.length} of {EXPLORE_CITIES.length} verified hubs</span>
          <span>Ranked by NomadOS Score</span>
        </div>
      </div>

      {/* Cities List Cards */}
      <div className="space-y-4">
        {filteredCities.map((city, index) => (
          <div
            key={city.id}
            className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm hover:border-orange-300 transition-all space-y-4"
          >
            {/* Header row */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-stone-100 text-stone-600 font-black text-xs flex items-center justify-center">
                  #{index + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-stone-900">{city.name}</h3>
                    <span className="text-xs text-stone-400 font-medium">
                      {city.country} · {city.region}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 bg-orange-50 border border-orange-200/60 px-2 py-0.5 rounded-md">
                      <Sparkles className="w-3 h-3 text-orange-500" />
                      <span className="text-[11px] font-black text-orange-700">
                        {city.nomadScore}/100 Score
                      </span>
                    </div>
                    {city.bestTag && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                        Best for {city.bestTag}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-stone-900">${city.costPerMonthUSD}</span>
                <span className="text-[11px] text-stone-400 block">/month</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 py-2 border-y border-stone-100 text-xs">
              <div className="flex items-center gap-1.5 text-stone-600">
                <Wifi className="w-3.5 h-3.5 text-orange-500" />
                <span className="font-semibold">{city.internetSpeedMbps} Mbps</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-600">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-semibold">{city.weatherTempC}°C</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-600">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-semibold">{city.safetyScore}% Safety</span>
              </div>
            </div>

            {/* Highlights tags */}
            <div className="flex flex-wrap gap-1.5">
              {city.highlights.map((h, i) => (
                <span
                  key={i}
                  className="text-[11px] font-medium bg-stone-50 border border-stone-200 text-stone-600 px-2.5 py-1 rounded-lg"
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleAddStop(city)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  addedCityId === city.id
                    ? 'bg-emerald-500 text-white'
                    : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20'
                }`}
              >
                {addedCityId === city.id ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Itinerary!
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Add to Trip
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedCityForModal(city)}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* City Details Modal */}
      {selectedCityForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-stone-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-black uppercase text-orange-600 tracking-wider">
                  City Intelligence
                </span>
                <h3 className="text-2xl font-black text-stone-900">
                  {selectedCityForModal.name}, {selectedCityForModal.country}
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Nomad Score: {selectedCityForModal.nomadScore}/100 · {selectedCityForModal.coworkingSpacesCount} registered coworking spaces
                </p>
              </div>
              <button
                onClick={() => setSelectedCityForModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1.5"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-[11px] text-stone-400 font-bold uppercase">Estimated Monthly Burn</span>
                <p className="text-lg font-black text-stone-900 mt-1">${selectedCityForModal.costPerMonthUSD} USD</p>
                <span className="text-[10px] text-stone-500">Includes 1BR apartment, food & coworking</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-[11px] text-stone-400 font-bold uppercase">Average Internet Speed</span>
                <p className="text-lg font-black text-stone-900 mt-1">{selectedCityForModal.internetSpeedMbps} Mbps</p>
                <span className="text-[10px] text-emerald-600 font-bold">Fast enough for 4K video calls</span>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Nomad Insights & Tips</h5>
              <div className="space-y-1.5 text-xs text-stone-600 leading-relaxed">
                <p>• <strong>Visa:</strong> Check 90/180-day limits or dedicated digital nomad permits before booking flights.</p>
                <p>• <strong>Neighborhoods:</strong> Stick to walking-distance hubs with fiber connectivity and 24/7 cafe access.</p>
                <p>• <strong>Community:</strong> Active local Telegram and WhatsApp channels for weekly meetups and padel/surf sessions.</p>
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
                className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

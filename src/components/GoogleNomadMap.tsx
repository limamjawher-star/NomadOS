import React, { useState, useMemo } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow 
} from '@vis.gl/react-google-maps';
import { 
  MapPin, 
  Navigation as NavIcon, 
  ExternalLink, 
  Coffee, 
  Laptop, 
  Users, 
  Star, 
  Wifi, 
  Compass, 
  Search, 
  ChevronRight, 
  Calendar, 
  Check, 
  Plus, 
  Layers,
  Sparkles,
  Info,
  Maximize2
} from 'lucide-react';
import { NomadState, NomadEvent } from '../types';

export interface MapPlace {
  id: string;
  name: string;
  category: 'coworking' | 'cafe' | 'meetup' | 'city';
  lat: number;
  lng: number;
  address: string;
  wifiSpeed?: string;
  rating?: number;
  description: string;
  photoUrl: string;
  badge?: string;
  eventDate?: string;
  attendeesCount?: number;
}

const DEFAULT_PLACES: MapPlace[] = [
  // Bali / Canggu
  {
    id: 'place-dojo',
    name: 'Dojo Coworking & Garden Pool',
    category: 'coworking',
    lat: -8.6539,
    lng: 115.1294,
    address: 'Jl. Batu Mejan No.88, Canggu, Bali',
    wifiSpeed: '120 Mbps fiber',
    rating: 4.9,
    description: 'Iconic beachfront coworking garden with dual backup generators, soundproof Skype booths, and tropical pool desks.',
    photoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    badge: 'Nomad Classic'
  },
  {
    id: 'place-batur',
    name: 'Batur Roastery & Work Lounge',
    category: 'cafe',
    lat: -8.6475,
    lng: 115.1382,
    address: 'Jl. Pantai Batu Bolong No.42, Canggu, Bali',
    wifiSpeed: '140 Mbps',
    rating: 4.8,
    description: 'High-speed air-conditioned quiet mezzanine with ergonomic seating and single-origin Kintamani pour-overs.',
    photoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    badge: 'Work-Friendly'
  },
  {
    id: 'place-zenita',
    name: 'Zenita Specialty Coffee & Bakery',
    category: 'cafe',
    lat: -8.6421,
    lng: 115.1350,
    address: 'Jl. Raya Semat No.14, Tibubeneng, Bali',
    wifiSpeed: '95 Mbps',
    rating: 4.7,
    description: 'Nomad morning favorite with outdoor shaded tables, abundant AC power outlets, and sourdough avocado toast.',
    photoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    badge: 'Casual Cowork'
  },
  {
    id: 'place-sunset-meetup',
    name: 'Echo Beach Sunset & Founders Mixer',
    category: 'meetup',
    lat: -8.6575,
    lng: 115.1270,
    address: 'Echo Beach Boardwalk, Canggu',
    rating: 4.9,
    description: 'Weekly casual sunset drinks for boot-strappers, remote software engineers, and digital nomad founders.',
    photoUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80',
    badge: 'Live Event',
    eventDate: 'Today · 18:00 WITA',
    attendeesCount: 24
  },
  {
    id: 'place-tropical-nomad',
    name: 'Tropical Nomad Coworking Space',
    category: 'coworking',
    lat: -8.6510,
    lng: 115.1430,
    address: 'Jl. Subak Canggu No.2, Canggu, Bali',
    wifiSpeed: '180 Mbps Dedicated',
    rating: 4.8,
    description: 'Open-air pavilion surrounded by rice fields with 24/7 access pass and active entrepreneur networking.',
    photoUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
    badge: '24/7 Access'
  },
  // Global Nomad Hubs
  {
    id: 'city-tokyo',
    name: 'Tokyo Nomad Hub (Shibuya & Shinjuku)',
    category: 'city',
    lat: 35.6580,
    lng: 139.7016,
    address: 'Shibuya City, Tokyo, Japan',
    wifiSpeed: '240 Mbps 5G/Fiber',
    rating: 4.9,
    description: 'World-class transit, ultra-clean cafes, exceptional safety, and vibrant remote creator meetups.',
    photoUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    badge: '$2,300/mo'
  },
  {
    id: 'city-lisbon',
    name: 'Lisbon Hub (Saldanha & Alfama)',
    category: 'city',
    lat: 38.7223,
    lng: -9.1393,
    address: 'Lisbon, Portugal',
    wifiSpeed: '160 Mbps',
    rating: 4.8,
    description: 'European nomad capital with year-round coastal sunshine, surf culture, and Schengen D8 digital nomad visa.',
    photoUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
    badge: '€2,100/mo'
  },
  {
    id: 'city-cdmx',
    name: 'Mexico City (Roma Norte & Condesa)',
    category: 'city',
    lat: 19.4194,
    lng: -99.1601,
    address: 'Cuauhtémoc, Mexico City, CDMX',
    wifiSpeed: '130 Mbps',
    rating: 4.9,
    description: 'Culinary wonderland, tree-lined European avenues, buzzing co-working cafes, and convenient US timezone alignment.',
    photoUrl: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=600&q=80',
    badge: '$1,450/mo'
  }
];

const CITY_PRESETS = [
  { name: 'Canggu, Bali', lat: -8.6500, lng: 115.1350, zoom: 14 },
  { name: 'Tokyo, Japan', lat: 35.6580, lng: 139.7016, zoom: 12 },
  { name: 'Lisbon, Portugal', lat: 38.7223, lng: -9.1393, zoom: 13 },
  { name: 'Mexico City', lat: 19.4194, lng: -99.1601, zoom: 13 },
];

interface GoogleNomadMapProps {
  state: NomadState;
  onSelectPlace?: (place: MapPlace) => void;
  onAddStopFromMap?: (city: string, country: string) => void;
  onRSVPEvent?: (eventId: string) => void;
}

export const GoogleNomadMap: React.FC<GoogleNomadMapProps> = ({
  state,
  onSelectPlace,
  onAddStopFromMap,
  onRSVPEvent,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'coworking' | 'cafe' | 'meetup' | 'city'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(DEFAULT_PLACES[0]);
  const [mapCenter, setMapCenter] = useState({ lat: -8.6500, lng: 115.1350 });
  const [zoomLevel, setZoomLevel] = useState(14);
  const [copiedLink, setCopiedLink] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  // Check API key from environment variable
  const apiKey = ((import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string) || '';

  // Filtered places
  const filteredPlaces = useMemo(() => {
    return DEFAULT_PLACES.filter((place) => {
      const matchCategory = selectedCategory === 'all' || place.category === selectedCategory;
      const matchSearch = 
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Handle Pan to city preset
  const handleJumpToCity = (preset: typeof CITY_PRESETS[0]) => {
    setMapCenter({ lat: preset.lat, lng: preset.lng });
    setZoomLevel(preset.zoom);
    const matching = DEFAULT_PLACES.find(p => p.address.toLowerCase().includes(preset.name.split(',')[0].toLowerCase()) || p.name.toLowerCase().includes(preset.name.split(',')[0].toLowerCase()));
    if (matching) {
      setSelectedPlace(matching);
    }
  };

  const handleOpenGoogleMapsDirections = (place: MapPlace) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.address || `${place.lat},${place.lng}`)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenGoogleMapsSearch = (place: MapPlace) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.address}`)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleRSVP = () => {
    setRsvpSuccess(true);
    if (onRSVPEvent && selectedPlace) {
      onRSVPEvent(selectedPlace.id);
    }
    setTimeout(() => setRsvpSuccess(false), 2000);
  };

  return (
    <div id="google-nomad-map-container" className="space-y-3.5">
      {/* Search Bar & City Selector */}
      <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coworking, cafes, sunset meetups in Bali or global hubs..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:bg-white focus:border-orange-500 transition-all text-slate-800 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>
          <button
            onClick={() => handleJumpToCity(CITY_PRESETS[0])}
            title="Recenter on current base (Bali)"
            className="px-3 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl text-xs font-bold border border-orange-200/70 flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <NavIcon className="w-3.5 h-3.5 text-orange-600" />
            <span className="hidden sm:inline">My Base</span>
          </button>
        </div>

        {/* Quick City Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-slate-400 font-bold text-[11px] shrink-0 flex items-center gap-1 pl-0.5">
            <Compass className="w-3 h-3 text-orange-500" />
            <span>Hubs:</span>
          </span>
          {CITY_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleJumpToCity(preset)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] whitespace-nowrap transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'All Places', icon: Layers },
          { id: 'coworking', label: 'Coworking Hubs', icon: Laptop },
          { id: 'cafe', label: 'Work Cafes', icon: Coffee },
          { id: 'meetup', label: 'Nomad Meetups', icon: Users },
          { id: 'city', label: 'Global Hubs', icon: MapPin },
        ].map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                isActive
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-500/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Map View Area */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-md bg-slate-950 min-h-[360px] sm:min-h-[420px] flex flex-col">
        {/* Top Floating Attribution & GPS Status */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-none">
          <div className="px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Google Maps · {filteredPlaces.length} Locations</span>
          </div>
        </div>

        {/* Map Rendering Engine: VisGL react-google-maps if Key exists, else Interactive Google Map Frame with Pins */}
        {apiKey ? (
          <div className="w-full h-80 sm:h-96 relative">
            <APIProvider apiKey={apiKey}>
              <Map
                center={mapCenter}
                zoom={zoomLevel}
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
                style={{ width: '100%', height: '100%' }}
                gestureHandling="cooperative"
                disableDefaultUI={false}
              >
                {filteredPlaces.map((place) => (
                  <AdvancedMarker
                    key={place.id}
                    position={{ lat: place.lat, lng: place.lng }}
                    onClick={() => {
                      setSelectedPlace(place);
                      if (onSelectPlace) onSelectPlace(place);
                    }}
                    title={place.name}
                  >
                    <div className="cursor-pointer transform hover:scale-110 transition-transform">
                      {place.category === 'coworking' && (
                        <div className="p-2 rounded-full bg-sky-600 text-white shadow-lg border-2 border-white">
                          <Laptop className="w-4 h-4" />
                        </div>
                      )}
                      {place.category === 'cafe' && (
                        <div className="p-2 rounded-full bg-amber-600 text-white shadow-lg border-2 border-white">
                          <Coffee className="w-4 h-4" />
                        </div>
                      )}
                      {place.category === 'meetup' && (
                        <div className="p-2 rounded-full bg-orange-600 text-white shadow-lg border-2 border-white animate-pulse">
                          <Users className="w-4 h-4" />
                        </div>
                      )}
                      {place.category === 'city' && (
                        <div className="p-2 rounded-full bg-indigo-600 text-white shadow-lg border-2 border-white">
                          <MapPin className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </AdvancedMarker>
                ))}
              </Map>
            </APIProvider>
          </div>
        ) : (
          /* Interactive High-Fidelity Google Maps Preview with Vector Controls & Overlay */
          <div className="relative w-full h-80 sm:h-96 bg-slate-900 overflow-hidden">
            {/* Embedded Live Google Maps Iframe */}
            <iframe
              title="Google Maps Nomad Locations"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}&z=${zoomLevel}&output=embed`}
            />

            {/* Interactive Pins Floating Layer */}
            <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
              <div className="flex items-start justify-end gap-2 pointer-events-auto">
                <button
                  onClick={() => {
                    const url = `https://www.google.com/maps/@${mapCenter.lat},${mapCenter.lng},${zoomLevel}z`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }}
                  className="px-3 py-1.5 bg-white/95 hover:bg-white text-slate-800 text-xs font-bold rounded-xl shadow-lg border border-slate-200 flex items-center gap-1.5 transition-transform hover:scale-105"
                  title="Open in official Google Maps app"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-orange-600" />
                  <span>Open in Google Maps</span>
                </button>
              </div>

              {/* Bottom Interactive Quick-Pin Carousels */}
              <div className="pointer-events-auto overflow-x-auto no-scrollbar flex items-center gap-2 pt-2">
                {filteredPlaces.map((place) => {
                  const isSelected = selectedPlace?.id === place.id;
                  return (
                    <button
                      key={place.id}
                      onClick={() => {
                        setSelectedPlace(place);
                        setMapCenter({ lat: place.lat, lng: place.lng });
                        if (onSelectPlace) onSelectPlace(place);
                      }}
                      className={`px-3 py-2 rounded-2xl backdrop-blur-xl border transition-all text-left shrink-0 max-w-[200px] flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-orange-500 text-white border-orange-400 shadow-xl scale-105'
                          : 'bg-slate-900/85 hover:bg-slate-900 text-white/90 border-white/20'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-white/20' : 'bg-slate-800'}`}>
                        {place.category === 'coworking' && <Laptop className="w-4 h-4 text-sky-400" />}
                        {place.category === 'cafe' && <Coffee className="w-4 h-4 text-amber-400" />}
                        {place.category === 'meetup' && <Users className="w-4 h-4 text-orange-400" />}
                        {place.category === 'city' && <MapPin className="w-4 h-4 text-indigo-400" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black truncate leading-tight font-display">{place.name}</p>
                        <p className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                          {place.badge || place.address.split(',')[0]}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Selected Place Details Card & Action Bar */}
        {selectedPlace && (
          <div className="bg-white p-4 border-t border-slate-200/90 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <img
                  src={selectedPlace.photoUrl}
                  alt={selectedPlace.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 shadow-xs border border-slate-100"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 text-[10px] font-black uppercase tracking-wider border border-orange-100">
                      {selectedPlace.category}
                    </span>
                    {selectedPlace.badge && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                        {selectedPlace.badge}
                      </span>
                    )}
                    {selectedPlace.rating && (
                      <span className="flex items-center gap-1 text-[11px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded-md border border-amber-100">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>{selectedPlace.rating}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-slate-900 font-display mt-1">
                    {selectedPlace.name}
                  </h3>

                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate max-w-xs">{selectedPlace.address}</span>
                  </p>

                  {selectedPlace.wifiSpeed && (
                    <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
                      <Wifi className="w-3 h-3" />
                      <span>{selectedPlace.wifiSpeed}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons: 100% Functional */}
              <div className="flex sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0">
                <button
                  onClick={() => handleOpenGoogleMapsDirections(selectedPlace)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 transition-all"
                  title="Open turn-by-turn directions in Google Maps"
                >
                  <NavIcon className="w-3.5 h-3.5" />
                  <span>Directions</span>
                </button>

                <button
                  onClick={() => handleOpenGoogleMapsSearch(selectedPlace)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  title="View on Google Maps"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span>Google Maps</span>
                </button>

                {selectedPlace.category === 'meetup' && (
                  <button
                    onClick={handleRSVP}
                    className={`w-full px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                      rsvpSuccess
                        ? 'bg-emerald-500 text-white'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    {rsvpSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>RSVP Confirmed!</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>RSVP Meetup</span>
                      </>
                    )}
                  </button>
                )}

                {selectedPlace.category === 'city' && onAddStopFromMap && (
                  <button
                    onClick={() => {
                      const cityName = selectedPlace.name.split('(')[0].trim();
                      onAddStopFromMap(cityName, 'Nomad Stop');
                    }}
                    className="w-full px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Trips</span>
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-2.5 pt-2.5 border-t border-slate-100 leading-relaxed font-normal">
              {selectedPlace.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

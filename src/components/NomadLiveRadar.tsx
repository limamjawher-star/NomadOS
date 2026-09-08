import React, { useState, useMemo } from 'react';
import { 
  Radio, 
  Wifi, 
  MapPin, 
  Users, 
  Coffee, 
  Sparkles, 
  Compass, 
  Navigation, 
  MessageSquare, 
  ExternalLink, 
  SlidersHorizontal, 
  Shield, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Zap, 
  Battery, 
  Check, 
  X,
  Clock
} from 'lucide-react';
import { NomadState, NearbyNomad, WorkSpot } from '../types';
import { WORK_SPOTS_DATA } from '../data/workSpotsData';

interface NomadLiveRadarProps {
  state: NomadState;
  onNavigateTab?: (tab: 'home' | 'travel' | 'finance' | 'explore' | 'social' | 'me') => void;
  onDirectMessage?: (nomad: NearbyNomad) => void;
}

type RadarFilter = 'all' | 'nomads' | 'workspots' | 'fastwifi';

interface RadarEntity {
  id: string;
  type: 'nomad' | 'workspot';
  title: string;
  subtitle: string;
  distanceMeters: number;
  distanceLabel: string;
  angleDeg: number; // 0 - 360 for radial plotting
  wifiSpeed?: number;
  avatarUrl?: string;
  isOnline?: boolean;
  statusText?: string;
  category?: string;
  noise?: string;
  rawNomad?: NearbyNomad;
  rawSpot?: WorkSpot;
}

export const NomadLiveRadar: React.FC<NomadLiveRadarProps> = ({
  state,
  onNavigateTab,
  onDirectMessage
}) => {
  const [radarRange, setRadarRange] = useState<number>(2000); // in meters: 500, 1000, 2000, 5000
  const [filter, setFilter] = useState<RadarFilter>('all');
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(true);
  const [selectedEntity, setSelectedEntity] = useState<RadarEntity | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanPulseKey, setScanPulseKey] = useState<number>(0);

  // Generate deterministic radial positions around current city coordinates
  const radarEntities: RadarEntity[] = useMemo(() => {
    const list: RadarEntity[] = [];

    // 1. Nearby Nomads from state
    state.nearbyNomads.forEach((nomad, idx) => {
      // Deterministic angle and distance based on index/id
      const angles = [35, 120, 210, 290, 75, 160, 320, 195];
      const distances = [350, 850, 1200, 600, 1750, 920, 1400, 480];
      const angle = angles[idx % angles.length];
      const dist = distances[idx % distances.length];

      list.push({
        id: `nomad-${nomad.id}`,
        type: 'nomad',
        title: nomad.name,
        subtitle: nomad.profession,
        distanceMeters: dist,
        distanceLabel: dist < 1000 ? `${dist}m away` : `${(dist / 1000).toFixed(1)}km away`,
        angleDeg: angle,
        avatarUrl: nomad.avatarUrl,
        isOnline: nomad.isOnline,
        statusText: nomad.isOnline ? 'Active on laptop now' : 'Seen 20m ago',
        rawNomad: nomad
      });
    });

    // 2. High-speed Workspots & Cafes
    WORK_SPOTS_DATA.forEach((spot, idx) => {
      const angles = [60, 145, 240, 310, 15, 185, 275, 100];
      const distances = [250, 550, 1100, 1600, 700, 1350, 1900, 400];
      const angle = angles[idx % angles.length];
      const dist = distances[idx % distances.length];

      list.push({
        id: `spot-${spot.id}`,
        type: 'workspot',
        title: spot.name,
        subtitle: `${spot.category === 'coworking' ? 'Coworking Hub' : 'Work-Friendly Cafe'} • ${spot.wifiSpeedMbps} Mbps`,
        distanceMeters: dist,
        distanceLabel: dist < 1000 ? `${dist}m away` : `${(dist / 1000).toFixed(1)}km away`,
        angleDeg: angle,
        wifiSpeed: spot.wifiSpeedMbps,
        category: spot.category,
        noise: spot.noiseLevel,
        rawSpot: spot
      });
    });

    return list;
  }, [state.nearbyNomads]);

  // Filtered entities based on range and category
  const visibleEntities = useMemo(() => {
    return radarEntities.filter((item) => {
      if (item.distanceMeters > radarRange) return false;
      if (filter === 'nomads' && item.type !== 'nomad') return false;
      if (filter === 'workspots' && item.type !== 'workspot') return false;
      if (filter === 'fastwifi' && (item.type !== 'workspot' || (item.wifiSpeed || 0) < 100)) return false;
      return true;
    });
  }, [radarEntities, radarRange, filter]);

  const handleManualScan = () => {
    setIsScanning(true);
    setScanPulseKey((prev) => prev + 1);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center relative">
            <Radio className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 leading-none font-display">
                Nomad & Coworking Radar
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 text-[10px] font-semibold border border-orange-200/60">
                LIVE 360°
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Scanning {state.currentCity || 'Canggu, Bali'} for remote peers, high-speed WiFi, & spots
            </p>
          </div>
        </div>

        {/* Scan & Broadcast Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleManualScan}
            disabled={isScanning}
            className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm shadow-orange-500/20 active:scale-95 transition-all"
          >
            <Zap className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Pinging...' : 'Ping Radar'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsBroadcasting(!isBroadcasting)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
              isBroadcasting
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
            title={isBroadcasting ? 'Broadcasting: Visible to nearby nomads' : 'Ghost Mode: Hidden from radar'}
          >
            {isBroadcasting ? (
              <>
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Broadcasting</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Ghost Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs & Radius Chips */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {[
            { id: 'all', label: `All Signals (${visibleEntities.length})` },
            { id: 'nomads', label: 'Remote Workers' },
            { id: 'workspots', label: 'Coworking / Cafes' },
            { id: 'fastwifi', label: '⚡ WiFi >100M' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as RadarFilter)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-medium whitespace-nowrap transition-colors ${
                filter === tab.id
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Radius Selector */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl text-[10px] font-medium text-slate-600">
          <span className="text-[10px] text-slate-400 pl-1 pr-0.5">Range:</span>
          {[500, 1000, 2000, 5000].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setRadarRange(m)}
              className={`px-2 py-0.5 rounded-lg transition-all ${
                radarRange === m
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              {m < 1000 ? `${m}m` : `${m / 1000}km`}
            </button>
          ))}
        </div>
      </div>

      {/* Radar Circular Stage */}
      <div className="relative w-full aspect-square max-w-[400px] mx-auto rounded-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-4 border-slate-800/80 shadow-inner overflow-hidden flex items-center justify-center p-4">
        {/* Background Grid Crosshairs */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-px bg-slate-800/60" />
          <div className="h-full w-px bg-slate-800/60 absolute" />
        </div>

        {/* Concentric Distance Rings */}
        <div className="absolute w-[86%] h-[86%] rounded-full border border-orange-500/20 pointer-events-none" />
        <div className="absolute w-[62%] h-[62%] rounded-full border border-orange-500/25 pointer-events-none" />
        <div className="absolute w-[36%] h-[36%] rounded-full border border-orange-500/30 pointer-events-none" />

        {/* Distance Range Labels */}
        <span className="absolute top-2.5 text-[9px] font-mono text-orange-400/60 uppercase pointer-events-none">
          {radarRange < 1000 ? `${radarRange}m` : `${radarRange / 1000}km`}
        </span>
        <span className="absolute right-3 text-[9px] font-mono text-orange-400/40 uppercase pointer-events-none">
          E
        </span>
        <span className="absolute bottom-2.5 text-[9px] font-mono text-orange-400/40 uppercase pointer-events-none">
          S
        </span>
        <span className="absolute left-3 text-[9px] font-mono text-orange-400/40 uppercase pointer-events-none">
          W
        </span>

        {/* Sweeping Radar Arm */}
        <div 
          key={scanPulseKey}
          className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
          style={{
            animation: 'radar-sweep 4s linear infinite',
          }}
        >
          <div 
            className="w-1/2 h-1/2 absolute top-0 right-0 origin-bottom-left"
            style={{
              background: 'conic-gradient(from 0deg at 0% 100%, rgba(249, 115, 22, 0.35) 0deg, rgba(249, 115, 22, 0) 65deg)',
            }}
          />
        </div>

        {/* Center: The User */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-orange-500/50 ring-4 ring-orange-500/30">
            <MapPin className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-semibold text-white/90 bg-slate-900/80 px-1.5 py-0.5 rounded mt-1 border border-slate-700">
            YOU
          </span>
        </div>

        {/* Plotted Blips */}
        {visibleEntities.map((entity) => {
          // Normalize distance to radius percentage (max 42% so it stays inside container)
          const radiusPercent = (entity.distanceMeters / radarRange) * 40;
          const rad = (entity.angleDeg * Math.PI) / 180;
          // Coordinates relative to center (50%, 50%)
          const xPercent = 50 + radiusPercent * Math.cos(rad);
          const yPercent = 50 + radiusPercent * Math.sin(rad);

          const isNomad = entity.type === 'nomad';
          const isSelected = selectedEntity?.id === entity.id;

          return (
            <div
              key={entity.id}
              style={{
                left: `${xPercent}%`,
                top: `${yPercent}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => setSelectedEntity(entity)}
              className="absolute z-20 cursor-pointer group"
            >
              {isNomad ? (
                <div className="relative flex items-center justify-center">
                  <div className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-transform group-hover:scale-125 ${
                    isSelected ? 'border-orange-400 ring-2 ring-orange-400 scale-110' : 'border-white/80'
                  }`}>
                    <img
                      src={entity.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={entity.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {entity.isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-1 ring-slate-900 animate-pulse" />
                  )}
                </div>
              ) : (
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] transition-transform group-hover:scale-125 ${
                  isSelected 
                    ? 'bg-amber-400 text-slate-950 ring-2 ring-white scale-110' 
                    : 'bg-orange-600/90 border border-orange-300'
                }`}>
                  {entity.wifiSpeed && entity.wifiSpeed >= 150 ? (
                    <Zap className="w-3 h-3 text-amber-200" />
                  ) : (
                    <Wifi className="w-3 h-3" />
                  )}
                </div>
              )}

              {/* Hover tooltip */}
              <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/95 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap z-30 border border-slate-700">
                {entity.title} • {entity.distanceLabel}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Entity Card Detail */}
      {selectedEntity ? (
        <div className="p-4 bg-slate-50 rounded-2xl border border-orange-200/80 space-y-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {selectedEntity.type === 'nomad' ? (
                <div className="relative">
                  <img
                    src={selectedEntity.avatarUrl}
                    alt={selectedEntity.title}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-orange-400/40"
                  />
                  {selectedEntity.isOnline && (
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  )}
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  {selectedEntity.category === 'coworking' ? (
                    <Radio className="w-6 h-6" />
                  ) : (
                    <Coffee className="w-6 h-6" />
                  )}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">{selectedEntity.title}</h4>
                  <span className="px-2 py-0.5 rounded-full bg-white text-slate-600 text-[10px] font-medium border border-slate-200">
                    {selectedEntity.distanceLabel}
                  </span>
                </div>
                <p className="text-xs text-orange-600 font-medium">{selectedEntity.subtitle}</p>
                {selectedEntity.statusText && (
                  <p className="text-[11px] text-slate-400 mt-0.5">{selectedEntity.statusText}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedEntity(null)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
            {selectedEntity.type === 'nomad' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedEntity.rawNomad && onDirectMessage) {
                      onDirectMessage(selectedEntity.rawNomad);
                    }
                  }}
                  className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm shadow-orange-500/20"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send Direct Message</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('social')}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  View Profile
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('explore')}
                  className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm shadow-orange-500/20"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Full Workspace Info & Reviews</span>
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-orange-500" />
            <span>Tap any blip on the 360° radar to view distance, speeds, or message</span>
          </div>
          <span className="font-semibold text-slate-700">{visibleEntities.length} active blips</span>
        </div>
      )}
    </div>
  );
};

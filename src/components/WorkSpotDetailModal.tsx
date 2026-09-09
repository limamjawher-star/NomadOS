import React, { useState } from 'react';
import {
  X,
  MapPin,
  Wifi,
  Zap,
  Coffee,
  Building2,
  Utensils,
  Wine,
  Star,
  Clock,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Share2,
  Heart,
  CalendarPlus,
  Volume2,
  VolumeX,
  Phone,
  Instagram,
  Globe,
  Navigation,
  Sparkles,
  ShieldCheck,
  Send,
  MessageSquare,
  Users,
  Compass
} from 'lucide-react';
import { WorkSpot, WorkSpotReview } from '../types';
import { formatDistance } from '../utils/geoUtils';

interface WorkSpotDetailModalProps {
  spot: WorkSpot | null;
  onClose: () => void;
  onAddStopToTrip?: (spot: WorkSpot) => void;
  onAddToDayItinerary?: (spot: WorkSpot) => void;
  onSaveReview?: (spotId: string, review: WorkSpotReview) => void;
}

export const WorkSpotDetailModal: React.FC<WorkSpotDetailModalProps> = ({
  spot,
  onClose,
  onAddStopToTrip,
  onAddToDayItinerary,
  onSaveReview,
}) => {
  if (!spot) return null;

  const [activeTab, setActiveTab] = useState<'coffee_menu' | 'specs' | 'amenities' | 'reviews'>('coffee_menu');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [wifiSpeed, setWifiSpeed] = useState(spot.wifiSpeedMbps || 120);
  const [noise, setNoise] = useState<'Quiet Focus' | 'Moderate / Cafe Ambience' | 'Lively' | 'Zoom Friendly'>('Quiet Focus');
  const [comment, setComment] = useState('');
  const [localReviews, setLocalReviews] = useState<WorkSpotReview[]>(spot.reviews || []);

  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleCopyAddress = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(spot.address);
      setCopiedAddress(true);
      triggerNotice('Address copied to clipboard!');
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      const shareText = `Check out ${spot.name} in ${spot.city} on NomadOS! Wi-Fi: ${spot.wifiSpeedMbps} Mbps.`;
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      triggerNotice('Link copied to clipboard!');
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleDirections = () => {
    const mapsQuery = encodeURIComponent(`${spot.name}, ${spot.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`, '_blank', 'noopener,noreferrer');
  };

  const handleAddItinerary = () => {
    if (onAddToDayItinerary) {
      onAddToDayItinerary(spot);
      triggerNotice(`Added "${spot.name}" to your daily schedule!`);
    } else {
      triggerNotice(`Added "${spot.name}" to itinerary!`);
    }
  };

  const handleAddTrip = () => {
    if (onAddStopToTrip) {
      onAddStopToTrip(spot);
      triggerNotice(`Saved "${spot.name}" to upcoming trip stops!`);
    } else {
      triggerNotice(`Saved to your nomad workspace list!`);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newRev: WorkSpotReview = {
      id: `rev-user-${Date.now()}`,
      author: authorName.trim() || 'Fellow Nomad',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      rating,
      wifiRating: Math.min(5, Math.max(1, Math.round(wifiSpeed / 30))),
      noiseLevel: noise,
      comment: comment.trim(),
      date: 'Just now',
      verifiedNomad: true
    };

    const updated = [newRev, ...localReviews];
    setLocalReviews(updated);
    if (onSaveReview) {
      onSaveReview(spot.id, newRev);
    }

    setComment('');
    setShowReviewForm(false);
    triggerNotice('Thank you! Your verified review and speed report was published.');
  };

  // Compile photos gallery
  const photos = spot.photos && spot.photos.length > 0 
    ? spot.photos 
    : [
        spot.photoUrl,
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80'
      ];

  const currentPhoto = photos[selectedPhotoIndex] || spot.photoUrl;

  const getCategoryIcon = () => {
    switch (spot.category) {
      case 'cafe':
        return <Coffee className="w-4 h-4" />;
      case 'bar':
        return <Wine className="w-4 h-4" />;
      case 'restaurant':
        return <Utensils className="w-4 h-4" />;
      default:
        return <Building2 className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = () => {
    switch (spot.category) {
      case 'cafe':
        return 'Specialty Cafe & Roastery';
      case 'bar':
        return 'Cocktail Bar & Sunset Social';
      case 'restaurant':
        return 'Artisan Dining & Work Bistro';
      default:
        return 'Nomad Coworking Hub';
    }
  };

  return (
    <div 
      id="workspot-detail-overlay"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="workspot-detail-card"
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200 mt-auto sm:my-auto"
      >
        {/* Sticky Header Photo Gallery */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-900 shrink-0 overflow-hidden group">
          <img
            src={currentPhoto}
            alt={spot.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20" />

          {/* Top Bar Actions */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-orange-500/95 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                {getCategoryIcon()}
                <span>{getCategoryLabel()}</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-xs font-medium border border-white/20">
                {spot.priceLevel || '$$'} {spot.coffeePriceUSD ? `· ${spot.coffeePriceUSD}` : ''}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Favorite Button */}
              <button
                type="button"
                onClick={() => {
                  setIsFavorited(!isFavorited);
                  triggerNotice(isFavorited ? 'Removed from favorites' : 'Saved to favorite spots!');
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xs cursor-pointer ${
                  isFavorited ? 'bg-rose-500 text-white' : 'bg-black/50 text-white hover:bg-black/70'
                }`}
                title={isFavorited ? 'Favorited' : 'Save to Favorites'}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} strokeWidth={1.75} />
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className="w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 backdrop-blur-md transition-all shadow-xs cursor-pointer"
                title="Share spot"
              >
                {copiedShare ? <Check className="w-4 h-4 text-emerald-400" strokeWidth={1.75} /> : <Share2 className="w-4 h-4" strokeWidth={1.75} />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 backdrop-blur-md transition-all shadow-xs cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          {/* Bottom Title & Neighborhood */}
          <div className="absolute bottom-4 left-4 right-4 text-white z-10">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-semibold uppercase tracking-wider shadow-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>Open Now</span>
              </span>
              <span className="text-xs font-medium text-white/90">
                {spot.city}, {spot.country}
              </span>
              {spot.distanceKm !== undefined && (
                <span className="text-xs font-medium text-orange-300">
                  · {formatDistance(spot.distanceKm)} from you
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold text-white leading-tight">
              {spot.name}
            </h2>

            <div className="flex items-center gap-3 mt-1 text-xs text-white/85">
              <span className="flex items-center gap-1 font-semibold text-amber-300">
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" strokeWidth={1.75} />
                <span>{spot.rating}</span>
                <span className="text-white/70 font-normal">({localReviews.length || spot.reviewCount} reviews)</span>
              </span>
              <span>·</span>
              <span className="truncate max-w-sm">{spot.address}</span>
            </div>
          </div>

          {/* Photo Switcher dots */}
          {photos.length > 1 && (
            <div className="absolute bottom-2 right-4 flex items-center gap-1.5 z-10">
              {photos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    selectedPhotoIndex === idx ? 'w-5 bg-orange-500' : 'w-1.5 bg-white/60 hover:bg-white'
                  }`}
                  title={`Photo ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action Notice Bar */}
        {actionNotice && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs font-medium text-emerald-800 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={1.75} />
              <span>{actionNotice}</span>
            </div>
            <button onClick={() => setActionNotice(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
              <X className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
          </div>
        )}

        {/* Primary Action Buttons Bar */}
        <div className="px-5 py-3 bg-stone-50 border-b border-stone-200/80 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDirections}
              className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Get Directions</span>
            </button>

            <button
              type="button"
              onClick={handleAddItinerary}
              className="px-3 py-2 bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-orange-600" strokeWidth={1.75} />
              <span>Add to Today's Plan</span>
            </button>

            <button
              type="button"
              onClick={handleAddTrip}
              className="px-3 py-2 bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-orange-600" strokeWidth={1.75} />
              <span>Add to Trip</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyAddress}
            className="text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1 shrink-0 px-2.5 py-1.5 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
            title="Copy exact address"
          >
            {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={1.75} /> : <Copy className="w-3.5 h-3.5" strokeWidth={1.75} />}
            <span>{copiedAddress ? 'Copied' : 'Copy Address'}</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 border-b border-stone-200 flex items-center gap-4 text-xs font-medium bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('coffee_menu')}
            className={`pb-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'coffee_menu'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Coffee, Drinks & Food</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`pb-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'specs'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wifi className="w-4 h-4" />
            <span>Nomad Wi-Fi & Work Specs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('amenities')}
            className={`pb-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'amenities'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Hours & Amenities</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`pb-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Reviews ({localReviews.length})</span>
          </button>
        </div>

        {/* Tab Body Contents */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          {/* TAB 1: COFFEE, DRINKS & FOOD */}
          {activeTab === 'coffee_menu' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Highlights Ribbon */}
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs uppercase tracking-wider">
                  <Coffee className="w-4 h-4 text-amber-700" strokeWidth={1.75} />
                  <span>Coffee & Cuisine Highlights</span>
                </div>
                <p className="text-sm font-medium text-stone-800 leading-relaxed">
                  {spot.foodAndCoffee || 'Specialty roasted coffees, wholesome sourdough brunches, and craft beverages.'}
                </p>
                {spot.atmosphere && (
                  <p className="text-xs text-stone-600 italic font-normal">
                    Ambience: "{spot.atmosphere}"
                  </p>
                )}
              </div>

              {/* Specialty Coffee Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-orange-500" strokeWidth={1.75} />
                  <span>Specialty Coffee & Roastery Profile</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                    <span className="text-[10px] font-semibold uppercase text-stone-500">Coffee Pricing</span>
                    <p className="text-sm sm:text-base font-semibold text-stone-900">
                      {spot.coffeePriceUSD || '$2.80 Flat White / Long Black'}
                    </p>
                    <p className="text-xs text-stone-500 font-normal">
                      Oat milk (Oatly) and almond alternatives available.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                    <span className="text-[10px] font-semibold uppercase text-stone-500">Brewing Methods</span>
                    <p className="text-xs sm:text-sm font-semibold text-stone-900">
                      {spot.specialtyCoffee || 'V60 Pour-over, Cold Drip, Aeropress & Double Espresso'}
                    </p>
                    <p className="text-xs text-stone-500 font-normal">
                      Locally roasted single-origin and house seasonal blends.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bar & Sunset Drinks (for Bars, Cafes & Restaurants) */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                  <Wine className="w-4 h-4 text-rose-500" strokeWidth={1.75} />
                  <span>Bar, Cocktails & Beverages</span>
                </h4>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <p className="text-xs font-medium text-slate-800">
                    {spot.barAndDrinks || 'Craft local IPA beers, espresso martinis, natural organic wines, cold-pressed kombucha & fresh coconut water.'}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <span className="px-2.5 py-0.5 bg-white border border-slate-200/80 rounded-full text-[11px] font-medium text-slate-600">
                      Signature Cocktails
                    </span>
                    <span className="px-2.5 py-0.5 bg-white border border-slate-200/80 rounded-full text-[11px] font-medium text-slate-600">
                      Craft Beers
                    </span>
                    <span className="px-2.5 py-0.5 bg-white border border-slate-200/80 rounded-full text-[11px] font-medium text-slate-600">
                      Natural Wine
                    </span>
                    <span className="px-2.5 py-0.5 bg-white border border-slate-200/80 rounded-full text-[11px] font-medium text-slate-600">
                      Fresh Coconuts
                    </span>
                  </div>
                </div>
              </div>

              {/* Popular Food & Dishes */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900 font-display flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />
                  <span>Popular Dishes & Nomad Staples</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(spot.popularDishes && spot.popularDishes.length > 0
                    ? spot.popularDishes
                    : [
                        'Sourdough Avocado & Poached Eggs',
                        'Tropical Acai & Dragonfruit Bowl',
                        'Truffle Mushroom Pasta',
                        'Balinese Roasted Chicken / Tempeh Bowl'
                      ]
                  ).map((dish, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" strokeWidth={1.75} />
                      <span className="text-xs font-medium text-slate-800">{dish}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-700">Dietary Options:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200/60">
                    Vegan Friendly
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium border border-amber-200/60">
                    Gluten-Free Options
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 font-medium border border-sky-200/60">
                    Dairy Alternatives
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NOMAD WI-FI & WORK SPECS */}
          {activeTab === 'specs' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Big Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-orange-50 border border-orange-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-orange-600 mb-1">
                    <Wifi className="w-4 h-4" strokeWidth={1.75} />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">Tested Speed</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-semibold text-stone-900">{spot.wifiSpeedMbps} Mbps</p>
                  <p className="text-xs text-slate-600 font-semibold">{spot.wifiReliability}</p>
                  <p className="text-[11px] text-slate-400">{spot.wifiSpeedText}</p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-600 mb-1">
                    <Zap className="w-4 h-4" strokeWidth={1.75} />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">Power Outlets</span>
                  </div>
                  <p className="text-base font-semibold text-slate-900 leading-tight">{spot.powerOutlets}</p>
                  <p className="text-xs text-slate-600 font-medium flex items-center gap-1">
                    {spot.hasBackupPower ? (
                      <>
                        <Zap className="w-3 h-3 text-amber-500 shrink-0" strokeWidth={1.75} />
                        <span>Backup Generator Ready</span>
                      </>
                    ) : (
                      'Standard Grid Power'
                    )}
                  </p>
                  <p className="text-[11px] text-slate-400 font-normal">Plugs along walls & work benches</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-700 mb-1">
                    <Volume2 className="w-4 h-4" strokeWidth={1.75} />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">Acoustics</span>
                  </div>
                  <p className="text-base font-semibold text-slate-900 leading-tight">{spot.noiseLevel}</p>
                  <p className="text-xs text-slate-600 font-medium">
                    {spot.noiseLevel.includes('Zoom') || spot.noiseLevel.includes('Call')
                      ? 'Ideal for client video calls'
                      : 'Great for deep coding & focus'}
                  </p>
                  <p className="text-[11px] text-slate-400 font-normal">Soft background cafe music</p>
                </div>
              </div>

              {/* Detailed Specs List */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 divide-y divide-slate-200/70">
                <div className="py-2.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500">Seating Ergonomics</span>
                  <span className="font-semibold text-slate-900">{spot.seatingErgonomics}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500">Air Conditioning</span>
                  <span className={`font-semibold ${spot.airConditioning ? 'text-emerald-700' : 'text-slate-600'}`}>
                    {spot.airConditioning ? '✓ Strong Indoor A/C + Fans' : 'Open-Air Tropical Breeze'}
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500">Day Pass Price</span>
                  <span className="font-semibold text-slate-900">
                    {spot.dayPassUSD ? `$${spot.dayPassUSD} / day` : 'Free with food/coffee purchase'}
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500">Laptop Stay Policy</span>
                  <span className="font-semibold text-slate-900">
                    Nomad Friendly (2-5+ hours welcome)
                  </span>
                </div>
              </div>

              {/* Tags Cloud */}
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-slate-900">Nomad Features & Tags</h5>
                <div className="flex flex-wrap gap-1.5">
                  {spot.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HOURS & AMENITIES */}
          {activeTab === 'amenities' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Hours Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
                  <Clock className="w-4 h-4 text-orange-500" strokeWidth={1.75} />
                  <span>Opening Hours & Best Time to Visit</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">Daily Schedule</span>
                  <span className="text-xs font-semibold text-slate-900">{spot.openingHours}</span>
                </div>

                <div className="text-xs text-slate-500 space-y-1">
                  <p><strong className="font-semibold text-slate-800">Nomad Tip:</strong> Arrive before 10:00 AM for the best plug-equipped tables and morning quiet focus. Late afternoons (4 PM - 7 PM) transition into vibrant sunset social hours.</p>
                </div>
              </div>

              {/* Amenities Grid */}
              <div className="space-y-2.5">
                <h5 className="text-xs font-semibold text-stone-900">Facilities & House Rules</h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center gap-2 text-xs font-medium text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={1.75} />
                    <span>Pet Friendly</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center gap-2 text-xs font-medium text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={1.75} />
                    <span>Outdoor Patio</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center gap-2 text-xs font-medium text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={1.75} />
                    <span>Cards & Apple Pay</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center gap-2 text-xs font-medium text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={1.75} />
                    <span>Clean Restrooms</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center gap-2 text-xs font-medium text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={1.75} />
                    <span>Free Water Refills</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center gap-2 text-xs font-medium text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={1.75} />
                    <span>Scooter Parking</span>
                  </div>
                </div>
              </div>

              {/* Contact & Socials */}
              <div className="space-y-2.5">
                <h5 className="text-xs font-semibold text-stone-900">Location & Social Channels</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={handleDirections}
                    className="p-3 rounded-xl bg-stone-50 hover:bg-orange-50 border border-stone-200/80 text-left flex items-center justify-between transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-orange-500" strokeWidth={1.75} />
                      <span className="font-medium text-stone-800 group-hover:text-orange-600">Open in Google Maps</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-orange-500" strokeWidth={1.75} />
                  </button>

                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Instagram className="w-4 h-4 text-pink-500" strokeWidth={1.75} />
                      <span className="font-medium text-stone-800">
                        {spot.instagram || `@${spot.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-medium">Community Tag</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS & SPEED TESTS */}
          {activeTab === 'reviews' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Scorecard Header */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-amber-500 text-white flex flex-col items-center justify-center font-semibold shadow-xs">
                    <span className="text-xl leading-none">{spot.rating}</span>
                    <span className="text-[10px] font-medium text-amber-100">/ 5.0</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-stone-900">Verified Nomad Rating</h5>
                    <p className="text-xs text-stone-500 font-normal">
                      Based on {localReviews.length} verified remote worker check-ins
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>{showReviewForm ? 'Cancel' : 'Log Speed & Review'}</span>
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="p-4 rounded-xl bg-orange-50/70 border border-orange-200/80 space-y-3 animate-in fade-in">
                  <h5 className="text-xs font-semibold text-stone-900">Log Your Speed Test & Experience</h5>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-medium text-stone-600 uppercase mb-1">Your Name</label>
                      <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="e.g. Alex Nomad"
                        className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-medium text-stone-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-medium text-stone-600 uppercase mb-1">Overall Rating</label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-medium text-stone-800"
                      >
                        <option value={5}>5 ★ - Outstanding</option>
                        <option value={4}>4 ★ - Very Good</option>
                        <option value={3}>3 ★ - Decent</option>
                        <option value={2}>2 ★ - Disappointing</option>
                        <option value={1}>1 ★ - Avoid</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-medium text-stone-600 uppercase mb-1">Wi-Fi Tested (Mbps)</label>
                      <input
                        type="number"
                        min={5}
                        max={1000}
                        value={wifiSpeed}
                        onChange={(e) => setWifiSpeed(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-medium text-stone-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-stone-600 uppercase mb-1">Noise Atmosphere</label>
                    <div className="flex gap-2 flex-wrap">
                      {(['Quiet Focus', 'Moderate / Cafe Ambience', 'Lively', 'Zoom Friendly'] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setNoise(lvl)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            noise === lvl ? 'bg-orange-500 text-white' : 'bg-white border border-stone-300 text-stone-700'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-stone-600 uppercase mb-1">Nomad Notes & Coffee Review</label>
                    <textarea
                      rows={2}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Comment on Wi-Fi stability, power plugs, coffee quality, or favorite dishes..."
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span>Publish Review</span>
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-3">
                {localReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.avatarUrl}
                          alt={rev.author}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover border border-orange-200"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h6 className="font-semibold text-xs text-stone-900">{rev.author}</h6>
                            {rev.verifiedNomad && (
                              <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-orange-100 text-orange-700 text-[9px] font-medium">
                                <ShieldCheck className="w-2.5 h-2.5" strokeWidth={1.75} /> Verified
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-stone-400">{rev.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Wifi className="w-3 h-3 text-emerald-600" strokeWidth={1.75} />
                          <span>Fast</span>
                        </span>
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                              strokeWidth={1.75}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-stone-700 font-normal leading-relaxed">{rev.comment}</p>
                    
                    <div className="flex items-center gap-3 text-[10px] font-medium text-stone-400 pt-1 border-t border-stone-200/60">
                      <span>Atmosphere: {rev.noiseLevel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

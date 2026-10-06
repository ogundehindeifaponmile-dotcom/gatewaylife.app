// src/components/EmojiMap.jsx
// Inside EmojiMap component, add:
const [otherPlayers, setOtherPlayers] = useState([]);

useEffect(() => {
  const handlePresenceUpdate = (e) => {
    const allPlayers = e.detail || [];
    // Filter out current player
    const others = allPlayers.filter(p => p.user_id !== useGameStore.getState().userId);
    setOtherPlayers(others);
  };

  window.addEventListener('player-presence-update', handlePresenceUpdate);
  return () => window.removeEventListener('player-presence-update', handlePresenceUpdate);
}, []);
import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

// Map Definitions: Emoji, Label, Type, and Interaction Logic
const MAP_LOCATIONS = [
  { 
    id: 'market', 
    label: 'Ogun Market', 
    emoji: '', 
    type: 'economy',
    description: 'Buy shares in Babo, OOPL, land & more'
  },
  { 
    id: 'temple', 
    label: 'IFA Temple', 
    emoji: '', 
    type: 'spiritual',
    description: 'Visit Baba for Aseje cleansing, Soap Shame removal'
  },
  { 
    id: 'police', 
    label: 'EFCC Station', 
    emoji: '', 
    type: 'legal',
    description: 'Surrender bribes, reduce Heat, avoid jail time'
  },
  { 
    id: 'chicken', 
    label: 'Chicken & Co', 
    emoji: '', 
    type: 'food',
    description: 'Order food, send meals to friends, gain energy'
  },
  { 
    id: 'bar', 
    label: 'YRN Bar', 
    emoji: '', 
    type: 'social',
    description: 'Meet NPCs, form crews, gain respect'
  },
  { 
    id: 'home', 
    label: 'Your Home', 
    emoji: '', 
    type: 'personal',
    description: 'Rest, store items, recover energy & sanity'
  },
];

export default function EmojiMap() {
  const { 
    currentLocation, 
    visitedLocations, 
    travelTo, 
    money, 
    heat, 
    babaTasks, 
    hasAsejeCurse,
    hasSoapShame 
  } = useGameStore();
  
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [traveling, setTraveling] = useState(false);
  const [travelCost, setTravelCost] = useState(0);
  const [energyCost, setEnergyCost] = useState(0);

  // Calculate travel costs based on distance and location type
  const calculateTravelCosts = (location) => {
    if (location.id === currentLocation) return { money: 0, energy: 0 };
    
    const baseMoney = location.type === 'economy' ? 50 : 
                     location.type === 'spiritual' ? 30 : 
                     location.type === 'legal' ? 40 : 
                     location.type === 'food' ? 20 : 
                     location.type === 'social' ? 15 : 10;
                     
    const baseEnergy = location.type === 'economy' ? 10 : 
                      location.type === 'spiritual' ? 8 : 
                      location.type === 'legal' ? 12 : 
                      location.type === 'food' ? 6 : 
                      location.type === 'social' ? 5 : 3;
                      
    // Distance multiplier (simplified as visited status)
    const distanceMult = visitedLocations.includes(location.id) ? 1 : 1.5;
    
    return { 
      money: Math.floor(baseMoney * distanceMult), 
      energy: Math.floor(baseEnergy * distanceMult) 
    };
  };

  // Handle location selection
  const handleLocationClick = (location) => {
    if (heat > 90) return; // EFCC monitoring blocks travel
    
    const costs = calculateTravelCosts(location);
    setSelectedLocation(location);
    setTravelCost(costs.money);
    setEnergyCost(costs.energy);
  };

  // Handle travel confirmation
  const confirmTravel = async () => {
    if (!selectedLocation || traveling) return;
    
    // Check if player can afford travel
    if (money < travelCost) {
      alert('Not enough money to travel!');
      return;
    }
    
    setTraveling(true);
    
    // Simulate travel delay (replace with actual animation later)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update store state
    travelTo(selectedLocation.id, travelCost, energyCost);
    
    // Reset state
    setTraveling(false);
    setSelectedLocation(null);
    setTravelCost(0);
    setEnergyCost(0);
  };

  // Cancel travel
  const cancelTravel = () => {
    setSelectedLocation(null);
    setTravelCost(0);
    setEnergyCost(0);
  };

  // Render selected location details
  const renderLocationDetails = () => {
    if (!selectedLocation) return null;

    const isCurrent = selectedLocation.id === currentLocation;
    const canAfford = money >= travelCost;
    const canTravel = !isCurrent && canAfford && heat <= 90;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl w-full max-w-[350px] overflow-hidden border border-white/10">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <span className="font-bold text-lg">{selectedLocation.emoji} {selectedLocation.label}</span>
            <button onClick={cancelTravel} className="text-white/50 hover:text-white">✕</button>
          </div>
          
          {/* Content */}
          <div className="p-4">
            <p className="text-white/70 text-sm mb-4">{selectedLocation.description}</p>
            
            {isCurrent ? (
              <div className="bg-green-500/20 border border-green-500/40 rounded-lg p-3 text-center">
                <p className="text-green-300 font-bold text-sm">You are here!</p>
                <p className="text-green-400/70 text-xs mt-1">No travel needed</p>
              </div>
            ) : (
              <>
                {/* Travel Costs */}
                <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-lg p-3 mb-4">
                  <p className="text-yellow-300 font-bold text-sm mb-2">Travel Costs</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/70"> Money:</span>
                    <span className={`font-bold ${canAfford ? 'text-green-300' : 'text-red-300'}`}>
                      ₦{travelCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-white/70">⚡ Energy:</span>
                    <span className="text-blue-300 font-bold">{energyCost}</span>
                  </div>
                </div>
                
                {/* Spiritual Warnings */}
                {(hasAsejeCurse || hasSoapShame) && selectedLocation.type !== 'spiritual' && (
                  <div className="bg-purple-500/20 border border-purple-500/40 rounded-lg p-3 mb-4 animate-pulse">
                    <p className="text-purple-300 font-bold text-xs mb-1">⚠️ SPIRITUAL WARNING</p>
                    <p className="text-purple-400/70 text-[10px]">
                      You have active curses. Visit IFA Temple first to avoid penalties.
                    </p>
                  </div>
                )}
                
                {/* Confirm Button */}
                <button
                  onClick={confirmTravel}
                  disabled={!canTravel || traveling}
                  className={`w-full py-3 rounded-lg font-bold text-sm transition ${
                    canTravel && !traveling
                      ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white hover:brightness-110'
                      : 'bg-gray-700 text-white/30 cursor-not-allowed'
                  }`}
                >
                  {traveling ? 'Traveling...' : canTravel ? 'Confirm Travel' : 'Cannot Travel'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-[600px] w-full max-w-[350px] mx-auto bg-black rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden">
      {/* Notch / Dynamic Island */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20" />

      {/* Status Bar */}
      <div className="pt-8 px-6 pb-2 flex justify-between items-center text-xs text-white/70 bg-black/50 backdrop-blur-sm z-10 relative">
        <span>9:41 AM</span>
        <div className="flex gap-1">
          <span></span>
          <span></span>
        </div>
      </div>

      {/* Heat Warning Overlay */}
      {heat > 70 && heat <= 90 && (
        <div className="absolute top-12 left-0 right-0 bg-red-500/20 border-b border-red-500/50 px-4 py-2 text-center z-10 animate-pulse">
          <span className="text-red-300 text-xs font-bold">⚠️ HIGH HEAT: EFCC MONITORING ACTIVE</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="h-full pt-2 px-4 pb-6 overflow-y-auto no-scrollbar">
        {/* Current Location Indicator */}
        <div className="mb-4 bg-blue-900/30 border border-blue-500/30 rounded-xl p-3">
          <span className="text-blue-300 text-xs font-bold">📍 CURRENT LOCATION</span>
          <p className="text-blue-400/70 text-[10px] mt-1">
            {MAP_LOCATIONS.find(loc => loc.id === currentLocation)?.label || 'Unknown'}
          </p>
        </div>

        {/* Visited Locations Tracker */}
        <div className="mb-4 bg-green-900/20 border border-green-500/20 rounded-xl p-3">
          <span className="text-green-300 text-xs font-bold">✅ VISITED LOCATIONS</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {visitedLocations.map(locId => {
              const loc = MAP_LOCATIONS.find(l => l.id === locId);
              return loc ? (
                <span key={locId} className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
                  {loc.emoji} {loc.label}
                </span>
              ) : null;
            })}
            {visitedLocations.length === 0 && (
              <span className="text-[10px] text-green-400/50">None yet</span>
            )}
          </div>
        </div>

        {/* Location Grid */}
        <div className="grid grid-cols-3 gap-4">
          {MAP_LOCATIONS.map((location) => {
            const isCurrent = location.id === currentLocation;
            const isVisited = visitedLocations.includes(location.id);
            const canSelect = heat <= 90;

            return (
              <button
                key={location.id}
                onClick={() => handleLocationClick(location)}
                disabled={!canSelect}
                className={`flex flex-col items-center gap-2 group active:scale-95 transition-transform ${
                  !canSelect ? 'opacity-50 grayscale cursor-not-allowed' : ''
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
                  isCurrent 
                    ? 'bg-gradient-to-br from-green-600 to-emerald-700 ring-2 ring-green-400' 
                    : isVisited
                    ? 'bg-gradient-to-br from-blue-600 to-purple-700'
                    : 'bg-gradient-to-br from-gray-700 to-gray-900'
                } group-hover:brightness-110`}>
                  {location.emoji}
                </div>
                <span className="text-[10px] text-white/80 font-medium">{location.label}</span>
                {isCurrent && (
                  <span className="text-[8px] text-green-400 font-bold">HERE</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1 spx-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />

      {/* Travel Modal */}
      {renderLocationDetails()}
    </div>
  );
}

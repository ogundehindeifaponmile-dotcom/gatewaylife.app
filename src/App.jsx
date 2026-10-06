// src/App.jsx
import { useState } from 'react';
import { useGameStore } from './store/gameStore';
import EmojiMap from './components/EmojiMap';
import PhoneInterface from './components/PhoneInterface';
import StatBar from './components/StatBar';
import TransportSelector from './components/TransportSelector';

// Ogun State Locations Data
const LOCATIONS = [
  { id: 'abeokuta', name: 'Abeokuta', icon: '🏔️', subtext: 'Olumo Rock', x: 30, y: 25 },
  { id: 'ijebu-ode', name: 'Ijebu-Ode', icon: '️', subtext: 'Maiyegun Resort', x: 45, y: 65 },
  { id: 'sagamu', name: 'Sagamu', icon: '🪩', subtext: 'WOSAM Club', x: 65, y: 45 },
  { id: 'sango', name: 'Sango-Ota', icon: '️', subtext: 'Border Area', x: 75, y: 75 },
  { id: 'homeland', name: 'Homeland Haven', icon: '', subtext: 'Rich Estate', x: 85, y: 30 },
  { id: 'yrn', name: 'yrnFAMILY Store', icon: '👕', subtext: 'Premium Fashion', x: 25, y: 50 },
  { id: 'amala', name: 'Amala Ogun', icon: '🍲', subtext: 'Local Joint', x: 35, y: 70 },
  { id: 'bank', name: 'Gateway Heritage Bank', icon: '', subtext: 'Cash & Loans', x: 50, y: 35 },
  { id: 'oid', name: 'Ogun Innovation District', icon: '💡', subtext: 'Tech Hub', x: 60, y: 60 },
];

function App() {
  const { money, location, setLocation, energy, respect, sanity } = useGameStore();
  const [showPhone, setShowPhone] = useState(false);

  const handleLocationClick = (locId) => {
    // Simulate travel cost deduction (placeholder logic)
    if (money >= 500) {
      setLocation(locId);
      // In full version: trigger transport selection modal here
    } else {
      alert("You don't have enough money to travel! Hustle first.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-yellow-800 to-blue-900 text-white font-sans overflow-hidden relative">
      {/* TOP STATUS BAR */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-yellow-400">₦{money.toLocaleString()}</span>
        </div>
        <div className="text-sm bg-white/10 px-3 py-1 rounded-full">
          📍 Current: {LOCATIONS.find(l => l.id === location)?.name || 'Unknown'}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="pt-16 pb-24 px-4 h-screen flex flex-col md:flex-row gap-4">
        
        {/* LEFT: PLAYER STATS (Hidden on mobile, visible on desktop) */}
        <div className="hidden md:block w-64 shrink-0">
          <StatBar 
            label="Money" value={money} max={10000000} color="bg-yellow-400" 
          />
          <StatBar 
            label="Respect" value={respect} max={100} color="bg-red-500" 
          />
          <StatBar 
            label="Energy" value={energy} max={100} color="bg-teal-400" 
          />
          <StatBar 
            label="Sanity" value={sanity} max={100} color="bg-purple-500" 
          />
          
          {/* PHONE TOGGLE BUTTON (Desktop Only) */}
          <button 
            onClick={() => setShowPhone(!showPhone)}
            className="mt-6 w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-4 transition-all active:scale-95"
          >
            📱 {showPhone ? 'Close Phone' : 'Open Phone'}
          </button>
        </div>

        {/* CENTER: EMOJI MAP */}
        <div className="flex-1 relative bg-black/30 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <EmojiMap 
            locations={LOCATIONS} 
            currentLocation={location} 
            onLocationClick={handleLocationClick} 
          />
        </div>

        {/* RIGHT: PHONE INTERFACE (Conditional Render) */}
        {showPhone && (
          <div className="w-full md:w-80 shrink-0 animate-slide-in-right">
            <PhoneInterface />
          </div>
        )}
      </div>

      {/* BOTTOM TRANSPORT SELECTOR (Mobile Sticky / Desktop Fixed Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-lg border-t border-white/10 p-3">
        <TransportSelector />
      </div>

      {/* MOBILE PHONE TOGGLE (Floating Button) */}
      <button 
        onClick={() => setShowPhone(!showPhone)}
        className="md:hidden fixed bottom-24 right-4 z-50 bg-yellow-500 text-black w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl active:scale-90 transition-transform"
      >
        📱
      </button>
    </div>
  );
}

export default App;

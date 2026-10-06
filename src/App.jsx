// src/App.jsx
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { useGameStore } from './store/gameStore';
import EmojiMap from './components/EmojiMap';
import PhoneInterface from './components/PhoneInterface';
import StatBar from './components/StatBar';
import TransportSelector from './components/TransportSelector';
import AuthModal from './components/AuthModal';

// Ogun State Locations Data (Kept for top bar reference)
const LOCATIONS = [
  { id: 'abeokuta', name: 'Abeokuta', icon: '🏔️', subtext: 'Olumo Rock' },
  { id: 'ijebu-ode', name: 'Ijebu-Ode', icon: '🏖️', subtext: 'Maiyegun Resort' },
  { id: 'sagamu', name: 'Sagamu', icon: '🪩', subtext: 'WOSAM Club' },
  { id: 'sango', name: 'Sango-Ota', icon: '🛣️', subtext: 'Border Area' },
  { id: 'homeland', name: 'Homeland Haven', icon: '🏡', subtext: 'Rich Estate' },
  { id: 'yrn', name: 'yrnFAMILY Store', icon: '👕', subtext: 'Premium Fashion' },
  { id: 'amala', name: 'Amala Ogun', icon: '🍲', subtext: 'Local Joint' },
  { id: 'bank', name: 'Gateway Heritage Bank', icon: '🏦', subtext: 'Cash & Loans' },
  { id: 'oid', name: 'Ogun Innovation District', icon: '💡', subtext: 'Tech Hub' },
];

function App() {
  const [session, setSession] = useState(null);
  const [showAuth, setShowAuth] = useState(true);
  
  // Game state from Zustand
  const { 
    money, location, setLocation, energy, respect, sanity, heat,
    updateStats, travelTo 
  } = useGameStore();
  
  const [showPhone, setShowPhone] = useState(false);

  //  AUTH CHECK ON LOAD
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setShowAuth(!session);
      
      // If logged in, sync local store with DB profile
      if (session) {
        loadPlayerProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setShowAuth(!session);
      if (session) loadPlayerProfile(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load player stats from Supabase on login
  const loadPlayerProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (!error && data) {
        // Sync DB state to Zustand store
        useGameStore.setState({
          userId: data.id,
          money: data.money,
          respect: data.respect,
          energy: data.energy,
          sanity: data.sanity,
          heat: data.heat,
          currentLocation: data.current_location,
          homeLocation: data.home_location,
          visitedLocations: data.visited_locations || [],
          inventory: data.inventory || [],
          clothing: data.clothing || [],
          vehicles: data.vehicles || [],
          friends: data.friends || [],
          babaTasks: data.baba_tasks || [],
          hasAsejeCurse: data.has_aseje_curse,
          hasSoapShame: data.has_soap_shame,
        });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  // Handle travel with actual cost deduction
  const handleLocationClick = (locId) => {
    if (heat > 90) {
      alert(" EFCC LOCKDOWN: Cannot travel while under surveillance!");
      return;
    }
    
    const travelCost = 500; // Simplified for MVP
    if (money >= travelCost) {
      travelTo(locId, travelCost, 10); // Deduct 500 + 10 energy
      setLocation(locId);
    } else {
      alert("You don't have enough money to travel! Hustle first.");
    }
  };

  // 🚫 BLOCK GAME UNTIL AUTHENTICATED
  if (showAuth) {
    return <AuthModal onClose={() => setShowAuth(false)} />;
  }

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
        <button 
          onClick={() => supabase.auth.signOut()}
          className="text-xs text-red-400 hover:text-red-300"
        >
          Sign Out
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="pt-16 pb-24 px-4 h-screen flex flex-col md:flex-row gap-4">
        
        {/* LEFT: PLAYER STATS (Desktop Only) */}
        <div className="hidden md:block w-64 shrink-0 space-y-3">
          <StatBar label="Money" value={money} max={10000000} color="bg-yellow-400" />
          <StatBar label="Respect" value={respect} max={100} color="bg-red-500" />
          <StatBar label="Energy" value={energy} max={100} color="bg-teal-400" />
          <StatBar label="Sanity" value={sanity} max={100} color="bg-purple-500" />
          
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

        {/* RIGHT: PHONE INTERFACE */}
        {showPhone && (
          <div className="w-full md:w-80 shrink-0 animate-slide-in-right">
            <PhoneInterface />
          </div>
        )}
      </div>

      {/* BOTTOM TRANSPORT SELECTOR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-lg border-t border-white/10 p-3">
        <TransportSelector />
      </div>

      {/* MOBILE PHONE TOGGLE */}
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

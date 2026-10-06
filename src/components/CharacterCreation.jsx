// src/components/CharacterCreation.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useGameStore } from '../store/gameStore';

export default function CharacterCreation({ onComplete }) {
  const [step, setStep] = useState(1); // 1: Gender, 2: Root, 3: Fate Spin
  const [gender, setGender] = useState(null);
  const [root, setRoot] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);

  // FATE SPIN LOGIC
  const handleSpin = async () => {
    setSpinning(true);
    
    // Simulate spin animation delay
    await new Promise(r => setTimeout(r, 2000));
    
    // 85% Lapo / 15% Nepo probability
    const isNepo = Math.random() < 0.15;
    const result = isNepo ? 'nepo' : 'lapo';
    setSpinResult(result);
    setSpinning(false);
    
    // CREATE PLAYER PROFILE IN SUPABASE
    const session = await supabase.auth.getSession();
    if (!session.data.session) return;
    
    const userId = session.data.session.user.id;
    const startingMoney = isNepo ? 35000000 : 90000;
    const startLocation = isNepo ? 'homeland' : 'sango';
    
    try {
      const { error } = await supabase.from('players').upsert({
        id: userId,
        username: session.data.session.user.email?.split('@')[0] || 'player',
        gender,
        root,
        class_type: result,
        is_ijgb: isNepo && Math.random() < 0.3, // 30% of Nepos are IJGB
        money: startingMoney,
        current_location: startLocation,
        home_location: isNepo ? 'homeland-estate-001' : null,
        visited_locations: [startLocation],
        updated_at: new Date().toISOString(),
      });
      
      if (error) throw error;
      
      // Sync to Zustand store immediately
      useGameStore.setState({
        userId,
        gender,
        root,
        classType: result,
        isIJGB: isNepo && Math.random() < 0.3,
        money: startingMoney,
        currentLocation: startLocation,
      });
      
      // Notify parent to close creation flow
      setTimeout(() => onComplete(), 1500);
    } catch (err) {
      console.error('Profile creation failed:', err);
      alert('Failed to create character. Please try again.');
      setSpinning(false);
    }
  };

  // STEP 1: GENDER SELECTION
  if (step === 1) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
        <div className="bg-gray-900 border border-yellow-500/30 rounded-2xl w-full max-w-md p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Who Are You?</h2>
          <p className="text-white/60 text-sm mb-6">Choose your avatar</p>
          
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => { setGender('male'); setStep(2); }}
              className="bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 
                         text-white py-6 rounded-xl text-lg font-bold transition active:scale-95">
              👨 Male
            </button>
            <button onClick={() => { setGender('female'); setStep(2); }}
              className="bg-gradient-to-br from-pink-600 to-pink-800 hover:from-pink-500 hover:to-pink-700 
                         text-white py-6 rounded-xl text-lg font-bold transition active:scale-95">
              👩 Female
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: ROOT SELECTION
  if (step === 2) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
        <div className="bg-gray-900 border border-green-500/30 rounded-2xl w-full max-w-md p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Where Do You Come From?</h2>
          <p className="text-white/60 text-sm mb-6">Your root determines your passive buffs</p>
          
          <div className="space-y-3">
            {[
              { id: 'ijebu', label: 'Ijebu', desc: '+30% Business & Elder Respect', color: 'from-purple-600 to-purple-800' },
              { id: 'egba', label: 'Egba', desc: '+30% Street Smarts & Heritage', color: 'from-orange-600 to-orange-800' },
              { id: 'remo', label: 'Remo', desc: '+30% Stamina & Logistics', color: 'from-teal-600 to-teal-800' },
            ].map((r) => (
              <button key={r.id} onClick={() => { setRoot(r.id); setStep(3); }}
                className={`w-full bg-gradient-to-r ${r.color} hover:brightness-110 
                           text-white py-4 rounded-xl font-bold transition active:scale-95`}>
                <div className="text-lg">{r.label}</div>
                <div className="text-xs opacity-80 font-normal">{r.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // STEP 3: THE FATE SPIN
  if (step === 3) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
        <div className="bg-gray-900 border border-yellow-500/30 rounded-2xl w-full max-w-md p-8 text-center relative overflow-hidden">
          
          {/* SPINNING ANIMATION */}
          {spinning && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
              <div className="text-6xl animate-spin">🎰</div>
            </div>
          )}
          
          <h2 className="text-2xl font-bold text-white mb-2">The Fate Spin</h2>
          <p className="text-white/60 text-sm mb-8">Will you be born into wealth or struggle?</p>
          
          {!spinResult ? (
            <button onClick={handleSpin} disabled={spinning}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 
                         text-black py-5 rounded-xl text-xl font-black transition active:scale-95 disabled:opacity-50">
              {spinning ? 'SPINNING...' : '🎲 SPIN YOUR FATE'}
            </button>
          ) : (
            <div className={`py-6 rounded-xl border-2 ${
              spinResult === 'nepo' 
                ? 'bg-yellow-500/20 border-yellow-400' 
                : 'bg-gray-700/50 border-gray-500'
            }`}>
              <div className="text-5xl mb-3">{spinResult === 'nepo' ? '💎' : '🧱'}</div>
              <h3 className={`text-2xl font-black ${spinResult === 'nepo' ? 'text-yellow-400' : 'text-gray-300'}`}>
                {spinResult === 'nepo' ? 'NEPO BABY!' : 'LAPO HUSTLER!'}
              </h3>
              <p className="text-white/70 text-sm mt-2">
                {spinResult === 'nepo' 
                  ? '₦35M from Popsy. Weekly allowance: ₦2.5M. Welcome to Homeland Haven.' 
                  : '₦90K loan. One room in Sango. Push wheelbarrow at Oke Aje. No gree for anybody.'}
              </p>
              <p className="text-white/40 text-xs mt-4 animate-pulse">Entering Gateway Life...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

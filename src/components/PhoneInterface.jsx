// src/components/PhoneInterface.jsx
import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import BabaTaskWidget from './BabaTaskWidget'; // Sub-component for spiritual reminders

// App Definitions: Icon, Label, and Conditional Visibility Logic
const PHONE_APPS = [
  { 
    id: 'investments', 
    label: 'Investments', 
    icon: '💰', 
    visible: true,
    description: 'Buy shares in Babcock, OOPL, land & more'
  },
  { 
    id: 'messages', 
    label: 'Messages', 
    icon: '💬', 
    visible: true,
    description: 'Chat with real players, form crews'
  },
  { 
    id: 'urban-foods', 
    label: 'Urban Foods', 
    icon: '', 
    visible: true,
    description: 'Order Chicken & Co, send food to friends'
  },
  { 
    id: 'bizlqly', 
    label: 'BizIqly', 
    icon: '', 
    visible: true,
    isPrank: true, // Special flag for PR page
    description: 'Supermarket app (Coming Soon)'
  },
  { 
    id: 'yrn-family', 
    label: 'YRN FAMILY', 
    icon: '👕', 
    visible: true,
    description: 'Premium streetwear & drip'
  },
  { 
    id: 'calls', 
    label: 'Calls', 
    icon: '📞', 
    visible: true,
    description: 'Call NPCs only (Baba, Police, Popsy)'
  },
];

export default function PhoneInterface() {
  const { heat, isIJGB, currentLocation, money } = useGameStore();
  const [activeApp, setActiveApp] = useState(null);
  const [accentMode, setAccentMode] = useState(isIJGB ? 'british' : 'pidgin');

  // Critical: Block access if Heat is too high (EFCC monitoring)
  const isPhoneLocked = heat > 90;

  const handleAppClick = (app) => {
    if (isPhoneLocked) return;
    
    if (app.isPrank) {
      // Show BizIqly PR page instead of functional app
      setActiveApp({ ...app, type: 'prank' });
    } else {
      setActiveApp(app);
    }
  };

  const closeApp = () => setActiveApp(null);

  // Render Active App Content
  const renderActiveApp = () => {
    if (!activeApp) return null;

    if (activeApp.type === 'prank') {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white text-black rounded-xl">
          <div className="text-4xl mb-4">🚧</div>
          <h2 className="text-xl font-bold mb-2">BizIqly is Coming</h2>
          <p className="text-sm text-gray-600 mb-4">The ultimate Ogun State supermarket experience. Stay tuned.</p>
          <button 
            onClick={closeApp}
            className="bg-black text-white px-6 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
          >
            Get In Touch
          </button>
        </div>
      );
    }

    // Placeholder for other apps (replace with actual components later)
    return (
      <div className="h-full flex flex-col bg-gray-900 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-white/10 flex justify-between items-center">
          <span className="font-bold">{activeApp.icon} {activeApp.label}</span>
          <button onClick={closeApp} className="text-white/50 hover:text-white">✕</button>
        </div>
        <div className="flex-1 p-4 flex items-center justify-center text-white/30 text-sm">
          {activeApp.description} (Full implementation coming soon)
        </div>
      </div>
    );
  };

  return (
    <div className={`relative h-[600px] w-full max-w-[350px] mx-auto bg-black rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden ${
      isPhoneLocked ? 'opacity-50 pointer-events-none grayscale' : ''
    }`}>
      {/* Notch / Dynamic Island */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20" />

      {/* Status Bar */}
      <div className="pt-8 px-6 pb-2 flex justify-between items-center text-xs text-white/70 bg-black/50 backdrop-blur-sm z-10 relative">
        <span>9:41 AM</span>
        <div className="flex gap-1">
          <span></span>
          <span>🔋</span>
        </div>
      </div>

      {/* Heat Warning Overlay */}
      {heat > 70 && !isPhoneLocked && (
        <div className="absolute top-12 left-0 right-0 bg-red-500/20 border-b border-red-500/50 px-4 py-2 text-center z-10 animate-pulse">
          <span className="text-red-300 text-xs font-bold">⚠️ HIGH HEAT: EFCC MONITORING ACTIVE</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="h-full pt-2 px-4 pb-6 overflow-y-auto no-scrollbar">
        {activeApp ? (
          renderActiveApp()
        ) : (
          <>
            {/* Baba Task Widget (Always visible on home screen) */}
            <BabaTaskWidget />

            {/* IJGB Accent Toggle (Only for IJGB-Nepos) */}
            {isIJGB && (
              <div className="mb-4 bg-blue-900/30 border border-blue-500/30 rounded-xl p-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-300 text-xs font-bold">ACCENT MODE</span>
                  <button 
                    onClick={() => setAccentMode(accentMode === 'british' ? 'pidgin' : 'british')}
                    className="text-[10px] bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 px-2 py-1 rounded transition"
                  >
                    {accentMode === 'british' ? 'Switch to Pidgin' : 'Switch to British'}
                  </button>
                </div>
                <p className="text-blue-400/70 text-[10px] mt-1">
                  Current: {accentMode === 'british' ? 'Innit, proper, lowkey...' : 'Wetin dey sup, abeg...'}
                </p>
              </div>
            )}

            {/* Location Economy Tooltip */}
            <div className="mb-4 bg-yellow-900/20 border border-yellow-500/20 rounded-xl p-3">
              <span className="text-yellow-300 text-xs font-bold">📍 {currentLocation.toUpperCase()}</span>
              <p className="text-yellow-400/70 text-[10px] mt-1">
                Price Multiplier: {['abeokuta', 'ijebu-ode'].includes(currentLocation) ? '1x (Standard)' : 
                                  ['sagamu', 'sango'].includes(currentLocation) ? '1.5x (Hustle Zone)' : 
                                  '2.5x (Premium Zone)'}
              </p>
            </div>

            {/* App Grid */}
            <div className="grid grid-cols-3 gap-4">
              {PHONE_APPS.filter(app => app.visible).map((app) => (
                <button
                  key={app.id}
                  onClick={() => handleAppClick(app)}
                  disabled={isPhoneLocked}
                  className="flex flex-col items-center gap-2 group active:scale-95 transition-transform"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
                    app.isPrank 
                      ? 'bg-gradient-to-br from-gray-700 to-gray-900' 
                      : 'bg-gradient-to-br from-blue-600 to-purple-700'
                  } group-hover:brightness-110`}>
                    {app.icon}
                  </div>
                  <span className="text-[10px] text-white/80 font-medium">{app.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
    </div>
  );
}

// src/components/PhoneInterface.jsx
import { useGameStore } from '../store/gameStore';

function BabaTaskWidget() {
  const { babaTasks, hasAsejeCurse, hasSoapShame } = useGameStore();
  
  if (babaTasks.length === 0 && !hasAsejeCurse && !hasSoapShame) return null;
  
  return (
    <div className="bg-purple-900/80 border border-purple-500/30 rounded-xl p-3 mb-3">
      <h3 className="text-purple-300 font-bold text-sm mb-2"> Baba's Reminders</h3>
      {hasAsejeCurse && (
        <p className="text-red-400 text-xs animate-pulse">️ Aseje Curse Active! Money disappearing...</p>
      )}
      {hasSoapShame && (
        <p className="text-yellow-400 text-xs animate-pulse">🧼 Soap Shame! NPCs are mocking you.</p>
      )}
      {babaTasks.map(task => (
        <div key={task.id} className="text-white/80 text-xs mt-1">
          • {task.description} (Due: {new Date(task.acceptedAt + 86400000).toLocaleTimeString()})
        </div>
      ))}
    </div>
  );
}

export default function PhoneInterface() {
  return (
    <div className="bg-black/90 backdrop-blur-lg rounded-2xl p-4 h-full overflow-y-auto">
      {/* Other phone apps grid... */}
      <BabaTaskWidget /> {/* ← PASTE IT HERE */}
      {/* Rest of phone UI */}
    </div>
  );
}

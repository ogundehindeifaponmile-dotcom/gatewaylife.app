// src/components/BabaTaskWidget.jsx
import { useGameStore } from '../store/gameStore';

export default function BabaTaskWidget() {
  const { babaTasks, hasAsejeCurse, hasSoapShame } = useGameStore();
  
  // Hide widget if no spiritual activity
  if (babaTasks.length === 0 && !hasAsejeCurse && !hasSoapShame) return null;
  
  return (
    <div className="mb-4 bg-purple-900/40 border border-purple-500/30 rounded-xl p-3 backdrop-blur-sm">
      <h3 className="text-purple-300 font-bold text-xs mb-2 flex items-center gap-1">
         Baba's Reminders
      </h3>
      
      {hasAsejeCurse && (
        <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-2 mb-2 animate-pulse">
          <p className="text-red-300 text-[10px] font-bold">⚠️ ASEJE CURSE ACTIVE</p>
          <p className="text-red-400/80 text-[9px]">Money disappearing randomly. Visit IFA Temple immediately.</p>
        </div>
      )}
      
      {hasSoapShame && (
        <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-lg p-2 mb-2 animate-pulse">
          <p className="text-yellow-300 text-[10px] font-bold">🧼 SOAP SHAME ACTIVE</p>
          <p className="text-yellow-400/80 text-[9px]">NPCs mocking you. Respect dropping. Pay Baba to cleanse.</p>
        </div>
      )}
      
      {babaTasks.map(task => {
        const hoursLeft = Math.max(0, Math.ceil((task.acceptedAt + 86400000 - Date.now()) / 3600000));
        return (
          <div key={task.id} className="bg-purple-500/10 rounded-lg p-2 mb-1 last:mb-0">
            <p className="text-white/90 text-[10px]">• {task.description}</p>
            <p className="text-purple-400/70 text-[9px] mt-0.5">⏳ {hoursLeft}h remaining</p>
          </div>
        );
      })}
    </div>
  );
}

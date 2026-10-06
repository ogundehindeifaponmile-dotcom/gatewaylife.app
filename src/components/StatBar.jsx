// src/components/StatBar.jsx
export default function StatBar({ label, value, max, color, isHeat }) {
  const percentage = Math.min(100, (value / max) * 100);
  
  // Special styling for Heat Meter when critical
  const heatClass = isHeat && value > 70 
    ? 'animate-pulse border-2 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
    : '';
    
  return (
    <div className={`mb-3 ${heatClass} rounded-lg p-2 bg-black/20`}>
      <div className="flex justify-between text-xs mb-1">
        <span className={isHeat && value > 70 ? 'text-red-400 font-bold' : 'text-white/70'}>
          {label}
        </span>
        <span className="text-white/90">{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className={`${color} h-2 rounded-full transition-all duration-500`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

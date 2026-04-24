import React from 'react';
import { AlertTriangle } from 'lucide-react';

const EmergencyBanner = () => {
  return (
    <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-center gap-3 overflow-hidden relative border-b border-red-700 shadow-lg shadow-red-900/20 z-50">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-30 pointer-events-none"></div>
      
      <div className="flex items-center gap-2 animate-pulse shrink-0">
        <AlertTriangle size={20} className="text-yellow-300" />
        <span className="font-syne font-bold tracking-widest text-yellow-300 uppercase">System Alert</span>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] font-medium text-sm md:text-base">
          ACTIVE EMERGENCY DECLARED IN SECTOR 4: SEVERE SEISMIC ACTIVITY. HIGH PRIORITY MEDICAL AND SHELTER RESOURCES URGENTLY REQUIRED. ALL UNITS ON STANDBY.
        </div>
      </div>
    </div>
  );
};

export default EmergencyBanner;

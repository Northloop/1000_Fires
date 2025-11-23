import React, { useState } from 'react';
import { MapPin, Info, Navigation, Layers } from 'lucide-react';

const MapInterface: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedPin, setSelectedPin] = useState<any>(null);

  const pins = [
    { id: 1, type: 'camp', x: 30, y: 40, name: 'Camp Entropy', desc: '4:30 & B' },
    { id: 2, type: 'art', x: 50, y: 50, name: 'The Man', desc: 'Open Playa' },
    { id: 3, type: 'medical', x: 20, y: 80, name: 'Ranger Station 3', desc: '3:00 Plaza' },
    { id: 4, type: 'camp', x: 70, y: 30, name: 'Bass Haven', desc: '10:00 & Esp' },
    { id: 5, type: 'art', x: 80, y: 60, name: 'Temple of Atonement', desc: 'Deep Playa' },
  ];

  const filteredPins = activeFilter === 'all' ? pins : pins.filter(p => p.type === activeFilter);

  const getPinColor = (type: string) => {
    switch (type) {
      case 'art': return 'text-purple-500';
      case 'medical': return 'text-red-500';
      default: return 'text-brand-500';
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col relative bg-night-900 rounded-xl border border-white/10 overflow-hidden">
      
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
        <div className="bg-night-800/90 backdrop-blur border border-white/10 rounded-lg p-1 flex flex-col">
          {['all', 'camp', 'art', 'medical'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`
                px-3 py-2 text-xs font-medium uppercase tracking-wider rounded
                ${activeFilter === filter ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}
              `}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <button className="bg-night-800/90 backdrop-blur border border-white/10 p-3 rounded-lg text-white hover:bg-white/10">
          <Layers className="w-5 h-5" />
        </button>
      </div>

      {/* Map Area (Conceptual) */}
      <div className="flex-1 relative bg-[#1a1a1a] overflow-hidden group">
        {/* Placeholder Grid/Terrain */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        ></div>
        
        {/* Semi-circle representation of Black Rock City layout */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-4 border-white/5 opacity-50"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border-4 border-white/5 opacity-50"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] rounded-full border-2 border-brand-500/30 opacity-80 flex items-center justify-center text-xs text-white/50">MAN</div>

        {/* Pins */}
        {filteredPins.map(pin => (
          <button
            key={pin.id}
            onClick={() => setSelectedPin(pin)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 hover:z-20`}
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          >
            <MapPin className={`w-8 h-8 drop-shadow-lg ${getPinColor(pin.type)} ${selectedPin?.id === pin.id ? 'fill-current' : ''}`} />
          </button>
        ))}
      </div>

      {/* Bottom Sheet / Info Card */}
      {selectedPin && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-night-800/95 backdrop-blur border border-white/10 p-4 rounded-xl shadow-2xl z-20 animate-in slide-in-from-bottom-4 fade-in duration-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-white">{selectedPin.name}</h3>
              <p className="text-sm text-gray-400">{selectedPin.desc}</p>
            </div>
            <button onClick={() => setSelectedPin(null)} className="text-gray-500 hover:text-white">
              &times;
            </button>
          </div>
          <div className="mt-4 flex space-x-2">
            <button className="flex-1 bg-brand-600 hover:bg-brand-500 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center">
              <Navigation className="w-4 h-4 mr-1" /> Navigate
            </button>
            <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center border border-white/10">
              <Info className="w-4 h-4 mr-1" /> Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapInterface;


import React, { useState } from 'react';
import { MapPin, Info, Navigation, Layers, ExternalLink } from 'lucide-react';
import { MOCK_MAP_PINS, MOCK_MAP_LAYERS } from '../constants';

const MapInterface: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedPin, setSelectedPin] = useState<any>(null);
  const [showLayers, setShowLayers] = useState(false);
  
  // Use mock layers but allow local toggle in this view
  const [layers, setLayers] = useState(MOCK_MAP_LAYERS);

  const filteredPins = activeFilter === 'all' ? MOCK_MAP_PINS : MOCK_MAP_PINS.filter(p => p.type === activeFilter);

  const getPinColor = (type: string) => {
    switch (type) {
      case 'art': return 'text-purple-500';
      case 'medical': return 'text-red-500';
      default: return 'text-brand-500';
    }
  };

  const openGoogleMaps = (pin: any) => {
     // Mock coords logic
     alert(`Opening Google Maps for ${pin.name}...`);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col relative bg-night-900 rounded-xl border border-white/10 overflow-hidden">
      
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
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

      <div className="absolute top-4 right-4 z-20">
        <button 
          onClick={() => setShowLayers(!showLayers)}
          className={`bg-night-800/90 backdrop-blur border border-white/10 p-3 rounded-lg hover:bg-white/10 ${showLayers ? 'text-brand-500' : 'text-white'}`}
        >
          <Layers className="w-5 h-5" />
        </button>
        
        {showLayers && (
            <div className="absolute top-12 right-0 bg-night-800 border border-white/10 p-3 rounded-lg w-48 shadow-xl animate-in fade-in slide-in-from-top-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Visible Layers</h4>
                <div className="space-y-2">
                    {layers.map(l => (
                        <label key={l.id} className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={l.visible} 
                                onChange={() => setLayers(layers.map(layer => layer.id === l.id ? {...layer, visible: !layer.visible} : layer))}
                                className="rounded bg-night-900 border-white/20 text-brand-500 focus:ring-0"
                            />
                            <span>{l.name}</span>
                        </label>
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* Map Area (Generic) */}
      <div className="flex-1 relative bg-[#1a1a1a] overflow-hidden group cursor-grab active:cursor-grabbing">
        
        {/* Render Layers */}
        {layers.filter(l => l.visible).map((layer, idx) => (
             <div 
                key={layer.id}
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{ 
                    zIndex: idx,
                    opacity: layer.opacity,
                    background: layer.type === 'SATELLITE' 
                        ? 'radial-gradient(circle at center, #1a2e1a 0%, #0f172a 100%)' 
                        : 'none'
                }}
             >
                 {layer.type === 'VECTOR' && (
                     <svg className="w-full h-full opacity-50">
                        <path d="M 0 0 L 1000 1000" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        <path d="M 1000 0 L 0 1000" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                     </svg>
                 )}
             </div>
        ))}

        {/* Pins */}
        {filteredPins.map(pin => (
          <button
            key={pin.id}
            onClick={() => setSelectedPin(pin)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 hover:z-30 z-20`}
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          >
            <MapPin className={`w-8 h-8 drop-shadow-lg ${getPinColor(pin.type)} ${selectedPin?.id === pin.id ? 'fill-current scale-110' : ''}`} />
          </button>
        ))}
      </div>

      {/* Bottom Sheet / Info Card */}
      {selectedPin && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-night-800/95 backdrop-blur border border-white/10 p-4 rounded-xl shadow-2xl z-30 animate-in slide-in-from-bottom-4 fade-in duration-200">
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
            <button 
                onClick={() => openGoogleMaps(selectedPin)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center border border-white/10"
            >
              <ExternalLink className="w-4 h-4 mr-1" /> Google Maps
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapInterface;

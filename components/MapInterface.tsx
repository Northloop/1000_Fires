
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Layers, Navigation, ExternalLink } from 'lucide-react';
import { MOCK_MAP_PINS } from '../constants';

// Define Leaflet types globally
declare global {
  interface Window {
    L: any;
  }
}

const MapInterface: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeBaseLayer, setActiveBaseLayer] = useState<'satellite' | 'vector'>('satellite'); // Default to satellite for park
  const [selectedPin, setSelectedPin] = useState<any>(null);
  
  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const L = window.L;
    
    // Init Map centered on Voyageurs National Park, MN
    const map = L.map(mapContainerRef.current, {
        minZoom: 4,
        maxZoom: 22
    }).setView([48.4558, -92.8384], 15);
    mapInstanceRef.current = map;

    // Define layers
    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 22,
      maxNativeZoom: 17 // Prevents gray tiles at high zoom
    });

    const vector = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CartoDB',
      subdomains: 'abcd',
      maxZoom: 22,
      maxNativeZoom: 20 
    });
    
    // Store references to layers for toggling
    (map as any)._layers_custom = { satellite, vector };

    // Add default based on initial state
    if (activeBaseLayer === 'satellite') {
        satellite.addTo(map);
    } else {
        vector.addTo(map);
    }

    // --- Resize Observer ---
    const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Layer Switching
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    
    const { satellite, vector } = (map as any)._layers_custom;
    
    if (activeBaseLayer === 'satellite') {
        if (map.hasLayer(vector)) map.removeLayer(vector);
        if (!map.hasLayer(satellite)) map.addLayer(satellite);
    } else {
        if (map.hasLayer(satellite)) map.removeLayer(satellite);
        if (!map.hasLayer(vector)) map.addLayer(vector);
    }
  }, [activeBaseLayer]);

  // Sync Pins
  useEffect(() => {
      const map = mapInstanceRef.current;
      if (!map) return;
      const L = window.L;

      // Clear existing markers
      map.eachLayer((layer: any) => {
          if (layer instanceof L.Marker) {
              map.removeLayer(layer);
          }
      });

      const filteredPins = activeFilter === 'all' ? MOCK_MAP_PINS : MOCK_MAP_PINS.filter(p => p.type === activeFilter);

      filteredPins.forEach(pin => {
          if (!pin.lat || !pin.lng) return;

          const getIconColor = () => {
              switch(pin.type) {
                  case 'medical': return '#ef4444'; // red-500
                  case 'art': return '#a855f7'; // purple-500
                  case 'infra': return '#f97316'; // orange-500
                  default: return '#22c55e'; // green-500
              }
          };

          const icon = L.divIcon({
              className: 'custom-pin',
              html: `<div style="
                background-color: ${getIconColor()}; 
                width: 16px; 
                height: 16px; 
                border-radius: 50%; 
                border: 2px solid white;
                box-shadow: 0 0 10px ${getIconColor()};
              "></div>`,
              iconSize: [16, 16],
              iconAnchor: [8, 8]
          });

          const marker = L.marker([pin.lat, pin.lng], { icon: icon }).addTo(map);

          marker.on('click', () => {
              setSelectedPin(pin);
              map.flyTo([pin.lat, pin.lng], 17);
          });
      });
  }, [activeFilter]);

  const openGoogleMaps = (pin: any) => {
     if (pin.lat && pin.lng) {
         window.open(`https://www.google.com/maps/search/?api=1&query=${pin.lat},${pin.lng}`, '_blank');
     }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col relative bg-night-900 rounded-xl border border-white/10 overflow-hidden">
      
      {/* Map Controls Container */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col space-y-4">
        
        {/* Filter Group */}
        <div className="bg-night-800/90 backdrop-blur border border-white/10 rounded-lg p-1 flex flex-col shadow-xl">
          {['all', 'camp', 'art', 'medical'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`
                px-3 py-2 text-xs font-medium uppercase tracking-wider rounded transition-colors
                ${activeFilter === filter ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}
              `}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

       {/* Layer Toggle (Top Right) */}
       <div className="absolute top-4 right-4 z-[1000]">
            <button 
                onClick={() => setActiveBaseLayer(prev => prev === 'satellite' ? 'vector' : 'satellite')}
                className={`bg-night-800/90 backdrop-blur border border-white/10 p-3 rounded-lg shadow-xl text-white hover:bg-white/10 transition-colors ${activeBaseLayer === 'satellite' ? 'bg-white/10 ring-1 ring-brand-500' : ''}`}
                title="Toggle Satellite/Map View"
            >
                <Layers className={`w-5 h-5 ${activeBaseLayer === 'satellite' ? 'text-brand-500' : 'text-gray-400'}`} />
            </button>
       </div>

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0 bg-[#18181b]" style={{ isolation: 'isolate' }} />

      {/* Selected Pin Details */}
      {selectedPin && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-night-800/95 backdrop-blur border border-white/10 p-5 rounded-xl shadow-2xl z-[1000] animate-in slide-in-from-bottom-4 fade-in duration-200">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold bg-white/10 text-gray-300 px-2 py-0.5 rounded border border-white/5 uppercase mb-2 inline-block">
                  {selectedPin.type}
              </span>
              <h3 className="text-lg font-bold text-white">{selectedPin.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{selectedPin.description || 'No description available'}</p>
            </div>
            <button onClick={() => setSelectedPin(null)} className="text-gray-500 hover:text-white">
              &times;
            </button>
          </div>
          <div className="mt-5 flex space-x-2">
            <button className="flex-1 bg-brand-600 hover:bg-brand-500 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors">
              <Navigation className="w-4 h-4 mr-1" /> Navigate
            </button>
            <button 
                onClick={() => openGoogleMaps(selectedPin)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center border border-white/10 transition-colors"
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

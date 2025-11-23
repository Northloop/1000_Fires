
import React, { useState, useRef } from 'react';
import { Layers, MapPin, Save, Plus, Trash2, Crosshair, Tent, Palette, HeartPulse, Hammer, Info } from 'lucide-react';
import { MOCK_MAP_PINS, MOCK_MAP_LAYERS, MOCK_CAMPS } from '../constants';
import { MapLayer, MapPin as MapPinType, UserRole } from '../types';
import { useUser } from '../context/UserContext';

const MapBuilder: React.FC = () => {
  const { activeMembership, checkPermission } = useUser();
  const [layers, setLayers] = useState<MapLayer[]>(MOCK_MAP_LAYERS);
  const [pins, setPins] = useState<MapPinType[]>(MOCK_MAP_PINS);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);

  // Permission Check
  if (!activeMembership || !checkPermission('MANAGE_MAP')) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MapPin className="w-16 h-16 mb-4 opacity-20" />
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p>You do not have permission to edit the Event Map.</p>
        </div>
    )
  }

  const selectedPin = pins.find(p => p.id === selectedPinId);

  const handleMapClick = (e: React.MouseEvent) => {
    // If not clicking a pin directly, and we have a map ref
    if (!mapRef.current) return;
    
    // Logic to drop a new pin if a tool was active could go here
    // For now, we use the "Add Pin" button to spawn one in center
  };

  const updatePinPosition = (e: React.MouseEvent) => {
    if (!isDragging || !selectedPinId || !mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPins(pins.map(p => p.id === selectedPinId ? { ...p, x, y } : p));
  };

  const handleAddPin = () => {
    const newPin: MapPinType = {
        id: `new-${Date.now()}`,
        type: 'camp',
        name: 'New Location',
        x: 50,
        y: 50,
        lat: 0,
        lng: 0,
        description: 'Description here'
    };
    setPins([...pins, newPin]);
    setSelectedPinId(newPin.id);
  };

  const handleDeletePin = (id: string) => {
    if(confirm('Are you sure you want to delete this pin?')) {
        setPins(pins.filter(p => p.id !== id));
        if (selectedPinId === id) setSelectedPinId(null);
    }
  };

  const handleUpdatePin = (id: string, updates: Partial<MapPinType>) => {
    setPins(pins.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const getPinIcon = (type: string) => {
    switch (type) {
        case 'camp': return <Tent className="w-4 h-4" />;
        case 'art': return <Palette className="w-4 h-4" />;
        case 'medical': return <HeartPulse className="w-4 h-4" />;
        case 'infra': return <Hammer className="w-4 h-4" />;
        default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getPinColor = (type: string) => {
    switch (type) {
      case 'art': return 'text-purple-500';
      case 'medical': return 'text-red-500';
      case 'infra': return 'text-orange-500';
      default: return 'text-brand-500';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-4">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-96 bg-night-800 rounded-xl border border-white/5 p-4 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-brand-500" />
            Map Editor
            </h2>
            <button 
                onClick={handleAddPin}
                className="bg-brand-600 hover:bg-brand-500 text-white p-2 rounded-lg"
                title="Add New Pin"
            >
                <Plus className="w-5 h-5" />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {/* Selected Pin Editor */}
            {selectedPin ? (
                <div className="bg-night-900 border border-brand-500/30 rounded-lg p-4 space-y-4 animate-in fade-in slide-in-from-left-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold text-brand-500 uppercase">Editing Pin</h3>
                        <button onClick={() => handleDeletePin(selectedPin.id)} className="text-red-500 hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Name</label>
                        <input 
                            type="text" 
                            value={selectedPin.name}
                            onChange={(e) => handleUpdatePin(selectedPin.id, { name: e.target.value })}
                            className="w-full bg-night-800 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-brand-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Type</label>
                            <select 
                                value={selectedPin.type}
                                onChange={(e) => handleUpdatePin(selectedPin.id, { type: e.target.value as any })}
                                className="w-full bg-night-800 border border-white/10 rounded px-3 py-2 text-white text-sm outline-none"
                            >
                                <option value="camp">Theme Camp</option>
                                <option value="art">Art Project</option>
                                <option value="medical">Medical/Safety</option>
                                <option value="infra">Infrastructure</option>
                                <option value="toilet">Restrooms</option>
                            </select>
                        </div>
                        <div>
                             <label className="block text-xs text-gray-500 mb-1">Linked Camp</label>
                             <select 
                                value={selectedPin.campId || ''}
                                onChange={(e) => handleUpdatePin(selectedPin.id, { campId: e.target.value || undefined })}
                                className="w-full bg-night-800 border border-white/10 rounded px-3 py-2 text-white text-sm outline-none"
                             >
                                <option value="">None</option>
                                {MOCK_CAMPS.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                             </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Real-World Coordinates (Lat/Lng)</label>
                        <div className="flex gap-2">
                            <input 
                                type="number" 
                                placeholder="Lat"
                                value={selectedPin.lat || ''}
                                onChange={(e) => handleUpdatePin(selectedPin.id, { lat: parseFloat(e.target.value) })}
                                className="w-full bg-night-800 border border-white/10 rounded px-3 py-2 text-white text-sm font-mono outline-none"
                            />
                            <input 
                                type="number" 
                                placeholder="Lng"
                                value={selectedPin.lng || ''}
                                onChange={(e) => handleUpdatePin(selectedPin.id, { lng: parseFloat(e.target.value) })}
                                className="w-full bg-night-800 border border-white/10 rounded px-3 py-2 text-white text-sm font-mono outline-none"
                            />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1 flex items-center">
                            <Info className="w-3 h-3 mr-1" /> Used for "Open in Google Maps"
                        </p>
                    </div>

                     <div>
                        <label className="block text-xs text-gray-500 mb-1">Description</label>
                        <textarea 
                            value={selectedPin.description || ''}
                            onChange={(e) => handleUpdatePin(selectedPin.id, { description: e.target.value })}
                            rows={2}
                            className="w-full bg-night-800 border border-white/10 rounded px-3 py-2 text-white text-sm outline-none resize-none"
                        />
                    </div>
                </div>
            ) : (
                <div className="p-4 border border-dashed border-white/10 rounded-lg text-center text-gray-500 text-sm">
                    Select a pin on the map or click "Add New" to edit.
                </div>
            )}

            {/* List of Pins */}
            <div>
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-4">All Pins ({pins.length})</h3>
                 <div className="space-y-2">
                     {pins.map(pin => (
                         <div 
                            key={pin.id} 
                            onClick={() => setSelectedPinId(pin.id)}
                            className={`flex items-center p-2 rounded-lg cursor-pointer border transition-colors ${selectedPinId === pin.id ? 'bg-white/10 border-brand-500' : 'bg-night-900 border-white/5 hover:border-white/20'}`}
                        >
                            <div className={`mr-3 ${getPinColor(pin.type)}`}>
                                {getPinIcon(pin.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{pin.name}</p>
                                <p className="text-xs text-gray-500 truncate">{pin.description}</p>
                            </div>
                         </div>
                     ))}
                 </div>
            </div>
        </div>

        <div className="pt-4 border-t border-white/5 mt-auto">
          <button className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-lg font-bold flex items-center justify-center">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="flex-1 flex flex-col bg-black rounded-xl border border-white/5 overflow-hidden">
        <div className="bg-night-800 p-2 border-b border-white/5 flex justify-between items-center text-xs text-gray-400">
            <span>Canvas Editor</span>
            <span className="flex items-center"><Crosshair className="w-3 h-3 mr-1" /> {selectedPin ? `X: ${selectedPin.x.toFixed(1)}% Y: ${selectedPin.y.toFixed(1)}%` : 'No Selection'}</span>
        </div>
        
        <div 
            ref={mapRef}
            className="flex-1 relative bg-[#1a1a1a] overflow-hidden cursor-crosshair"
            onMouseMove={updatePinPosition}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
        >
            {/* Background Layers */}
            {layers.filter(l => l.visible).map((layer, idx) => (
                <div 
                    key={layer.id}
                    className="absolute inset-0 pointer-events-none"
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
                             {/* Grid Lines */}
                            <defs>
                                <pattern id="smallGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#smallGrid)" />
                        </svg>
                    )}
                </div>
            ))}

            {/* Draggable Pins */}
            {pins.map(pin => (
                <div
                    key={pin.id}
                    onMouseDown={(e) => {
                        e.stopPropagation(); // Prevent drag from starting if clicking other elements
                        setSelectedPinId(pin.id);
                        setIsDragging(true);
                    }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 z-20 cursor-move group`}
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                >
                    <div className={`relative ${getPinColor(pin.type)} ${selectedPinId === pin.id ? 'scale-125' : ''} transition-all`}>
                        <MapPin className={`w-8 h-8 drop-shadow-lg fill-current`} />
                        {selectedPinId === pin.id && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap">
                                {pin.name}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MapBuilder;
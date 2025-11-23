
import React, { useState } from 'react';
import { Layers, Upload, Map as MapIcon, Eye, EyeOff, Move, Save, Check } from 'lucide-react';
import { MOCK_MAP_LAYERS } from '../constants';
import { MapLayer } from '../types';

const MapBuilder: React.FC = () => {
  const [layers, setLayers] = useState<MapLayer[]>(MOCK_MAP_LAYERS);
  const [activeTool, setActiveTool] = useState<'move' | 'draw' | 'upload'>('move');
  
  const toggleLayer = (id: string) => {
    setLayers(layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  };

  const handleOpacityChange = (id: string, val: number) => {
    setLayers(layers.map(l => l.id === id ? { ...l, opacity: val } : l));
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-4">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-80 bg-night-800 rounded-xl border border-white/5 p-4 flex flex-col">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <MapIcon className="w-5 h-5 mr-2 text-brand-500" />
          Map Builder
        </h2>
        
        <div className="space-y-6 flex-1 overflow-y-auto">
          {/* Toolbelt */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tools</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTool('move')}
                className={`p-2 rounded-lg border transition-colors ${activeTool === 'move' ? 'bg-brand-600 border-brand-500 text-white' : 'bg-night-900 border-white/10 text-gray-400 hover:text-white'}`}
                title="Move / Pan"
              >
                <Move className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setActiveTool('upload')}
                className={`p-2 rounded-lg border transition-colors ${activeTool === 'upload' ? 'bg-brand-600 border-brand-500 text-white' : 'bg-night-900 border-white/10 text-gray-400 hover:text-white'}`}
                title="Upload Overlay"
              >
                <Upload className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Layers List */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Layers</span>
              <Layers className="w-4 h-4" />
            </h3>
            <div className="space-y-2">
              {layers.map((layer) => (
                <div key={layer.id} className="bg-night-900 border border-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{layer.name}</span>
                    <button onClick={() => toggleLayer(layer.id)} className="text-gray-400 hover:text-white">
                      {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1"
                    value={layer.opacity}
                    onChange={(e) => handleOpacityChange(layer.id, parseFloat(e.target.value))}
                    className="w-full h-1 bg-night-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                </div>
              ))}
            </div>
            <button className="w-full mt-3 py-2 border border-dashed border-white/10 rounded-lg text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors">
              + Add Custom Layer
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <button className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-lg font-bold flex items-center justify-center">
            <Save className="w-4 h-4 mr-2" />
            Save Map Config
          </button>
        </div>
      </div>

      {/* Map Preview Area */}
      <div className="flex-1 bg-black rounded-xl border border-white/5 relative overflow-hidden group">
        {/* Placeholder for Map Rendering */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-600 pointer-events-none">
          <div className="text-center">
            <MapIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-sm">Interactive Map Canvas</p>
            <p className="text-xs opacity-50">(Satellite / Vector Rendering)</p>
          </div>
        </div>

        {/* Simulated Layers */}
        {layers.filter(l => l.visible).map((layer, idx) => (
          <div 
            key={layer.id}
            className="absolute inset-0 pointer-events-none"
            style={{ 
              opacity: layer.opacity,
              zIndex: idx,
              background: layer.type === 'SATELLITE' 
                ? 'radial-gradient(circle at center, #1a2e1a 0%, #0f172a 100%)' 
                : layer.type === 'VECTOR' ? 'transparent' 
                : 'none',
            }}
          >
            {layer.type === 'VECTOR' && (
              <svg className="w-full h-full opacity-50">
                <path d="M 100 100 Q 400 50 600 300 T 1000 500" stroke="white" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                <rect x="20%" y="30%" width="15%" height="10%" fill="rgba(249, 115, 22, 0.2)" stroke="rgba(249, 115, 22, 0.5)" />
              </svg>
            )}
          </div>
        ))}
        
        {/* Mock Upload Overlay */}
        {activeTool === 'upload' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-night-800 p-8 rounded-xl border border-white/10 text-center">
                    <Upload className="w-12 h-12 text-brand-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Upload Custom Map</h3>
                    <p className="text-gray-400 mb-6">Upload a drone shot or artistic map (PDF/PNG) to overlay.</p>
                    <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg">Select File</button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default MapBuilder;

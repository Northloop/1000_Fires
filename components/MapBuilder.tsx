
import React, { useState, useRef, useEffect } from 'react';
import { 
  Layers, MapPin, Save, Plus, Trash2, Crosshair, Tent, Palette, 
  HeartPulse, Hammer, Info, Image as ImageIcon, MousePointer2, 
  Hexagon, Waypoints, Upload, X, Check
} from 'lucide-react';
import { MOCK_MAP_PINS, MOCK_MAP_LAYERS, MOCK_CAMPS } from '../constants';
import { MapLayer, MapPin as MapPinType } from '../types';
import { useUser } from '../context/UserContext';

// Extended Types for internal use
interface MapShape {
  id: string;
  type: 'polygon' | 'path';
  points: {x: number, y: number}[];
  color: string;
  name: string;
  opacity: number;
}

const MapBuilder: React.FC = () => {
  const { activeMembership, checkPermission } = useUser();
  
  // -- STATE --
  const [layers, setLayers] = useState<MapLayer[]>(MOCK_MAP_LAYERS);
  const [pins, setPins] = useState<MapPinType[]>(MOCK_MAP_PINS);
  const [shapes, setShapes] = useState<MapShape[]>([]);
  
  // Tool State
  const [activeTool, setActiveTool] = useState<'select' | 'pin' | 'polygon' | 'path'>('select');
  const [backgroundImage, setBackgroundImage] = useState<string>(''); // URL for custom satellite map
  const [bgOpacity, setBgOpacity] = useState(1);
  
  // Selection & Editing
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'pin' | 'shape' | null>(null);
  
  // Drawing State
  const [drawPoints, setDrawPoints] = useState<{x: number, y: number}[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const mapRef = useRef<HTMLDivElement>(null);

  // -- PERMISSION CHECK --
  if (!activeMembership || !checkPermission('MANAGE_MAP')) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MapPin className="w-16 h-16 mb-4 opacity-20" />
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p>You do not have permission to edit the Event Map.</p>
        </div>
    )
  }

  // -- HELPERS --

  const getRelativeCoords = (e: React.MouseEvent | React.TouchEvent) => {
    if (!mapRef.current) return { x: 0, y: 0 };
    const rect = mapRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    return {
      x: Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100))
    };
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

  // -- HANDLERS --

  const handleMapMouseDown = (e: React.MouseEvent) => {
    const coords = getRelativeCoords(e);

    if (activeTool === 'pin') {
       const newPin: MapPinType = {
           id: `pin-${Date.now()}`,
           type: 'camp',
           name: 'New Location',
           x: coords.x,
           y: coords.y,
           description: ''
       };
       setPins([...pins, newPin]);
       setSelectedId(newPin.id);
       setSelectedType('pin');
       setActiveTool('select'); // Auto switch back to select after dropping
    } else if (activeTool === 'polygon' || activeTool === 'path') {
       setDrawPoints([...drawPoints, coords]);
    } else if (activeTool === 'select') {
       // Deselect if clicking empty space
       if (e.target === mapRef.current || (e.target as HTMLElement).id === 'map-bg') {
           setSelectedId(null);
           setSelectedType(null);
       }
    }
  };

  const finishDrawing = () => {
      if (drawPoints.length < 2) {
          setDrawPoints([]);
          return;
      }
      const newShape: MapShape = {
          id: `shape-${Date.now()}`,
          type: activeTool === 'polygon' ? 'polygon' : 'path',
          points: drawPoints,
          color: activeTool === 'polygon' ? '#22c55e' : '#f97316',
          name: activeTool === 'polygon' ? 'New Zone' : 'New Path',
          opacity: 0.5
      };
      setShapes([...shapes, newShape]);
      setDrawPoints([]);
      setSelectedId(newShape.id);
      setSelectedType('shape');
      setActiveTool('select');
  };

  const handlePinMouseDown = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (activeTool === 'select') {
          setSelectedId(id);
          setSelectedType('pin');
          setIsDragging(true);
          // Calculate offset if needed, for now center drag
      }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (isDragging && selectedId && selectedType === 'pin') {
          const coords = getRelativeCoords(e);
          setPins(pins.map(p => p.id === selectedId ? { ...p, x: coords.x, y: coords.y } : p));
      }
  };

  const handleMouseUp = () => {
      setIsDragging(false);
  };

  // -- RENDER HELPERS --

  const renderShapePreview = () => {
      if (drawPoints.length === 0) return null;
      const pointsStr = drawPoints.map(p => `${p.x},${p.y}`).join(' ');
      
      return activeTool === 'polygon' ? (
          <polygon points={pointsStr} fill="rgba(34, 197, 94, 0.3)" stroke="#22c55e" strokeWidth="0.5" />
      ) : (
          <polyline points={pointsStr} fill="none" stroke="#f97316" strokeWidth="0.5" strokeDasharray="1 0.5" />
      );
  };

  // -- UI COMPONENTS --

  const Sidebar = () => {
      const selectedPin = pins.find(p => p.id === selectedId);
      const selectedShape = shapes.find(s => s.id === selectedId);

      return (
        <div className="w-full lg:w-96 bg-night-800 rounded-xl border border-white/5 flex flex-col overflow-hidden shadow-2xl z-10">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-night-900">
                <h2 className="text-lg font-bold text-white flex items-center">
                    <Layers className="w-5 h-5 mr-2 text-brand-500" />
                    Map Properties
                </h2>
                <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-white" title="Export Map Data">
                        <Save className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                
                {/* Global Map Settings */}
                {!selectedId && (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center">
                                <ImageIcon className="w-3 h-3 mr-2" /> Base Layer
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Custom Image URL</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="https://..."
                                            value={backgroundImage}
                                            onChange={(e) => setBackgroundImage(e.target.value)}
                                            className="flex-1 bg-night-900 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-brand-500"
                                        />
                                        <button className="bg-white/10 p-1.5 rounded hover:bg-white/20">
                                            <Upload className="w-3 h-3 text-white" />
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-1">Paste a link to a satellite image or map screenshot.</p>
                                </div>
                                {backgroundImage && (
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Opacity: {Math.round(bgOpacity * 100)}%</label>
                                        <input 
                                            type="range" 
                                            min="0" max="1" step="0.1" 
                                            value={bgOpacity}
                                            onChange={(e) => setBgOpacity(parseFloat(e.target.value))}
                                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Statistics</h3>
                            <div className="grid grid-cols-2 gap-2 text-center">
                                <div className="bg-night-900 p-2 rounded">
                                    <span className="block text-lg font-bold text-white">{pins.length}</span>
                                    <span className="text-[10px] text-gray-500">Pins</span>
                                </div>
                                <div className="bg-night-900 p-2 rounded">
                                    <span className="block text-lg font-bold text-white">{shapes.length}</span>
                                    <span className="text-[10px] text-gray-500">Zones</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Selected Pin Editor */}
                {selectedType === 'pin' && selectedPin && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-bold text-brand-500 uppercase flex items-center">
                                <MapPin className="w-3 h-3 mr-2" /> Edit Location
                            </h3>
                            <button 
                                onClick={() => {
                                    setPins(pins.filter(p => p.id !== selectedPin.id));
                                    setSelectedId(null);
                                    setSelectedType(null);
                                }} 
                                className="text-red-500 hover:text-red-400 p-1 bg-red-500/10 rounded"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                             <div>
                                <label className="block text-xs text-gray-500 mb-1">Name</label>
                                <input 
                                    value={selectedPin.name}
                                    onChange={(e) => setPins(pins.map(p => p.id === selectedPin.id ? {...p, name: e.target.value} : p))}
                                    className="w-full bg-night-900 border border-white/10 rounded px-3 py-2 text-white text-sm outline-none focus:border-brand-500"
                                />
                             </div>
                             <div className="grid grid-cols-2 gap-2">
                                 <div>
                                    <label className="block text-xs text-gray-500 mb-1">Type</label>
                                    <select 
                                        value={selectedPin.type}
                                        onChange={(e) => setPins(pins.map(p => p.id === selectedPin.id ? {...p, type: e.target.value as any} : p))}
                                        className="w-full bg-night-900 border border-white/10 rounded px-3 py-2 text-white text-sm outline-none"
                                    >
                                        <option value="camp">Camp</option>
                                        <option value="art">Art</option>
                                        <option value="medical">Medical</option>
                                        <option value="infra">Infra</option>
                                    </select>
                                 </div>
                                 <div>
                                    <label className="block text-xs text-gray-500 mb-1">Linked Camp</label>
                                    <select 
                                        value={selectedPin.campId || ''}
                                        onChange={(e) => setPins(pins.map(p => p.id === selectedPin.id ? {...p, campId: e.target.value} : p))}
                                        className="w-full bg-night-900 border border-white/10 rounded px-3 py-2 text-white text-sm outline-none"
                                    >
                                        <option value="">None</option>
                                        {MOCK_CAMPS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                 </div>
                             </div>
                             <div>
                                <label className="block text-xs text-gray-500 mb-1">Coordinates (X / Y)</label>
                                <div className="flex gap-2">
                                    <input value={selectedPin.x.toFixed(2)} readOnly className="w-1/2 bg-night-900/50 border border-white/5 rounded px-2 py-1 text-xs text-gray-400" />
                                    <input value={selectedPin.y.toFixed(2)} readOnly className="w-1/2 bg-night-900/50 border border-white/5 rounded px-2 py-1 text-xs text-gray-400" />
                                </div>
                             </div>
                        </div>
                    </div>
                )}

                {/* Selected Shape Editor */}
                {selectedType === 'shape' && selectedShape && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-bold text-brand-500 uppercase flex items-center">
                                <Hexagon className="w-3 h-3 mr-2" /> Edit Zone
                            </h3>
                            <button 
                                onClick={() => {
                                    setShapes(shapes.filter(s => s.id !== selectedShape.id));
                                    setSelectedId(null);
                                    setSelectedType(null);
                                }} 
                                className="text-red-500 hover:text-red-400 p-1 bg-red-500/10 rounded"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                        
                         <div className="space-y-3">
                             <div>
                                <label className="block text-xs text-gray-500 mb-1">Label</label>
                                <input 
                                    value={selectedShape.name}
                                    onChange={(e) => setShapes(shapes.map(s => s.id === selectedShape.id ? {...s, name: e.target.value} : s))}
                                    className="w-full bg-night-900 border border-white/10 rounded px-3 py-2 text-white text-sm outline-none focus:border-brand-500"
                                />
                             </div>
                             <div className="grid grid-cols-2 gap-2">
                                 <div>
                                    <label className="block text-xs text-gray-500 mb-1">Color</label>
                                    <input 
                                        type="color"
                                        value={selectedShape.color}
                                        onChange={(e) => setShapes(shapes.map(s => s.id === selectedShape.id ? {...s, color: e.target.value} : s))}
                                        className="w-full h-9 bg-night-900 border border-white/10 rounded cursor-pointer"
                                    />
                                 </div>
                                 <div>
                                    <label className="block text-xs text-gray-500 mb-1">Opacity</label>
                                    <input 
                                        type="number"
                                        min="0.1" max="1" step="0.1"
                                        value={selectedShape.opacity}
                                        onChange={(e) => setShapes(shapes.map(s => s.id === selectedShape.id ? {...s, opacity: parseFloat(e.target.value)} : s))}
                                        className="w-full bg-night-900 border border-white/10 rounded px-3 py-2 text-white text-sm outline-none"
                                    />
                                 </div>
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      );

  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-4">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Map Canvas Area */}
      <div className="flex-1 flex flex-col bg-black rounded-xl border border-white/5 overflow-hidden relative shadow-2xl">
         
         {/* Toolbar */}
         <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-night-800/90 backdrop-blur border border-white/10 rounded-full p-1.5 flex gap-2 shadow-xl">
             <button 
                onClick={() => setActiveTool('select')}
                className={`p-2.5 rounded-full transition-all ${activeTool === 'select' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                title="Select & Move (V)"
             >
                 <MousePointer2 className="w-5 h-5" />
             </button>
             <div className="w-px bg-white/10 my-1"></div>
             <button 
                onClick={() => setActiveTool('pin')}
                className={`p-2.5 rounded-full transition-all ${activeTool === 'pin' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                title="Place Pin (P)"
             >
                 <MapPin className="w-5 h-5" />
             </button>
             <button 
                onClick={() => setActiveTool('polygon')}
                className={`p-2.5 rounded-full transition-all ${activeTool === 'polygon' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                title="Draw Zone (Z)"
             >
                 <Hexagon className="w-5 h-5" />
             </button>
             <button 
                onClick={() => setActiveTool('path')}
                className={`p-2.5 rounded-full transition-all ${activeTool === 'path' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                title="Draw Path (L)"
             >
                 <Waypoints className="w-5 h-5" />
             </button>
         </div>

         {/* Floating Action (Finish Draw) */}
         {drawPoints.length > 0 && (
             <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 bg-night-800 border border-brand-500 rounded-lg p-2 flex gap-3 shadow-2xl animate-in slide-in-from-bottom-4">
                 <button onClick={() => setDrawPoints([])} className="px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded">
                     Cancel
                 </button>
                 <button onClick={finishDrawing} className="px-3 py-1.5 text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white rounded flex items-center shadow-lg">
                     <Check className="w-3 h-3 mr-1.5" /> Finish {activeTool === 'polygon' ? 'Zone' : 'Path'}
                 </button>
             </div>
         )}

         {/* Canvas */}
         <div 
            ref={mapRef}
            className={`flex-1 relative overflow-hidden bg-[#0f172a] ${activeTool === 'select' ? 'cursor-default' : 'cursor-crosshair'}`}
            onMouseDown={handleMapMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
         >
             {/* 1. Background Layer */}
             <div className="absolute inset-0 pointer-events-none">
                 {backgroundImage ? (
                     <img 
                        src={backgroundImage} 
                        alt="Map Background" 
                        className="w-full h-full object-cover"
                        style={{ opacity: bgOpacity }} 
                     />
                 ) : (
                     <div className="w-full h-full bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#020617_100%)]">
                        {/* Grid Pattern Fallback */}
                        <svg className="w-full h-full opacity-20">
                            <defs>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                     </div>
                 )}
             </div>

             {/* 2. SVG Shape Layer */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
                 {/* Existing Shapes */}
                 {shapes.map(shape => {
                     const pointsStr = shape.points.map(p => `${p.x},${p.y}`).join(' ');
                     const isSelected = selectedId === shape.id;
                     
                     return shape.type === 'polygon' ? (
                        <polygon 
                            key={shape.id}
                            points={pointsStr}
                            fill={shape.color}
                            fillOpacity={shape.opacity}
                            stroke={isSelected ? '#fff' : shape.color}
                            strokeWidth={isSelected ? '0.5' : '0.2'}
                            className="pointer-events-auto cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                if(activeTool === 'select') {
                                    setSelectedId(shape.id);
                                    setSelectedType('shape');
                                }
                            }}
                        />
                     ) : (
                        <polyline
                            key={shape.id}
                            points={pointsStr}
                            fill="none"
                            stroke={shape.color}
                            strokeWidth={isSelected ? '0.8' : '0.4'}
                            strokeDasharray="1 0.5"
                            className="pointer-events-auto cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                if(activeTool === 'select') {
                                    setSelectedId(shape.id);
                                    setSelectedType('shape');
                                }
                            }}
                        />
                     );
                 })}
                 
                 {/* Current Drawing Preview */}
                 {renderShapePreview()}

                 {/* Drawing Points (Vertices) */}
                 {drawPoints.map((p, i) => (
                     <circle key={i} cx={p.x + "%"} cy={p.y + "%"} r="3" fill="white" stroke="#f97316" strokeWidth="2" />
                 ))}
             </svg>

             {/* 3. Pin Layer */}
             {pins.map(pin => (
                 <div
                    key={pin.id}
                    onMouseDown={(e) => handlePinMouseDown(e, pin.id)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 z-20 cursor-grab active:cursor-grabbing group`}
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                 >
                    <div className={`relative ${getPinColor(pin.type)} ${selectedId === pin.id ? 'scale-125 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : ''} transition-all`}>
                        <MapPin className={`w-8 h-8 drop-shadow-lg fill-current`} />
                        
                        {/* Label on Hover or Select */}
                        {(selectedId === pin.id || activeTool === 'select') && (
                             <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
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

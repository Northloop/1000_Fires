
import React, { useState, useRef, useEffect } from 'react';
import { 
  Layers, MapPin, Save, Trash2, Hexagon, Waypoints, 
  MousePointer2, Info, Check, X, Plus, Minus
} from 'lucide-react';
import { MOCK_MAP_PINS } from '../constants';
import { MapPin as MapPinType } from '../types';
import { useUser } from '../context/UserContext';

// Define Leaflet types globally to satisfy TS
declare global {
  interface Window {
    L: any;
  }
}

interface MapShape {
  id: string;
  type: 'polygon' | 'polyline';
  latlngs: {lat: number, lng: number}[];
  color: string;
  name: string;
}

const MapBuilder: React.FC = () => {
  const { activeMembership, checkPermission } = useUser();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  
  // -- STATE --
  const [pins, setPins] = useState<MapPinType[]>(MOCK_MAP_PINS);
  const [shapes, setShapes] = useState<MapShape[]>([]);
  
  // Tools: 'select' | 'pin' | 'polygon' | 'polyline'
  const [activeTool, setActiveTool] = useState<string>('select');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'pin' | 'shape' | null>(null);
  
  // Drawing State
  const [drawPoints, setDrawPoints] = useState<{lat: number, lng: number}[]>([]);
  const [tempLayer, setTempLayer] = useState<any>(null);
  
  // Layer State
  const [activeBaseLayer, setActiveBaseLayer] = useState<'satellite' | 'dark'>('satellite');

  // -- REFS FOR EVENT HANDLERS (Fix Stale Closures) --
  const activeToolRef = useRef(activeTool);
  const drawPointsRef = useRef(drawPoints);
  
  useEffect(() => { activeToolRef.current = activeTool; }, [activeTool]);
  useEffect(() => { drawPointsRef.current = drawPoints; }, [drawPoints]);

  // -- INITIALIZATION --
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const L = window.L;
    
    // Init Map centered on Voyageurs National Park, MN
    const map = L.map(mapContainerRef.current, {
        zoomControl: false, 
        minZoom: 4,
        maxZoom: 22
    }).setView([48.4558, -92.8384], 15);
    
    mapInstanceRef.current = map;

    // --- 1. Base Layers Setup ---
    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 22,
      maxNativeZoom: 17 // Esri Satellite often doesn't go deeper than 17/18
    });
    
    const dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CartoDB',
      subdomains: 'abcd',
      maxZoom: 22,
      maxNativeZoom: 20
    });

    // Add default layer (Satellite)
    satellite.addTo(map);
    
    // Store layers for toggling later
    (map as any)._layers_custom = { satellite, dark };

    // --- 2. Resize Observer ---
    const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    // --- 3. Click Handler (Attached Once, Uses Refs) ---
    map.on('click', (e: any) => {
        const tool = activeToolRef.current;
        const latlng = e.latlng;

        if (tool === 'select') {
            // Deselect if clicking on empty map
            setSelectedId(null);
            setSelectedType(null);
            return;
        }

        if (tool === 'pin') {
            const newPin: MapPinType = {
                id: `pin-${Date.now()}`,
                type: 'camp',
                name: 'New Location',
                x: 0,
                y: 0,
                lat: latlng.lat,
                lng: latlng.lng
            };
            setPins(prev => [...prev, newPin]);
            
            // Auto-select the new pin
            setActiveTool('select');
            setSelectedId(newPin.id);
            setSelectedType('pin');
        }

        if (tool === 'polygon' || tool === 'polyline') {
            setDrawPoints(prev => [...prev, latlng]);
        }
    });

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // -- BASE LAYER TOGGLE --
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    
    const { satellite, dark } = (map as any)._layers_custom;
    
    if (activeBaseLayer === 'satellite') {
        if (map.hasLayer(dark)) map.removeLayer(dark);
        if (!map.hasLayer(satellite)) map.addLayer(satellite);
    } else {
        if (map.hasLayer(satellite)) map.removeLayer(satellite);
        if (!map.hasLayer(dark)) map.addLayer(dark);
    }
  }, [activeBaseLayer]);

  // -- RENDER PINS & SHAPES --
  useEffect(() => {
      const map = mapInstanceRef.current;
      if (!map) return;
      const L = window.L;

      // Clear existing custom overlays (markers/shapes)
      // Note: We use a specific class or property to identify OUR layers to avoid removing base tiles
      map.eachLayer((layer: any) => {
          if (layer instanceof L.Marker || layer instanceof L.Polygon || layer instanceof L.Polyline) {
             // Don't remove the temporary drawing layer
             if (layer !== tempLayer) {
                 map.removeLayer(layer);
             }
          }
      });

      // Render Pins
      pins.forEach(pin => {
          if (!pin.lat || !pin.lng) return;

          const getIconColor = () => {
              switch(pin.type) {
                  case 'medical': return '#ef4444';
                  case 'art': return '#a855f7';
                  case 'infra': return '#f97316';
                  case 'toilet': return '#3b82f6';
                  default: return '#22c55e';
              }
          };

          const icon = L.divIcon({
              className: 'custom-pin',
              html: `<div style="
                background-color: ${getIconColor()}; 
                width: 24px; 
                height: 24px; 
                border-radius: 50%; 
                border: 2px solid white;
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
                display: flex; align-items: center; justify-content: center;
                transform: scale(${selectedId === pin.id ? 1.25 : 1});
                transition: transform 0.2s;
              ">
               <div style="width: 8px; height: 8px; background: white; border-radius: 50%"></div>
              </div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12]
          });

          const marker = L.marker([pin.lat, pin.lng], { 
              icon: icon, 
              draggable: true,
              autoPan: true 
          }).addTo(map);

          marker.on('click', (e: any) => {
              L.DomEvent.stopPropagation(e);
              if (activeToolRef.current === 'select') {
                  setSelectedId(pin.id);
                  setSelectedType('pin');
              }
          });

          marker.on('dragend', (e: any) => {
              const newPos = e.target.getLatLng();
              setPins(prev => prev.map(p => p.id === pin.id ? { ...p, lat: newPos.lat, lng: newPos.lng } : p));
          });
          
          if (selectedId === pin.id) {
             marker.setZIndexOffset(1000);
          }
      });

      // Render Shapes
      shapes.forEach(shape => {
          let layer;
          const opts = {
              color: shape.color,
              weight: selectedId === shape.id ? 4 : 2,
              opacity: 1,
              fillOpacity: shape.type === 'polygon' ? 0.3 : 0,
              dashArray: null
          };

          if (shape.type === 'polygon') {
              layer = L.polygon(shape.latlngs, opts);
          } else {
              layer = L.polyline(shape.latlngs, opts);
          }

          layer.addTo(map);
          
          layer.on('click', (e: any) => {
              L.DomEvent.stopPropagation(e);
               if (activeToolRef.current === 'select') {
                  setSelectedId(shape.id);
                  setSelectedType('shape');
               }
          });
      });

  }, [pins, shapes, selectedId]); // removed tempLayer from deps to avoid flickers

  // -- DRAWING PREVIEW --
  useEffect(() => {
     const map = mapInstanceRef.current;
     if (!map) return;
     const L = window.L;

     if (tempLayer) {
         map.removeLayer(tempLayer);
     }

     if (drawPoints.length > 0) {
         let layer;
         if (activeTool === 'polygon') {
             layer = L.polygon(drawPoints, { color: '#22c55e', dashArray: '5, 10', fillOpacity: 0.1 });
         } else {
             layer = L.polyline(drawPoints, { color: '#f97316', dashArray: '5, 10' });
         }
         layer.addTo(map);
         setTempLayer(layer);
     } else {
         setTempLayer(null);
     }
  }, [drawPoints, activeTool]);


  const finishDrawing = () => {
      if (drawPoints.length < 2) return;
      
      const newShape: MapShape = {
          id: `shape-${Date.now()}`,
          type: activeTool === 'polygon' ? 'polygon' : 'polyline',
          latlngs: [...drawPoints],
          color: activeTool === 'polygon' ? '#22c55e' : '#f97316',
          name: activeTool === 'polygon' ? 'New Zone' : 'New Path'
      };
      
      setShapes(prev => [...prev, newShape]);
      setDrawPoints([]);
      setActiveTool('select');
      setSelectedId(newShape.id);
      setSelectedType('shape');
  };

  const zoomIn = () => mapInstanceRef.current?.zoomIn();
  const zoomOut = () => mapInstanceRef.current?.zoomOut();

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

  const getSelectedPin = () => pins.find(p => p.id === selectedId);
  const getSelectedShape = () => shapes.find(s => s.id === selectedId);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-4">
        {/* SIDEBAR CONTROLS */}
        <div className="w-full lg:w-96 bg-night-800 rounded-xl border border-white/5 flex flex-col shadow-2xl z-10 order-2 lg:order-1">
            <div className="p-4 border-b border-white/5 bg-night-900 flex justify-between items-center rounded-t-xl">
                <h2 className="text-lg font-bold text-white flex items-center">
                    <Layers className="w-5 h-5 mr-2 text-brand-500" /> Map Builder
                </h2>
                <button 
                  onClick={() => alert('Map Configuration Saved!')}
                  className="bg-brand-600 hover:bg-brand-500 text-white p-2 rounded-lg transition-colors shadow-lg shadow-brand-900/50"
                >
                    <Save className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                {/* Global Settings */}
                {!selectedId && (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Base Map Layer</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <button 
                                    onClick={() => setActiveBaseLayer('satellite')}
                                    className={`p-3 rounded-lg border text-sm font-bold transition-all flex flex-col items-center justify-center gap-2 ${activeBaseLayer === 'satellite' ? 'bg-brand-600 border-brand-500 text-white shadow-lg' : 'bg-night-900 border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5'}`}
                                >
                                    <div className="w-8 h-8 rounded-full bg-green-900 border border-green-700"></div>
                                    Satellite
                                </button>
                                <button 
                                    onClick={() => setActiveBaseLayer('dark')}
                                    className={`p-3 rounded-lg border text-sm font-bold transition-all flex flex-col items-center justify-center gap-2 ${activeBaseLayer === 'dark' ? 'bg-brand-600 border-brand-500 text-white shadow-lg' : 'bg-night-900 border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5'}`}
                                >
                                    <div className="w-8 h-8 rounded-full bg-gray-900 border border-gray-700"></div>
                                    Dark Vector
                                </button>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg border border-blue-500/20 bg-blue-500/10">
                            <h3 className="text-xs font-bold text-blue-400 uppercase mb-2 flex items-center"><Info className="w-3 h-3 mr-1" /> Controls</h3>
                            <ul className="text-xs text-gray-300 space-y-2">
                                <li className="flex items-start"><MousePointer2 className="w-3 h-3 mr-2 mt-0.5" /> Select items to edit details.</li>
                                <li className="flex items-start"><MapPin className="w-3 h-3 mr-2 mt-0.5" /> Place pins and drag to move.</li>
                                <li className="flex items-start"><Hexagon className="w-3 h-3 mr-2 mt-0.5" /> Click multiple points to draw zones.</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Pin Editor */}
                {selectedType === 'pin' && getSelectedPin() && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="flex justify-between items-center mb-2 bg-white/5 p-3 rounded-lg border border-white/5">
                            <h3 className="text-sm font-bold text-white uppercase flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-brand-500" /> Edit Pin
                            </h3>
                            <button 
                                onClick={() => {
                                    setPins(pins.filter(p => p.id !== selectedId));
                                    setSelectedId(null);
                                }}
                                className="text-red-500 hover:bg-red-500/20 p-2 rounded transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Label</label>
                                <input 
                                    value={getSelectedPin()?.name}
                                    onChange={(e) => setPins(pins.map(p => p.id === selectedId ? {...p, name: e.target.value} : p))}
                                    className="w-full bg-night-900 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                                />
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Type</label>
                                    <select 
                                        value={getSelectedPin()?.type}
                                        onChange={(e) => setPins(pins.map(p => p.id === selectedId ? {...p, type: e.target.value as any} : p))}
                                        className="w-full bg-night-900 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-brand-500"
                                    >
                                        <option value="camp">Camp</option>
                                        <option value="art">Art</option>
                                        <option value="medical">Medical</option>
                                        <option value="infra">Infra</option>
                                        <option value="toilet">Services</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Coordinates</label>
                                    <div className="bg-night-900 border border-white/10 rounded-lg px-3 py-2.5 text-gray-400 text-xs font-mono truncate">
                                        {getSelectedPin()?.lat?.toFixed(5)}, {getSelectedPin()?.lng?.toFixed(5)}
                                    </div>
                                </div>
                             </div>
                             
                             <button 
                                onClick={() => setSelectedId(null)}
                                className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm font-medium transition-colors border border-white/5"
                             >
                                Done Editing
                             </button>
                        </div>
                    </div>
                )}

                {/* Shape Editor */}
                {selectedType === 'shape' && getSelectedShape() && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="flex justify-between items-center mb-2 bg-white/5 p-3 rounded-lg border border-white/5">
                            <h3 className="text-sm font-bold text-white uppercase flex items-center">
                                <Hexagon className="w-4 h-4 mr-2 text-brand-500" /> Edit Zone
                            </h3>
                            <button 
                                onClick={() => {
                                    setShapes(shapes.filter(s => s.id !== selectedId));
                                    setSelectedId(null);
                                }}
                                className="text-red-500 hover:bg-red-500/20 p-2 rounded transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Label</label>
                                <input 
                                    value={getSelectedShape()?.name}
                                    onChange={(e) => setShapes(shapes.map(s => s.id === selectedId ? {...s, name: e.target.value} : s))}
                                    className="w-full bg-night-900 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Color</label>
                                <div className="flex gap-3">
                                    {['#f97316', '#ef4444', '#22c55e', '#3b82f6', '#a855f7'].map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setShapes(shapes.map(s => s.id === selectedId ? {...s, color} : s))}
                                            className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${getSelectedShape()?.color === color ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                             </div>

                             <button 
                                onClick={() => setSelectedId(null)}
                                className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm font-medium transition-colors border border-white/5"
                             >
                                Done Editing
                             </button>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* MAP CANVAS */}
        <div className="flex-1 relative bg-black rounded-xl border border-white/5 overflow-hidden shadow-2xl order-1 lg:order-2">
            {/* Toolbar Overlay */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-night-800/90 backdrop-blur border border-white/10 rounded-full p-1.5 flex gap-2 shadow-2xl">
                 <button 
                    onClick={() => setActiveTool('select')}
                    className={`p-2.5 rounded-full transition-all ${activeTool === 'select' ? 'bg-brand-600 text-white shadow-lg scale-105' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                    title="Select (V)"
                 >
                     <MousePointer2 className="w-5 h-5" />
                 </button>
                 <div className="w-px bg-white/10 my-1"></div>
                 <button 
                    onClick={() => setActiveTool('pin')}
                    className={`p-2.5 rounded-full transition-all ${activeTool === 'pin' ? 'bg-brand-600 text-white shadow-lg scale-105' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                    title="Place Pin (P)"
                 >
                     <MapPin className="w-5 h-5" />
                 </button>
                 <button 
                    onClick={() => setActiveTool('polygon')}
                    className={`p-2.5 rounded-full transition-all ${activeTool === 'polygon' ? 'bg-brand-600 text-white shadow-lg scale-105' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                    title="Draw Zone (Z)"
                 >
                     <Hexagon className="w-5 h-5" />
                 </button>
                 <button 
                    onClick={() => setActiveTool('polyline')}
                    className={`p-2.5 rounded-full transition-all ${activeTool === 'polyline' ? 'bg-brand-600 text-white shadow-lg scale-105' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                    title="Draw Path (L)"
                 >
                     <Waypoints className="w-5 h-5" />
                 </button>
            </div>

            {/* Zoom Controls */}
            <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-2">
                <button onClick={zoomIn} className="p-3 bg-night-800/90 backdrop-blur border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors shadow-xl">
                    <Plus className="w-5 h-5" />
                </button>
                <button onClick={zoomOut} className="p-3 bg-night-800/90 backdrop-blur border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors shadow-xl">
                    <Minus className="w-5 h-5" />
                </button>
            </div>

            {/* Drawing Confirmation Overlay */}
            {drawPoints.length > 0 && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[1000] bg-night-800 border border-brand-500 rounded-lg p-2 flex gap-3 shadow-2xl animate-in slide-in-from-bottom-4">
                     <button onClick={() => setDrawPoints([])} className="px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded flex items-center transition-colors">
                         <X className="w-3 h-3 mr-1.5" /> Cancel
                     </button>
                     <button onClick={finishDrawing} className="px-3 py-1.5 text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white rounded flex items-center shadow-lg transition-colors">
                         <Check className="w-3 h-3 mr-1.5" /> Finish Drawing
                     </button>
                </div>
            )}

            {/* LEAFLET CONTAINER */}
            <div 
                ref={mapContainerRef} 
                className={`w-full h-full z-0 ${activeTool !== 'select' ? 'cursor-crosshair' : ''}`} 
                style={{ isolation: 'isolate' }} 
            />
        </div>
    </div>
  );
};

export default MapBuilder;

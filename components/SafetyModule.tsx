import React, { useState } from 'react';
import { AlertTriangle, MapPin, Phone, Shield, Flame, Activity, Send, CheckCircle2 } from 'lucide-react';
import { MOCK_INCIDENTS } from '../constants';
import { Incident } from '../types';

const SafetyModule: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [showSOSConfirm, setShowSOSConfirm] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [newIncident, setNewIncident] = useState({ type: 'MEDICAL', location: '', description: '' });

  const handleSOS = () => {
    setSosActive(true);
    setShowSOSConfirm(false);
    // Simulate API call
    setTimeout(() => {
      setSosActive(false);
      alert("Rangers and ESD have been notified of your location.");
    }, 3000);
  };

  const reportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    const incident: Incident = {
      id: `new-${Date.now()}`,
      type: newIncident.type as any,
      status: 'OPEN',
      location: newIncident.location,
      description: newIncident.description,
      reportedAt: new Date().toISOString(),
      reporter: 'You'
    };
    setIncidents([incident, ...incidents]);
    setNewIncident({ type: 'MEDICAL', location: '', description: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center">
          <Shield className="w-8 h-8 mr-3 text-red-500" />
          Safety & Emergency
        </h1>
        <p className="text-gray-400 mt-2">Immediate assistance and incident logging.</p>
      </div>

      {/* SOS Button Area */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[300px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/20 via-transparent to-transparent opacity-50"></div>
        
        <h2 className="text-2xl font-bold text-white mb-8 relative z-10">Emergency Beacon</h2>
        
        <div className="relative z-10">
            {!sosActive ? (
            <button 
                onClick={() => setShowSOSConfirm(true)}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xl md:text-2xl shadow-[0_0_40px_rgba(220,38,38,0.5)] border-4 border-red-400 transition-all active:scale-95 flex flex-col items-center justify-center group"
            >
                <AlertTriangle className="w-10 h-10 md:w-12 md:h-12 mb-2 group-hover:scale-110 transition-transform" />
                <span>SOS</span>
            </button>
            ) : (
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-red-600 flex items-center justify-center relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <Activity className="w-12 h-12 text-white animate-pulse" />
            </div>
            )}
        </div>

        <p className="text-red-200 mt-8 max-w-md relative z-10 text-sm md:text-base px-4">
          Pressing SOS transmits your GPS coordinates to Event Rangers and ESD immediately. <br/><span className="font-bold text-white">Only use for life-threatening emergencies.</span>
        </p>

        {showSOSConfirm && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-night-800 border border-red-500 rounded-xl p-6 max-w-sm w-full text-center shadow-2xl shadow-red-900/50">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                 <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Confirm Emergency?</h3>
              <p className="text-gray-300 mb-6 text-sm">This will transmit your location to emergency services. False alarms are taken seriously.</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowSOSConfirm(false)}
                  className="flex-1 py-3 rounded-lg bg-night-900 border border-white/10 hover:bg-white/5 text-gray-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSOS}
                  className="flex-1 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors shadow-lg shadow-red-900/50"
                >
                  CONFIRM SOS
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Reporting Form */}
        <div className="bg-night-800 rounded-xl border border-white/5 p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <Send className="w-5 h-5 mr-2 text-brand-500" />
            Report an Incident
          </h3>
          <form onSubmit={reportIncident} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5 font-medium">Incident Type</label>
              <div className="relative">
                  <select 
                    value={newIncident.type}
                    onChange={(e) => setNewIncident({...newIncident, type: e.target.value})}
                    className="w-full bg-night-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-500 appearance-none cursor-pointer"
                  >
                    <option value="MEDICAL">Medical</option>
                    <option value="FIRE">Fire</option>
                    <option value="CONFLICT">Conflict / Altercation</option>
                    <option value="LOST_CHILD">Lost Child</option>
                    <option value="MOOP">Large Scale MOOP</option>
                  </select>
                  <div className="absolute right-3 top-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5 font-medium">Location</label>
              <div className="flex relative">
                <input 
                  type="text" 
                  value={newIncident.location}
                  onChange={(e) => setNewIncident({...newIncident, location: e.target.value})}
                  placeholder="e.g. 4:30 & C"
                  className="w-full bg-night-900 border border-white/10 rounded-lg pl-4 pr-10 py-2.5 text-white outline-none focus:border-brand-500 placeholder-gray-600"
                />
                <button type="button" className="absolute right-2 top-2 p-1 text-gray-400 hover:text-white rounded bg-white/5 hover:bg-white/10 transition-colors">
                  <MapPin className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5 font-medium">Description</label>
              <textarea 
                value={newIncident.description}
                onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
                rows={3}
                className="w-full bg-night-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-500 placeholder-gray-600 resize-none"
                placeholder="Describe the situation..."
              />
            </div>
            <button type="submit" className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-lg transition-all border border-white/10 hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-900/20">
              Submit Report
            </button>
          </form>
        </div>

        {/* Quick Resources */}
        <div className="space-y-4">
          <div className="bg-night-800 rounded-xl border border-white/5 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Nearby Resources</h3>
            <div className="space-y-3">
              {[
                { name: 'Ranger Station 3', loc: '3:00 & C', dist: '0.2mi', icon: Shield, color: 'text-yellow-500' },
                { name: 'Medical HQ', loc: 'Inner Circle & 5:30', dist: '0.8mi', icon: Activity, color: 'text-red-500' },
                { name: 'Fire Response 1', loc: 'Center Village', dist: '0.5mi', icon: Flame, color: 'text-orange-500' },
              ].map((res, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="flex items-center">
                    <div className={`p-2.5 bg-night-900 rounded-full mr-3 ${res.color} border border-white/5 group-hover:border-white/10`}>
                      <res.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-white group-hover:text-brand-400 transition-colors">{res.name}</p>
                      <p className="text-xs text-gray-400">{res.loc}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-400 group-hover:text-brand-500 text-sm font-medium transition-colors">
                    <MapPin className="w-3 h-3 mr-1" />
                    {res.dist}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-night-800 rounded-xl border border-white/5 p-6">
             <h3 className="text-lg font-bold text-white mb-4">Active Incident Log</h3>
             <div className="max-h-60 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {incidents.map((inc) => (
                  <div key={inc.id} className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/20 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        inc.type === 'MEDICAL' ? 'bg-red-500/20 text-red-500 border-red-500/20' :
                        inc.type === 'FIRE' ? 'bg-orange-500/20 text-orange-500 border-orange-500/20' :
                        'bg-blue-500/20 text-blue-500 border-blue-500/20'
                      }`}>
                        {inc.type}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">
                        {new Date(inc.reportedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <div className="flex items-center mt-1.5 mb-0.5 text-gray-300">
                         <MapPin className="w-3 h-3 mr-1 text-gray-500" />
                         <span className="text-sm font-medium">{inc.location}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">{inc.description}</p>
                    <div className="mt-2 pt-2 border-t border-white/5 text-xs flex items-center justify-end text-yellow-500 font-medium uppercase tracking-wider">
                      {inc.status}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyModule;
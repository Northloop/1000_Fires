
import React, { useState } from 'react';
import { 
  Shield, Users, Calendar, Radio, BarChart3, Clock, AlertCircle, 
  HeartPulse, Stethoscope, DoorOpen, Timer, Car, Hammer, Zap, 
  Fuel, Activity, ClipboardList, Flame, Truck, Map as MapIcon, 
  Moon, AlertTriangle, CheckCircle2, Grid, ArrowLeft, Droplets,
  AlertOctagon, Search, FileText, Scale, Eye, Thermometer,
  MoreHorizontal, Plus, Flag, Tent, Brain, Waves, Bike
} from 'lucide-react';
import { MOCK_DEPARTMENTS, MOCK_SHIFTS, MOCK_INCIDENTS, MOCK_CAMPS } from '../constants';
import { Department, UserRole } from '../types';
import { useUser } from '../context/UserContext';

// --- Local Mock Data for Specialized Views ---

const MOCK_PATIENTS = [
  { id: '842', loc: '4:30 & B', complaint: 'Heat Exhaustion', status: 'OBSERVATION', timeIn: '45m', acuity: 'yellow' },
  { id: '845', loc: 'Temple', complaint: 'Laceration (Foot)', status: 'TREATING', timeIn: '12m', acuity: 'green' },
  { id: '849', loc: 'Deep Playa', complaint: 'Unconscious', status: 'TRANSPORT', timeIn: '2m', acuity: 'red' },
];

const MOCK_WORK_ORDERS = [
    { id: 'W-102', title: 'Main Stage Power Dip', priority: 'CRITICAL', assigned: 'Sparky Team', time: '14m' },
    { id: 'W-105', title: 'Generator 4 Refuel', priority: 'NORMAL', assigned: 'Unassigned', time: '2h' },
    { id: 'W-109', title: 'Dust Abatement - Road 5', priority: 'HIGH', assigned: 'Water Truck 2', time: '30m' },
];

const MOCK_RED_TAGS = [
    { art: 'The Phoenix', issue: 'Propane Leak', inspector: 'Blaze', time: '1h ago' },
    { art: 'Sound Garden', issue: 'Unsecured Structure', inspector: 'Safety Team', time: '3h ago' },
];

const MOCK_DISPUTES = [
  { id: 'DP-01', camp: 'Camp Bass', issue: 'Encroaching on Emergency Lane', status: 'OPEN', priority: 'HIGH' },
  { id: 'DP-02', camp: 'Vegan Nightmare', issue: 'Power Grid Access Dispute', status: 'RESOLVED', priority: 'LOW' },
  { id: 'DP-03', camp: 'The Library', issue: 'Sound Bleed Complaint', status: 'OPEN', priority: 'MEDIUM' },
];

const MOCK_VEHICLES = [
  { id: 'MV-88', name: 'The Fur Bus', owner: 'Mike', type: 'Heavy', status: 'PASS_DAY', inspection: 'PENDING_NIGHT' },
  { id: 'MV-12', name: 'Disco Fish', owner: 'Sarah', type: 'Light', status: 'FAIL', inspection: 'RE_INSPECT' },
  { id: 'MV-99', name: 'Dust Glider', owner: 'Xavier', type: 'Light', status: 'PASS_ALL', inspection: 'COMPLETE' },
];

const MOCK_SANCTUARY_GUESTS = [
  { id: 'G-Alpha', timeIn: '2h 15m', status: 'RESTING', acuity: 'GREEN', needs: 'Water & Time' },
  { id: 'G-Beta', timeIn: '45m', status: 'ACTIVE', acuity: 'YELLOW', needs: 'De-escalation' },
];

const MOCK_RANGER_PATROLS = [
    { name: 'Dirt 1 (Alpha)', sector: 'Sector 2', status: 'PATROL', type: 'Dirt', radio: 'Ch 1' },
    { name: 'Dirt 4 (Bravo)', sector: 'Sector 4', status: 'INCIDENT', type: 'Dirt', radio: 'Ch 1' },
    { name: 'Khaki 9', sector: 'HQ', status: 'AVAILABLE', type: 'Khaki', radio: 'Ch 2' },
    { name: 'Green Dot 3', sector: 'Open Playa', status: 'PATROL', type: 'Echelon', radio: 'Ch 3' },
];

const DepartmentDashboard: React.FC = () => {
  const { activeMembership } = useUser();
  const [viewingDeptId, setViewingDeptId] = useState<string | null>(null);

  // 1. ACCESS CONTROL & CONTEXT RESOLUTION
  const isOrganizer = activeMembership?.role === UserRole.EVENT_ORGANIZER;
  
  // If Organizer, allow viewing any dept (Unified Command Mode)
  // If Dept Lead, force viewing their specific dept
  const targetDeptId = isOrganizer 
    ? (viewingDeptId || 'UNIFIED') 
    : activeMembership?.entityId;

  // Helper to get status colors
  const getStatusColor = (status: 'good' | 'warning' | 'critical') => {
      switch(status) {
          case 'good': return 'text-green-500 bg-green-500/10 border-green-500/20';
          case 'warning': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
          case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      }
  };

  const getDeptIcon = (type: string, className = "w-6 h-6") => {
    switch(type) {
        case 'MEDICAL': return <HeartPulse className={`${className} text-red-500`} />;
        case 'GATE': return <DoorOpen className={`${className} text-blue-500`} />;
        case 'LOGISTICS': return <Hammer className={`${className} text-orange-500`} />;
        case 'FIRE': return <Flame className={`${className} text-red-600`} />;
        case 'DMV': return <Truck className={`${className} text-yellow-500`} />;
        case 'PLACEMENT': return <MapIcon className={`${className} text-green-600`} />;
        case 'SANCTUARY': return <Moon className={`${className} text-purple-400`} />;
        case 'RANGERS': return <Eye className={`${className} text-green-500`} />;
        default: return <Shield className={`${className} text-gray-500`} />;
    }
  };

  // --- VIEW 1: UNIFIED COMMAND (ORGANIZER ONLY) ---
  if (targetDeptId === 'UNIFIED') {
      return (
          <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                  <div>
                      <h1 className="text-3xl font-bold text-white flex items-center">
                          <Activity className="w-8 h-8 mr-3 text-brand-500" />
                          Unified Command
                      </h1>
                      <p className="text-gray-400 mt-1">Event Operations Overview • {MOCK_DEPARTMENTS.length} Active Departments</p>
                  </div>
                  <div className="flex items-center space-x-4 bg-night-800 p-2 rounded-lg border border-white/10">
                      <div className="text-right px-2">
                          <p className="text-xs text-gray-500 uppercase font-bold">Total Personnel</p>
                          <p className="text-xl font-bold text-white">1,842</p>
                      </div>
                      <div className="h-8 w-px bg-white/10"></div>
                      <div className="text-right px-2">
                          <p className="text-xs text-gray-500 uppercase font-bold">Active Incidents</p>
                          <p className="text-xl font-bold text-red-500">{MOCK_INCIDENTS.filter(i => i.status !== 'RESOLVED').length}</p>
                      </div>
                  </div>
              </div>

              {/* Department Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {MOCK_DEPARTMENTS.map(dept => {
                      // Determine overall health based on stats
                      const criticals = dept.stats?.filter(s => s.status === 'critical').length || 0;
                      const warnings = dept.stats?.filter(s => s.status === 'warning').length || 0;
                      const statusColor = criticals > 0 ? 'border-red-500/50 shadow-red-900/20' : warnings > 0 ? 'border-yellow-500/50 shadow-yellow-900/20' : 'border-white/10';

                      return (
                          <button 
                            key={dept.id}
                            onClick={() => setViewingDeptId(dept.id)}
                            className={`bg-night-800 rounded-xl border p-5 text-left transition-all hover:scale-[1.02] hover:shadow-xl group relative overflow-hidden ${statusColor}`}
                          >
                              {criticals > 0 && <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full -mr-8 -mt-8 animate-pulse"></div>}
                              
                              <div className="flex justify-between items-start mb-4 relative z-10">
                                  <div className="bg-night-900 p-2 rounded-lg border border-white/5">
                                      {getDeptIcon(dept.type)}
                                  </div>
                                  <div className="text-right">
                                      <span className={`text-xs font-bold px-2 py-1 rounded border ${criticals > 0 ? 'bg-red-500/20 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                                          {criticals > 0 ? 'ALERT' : 'NOMINAL'}
                                      </span>
                                  </div>
                              </div>
                              
                              <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">{dept.name}</h3>
                              <p className="text-xs text-gray-500 mb-4">Lead: {dept.lead}</p>
                              
                              <div className="space-y-2">
                                  {dept.stats?.slice(0, 2).map((stat, idx) => (
                                      <div key={idx} className="flex justify-between text-sm">
                                          <span className="text-gray-400">{stat.label}</span>
                                          <span className={`font-medium ${stat.status === 'critical' ? 'text-red-500' : stat.status === 'warning' ? 'text-yellow-500' : 'text-white'}`}>
                                              {stat.value}
                                          </span>
                                      </div>
                                  ))}
                              </div>
                          </button>
                      );
                  })}
              </div>

              {/* High Level Alerts */}
              <div className="bg-night-800 rounded-xl border border-white/5 p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                      Cross-Department Alerts
                  </h3>
                  <div className="space-y-3">
                      <div className="flex items-start p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <AlertOctagon className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                          <div>
                              <p className="text-white font-bold text-sm">Severe Weather Inbound</p>
                              <p className="text-gray-400 text-xs">High wind advisory (40mph gusts). All depts secure infrastructure.</p>
                              <div className="mt-2 flex gap-2">
                                  <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">RANGERS</span>
                                  <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">ESD</span>
                                  <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">SITE OPS</span>
                              </div>
                          </div>
                      </div>
                       <div className="flex items-start p-3 bg-white/5 border border-white/10 rounded-lg">
                          <Truck className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                          <div>
                              <p className="text-white font-bold text-sm">Ice Delivery Delayed</p>
                              <p className="text-gray-400 text-xs">Main vendor truck stuck at Gate Lane 3. Expect 1hr delay on Artica resupply.</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // --- VIEW 2: SPECIFIC DEPARTMENT DASHBOARD ---
  const dept = MOCK_DEPARTMENTS.find(d => d.id === targetDeptId);
  const deptShifts = MOCK_SHIFTS.filter(s => s.departmentId === dept?.id);
  
  if (!dept) return <div>Department Not Found</div>;

  return (
    <div className="space-y-6">
      {/* Specific Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          {isOrganizer && (
              <button onClick={() => setViewingDeptId(null)} className="flex items-center text-sm text-gray-400 hover:text-white mb-2 transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back to Unified Command
              </button>
          )}
          <h1 className="text-3xl font-bold text-white flex items-center">
            {getDeptIcon(dept.type, "w-8 h-8 mr-3")}
            {dept.name} Command
          </h1>
          <p className="text-gray-400 mt-1">Operational Lead: {dept.lead}</p>
        </div>
        <div className="flex gap-2">
            <button className="bg-night-800 border border-white/10 hover:bg-white/5 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                <Radio className="w-4 h-4 mr-2" /> 
                <span className="hidden sm:inline">Dispatch Ch. {dept.type === 'MEDICAL' ? '1' : '5'}</span>
            </button>
            <button className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-brand-900/50">
                Manage Roster
            </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-night-800 p-5 rounded-xl border border-white/5">
          <p className="text-gray-400 text-xs uppercase tracking-wider">On Shift</p>
          <div className="flex justify-between items-end mt-2">
            <h3 className="text-2xl font-bold text-white">{dept.volunteerCount}</h3>
            <Users className="w-5 h-5 text-gray-500" />
          </div>
        </div>
        {dept.stats?.map((stat, idx) => (
            <div key={idx} className={`p-5 rounded-xl border ${getStatusColor(stat.status).replace('text-', 'border-').split(' ')[2]} bg-night-800`}>
                <p className="text-gray-400 text-xs uppercase tracking-wider">{stat.label}</p>
                <div className="flex justify-between items-end mt-2">
                    <h3 className={`text-2xl font-bold ${getStatusColor(stat.status).split(' ')[0]}`}>{stat.value}</h3>
                    {stat.status === 'critical' ? <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" /> : <Activity className="w-5 h-5 text-gray-600" />}
                </div>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAIN OPERATIONAL COLUMN (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* --- CUSTOM MODULE: MEDICAL --- */}
            {dept.type === 'MEDICAL' && (
                <div className="bg-night-800 rounded-xl border border-white/5 overflow-hidden">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-red-500/5">
                        <h3 className="font-bold text-white flex items-center">
                            <Stethoscope className="w-5 h-5 mr-2 text-red-500" /> 
                            Triage & Patient Board
                        </h3>
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/20">CONFIDENTIAL</span>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Acuity</th>
                                <th className="px-4 py-3">Complaint</th>
                                <th className="px-4 py-3">Location</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Time In</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {MOCK_PATIENTS.map(p => (
                                <tr key={p.id} className="hover:bg-white/5">
                                    <td className="px-4 py-3 font-mono text-gray-500">#{p.id}</td>
                                    <td className="px-4 py-3">
                                        <div className={`w-3 h-3 rounded-full ${p.acuity === 'red' ? 'bg-red-500 animate-pulse' : p.acuity === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                                    </td>
                                    <td className="px-4 py-3 font-medium text-white">{p.complaint}</td>
                                    <td className="px-4 py-3 text-gray-400">{p.loc}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs font-bold text-gray-300">
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-400 font-mono">{p.timeIn}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- CUSTOM MODULE: LOGISTICS / DPW --- */}
            {dept.type === 'LOGISTICS' && (
                <div className="space-y-6">
                    {/* Fuel & Water Telemetry */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-night-800 p-5 rounded-xl border border-white/5">
                             <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center"><Fuel className="w-4 h-4 mr-2" /> Fuel Reserves</h4>
                             <div className="space-y-4">
                                 <div>
                                     <div className="flex justify-between text-xs mb-1"><span className="text-white">Diesel (Main)</span> <span className="text-orange-500">68%</span></div>
                                     <div className="h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-orange-500 w-[68%]"></div></div>
                                 </div>
                                 <div>
                                     <div className="flex justify-between text-xs mb-1"><span className="text-white">Unleaded</span> <span className="text-green-500">92%</span></div>
                                     <div className="h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[92%]"></div></div>
                                 </div>
                             </div>
                        </div>
                        <div className="bg-night-800 p-5 rounded-xl border border-white/5">
                             <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center"><Droplets className="w-4 h-4 mr-2" /> Water Levels</h4>
                             <div className="space-y-4">
                                 <div>
                                     <div className="flex justify-between text-xs mb-1"><span className="text-white">Potable 1</span> <span className="text-blue-500">45%</span></div>
                                     <div className="h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[45%]"></div></div>
                                 </div>
                                 <div>
                                     <div className="flex justify-between text-xs mb-1"><span className="text-white">Potable 2</span> <span className="text-blue-500">80%</span></div>
                                     <div className="h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[80%]"></div></div>
                                 </div>
                             </div>
                        </div>
                    </div>
                    
                    {/* Work Orders */}
                    <div className="bg-night-800 rounded-xl border border-white/5 p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center">
                            <ClipboardList className="w-5 h-5 mr-2 text-orange-500" /> Active Work Tickets
                        </h3>
                        <div className="space-y-3">
                            {MOCK_WORK_ORDERS.map(wo => (
                                <div key={wo.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-lg hover:border-white/20 transition-colors">
                                    <div className="flex items-center">
                                        <div className={`p-2 rounded-lg mr-3 ${wo.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                            {wo.priority === 'CRITICAL' ? <Zap className="w-4 h-4" /> : <Hammer className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm">{wo.title}</p>
                                            <p className="text-xs text-gray-400">{wo.id} • {wo.assigned}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono text-gray-500">{wo.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

             {/* --- CUSTOM MODULE: GATE --- */}
             {dept.type === 'GATE' && (
                <div className="bg-night-800 rounded-xl border border-white/5 p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center">
                        <Car className="w-5 h-5 mr-2 text-blue-500" /> Live Lane Analysis
                    </h3>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {[
                            { name: 'Lane 1 (RV)', speed: 'Stopped', color: 'text-red-500', wait: '45m' },
                            { name: 'Lane 2 (Gen)', speed: 'Flowing', color: 'text-green-500', wait: '10m' },
                            { name: 'Lane 3 (Exp)', speed: 'Flowing', color: 'text-green-500', wait: '5m' }
                        ].map((lane, i) => (
                            <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/5 text-center">
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">{lane.name}</p>
                                <p className={`text-lg font-bold ${lane.color}`}>{lane.speed}</p>
                                <p className="text-xs text-gray-500 mt-1">Wait: {lane.wait}</p>
                            </div>
                        ))}
                    </div>
                    {/* Simulated Graph */}
                    <div className="h-40 bg-black/30 rounded-lg border border-white/5 relative flex items-end justify-between px-2 pb-0 overflow-hidden">
                        {[40, 60, 45, 70, 80, 50, 60, 90, 85, 70, 60, 50, 40, 30, 60, 75, 80, 95, 100, 90].map((h, i) => (
                            <div key={i} style={{ height: `${h}%` }} className="w-2 bg-blue-500/30 hover:bg-blue-500 rounded-t-sm transition-colors"></div>
                        ))}
                        <div className="absolute top-2 left-2 text-xs text-gray-500 font-mono">Vehicles / Hour (Last 4h)</div>
                    </div>
                </div>
            )}

            {/* --- CUSTOM MODULE: FIRE (FAST) --- */}
            {dept.type === 'FIRE' && (
                <div className="bg-night-800 rounded-xl border border-white/5 p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center">
                        <Flame className="w-5 h-5 mr-2 text-red-600" /> Art Safety Inspection Queue
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <h4 className="text-sm font-bold text-red-500 uppercase mb-3 flex items-center"><AlertOctagon className="w-4 h-4 mr-2" /> Red Tagged Items</h4>
                            <div className="space-y-2">
                                {MOCK_RED_TAGS.map((tag, i) => (
                                    <div key={i} className="flex justify-between items-center bg-black/40 p-2 rounded border border-red-500/10">
                                        <div>
                                            <p className="text-sm font-bold text-white">{tag.art}</p>
                                            <p className="text-xs text-red-400">Issue: {tag.issue}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400">{tag.inspector}</p>
                                            <p className="text-xs text-gray-500">{tag.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                             <h4 className="text-sm font-bold text-gray-300 uppercase mb-3">Pending Inspections</h4>
                             <div className="flex items-center justify-between py-2 border-b border-white/5">
                                 <span className="text-sm text-gray-300">The Golden Spiral</span>
                                 <button className="px-3 py-1 bg-brand-600 text-white text-xs rounded hover:bg-brand-500">Dispatch</button>
                             </div>
                             <div className="flex items-center justify-between py-2 border-b border-white/5">
                                 <span className="text-sm text-gray-300">Camp Inferno Stage</span>
                                 <button className="px-3 py-1 bg-brand-600 text-white text-xs rounded hover:bg-brand-500">Dispatch</button>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- CUSTOM MODULE: PLACEMENT --- */}
            {dept.type === 'PLACEMENT' && (
                <div className="space-y-6">
                    {/* Disputes */}
                    <div className="bg-night-800 rounded-xl border border-white/5 p-6">
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="font-bold text-white flex items-center">
                                <Scale className="w-5 h-5 mr-2 text-green-500" /> Land Disputes
                            </h3>
                            <button className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1 rounded text-white border border-white/10">
                                Log New
                            </button>
                        </div>
                        <div className="space-y-3">
                            {MOCK_DISPUTES.map((d, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-lg hover:border-white/20 transition-colors">
                                    <div className="flex items-center">
                                        <div className={`p-2 rounded-lg mr-3 ${d.priority === 'HIGH' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                            <AlertTriangle className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm">{d.camp}</p>
                                            <p className="text-xs text-gray-400">{d.issue}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${d.status === 'OPEN' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                                            {d.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mapping Stats */}
                    <div className="grid grid-cols-2 gap-4">
                         <div className="bg-night-800 p-5 rounded-xl border border-white/5">
                             <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Sectors Mapped</h4>
                             <div className="h-24 flex items-center justify-center relative">
                                  {/* Fake Donut Chart */}
                                  <svg viewBox="0 0 36 36" className="w-20 h-20 transform -rotate-90">
                                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#333" strokeWidth="3" />
                                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="92, 100" />
                                  </svg>
                                  <span className="absolute text-xl font-bold text-white">92%</span>
                             </div>
                         </div>
                         <div className="bg-night-800 p-5 rounded-xl border border-white/5 flex flex-col justify-center">
                             <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Camp Density</h4>
                             <p className="text-3xl font-bold text-white">1,204</p>
                             <p className="text-xs text-gray-500">Camps / Sq Mile</p>
                         </div>
                    </div>
                </div>
            )}

            {/* --- CUSTOM MODULE: DMV --- */}
            {dept.type === 'DMV' && (
                <div className="space-y-6">
                    <div className="bg-night-800 rounded-xl border border-white/5 p-6">
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="font-bold text-white flex items-center">
                                <Truck className="w-5 h-5 mr-2 text-yellow-500" /> Inspection Lanes
                            </h3>
                            <div className="flex space-x-2">
                                <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">Day Mode</span>
                            </div>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="px-3 py-2">ID</th>
                                    <th className="px-3 py-2">Vehicle</th>
                                    <th className="px-3 py-2">Type</th>
                                    <th className="px-3 py-2">Inspection</th>
                                    <th className="px-3 py-2 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {MOCK_VEHICLES.map((v, i) => (
                                    <tr key={i} className="hover:bg-white/5">
                                        <td className="px-3 py-3 text-gray-500 font-mono">{v.id}</td>
                                        <td className="px-3 py-3 font-bold text-white">{v.name} <span className="text-xs font-normal text-gray-500 block">{v.owner}</span></td>
                                        <td className="px-3 py-3 text-gray-300">{v.type}</td>
                                        <td className="px-3 py-3">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded ${v.inspection === 'COMPLETE' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                                {v.inspection}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 text-right">
                                            <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded">
                                                Process
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- CUSTOM MODULE: SANCTUARY --- */}
            {dept.type === 'SANCTUARY' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-night-800 p-5 rounded-xl border border-white/5">
                            <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Sitters Active</h4>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-bold text-purple-400">8</span>
                                <span className="text-sm text-gray-500 mb-1">/ 12 required</span>
                            </div>
                        </div>
                        <div className="bg-night-800 p-5 rounded-xl border border-white/5">
                            <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Capacity</h4>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-bold text-green-500">15%</span>
                                <span className="text-sm text-gray-500 mb-1">Utilization</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-night-800 rounded-xl border border-white/5 p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center">
                            <Moon className="w-5 h-5 mr-2 text-purple-400" /> Active Guests (Anonymized)
                        </h3>
                        <div className="space-y-3">
                            {MOCK_SANCTUARY_GUESTS.map((g, i) => (
                                <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-lg flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${g.acuity === 'GREEN' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                                        <div>
                                            <p className="font-bold text-white text-sm">Guest {g.id}</p>
                                            <p className="text-xs text-gray-400">Needs: {g.needs}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-mono text-gray-300">{g.timeIn}</p>
                                        <span className="text-[10px] text-gray-500">{g.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* --- CUSTOM MODULE: RANGERS --- */}
            {dept.type === 'RANGERS' && (
                <div className="space-y-6">
                    <div className="bg-night-800 rounded-xl border border-white/5 p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center">
                            <Eye className="w-5 h-5 mr-2 text-green-500" /> Active Patrols
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                             {MOCK_RANGER_PATROLS.map((p, i) => (
                                 <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                     <div className="flex items-center gap-2">
                                         <div className={`w-2 h-2 rounded-full ${p.status === 'INCIDENT' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                                         <div>
                                            <span className="text-sm font-bold text-white block">{p.name}</span>
                                            <span className="text-xs text-gray-500">{p.type} • {p.radio}</span>
                                         </div>
                                     </div>
                                     <span className="text-xs text-gray-400 font-mono">{p.sector}</span>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>
            )}

            {/* --- GENERIC SHIFT BOARD (Fallback for others or bottom of others) --- */}
            <div className="bg-night-800 rounded-xl border border-white/5 flex flex-col h-[500px]">
                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bold text-white flex items-center">
                        <Calendar className="w-4 h-4 mr-2" /> 
                        Shift Roster
                    </h3>
                    <button className="text-xs text-brand-500 hover:text-white transition-colors">View Full Schedule</button>
                </div>
                <div className="p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                    {deptShifts.length > 0 ? deptShifts.map(shift => (
                        <div key={shift.id} className="bg-night-900 border border-white/10 p-4 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 group hover:border-brand-500/50 transition-colors">
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className="font-bold text-white truncate">{shift.role}</span>
                                    {shift.requiredSkills?.map(skill => (
                                        <span key={skill} className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300 whitespace-nowrap">{skill}</span>
                                    ))}
                                </div>
                                <div className="text-sm text-gray-400 flex items-center">
                                    <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                                    <span className="truncate">{shift.time}</span>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                {shift.filled ? (
                                    <div className="flex items-center bg-night-800 py-1.5 px-3 rounded-full border border-white/5">
                                        <div className="w-6 h-6 rounded-full bg-gray-700 mr-2 flex items-center justify-center text-xs font-bold text-white">
                                            {shift.volunteerName?.charAt(0)}
                                        </div>
                                        <span className="text-sm text-gray-300 font-medium">{shift.volunteerName}</span>
                                    </div>
                                ) : (
                                    <button className="w-full sm:w-auto text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/30 px-4 py-2 rounded hover:bg-red-500/20 transition-colors">
                                        Assign
                                    </button>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <Calendar className="w-12 h-12 mb-3 opacity-20" />
                            <p>No shifts scheduled today.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* SIDEBAR COLUMN (1/3 width) - Resources & Actions */}
        <div className="space-y-6">
            <div className="bg-night-800 rounded-xl border border-white/5 p-6">
                <h3 className="font-bold text-white mb-6">
                    {dept.type === 'MEDICAL' ? 'Critical Supplies' : 'Asset Tracking'}
                </h3>
                <div className="space-y-6">
                    {dept.type === 'MEDICAL' ? (
                        <>
                             <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex justify-between text-sm mb-2 font-medium">
                                    <span className="text-gray-300">Oxygen (D-Cyl)</span>
                                    <span className="text-red-500 font-bold">CRITICAL</span>
                                </div>
                                <div className="w-full bg-black/50 h-2.5 rounded-full overflow-hidden border border-white/5">
                                    <div className="bg-red-500 h-full w-[15%] animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                </div>
                                <p className="text-xs text-red-500 mt-2 text-right">2/15 Remaining</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex justify-between text-sm mb-2 font-medium">
                                    <span className="text-gray-300">IV Fluids (Lactated)</span>
                                    <span className="text-green-500">Good</span>
                                </div>
                                <div className="w-full bg-black/50 h-2.5 rounded-full overflow-hidden border border-white/5">
                                    <div className="bg-green-500 h-full w-[85%]"></div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex justify-between text-sm mb-2 font-medium">
                                    <span className="text-gray-300">Handheld Radios</span>
                                    <span className="text-white">42 / 50</span>
                                </div>
                                <div className="w-full bg-black/50 h-2.5 rounded-full overflow-hidden border border-white/5">
                                    <div className="bg-yellow-500 h-full w-[84%]"></div>
                                </div>
                                <p className="text-xs text-yellow-500 mt-2 text-right">84% Utilized</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex justify-between text-sm mb-2 font-medium">
                                    <span className="text-gray-300">Golf Carts</span>
                                    <span className="text-white">4 / 4</span>
                                </div>
                                <div className="w-full bg-black/50 h-2.5 rounded-full overflow-hidden border border-white/5">
                                    <div className="bg-red-500 h-full w-full"></div>
                                </div>
                                <p className="text-xs text-red-500 mt-2 text-right">100% Utilized</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="bg-night-800 rounded-xl border border-white/5 p-6">
                <h3 className="font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                    <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-200 font-medium transition-colors text-left px-4 flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-2 text-gray-500" />
                        Log Operations Note
                    </button>
                    <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-200 font-medium transition-colors text-left px-4 flex items-center">
                        <Search className="w-4 h-4 mr-2 text-gray-500" />
                        Find Volunteer
                    </button>
                    <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-200 font-medium transition-colors text-left px-4 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2 text-gray-500" />
                        Request Supply Restock
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;

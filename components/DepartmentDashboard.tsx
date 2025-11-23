
import React from 'react';
import { Shield, Users, Calendar, Radio, BarChart3, Clock, AlertCircle, HeartPulse, Stethoscope, DoorOpen, Timer, Car, Hammer, Zap, Fuel, Activity, ClipboardList, Flame, Truck, Map, Moon, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { MOCK_DEPARTMENTS, MOCK_SHIFTS } from '../constants';
import { Department, Shift } from '../types';
import { useUser } from '../context/UserContext';

const DepartmentDashboard: React.FC = () => {
  const { activeMembership } = useUser();
  
  // Dynamic Department Selection based on Context
  const dept = MOCK_DEPARTMENTS.find(d => d.id === activeMembership?.entityId) || MOCK_DEPARTMENTS[0];
  const deptShifts = MOCK_SHIFTS.filter(s => s.departmentId === dept.id);

  // Helper for Status Colors
  const getStatusColor = (status: 'good' | 'warning' | 'critical') => {
      switch(status) {
          case 'good': return 'text-green-500 bg-green-500/10 border-green-500/20';
          case 'warning': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
          case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      }
  };

  const getDepartmentIcon = () => {
    switch(dept.type) {
        case 'MEDICAL': return <HeartPulse className="w-8 h-8 mr-3 text-red-500" />;
        case 'GATE': return <DoorOpen className="w-8 h-8 mr-3 text-blue-500" />;
        case 'LOGISTICS': return <Hammer className="w-8 h-8 mr-3 text-orange-500" />;
        case 'FIRE': return <Flame className="w-8 h-8 mr-3 text-red-600" />;
        case 'DMV': return <Truck className="w-8 h-8 mr-3 text-yellow-500" />;
        case 'PLACEMENT': return <Map className="w-8 h-8 mr-3 text-green-600" />;
        case 'SANCTUARY': return <Moon className="w-8 h-8 mr-3 text-purple-400" />;
        default: return <Shield className="w-8 h-8 mr-3 text-green-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            {getDepartmentIcon()}
            {dept.name} Command
          </h1>
          <p className="text-gray-400 mt-1">Lead: {dept.lead}</p>
        </div>
        <div className="flex gap-2">
            <button className="bg-night-800 border border-white/10 hover:bg-white/5 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                <Radio className="w-4 h-4 mr-2" /> Broadcast
            </button>
            <button className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-brand-900/50">
                Manage Roster
            </button>
        </div>
      </div>

      {/* SPECIALIZED METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Common Metric for All */}
        <div className="bg-night-800 p-5 rounded-xl border border-white/5">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Active Volunteers</p>
          <div className="flex justify-between items-end mt-2">
            <h3 className="text-2xl font-bold text-white">{dept.volunteerCount}</h3>
            <Users className="w-5 h-5 text-gray-500" />
          </div>
        </div>

        {/* Dynamic Metrics */}
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
        
        {/* Column 1 & 2: Main Operational View */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* MEDICAL SPECIFIC VIEW */}
            {dept.type === 'MEDICAL' && (
                <div className="bg-night-800 rounded-xl border border-white/5 p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center">
                        <Stethoscope className="w-5 h-5 mr-2 text-red-500" /> Active Patient Board
                    </h3>
                    <div className="overflow-hidden rounded-lg border border-white/10">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Location</th>
                                    <th className="px-4 py-3">Chief Complaint</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Time In</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <tr className="hover:bg-white/5">
                                    <td className="px-4 py-3 font-mono text-gray-400">#842</td>
                                    <td className="px-4 py-3">4:30 & B</td>
                                    <td className="px-4 py-3 text-white">Dehydration / Heat</td>
                                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-500 text-xs font-bold border border-yellow-500/20">OBSERVATION</span></td>
                                    <td className="px-4 py-3 text-right text-gray-400">45m</td>
                                </tr>
                                <tr className="hover:bg-white/5">
                                    <td className="px-4 py-3 font-mono text-gray-400">#843</td>
                                    <td className="px-4 py-3">Deep Playa</td>
                                    <td className="px-4 py-3 text-white">Laceration (Foot)</td>
                                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-green-500/20 text-green-500 text-xs font-bold border border-green-500/20">TREATING</span></td>
                                    <td className="px-4 py-3 text-right text-gray-400">12m</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* GATE SPECIFIC VIEW */}
            {dept.type === 'GATE' && (
                <div className="bg-night-800 rounded-xl border border-white/5 p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center">
                        <Car className="w-5 h-5 mr-2 text-blue-500" /> Lane Throughput Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {['Lane 1 (RV)', 'Lane 2 (Gen)', 'Lane 3 (Exp)'].map((lane, i) => (
                            <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/5">
                                <p className="text-xs text-gray-400 uppercase font-bold">{lane}</p>
                                <p className={`text-xl font-bold mt-1 ${i === 2 ? 'text-green-500' : 'text-white'}`}>
                                    {i === 0 ? 'Stopped' : 'Flowing'}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">{i === 0 ? 'Wait: 25m' : 'Wait: 5m'}</p>
                            </div>
                        ))}
                    </div>
                    <div className="h-40 bg-black/30 rounded-lg flex items-center justify-center border border-white/5 text-gray-500 text-sm">
                        [Throughput Chart Visualization Placeholder]
                    </div>
                </div>
            )}

             {/* OPS SPECIFIC VIEW */}
             {dept.type === 'LOGISTICS' && (
                <div className="bg-night-800 rounded-xl border border-white/5 p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center">
                        <ClipboardList className="w-5 h-5 mr-2 text-orange-500" /> Active Work Orders
                    </h3>
                    <div className="space-y-3">
                         <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                             <div className="flex items-center">
                                 <Zap className="w-5 h-5 text-red-500 mr-3" />
                                 <div>
                                     <p className="font-bold text-white">Main Stage Power Failure</p>
                                     <p className="text-xs text-red-400">Assigned: Sparky Team • Priority: Critical</p>
                                 </div>
                             </div>
                             <span className="text-xs font-mono text-gray-400">14m ago</span>
                         </div>
                         <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                             <div className="flex items-center">
                                 <Fuel className="w-5 h-5 text-orange-500 mr-3" />
                                 <div>
                                     <p className="font-bold text-white">Refuel Generator 4</p>
                                     <p className="text-xs text-gray-400">Assigned: Unassigned • Priority: Normal</p>
                                 </div>
                             </div>
                             <span className="text-xs font-mono text-gray-400">2h ago</span>
                         </div>
                    </div>
                </div>
            )}

            {/* FAST (FIRE) SPECIFIC VIEW */}
            {dept.type === 'FIRE' && (
                <div className="bg-night-800 rounded-xl border border-white/5 p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center">
                        <Flame className="w-5 h-5 mr-2 text-red-500" /> Fire Art Safety Inspection Queue
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <h4 className="text-sm font-bold text-gray-300 uppercase mb-3">Pending Inspections</h4>
                            <div className="space-y-2">
                                {['The Phoenix Rises', 'Eternal Flame Garden', 'Dragon Wagon'].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center bg-black/20 p-2 rounded">
                                        <span className="text-sm text-white">{item}</span>
                                        <button className="text-xs bg-brand-600 hover:bg-brand-500 text-white px-2 py-1 rounded">
                                            Inspect
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                             <h4 className="text-sm font-bold text-gray-300 uppercase mb-3">Perimeter Status</h4>
                             <div className="flex items-center justify-between mb-2">
                                 <span className="text-sm text-gray-400">Effigy</span>
                                 <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">SECURE</span>
                             </div>
                             <div className="flex items-center justify-between mb-2">
                                 <span className="text-sm text-gray-400">Temple</span>
                                 <span className="text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">PREP</span>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* DMV SPECIFIC VIEW */}
            {dept.type === 'DMV' && (
                <div className="bg-night-800 rounded-xl border border-white/5 p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center">
                        <Truck className="w-5 h-5 mr-2 text-yellow-500" /> Vehicle Inspection Lanes
                    </h3>
                    <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10 mb-4">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-500/20 rounded-full mr-3 text-green-500"><Truck className="w-5 h-5"/></div>
                            <div>
                                <p className="text-lg font-bold text-white">Line A: Active</p>
                                <p className="text-xs text-gray-400">Processing Speed: 5 mins/vehicle</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-2xl font-bold text-white">5</p>
                             <p className="text-xs text-gray-500 uppercase">Vehicles Waiting</p>
                        </div>
                    </div>
                    <div className="h-32 bg-black/30 rounded-lg flex items-center justify-center border border-white/5 text-gray-500 text-sm">
                        [Vehicle Type Distribution Chart]
                    </div>
                </div>
            )}

            {/* SANCTUARY SPECIFIC VIEW */}
            {dept.type === 'SANCTUARY' && (
                <div className="bg-night-800 rounded-xl border border-white/5 p-6 border-l-4 border-l-purple-500">
                     <h3 className="font-bold text-white mb-4 flex items-center">
                        <Moon className="w-5 h-5 mr-2 text-purple-400" /> Sanctuary Status Board
                    </h3>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg text-center">
                            <p className="text-xs text-purple-300 uppercase">Green Zone</p>
                            <p className="text-2xl font-bold text-white">12</p>
                            <p className="text-[10px] text-gray-400">Resting</p>
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg text-center">
                            <p className="text-xs text-yellow-300 uppercase">Yellow Zone</p>
                            <p className="text-2xl font-bold text-white">3</p>
                            <p className="text-[10px] text-gray-400">Active Support</p>
                        </div>
                         <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg text-center">
                            <p className="text-xs text-red-300 uppercase">Red Zone</p>
                            <p className="text-2xl font-bold text-white">0</p>
                            <p className="text-[10px] text-gray-400">Medical Transfer</p>
                        </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg flex justify-between items-center">
                        <span className="text-sm text-gray-300">Shift Lead on Duty:</span>
                        <span className="text-sm font-bold text-white">Sage (Radio Ch 4)</span>
                    </div>
                </div>
            )}

            {/* Shift Board (Common to all, but styled) */}
            <div className="bg-night-800 rounded-xl border border-white/5 flex flex-col h-[500px]">
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center">
                    <Calendar className="w-4 h-4 mr-2" /> 
                    {dept.type === 'MEDICAL' || dept.type === 'SANCTUARY' ? 'Clinical Roster' : 'Shift Schedule'}
                </h3>
                <div className="flex space-x-2 text-xs">
                    <span className="flex items-center px-2 py-1 bg-green-500/10 text-green-500 rounded border border-green-500/20">Filled</span>
                    <span className="flex items-center px-2 py-1 bg-red-500/10 text-red-500 rounded border border-red-500/20">Open</span>
                </div>
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
                                    <img src={`https://ui-avatars.com/api/?name=${shift.volunteerName}&background=random`} alt="" className="w-6 h-6 rounded-full mr-2 border border-white/10" />
                                    <span className="text-sm text-gray-300 font-medium">{shift.volunteerName}</span>
                                </div>
                            ) : (
                                <button className="w-full sm:w-auto text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/30 px-4 py-2 rounded hover:bg-red-500/20 transition-colors">
                                    Assign Volunteer
                                </button>
                            )}
                        </div>
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <Calendar className="w-12 h-12 mb-3 opacity-20" />
                        <p>No shifts scheduled for this department.</p>
                    </div>
                )}
            </div>
            </div>
        </div>

        {/* Column 3: Resources & Assets */}
        <div className="space-y-6">
            <div className="bg-night-800 rounded-xl border border-white/5 p-6">
                <h3 className="font-bold text-white mb-6">
                    {dept.type === 'MEDICAL' || dept.type === 'SANCTUARY' ? 'Medical Supplies' : 'Department Assets'}
                </h3>
                <div className="space-y-6">
                    {dept.type === 'MEDICAL' ? (
                        <>
                             <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex justify-between text-sm mb-2 font-medium">
                                    <span className="text-gray-300">Oxygen Tanks</span>
                                    <span className="text-red-500 font-bold">CRITICAL</span>
                                </div>
                                <div className="w-full bg-black/50 h-2.5 rounded-full overflow-hidden border border-white/5">
                                    <div className="bg-red-500 h-full w-[15%] animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                </div>
                                <p className="text-xs text-red-500 mt-2 text-right">2/15 Remaining</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex justify-between text-sm mb-2 font-medium">
                                    <span className="text-gray-300">IV Kits</span>
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
                                    <div className="bg-yellow-500 h-full w-[84%] shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                                </div>
                                <p className="text-xs text-yellow-500 mt-2 text-right">84% Utilized</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex justify-between text-sm mb-2 font-medium">
                                    <span className="text-gray-300">Golf Carts</span>
                                    <span className="text-white">4 / 4</span>
                                </div>
                                <div className="w-full bg-black/50 h-2.5 rounded-full overflow-hidden border border-white/5">
                                    <div className="bg-red-500 h-full w-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                </div>
                                <p className="text-xs text-red-500 mt-2 text-right">Critical Usage</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="bg-night-800 rounded-xl border border-white/5 p-6">
                <h3 className="font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                    <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-200 font-medium transition-colors text-left px-4">
                        {dept.type === 'MEDICAL' ? 'Log New Patient' : 'Log Incident'}
                    </button>
                    <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-200 font-medium transition-colors text-left px-4">
                        View {dept.name} Budget
                    </button>
                    <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-200 font-medium transition-colors text-left px-4">
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

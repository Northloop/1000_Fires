import React from 'react';
import { Shield, Users, Calendar, Radio, BarChart3, Clock, AlertCircle } from 'lucide-react';
import { MOCK_DEPARTMENTS, MOCK_SHIFTS } from '../constants';
import { Department, Shift } from '../types';

const DepartmentDashboard: React.FC = () => {
  // Mock selecting the first department (Rangers)
  const myDept: Department = MOCK_DEPARTMENTS[0]; 
  const deptShifts: Shift[] = MOCK_SHIFTS.filter(s => s.departmentId === myDept.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Shield className="w-8 h-8 mr-3 text-brand-500" />
            {myDept.name} Command
          </h1>
          <p className="text-gray-400 mt-1">Lead: {myDept.lead}</p>
        </div>
        <div className="flex gap-2">
            <button className="bg-night-800 border border-white/10 hover:bg-white/5 text-white px-4 py-2 rounded-lg flex items-center">
                <Radio className="w-4 h-4 mr-2" /> Broadcast
            </button>
            <button className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-medium">
                Manage Roster
            </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-night-800 p-5 rounded-xl border border-white/5">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Active Volunteers</p>
          <div className="flex justify-between items-end mt-2">
            <h3 className="text-2xl font-bold text-white">{myDept.volunteerCount}</h3>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
        </div>
        <div className="bg-night-800 p-5 rounded-xl border border-white/5">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Shift Fill Rate</p>
          <div className="flex justify-between items-end mt-2">
            <h3 className="text-2xl font-bold text-green-500">{myDept.shiftFillRate}%</h3>
            <BarChart3 className="w-5 h-5 text-green-500" />
          </div>
        </div>
        <div className="bg-night-800 p-5 rounded-xl border border-white/5">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Radio Checkouts</p>
          <div className="flex justify-between items-end mt-2">
            <h3 className="text-2xl font-bold text-yellow-500">42/50</h3>
            <Radio className="w-5 h-5 text-yellow-500" />
          </div>
        </div>
        <div className="bg-night-800 p-5 rounded-xl border border-white/5">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Pending Incidents</p>
          <div className="flex justify-between items-end mt-2">
            <h3 className="text-2xl font-bold text-red-500">3</h3>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shift Board */}
        <div className="lg:col-span-2 bg-night-800 rounded-xl border border-white/5 flex flex-col h-[600px]">
          <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-white flex items-center">
                <Calendar className="w-4 h-4 mr-2" /> Upcoming Shifts
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
             {/* Filler Data for visual density */}
             {[1, 2, 3].map((_, i) => (
                <div key={i} className="bg-night-900 border border-white/10 p-4 rounded-lg flex justify-between items-center opacity-40">
                    <div>
                        <div className="font-bold text-white mb-1">Ranger (Dirt) - Slot {i+1}</div>
                        <div className="text-sm text-gray-400">Fri 2:00 PM - 6:00 PM</div>
                    </div>
                    <div className="text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/30 px-3 py-1 rounded">Assign</div>
                </div>
             ))}
          </div>
        </div>

        {/* Resources / Assets */}
        <div className="bg-night-800 rounded-xl border border-white/5 p-6 h-fit">
            <h3 className="font-bold text-white mb-6">Department Assets</h3>
            <div className="space-y-6">
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

                <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                    <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-gray-300">First Aid Kits</span>
                        <span className="text-white">12 / 15</span>
                    </div>
                    <div className="w-full bg-black/50 h-2.5 rounded-full overflow-hidden border border-white/5">
                        <div className="bg-green-500 h-full w-[80%] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                    </div>
                    <p className="text-xs text-green-500 mt-2 text-right">Healthy Supply</p>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                    <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-200 font-medium transition-colors">
                        View Incident Map
                    </button>
                    <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-200 font-medium transition-colors">
                        Department Budget
                    </button>
                    <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-200 font-medium transition-colors">
                        Asset Checkout Logs
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;
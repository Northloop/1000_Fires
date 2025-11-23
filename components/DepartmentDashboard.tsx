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
        <div className="lg:col-span-2 bg-night-800 rounded-xl border border-white/5 flex flex-col h-[500px]">
          <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-white flex items-center">
                <Calendar className="w-4 h-4 mr-2" /> Upcoming Shifts
            </h3>
            <div className="flex space-x-2 text-xs">
                <span className="flex items-center px-2 py-1 bg-green-500/10 text-green-500 rounded border border-green-500/20">Filled</span>
                <span className="flex items-center px-2 py-1 bg-red-500/10 text-red-500 rounded border border-red-500/20">Open</span>
            </div>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto flex-1">
            {deptShifts.length > 0 ? deptShifts.map(shift => (
                <div key={shift.id} className="bg-night-900 border border-white/10 p-4 rounded-lg flex justify-between items-center group hover:border-brand-500/50 transition-colors">
                    <div>
                        <div className="flex items-center mb-1">
                            <span className="font-bold text-white mr-2">{shift.role}</span>
                            {shift.requiredSkills?.map(skill => (
                                <span key={skill} className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300">{skill}</span>
                            ))}
                        </div>
                        <div className="text-sm text-gray-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {shift.time}
                        </div>
                    </div>
                    <div>
                        {shift.filled ? (
                             <div className="flex items-center">
                                <img src={`https://ui-avatars.com/api/?name=${shift.volunteerName}&background=random`} alt="" className="w-6 h-6 rounded-full mr-2" />
                                <span className="text-sm text-gray-300">{shift.volunteerName}</span>
                             </div>
                        ) : (
                            <button className="text-xs bg-red-500/10 text-red-500 border border-red-500/30 px-3 py-1 rounded hover:bg-red-500/20">
                                Assign
                            </button>
                        )}
                    </div>
                </div>
            )) : (
                <div className="text-center text-gray-500 mt-10">No shifts scheduled for this department.</div>
            )}
             {/* Filler Data for visual density */}
             <div className="bg-night-900 border border-white/10 p-4 rounded-lg flex justify-between items-center opacity-50">
                <div>
                    <div className="font-bold text-white mb-1">Ranger (Dirt)</div>
                    <div className="text-sm text-gray-400">Fri 2:00 PM - 6:00 PM</div>
                </div>
                <div className="text-xs bg-red-500/10 text-red-500 border border-red-500/30 px-3 py-1 rounded">Assign</div>
             </div>
             <div className="bg-night-900 border border-white/10 p-4 rounded-lg flex justify-between items-center opacity-50">
                <div>
                    <div className="font-bold text-white mb-1">Ranger (HQ)</div>
                    <div className="text-sm text-gray-400">Fri 2:00 PM - 6:00 PM</div>
                </div>
                <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-600 mr-2"></div>
                    <span className="text-sm text-gray-300">Mike R.</span>
                </div>
             </div>
          </div>
        </div>

        {/* Resources / Assets */}
        <div className="bg-night-800 rounded-xl border border-white/5 p-6">
            <h3 className="font-bold text-white mb-4">Department Assets</h3>
            <div className="space-y-4">
                <div className="p-3 bg-white/5 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Handheld Radios</span>
                        <span className="text-white font-bold">42/50</span>
                    </div>
                    <div className="w-full bg-black h-2 rounded-full overflow-hidden">
                        <div className="bg-yellow-500 h-full w-[84%]"></div>
                    </div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Golf Carts</span>
                        <span className="text-white font-bold">4/4</span>
                    </div>
                    <div className="w-full bg-black h-2 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full w-full"></div>
                    </div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">First Aid Kits</span>
                        <span className="text-white font-bold">12/15</span>
                    </div>
                    <div className="w-full bg-black h-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-[80%]"></div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                    <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300">
                        View Incident Map
                    </button>
                    <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300">
                        Department Budget
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;
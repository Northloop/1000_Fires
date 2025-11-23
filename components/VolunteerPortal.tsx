
import React, { useState } from 'react';
import { Calendar, Filter, CheckCircle2, Clock, MapPin, Search } from 'lucide-react';
import { MOCK_SHIFTS, MOCK_DEPARTMENTS } from '../constants';
import { useUser } from '../context/UserContext';

const VolunteerPortal: React.FC = () => {
  const { user } = useUser();
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'browse' | 'my-shifts'>('browse');

  const availableShifts = MOCK_SHIFTS.filter(s => !s.filled);
  const myShifts = MOCK_SHIFTS.filter(s => s.filled && s.volunteerName?.includes('Val')); // Mock "My Shifts"

  const filteredShifts = departmentFilter === 'ALL' 
    ? availableShifts 
    : availableShifts.filter(s => s.departmentId === departmentFilter);

  const getDeptName = (id: string) => MOCK_DEPARTMENTS.find(d => d.id === id)?.name || 'General';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Volunteer Portal</h1>
          <p className="text-gray-400 mt-1">Join the team that makes the burn happen.</p>
        </div>
        <div className="flex bg-night-800 rounded-lg p-1 border border-white/5">
          <button 
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'browse' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Browse Opportunities
          </button>
          <button 
            onClick={() => setActiveTab('my-shifts')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'my-shifts' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            My Shifts
          </button>
        </div>
      </div>

      {activeTab === 'browse' && (
        <>
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setDepartmentFilter('ALL')}
              className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${departmentFilter === 'ALL' ? 'bg-white text-night-900 border-white' : 'bg-night-800 border-white/10 text-gray-400 hover:border-white/30'}`}
            >
              All Departments
            </button>
            {MOCK_DEPARTMENTS.map(dept => (
              <button
                key={dept.id}
                onClick={() => setDepartmentFilter(dept.id)}
                className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${departmentFilter === dept.id ? 'bg-white text-night-900 border-white' : 'bg-night-800 border-white/10 text-gray-400 hover:border-white/30'}`}
              >
                {dept.name}
              </button>
            ))}
          </div>

          {/* Shift List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredShifts.map(shift => (
              <div key={shift.id} className="bg-night-800 border border-white/5 p-5 rounded-xl hover:border-brand-500/50 transition-all group">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">{getDeptName(shift.departmentId)}</span>
                    <h3 className="text-lg font-bold text-white mt-1 group-hover:text-brand-400 transition-colors">{shift.role}</h3>
                  </div>
                  {shift.requiredSkills && (
                    <div className="flex gap-1">
                      {shift.requiredSkills.map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-gray-300 border border-white/5">{skill}</span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center text-gray-400 text-sm mt-3">
                  <Clock className="w-4 h-4 mr-2" />
                  {shift.time}
                </div>
                
                <button className="w-full mt-4 bg-white/5 hover:bg-brand-600 hover:text-white text-gray-300 py-2 rounded-lg font-medium transition-colors border border-white/10 hover:border-brand-500">
                  Sign Up
                </button>
              </div>
            ))}
            
            {filteredShifts.length === 0 && (
              <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-xl bg-night-800/50">
                <p className="text-gray-500">No open shifts found for this filter.</p>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'my-shifts' && (
        <div className="space-y-4">
           {myShifts.length > 0 ? myShifts.map(shift => (
             <div key={shift.id} className="bg-brand-900/10 border border-brand-500/20 p-5 rounded-xl flex justify-between items-center">
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">{getDeptName(shift.departmentId)}</span>
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-[10px] font-bold rounded flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> CONFIRMED
                      </span>
                   </div>
                   <h3 className="text-lg font-bold text-white">{shift.role}</h3>
                   <div className="flex items-center text-gray-400 text-sm mt-1">
                      <Clock className="w-4 h-4 mr-2" />
                      {shift.time}
                   </div>
                </div>
                <button className="text-sm text-red-500 hover:text-red-400 hover:underline">
                  Cancel Shift
                </button>
             </div>
           )) : (
             <div className="py-12 text-center border border-dashed border-white/10 rounded-xl bg-night-800/50">
                <Calendar className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                <h3 className="text-lg font-bold text-white">No Shifts Scheduled</h3>
                <p className="text-gray-500 mt-1">You haven't signed up for any shifts yet.</p>
                <button onClick={() => setActiveTab('browse')} className="mt-4 text-brand-500 font-medium hover:underline">
                  Browse Opportunities
                </button>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default VolunteerPortal;

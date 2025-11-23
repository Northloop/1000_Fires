
import React, { useState } from 'react';
import { 
  Users, 
  ClipboardCheck, 
  Wallet, 
  Settings, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock,
  MoreVertical,
  Trash2,
  Package,
  Wrench,
  Mail
} from 'lucide-react';
import { MOCK_SHIFTS, MOCK_TASKS, MOCK_CAMPS, MOCK_CAMP_MEMBERS, MOCK_CAMP_ASSETS } from '../constants';
import { canEditCamp, canViewFinances } from '../lib/rbac';
import FinanceModule from './FinanceModule';
import LNTModule from './LNTModule';
import { useUser } from '../context/UserContext';

const CampManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'roster' | 'tasks' | 'budget' | 'lnt' | 'inventory'>('tasks');
  const camp = MOCK_CAMPS[0]; // Camp Entropy
  const { user } = useUser();

  if (!user) return null;

  const canEdit = canEditCamp(user);
  const canSeeFinances = canViewFinances(user);

  return (
    <div className="space-y-6">
      {/* Camp Header */}
      <div className="bg-gradient-to-r from-brand-900 to-night-800 rounded-2xl p-6 border border-white/10 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{camp.name}</h1>
              <p className="text-brand-200 mt-1">{camp.description}</p>
              <div className="flex items-center mt-4 text-sm text-gray-300 space-x-4">
                <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> {camp.members} Members</span>
                <span className="flex items-center"><Wallet className="w-4 h-4 mr-1" /> ${camp.budgetSpent} / ${camp.budgetTotal}</span>
                <span className="flex items-center"><Trash2 className="w-4 h-4 mr-1" /> LNT: {camp.moopScore}/100</span>
              </div>
            </div>
            <div className="flex space-x-3">
               {canEdit && (
                <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-colors backdrop-blur-sm">
                  Edit Profile
                </button>
               )}
              <button className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-brand-900/50">
                Invite Member
              </button>
            </div>
          </div>
        </div>
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Overview', icon: Settings, allowed: true },
          { id: 'tasks', label: 'Tasks & Shifts', icon: ClipboardCheck, allowed: true },
          { id: 'roster', label: 'Roster', icon: Users, allowed: true },
          { id: 'inventory', label: 'Inventory', icon: Package, allowed: true },
          { id: 'budget', label: 'Finances', icon: Wallet, allowed: canSeeFinances },
          { id: 'lnt', label: 'LNT & Cleanup', icon: Trash2, allowed: true },
        ].map((tab) => {
            if (!tab.allowed) return null;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0
                  ${activeTab === tab.id 
                    ? 'border-brand-500 text-brand-500' 
                    : 'border-transparent text-gray-400 hover:text-white hover:border-white/10'}
                `}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            )
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'tasks' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Task Board */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Tasks</h3>
                <button className="text-sm text-brand-500 flex items-center hover:text-brand-400">
                  <Plus className="w-4 h-4 mr-1" /> Add Task
                </button>
              </div>
              <div className="bg-night-800 rounded-xl border border-white/5 overflow-hidden">
                {MOCK_TASKS.map((task, idx) => (
                  <div key={task.id} className={`p-4 flex items-center ${idx !== MOCK_TASKS.length - 1 ? 'border-b border-white/5' : ''}`}>
                    <button className={`mr-4 ${task.status === 'DONE' ? 'text-green-500' : 'text-gray-600'}`}>
                      {task.status === 'DONE' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${task.status === 'DONE' ? 'text-gray-500 line-through' : 'text-white'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-gray-500">{task.assignee}</span>
                        {task.priority === 'HIGH' && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded">HIGH</span>
                        )}
                      </div>
                    </div>
                    <button className="text-gray-500 hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Shifts */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Upcoming Shifts</h3>
                <button className="text-sm text-brand-500 flex items-center hover:text-brand-400">
                  <Plus className="w-4 h-4 mr-1" /> Create Shift
                </button>
              </div>
              <div className="space-y-3">
                {MOCK_SHIFTS.filter(s => s.role !== 'Ranger (Shift Lead)' && s.role !== 'Ranger (Patrol)').map((shift) => (
                  <div key={shift.id} className="bg-night-800 p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-white">{shift.role}</h4>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <Clock className="w-4 h-4 mr-1.5" />
                        {shift.time}
                      </div>
                    </div>
                    {shift.filled ? (
                      <div className="flex items-center bg-green-500/10 text-green-500 px-3 py-1.5 rounded-lg border border-green-500/20 text-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {shift.volunteerName}
                      </div>
                    ) : (
                      <button className="bg-brand-600/10 hover:bg-brand-600/20 text-brand-500 border border-brand-500/50 px-4 py-1.5 rounded-lg text-sm transition-colors">
                        Sign Up
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ROSTER TAB (New) */}
        {activeTab === 'roster' && (
            <div className="bg-night-800 rounded-xl border border-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h3 className="text-xl font-bold text-white">Camp Roster</h3>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white">
                           Export CSV
                        </button>
                        <button className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-medium flex items-center">
                            <Plus className="w-4 h-4 mr-2" /> Add Member
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3">Member</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Team</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {MOCK_CAMP_MEMBERS.map((member) => (
                                <tr key={member.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-500 font-bold border border-brand-500/30 mr-3">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{member.name}</div>
                                                <div className="text-xs text-gray-500">{member.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                            member.role === 'LEAD' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                                            member.role === 'NEWBIE' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                            'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                        }`}>
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-300">{member.campTeam}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center text-xs font-medium ${
                                            member.status === 'ARRIVED' ? 'text-green-500' :
                                            member.status === 'CONFIRMED' ? 'text-blue-500' : 'text-gray-500'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                                member.status === 'ARRIVED' ? 'bg-green-500' :
                                                member.status === 'CONFIRMED' ? 'bg-blue-500' : 'bg-gray-500'
                                            }`}></div>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-500 hover:text-white p-2">
                                            <Mail className="w-4 h-4" />
                                        </button>
                                        <button className="text-gray-500 hover:text-white p-2">
                                            <Settings className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* INVENTORY TAB (New) */}
        {activeTab === 'inventory' && (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Asset Inventory</h3>
                    <button className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-medium flex items-center">
                        <Plus className="w-4 h-4 mr-2" /> Add Item
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MOCK_CAMP_ASSETS.map((asset) => (
                        <div key={asset.id} className="bg-night-800 border border-white/5 p-5 rounded-xl flex flex-col hover:border-white/20 transition-all">
                             <div className="flex justify-between items-start mb-3">
                                 <div className={`p-2 rounded-lg ${
                                     asset.category === 'POWER' ? 'bg-yellow-500/10 text-yellow-500' :
                                     asset.category === 'SOUND' ? 'bg-purple-500/10 text-purple-500' :
                                     asset.category === 'KITCHEN' ? 'bg-blue-500/10 text-blue-500' :
                                     'bg-gray-500/10 text-gray-500'
                                 }`}>
                                    {asset.category === 'POWER' ? <Settings className="w-5 h-5" /> : 
                                     asset.category === 'SOUND' ? <Users className="w-5 h-5" /> :
                                     <Package className="w-5 h-5" />}
                                 </div>
                                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                     asset.condition === 'GOOD' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                     'bg-red-500/10 text-red-500 border-red-500/20'
                                 }`}>
                                     {asset.condition}
                                 </span>
                             </div>
                             <h4 className="text-lg font-bold text-white mb-1">{asset.name}</h4>
                             <p className="text-sm text-gray-500">Value: ${asset.value}</p>
                             
                             <div className="mt-4 pt-4 border-t border-white/5">
                                 {asset.assignedTo ? (
                                     <div className="flex items-center text-sm text-brand-400 bg-brand-500/10 px-3 py-2 rounded-lg">
                                         <CheckCircle2 className="w-4 h-4 mr-2" />
                                         Checked out to {asset.assignedTo}
                                     </div>
                                 ) : (
                                     <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium rounded-lg border border-white/10 transition-colors">
                                         Check Out
                                     </button>
                                 )}
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'budget' && (
            <FinanceModule 
              currentUser={user}
              budgetTotal={camp.budgetTotal}
              budgetSpent={camp.budgetSpent}
            />
        )}

        {activeTab === 'lnt' && (
            <LNTModule />
        )}

        {activeTab === 'overview' && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 border border-dashed border-white/10 rounded-xl bg-night-800/50">
            <Settings className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg">Overview settings under construction.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampManager;

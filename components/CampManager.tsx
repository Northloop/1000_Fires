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
  Lock,
  Trash2
} from 'lucide-react';
import { MOCK_SHIFTS, MOCK_TASKS, MOCK_CAMPS, CURRENT_USER } from '../constants';
import { canEditCamp, canViewFinances } from '../lib/rbac';
import FinanceModule from './FinanceModule';
import LNTModule from './LNTModule';

const CampManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'roster' | 'tasks' | 'budget' | 'lnt'>('tasks');
  const camp = MOCK_CAMPS[0]; // Camp Entropy

  const canEdit = canEditCamp(CURRENT_USER);
  const canSeeFinances = canViewFinances(CURRENT_USER);

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
      <div className="flex border-b border-white/10 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Settings, allowed: true },
          { id: 'tasks', label: 'Tasks & Shifts', icon: ClipboardCheck, allowed: true },
          { id: 'roster', label: 'Roster', icon: Users, allowed: true },
          { id: 'budget', label: 'Finances', icon: Wallet, allowed: canSeeFinances },
          { id: 'lnt', label: 'LNT & Cleanup', icon: Trash2, allowed: true },
        ].map((tab) => {
            if (!tab.allowed) return null;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
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
                {MOCK_SHIFTS.filter(s => s.role !== 'Ranger (Alpha)' && s.role !== 'Ranger (Dirt)').map((shift) => (
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

        {activeTab === 'budget' && (
            <FinanceModule 
              currentUser={CURRENT_USER}
              budgetTotal={camp.budgetTotal}
              budgetSpent={camp.budgetSpent}
            />
        )}

        {activeTab === 'lnt' && (
            <LNTModule />
        )}

        {(activeTab !== 'tasks' && activeTab !== 'budget' && activeTab !== 'lnt') && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 border border-dashed border-white/10 rounded-xl bg-night-800/50">
            <Settings className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg">This module is under construction.</p>
            <p className="text-sm opacity-60">Phase 2 Implementation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampManager;
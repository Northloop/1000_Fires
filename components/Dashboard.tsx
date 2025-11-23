
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Activity, Users, Tent, DollarSign, AlertCircle, Calendar, HeartHandshake, Map, Star, Shield, ArrowRight } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { UserRole } from '../types';
import { useNavigate } from 'react-router-dom';
import DepartmentDashboard from './DepartmentDashboard';

// Updated data to represent realistic percentages for "Fill Rate"
const data = [
  { name: 'Mon', rate: 45 },
  { name: 'Tue', rate: 52 },
  { name: 'Wed', rate: 38 },
  { name: 'Thu', rate: 65 },
  { name: 'Fri', rate: 82 },
  { name: 'Sat', rate: 95 },
  { name: 'Sun', rate: 88 },
];

const budgetData = [
  { name: 'Infrastructure', value: 400 },
  { name: 'Art Grants', value: 300 },
  { name: 'Safety', value: 300 },
  { name: 'Site Ops', value: 200 },
];

const COLORS = ['#f97316', '#ea580c', '#c2410c', '#7c2d12'];

const Dashboard: React.FC = () => {
  const { user, activeMembership } = useUser();
  const navigate = useNavigate();

  if (!user || !activeMembership) return null;

  // --- ROUTING LOGIC BASED ON PERSONA ---

  // 1. DEPARTMENT LEADS: Go straight to their operational dashboard
  if (activeMembership.role === UserRole.DEPARTMENT_LEAD) {
    return <DepartmentDashboard />;
  }

  // 2. PARTICIPANT & VOLUNTEER & TEAM LEAD (The "Normie" View)
  if (activeMembership.role === UserRole.PARTICIPANT || activeMembership.role === UserRole.VOLUNTEER || activeMembership.role === UserRole.TEAM_LEAD || activeMembership.role === UserRole.CAMP_LEAD) {
    // Note: Camp Leads have their own /camp route, but their "Dashboard" is the participant view + shortcuts
    return (
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-brand-900 to-night-800 rounded-2xl p-8 border border-white/10 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-2">Welcome Home, {user.name.split(' ')[0]}</h1>
            <p className="text-brand-200 text-lg">Minnesota Regional Burn • Day 2 of 5</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>

        {/* Quick Stats / Personal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-night-800 p-6 rounded-xl border border-white/5 hover:border-brand-500/30 transition-colors cursor-pointer" onClick={() => navigate('/volunteer')}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm font-medium">My Upcoming Shifts</p>
                <h3 className="text-3xl font-bold text-white mt-2">2</h3>
              </div>
              <div className="p-3 rounded-lg bg-brand-500/10 text-brand-500">
                <HeartHandshake className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="bg-night-800 p-6 rounded-xl border border-white/5 hover:border-brand-500/30 transition-colors cursor-pointer" onClick={() => navigate('/schedule')}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm font-medium">Favorited Events</p>
                <h3 className="text-3xl font-bold text-white mt-2">12</h3>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500">
                <Star className="w-6 h-6" />
              </div>
            </div>
          </div>
          {activeMembership.role === UserRole.CAMP_LEAD ? (
             <div className="bg-night-800 p-6 rounded-xl border border-white/5 hover:border-brand-500/30 transition-colors cursor-pointer" onClick={() => navigate('/camp')}>
               <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm font-medium">My Camp</p>
                  <h3 className="text-lg font-bold text-green-500 mt-2">Manage Camp</h3>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
                  <Tent className="w-6 h-6" />
                </div>
              </div>
            </div>
          ) : (
             <div className="bg-night-800 p-6 rounded-xl border border-white/5 hover:border-brand-500/30 transition-colors cursor-pointer" onClick={() => navigate('/map')}>
               <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Camp Status</p>
                  <h3 className="text-lg font-bold text-green-500 mt-2">Placed @ 4:30 & B</h3>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
                  <Tent className="w-6 h-6" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Happening Now */}
        <div className="bg-night-800 rounded-xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-brand-500" />
              Happening Now
            </h3>
            <button onClick={() => navigate('/schedule')} className="text-sm text-brand-500 hover:text-brand-400 font-medium">View Full Schedule</button>
          </div>
          <div className="divide-y divide-white/5">
            {[
              { title: 'Sunset Yoga', host: 'Camp Serenity', time: 'Now', loc: 'Temple Grounds', type: 'WORKSHOP' },
              { title: 'Fire Spinning 101', host: 'Pyro Guild', time: 'Starting in 15m', loc: 'Center Village', type: 'PERFORMANCE' },
              { title: 'Midnight Poutine', host: 'Camp Maple', time: 'Starting in 45m', loc: '4:30 & B', type: 'FOOD' },
            ].map((evt, idx) => (
              <div key={idx} className="p-5 flex items-center hover:bg-white/5 transition-colors cursor-pointer">
                <div className="mr-4 text-center min-w-[60px]">
                   <span className="block text-xs font-bold text-brand-500 uppercase">{evt.time}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white">{evt.title}</h4>
                  <p className="text-sm text-gray-400">{evt.host} • {evt.loc}</p>
                </div>
                <span className="px-3 py-1 bg-white/5 text-gray-300 text-xs rounded-full border border-white/10">{evt.type}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
             <button onClick={() => navigate('/map')} className="p-4 bg-night-800 border border-white/5 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors group">
                 <Map className="w-6 h-6 text-gray-400 mr-3 group-hover:text-brand-500" />
                 <span className="font-bold text-white">Interactive Map</span>
             </button>
             <button onClick={() => navigate('/volunteer')} className="p-4 bg-night-800 border border-white/5 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors group">
                 <HeartHandshake className="w-6 h-6 text-gray-400 mr-3 group-hover:text-brand-500" />
                 <span className="font-bold text-white">Volunteer Opportunities</span>
             </button>
        </div>
      </div>
    );
  }

  // 3. EVENT ORGANIZER (The "God" View)
  // Only organizers get the financial stats and the drill-down capability
  if (activeMembership.role === UserRole.EVENT_ORGANIZER) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Executive Overview</h1>
            <p className="text-gray-400">Minnesota Regional Burn • October 2026</p>
          </div>
          <button className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Download Report
          </button>
        </div>

        {/* Stats Grid - ONLY SEEN BY ORGANIZERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Registered Camps', value: '84', icon: Tent, color: 'text-blue-500' },
            { label: 'Tickets Sold', value: '2,405', icon: Users, color: 'text-green-500' },
            { label: 'Budget Used', value: '64%', icon: DollarSign, color: 'text-yellow-500' },
            { label: 'Active Incidents', value: '3', icon: AlertCircle, color: 'text-red-500' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-night-800 p-6 rounded-xl border border-white/5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-white mt-2">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-lg bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Unified Command View (Department Grid) */}
        {/* We render DepartmentDashboard here, which handles the "Unified" view logic for Organizers */}
        <DepartmentDashboard />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-night-800 p-6 rounded-xl border border-white/5 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-2">Volunteer Shift Fill Rate</h3>
            <p className="text-sm text-gray-500 mb-6">Percentage of shifts filled per day</p>
            <div className="h-80 w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
                  <YAxis 
                    stroke="#666" 
                    domain={[0, 100]} 
                    tickFormatter={(value) => `${value}%`} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                    formatter={(value: number) => [`${value}%`, 'Fill Rate']}
                  />
                  <Bar dataKey="rate" fill="#f97316" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Chart */}
          <div className="bg-night-800 p-6 rounded-xl border border-white/5 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-2">Budget Allocation</h3>
            <p className="text-sm text-gray-500 mb-6">Distribution by category</p>
            <div className="h-64 w-full flex-1 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333', borderRadius: '8px' }}
                     itemStyle={{ color: '#fff' }}
                     formatter={(value: number) => [`$${value}k`, 'Budget']}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="block text-2xl font-bold text-white">1.2M</span>
                  <span className="block text-xs text-gray-500 uppercase">Total</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-3">
              {budgetData.map((entry, index) => (
                <div key={index} className="flex items-center text-sm text-gray-400 justify-between">
                  <div className="flex items-center">
                     <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                     <span>{entry.name}</span>
                  </div>
                  <span className="text-white font-mono font-medium">${entry.value}k</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-night-800 rounded-xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Recent Activity</h3>
            <button className="text-sm text-brand-500 hover:text-brand-400 font-medium">View All</button>
          </div>
          <div className="divide-y divide-white/5">
            {[
              { msg: 'Camp "Sparkle Ponies" submitted their LNT plan.', time: '10m ago', icon: Activity },
              { msg: 'Ranger HQ posted a new announcement regarding weather.', time: '1h ago', icon: AlertCircle },
              { msg: 'New Art Grant application received: "The Phoenix Rises"', time: '2h ago', icon: DollarSign },
            ].map((item, idx) => (
              <div key={idx} className="p-4 flex items-center hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="bg-white/5 p-2 rounded-lg text-gray-400 mr-4 group-hover:text-brand-500 group-hover:bg-brand-500/10 transition-colors">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-200">{item.msg}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Fallback (shouldn't happen given types)
  return <div>Loading...</div>;
};

export default Dashboard;

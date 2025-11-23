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
import { Activity, Users, Tent, DollarSign, AlertCircle } from 'lucide-react';

const data = [
  { name: 'Mon', volunteers: 40 },
  { name: 'Tue', volunteers: 30 },
  { name: 'Wed', volunteers: 20 },
  { name: 'Thu', volunteers: 27 },
  { name: 'Fri', volunteers: 18 },
  { name: 'Sat', volunteers: 23 },
  { name: 'Sun', volunteers: 34 },
];

const budgetData = [
  { name: 'Infrastructure', value: 400 },
  { name: 'Art Grants', value: 300 },
  { name: 'Safety', value: 300 },
  { name: 'City Ops', value: 200 },
];

const COLORS = ['#f97316', '#ea580c', '#c2410c', '#7c2d12'];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Event Overview</h1>
          <p className="text-gray-400">Minnesota Regional Burn • October 2026</p>
        </div>
        <button className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Download Report
        </button>
      </div>

      {/* Stats Grid */}
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-night-800 p-6 rounded-xl border border-white/5">
          <h3 className="text-lg font-bold text-white mb-6">Volunteer Shift Fill Rate</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="volunteers" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Chart */}
        <div className="bg-night-800 p-6 rounded-xl border border-white/5">
          <h3 className="text-lg font-bold text-white mb-6">Budget Allocation</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333' }}
                   itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {budgetData.map((entry, index) => (
                <div key={index} className="flex items-center text-sm text-gray-400">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="flex-1">{entry.name}</span>
                  <span className="text-white font-medium">{entry.value}k</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-night-800 rounded-xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Recent Activity</h3>
          <button className="text-sm text-brand-500 hover:text-brand-400">View All</button>
        </div>
        <div className="divide-y divide-white/5">
          {[
            { msg: 'Camp "Sparkle Ponies" submitted their LNT plan.', time: '10m ago', icon: Activity },
            { msg: 'Ranger HQ posted a new announcement regarding weather.', time: '1h ago', icon: AlertCircle },
            { msg: 'New Art Grant application received: "The Phoenix Rises"', time: '2h ago', icon: DollarSign },
          ].map((item, idx) => (
            <div key={idx} className="p-4 flex items-center hover:bg-white/5 transition-colors cursor-pointer">
              <div className="bg-white/5 p-2 rounded-lg text-gray-400 mr-4">
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
};

export default Dashboard;

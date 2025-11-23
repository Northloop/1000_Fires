
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Calendar, 
  Tent, 
  Users, 
  Menu, 
  X,
  Flame,
  Settings,
  Bell,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { useOfflineSync } from '../lib/offline';
import { UserRole } from '../types';
import { useUser } from '../context/UserContext';

const Layout: React.FC = () => {
  const { user } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { syncState, showConflictModal, resolveConflict, toggleOnlineStatus } = useOfflineSync();
  const navigate = useNavigate();

  // If no user is logged in (should be handled by App.tsx redirect, but safe check here)
  if (!user) return null;

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/camp', label: 'My Camp', icon: Tent },
    { to: '/map', label: 'Map', icon: MapIcon },
    { to: '/schedule', label: 'Schedule', icon: Calendar },
    { to: '/safety', label: 'Safety & SOS', icon: Shield },
  ];

  // Logic to show Department link for Leads/Organizers
  if ([UserRole.DEPARTMENT_LEAD, UserRole.EVENT_ORGANIZER].includes(user.role)) {
     navItems.push({ to: '/department', label: 'Department HQ', icon: Users });
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-night-900 text-gray-100 overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-30 w-64 bg-night-800 border-r border-white/5 transform transition-transform duration-200 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="h-16 flex items-center px-6 border-b border-white/5">
            <Flame className="w-8 h-8 text-brand-500 mr-2" />
            <span className="text-xl font-bold bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
              1000 FIRES
            </span>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-brand-500/10 text-brand-500' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-100'}
                `}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center">
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-10 h-10 rounded-full border border-white/10"
              />
              <div className="ml-3 truncate">
                <p className="text-sm font-medium text-white truncate w-32">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role.replace('_', ' ')}</p>
              </div>
              <button 
                onClick={() => navigate('/profile')} 
                className="ml-auto p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full w-full relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 bg-night-800 border-b border-white/5 z-10">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="p-2 text-gray-400 lg:hidden mr-2">
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-lg text-white lg:hidden">1000 Fires</span>
            
            {/* Offline/Sync Indicator */}
            <div className="hidden md:flex items-center ml-4 px-3 py-1.5 rounded-full bg-black/20 border border-white/5">
                <button onClick={toggleOnlineStatus} className="flex items-center space-x-2">
                    {syncState.status === 'SYNCING' && <RefreshCw className="w-4 h-4 text-brand-500 animate-spin" />}
                    {syncState.status === 'SYNCED' && <Wifi className="w-4 h-4 text-green-500" />}
                    {syncState.status === 'OFFLINE' && <WifiOff className="w-4 h-4 text-gray-500" />}
                    {syncState.status === 'CONFLICT' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    
                    <span className={`text-xs font-medium uppercase tracking-wider ${
                        syncState.status === 'CONFLICT' ? 'text-red-500' :
                        syncState.status === 'SYNCED' ? 'text-green-500' : 'text-gray-400'
                    }`}>
                        {syncState.status}
                    </span>
                </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
             {/* Global SOS Button (Short) */}
            <NavLink to="/safety" className="hidden sm:flex items-center bg-red-600/20 hover:bg-red-600/30 text-red-500 border border-red-600/50 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors animate-pulse">
                <AlertTriangle className="w-4 h-4 mr-2" />
                SOS
            </NavLink>

            <button className="p-2 text-gray-400 hover:text-white">
              <Bell className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-night-900 p-4 lg:p-8 relative">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Sync Conflict Modal */}
        {showConflictModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-night-800 rounded-xl max-w-md w-full border border-red-500/20 shadow-2xl animate-in zoom-in-95">
                    <div className="p-6">
                        <div className="flex items-center space-x-3 text-red-500 mb-4">
                            <AlertTriangle className="w-8 h-8" />
                            <h3 className="text-xl font-bold text-white">Sync Conflict Detected</h3>
                        </div>
                        <p className="text-gray-300 mb-6">
                            Changes to the <strong>Camp Roster</strong> were made on another device while you were offline. How would you like to resolve this?
                        </p>
                        
                        <div className="space-y-3">
                            <button 
                                onClick={() => resolveConflict('server')}
                                className="w-full p-4 rounded-lg bg-night-900 border border-white/10 hover:border-brand-500 text-left group transition-colors"
                            >
                                <span className="block text-sm font-bold text-white group-hover:text-brand-500">Use Server Version (Recommended)</span>
                                <span className="block text-xs text-gray-500 mt-1">Discard your local changes and accept the server's update (Modified 2 mins ago).</span>
                            </button>
                            
                            <button 
                                onClick={() => resolveConflict('local')}
                                className="w-full p-4 rounded-lg bg-night-900 border border-white/10 hover:border-brand-500 text-left group transition-colors"
                            >
                                <span className="block text-sm font-bold text-white group-hover:text-brand-500">Keep My Changes</span>
                                <span className="block text-xs text-gray-500 mt-1">Overwrite the server with your local version.</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Layout;

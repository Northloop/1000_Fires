
import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Save, User, Camera } from 'lucide-react';

const ProfileSettings: React.FC = () => {
  const { user, updateProfile, logout } = useUser();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, avatarUrl);
    alert('Profile updated successfully');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
        <p className="text-gray-400 mt-2">Manage your account preferences and persona.</p>
      </div>

      <div className="bg-night-800 rounded-xl border border-white/10 overflow-hidden">
        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="flex items-center space-x-6">
            <div className="relative group cursor-pointer">
                <img 
                    src={avatarUrl} 
                    alt={user.name} 
                    className="w-24 h-24 rounded-full border-4 border-night-900 shadow-lg"
                />
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                </div>
            </div>
            <div>
                <h3 className="text-lg font-bold text-white">{user.name}</h3>
                <p className="text-sm text-gray-500 font-mono uppercase">{user.role.replace('_', ' ')}</p>
            </div>
          </div>

          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-night-900 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Avatar URL</label>
              <input 
                type="text" 
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full bg-night-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 outline-none text-sm font-mono text-gray-400"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              className="flex items-center px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-lg transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <div className="bg-red-500/10 rounded-xl border border-red-500/20 p-6">
        <h3 className="text-lg font-bold text-white mb-2">Session Management</h3>
        <p className="text-gray-400 text-sm mb-6">Logging out will return you to the persona selection screen.</p>
        <button 
          onClick={handleLogout}
          className="flex items-center px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors w-full sm:w-auto justify-center"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;

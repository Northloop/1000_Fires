
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { MOCK_USERS } from '../constants';
import { Flame, ArrowRight, Shield, Tent, Users, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { UserRole } from '../types';

const LoginScreen: React.FC = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = (userId: string) => {
    login(userId);
    navigate('/dashboard');
  };

  const getRoleIcon = (role: UserRole) => {
    switch(role) {
      case UserRole.EVENT_ORGANIZER: return <LayoutDashboard className="w-5 h-5 text-purple-400" />;
      case UserRole.DEPARTMENT_LEAD: return <Shield className="w-5 h-5 text-red-400" />;
      case UserRole.CAMP_LEAD: return <Tent className="w-5 h-5 text-brand-400" />;
      case UserRole.VOLUNTEER: return <Users className="w-5 h-5 text-green-400" />;
      default: return <UserIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center p-4">
      <div className="mb-10 text-center animate-in fade-in zoom-in duration-500">
        <div className="inline-flex items-center justify-center p-4 bg-brand-500/10 rounded-full mb-4 ring-1 ring-brand-500/50 shadow-[0_0_30px_rgba(249,115,22,0.3)]">
          <Flame className="w-12 h-12 text-brand-500" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">1000 FIRES</h1>
        <p className="text-gray-500 mt-2 font-medium tracking-wide">EVENT OPERATING SYSTEM</p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_USERS.map((user) => (
          <button
            key={user.id}
            onClick={() => handleLogin(user.id)}
            className="group bg-night-800 hover:bg-night-700 border border-white/5 hover:border-brand-500/50 p-6 rounded-xl transition-all duration-200 text-left flex items-start gap-4 hover:shadow-xl hover:shadow-brand-900/20"
          >
            <div className="relative">
                <img 
                    src={user.avatarUrl} 
                    alt={user.name} 
                    className="w-14 h-14 rounded-full border-2 border-white/10 group-hover:border-brand-500 transition-colors" 
                />
                <div className="absolute -bottom-1 -right-1 bg-night-900 rounded-full p-1 border border-white/10">
                    {getRoleIcon(user.role)}
                </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">{user.name}</h3>
              <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mt-0.5">{user.role.replace('_', ' ')}</p>
              <div className="mt-3 flex items-center text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                <span>Login as {user.name.split(' ')[0]}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-12 text-gray-600 text-sm">
        Select a persona above to simulate different user roles and permissions.
      </p>
    </div>
  );
};

export default LoginScreen;

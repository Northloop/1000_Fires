
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { MOCK_USERS } from '../constants';
import { Flame, ArrowRight, Shield, Tent, Users, User as UserIcon, LayoutDashboard, HeartPulse, DoorOpen, Hammer, Truck, Map, Moon } from 'lucide-react';
import { UserRole, User } from '../types';

const getRoleIcon = (role: UserRole, entityName?: string) => {
  // Specialized icons based on entity name or role
  if (entityName?.includes('Medical')) return <HeartPulse className="w-5 h-5 text-red-400" />;
  if (entityName?.includes('Gate')) return <DoorOpen className="w-5 h-5 text-blue-400" />;
  if (entityName?.includes('Site Ops')) return <Hammer className="w-5 h-5 text-orange-400" />;
  if (entityName?.includes('FAST')) return <Flame className="w-5 h-5 text-red-600" />;
  if (entityName?.includes('DMV')) return <Truck className="w-5 h-5 text-yellow-500" />;
  if (entityName?.includes('Placement')) return <Map className="w-5 h-5 text-green-500" />;
  if (entityName?.includes('Sanctuary')) return <Moon className="w-5 h-5 text-purple-400" />;

  switch(role) {
    case UserRole.EVENT_ORGANIZER: return <LayoutDashboard className="w-5 h-5 text-purple-400" />;
    case UserRole.DEPARTMENT_LEAD: return <Shield className="w-5 h-5 text-red-400" />;
    case UserRole.CAMP_LEAD: return <Tent className="w-5 h-5 text-brand-400" />;
    case UserRole.VOLUNTEER: return <Users className="w-5 h-5 text-green-400" />;
    default: return <UserIcon className="w-5 h-5 text-gray-400" />;
  }
};

interface UserCardProps {
  user: User;
  onLogin: (id: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onLogin }) => {
  const primaryMembership = user.memberships[0];
  const extraRoles = user.memberships.length - 1;
  
  return (
      <button
          onClick={() => onLogin(user.id)}
          className="group bg-night-800 hover:bg-night-700 border border-white/5 hover:border-brand-500/50 p-4 rounded-xl transition-all duration-200 text-left flex items-start gap-4 hover:shadow-xl hover:shadow-brand-900/20 relative overflow-hidden h-full"
      >
          <div className="relative flex-shrink-0">
              <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  className="w-12 h-12 rounded-full border-2 border-white/10 group-hover:border-brand-500 transition-colors" 
              />
              <div className="absolute -bottom-1 -right-1 bg-night-900 rounded-full p-1 border border-white/10">
                  {getRoleIcon(primaryMembership.role, primaryMembership.entityName)}
              </div>
          </div>
          
          <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-white group-hover:text-brand-400 transition-colors truncate">{user.name}</h3>
          <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mt-0.5 truncate">
              {primaryMembership.entityName}
          </p>
          <p className="text-[10px] text-gray-400 mt-1 truncate">
              {primaryMembership.role.replace('_', ' ')}
          </p>
          
          {extraRoles > 0 && (
              <div className="mt-2 flex items-center gap-1">
                  {user.memberships.slice(1).map((m, idx) => (
                      <span key={idx} className="w-2 h-2 rounded-full bg-white/20" title={m.role}></span>
                  ))}
                  <span className="text-[10px] text-gray-500 ml-1">+{extraRoles} roles</span>
              </div>
          )}
          </div>
           <ArrowRight className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-all absolute right-4 top-4" />
      </button>
  )
};

const LoginScreen: React.FC = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = (userId: string) => {
    login(userId);
    navigate('/dashboard');
  };

  // Group users by category for cleaner UI
  const leads = MOCK_USERS.filter(u => u.memberships[0].role === UserRole.DEPARTMENT_LEAD || u.memberships[0].role === UserRole.EVENT_ORGANIZER);
  const others = MOCK_USERS.filter(u => u.memberships[0].role !== UserRole.DEPARTMENT_LEAD && u.memberships[0].role !== UserRole.EVENT_ORGANIZER);

  return (
    <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="inline-flex items-center justify-center p-4 bg-brand-500/10 rounded-full mb-4 ring-1 ring-brand-500/50 shadow-[0_0_30px_rgba(249,115,22,0.3)]">
          <Flame className="w-10 h-10 text-brand-500" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">1000 FIRES</h1>
        <p className="text-gray-500 mt-2 font-medium tracking-wide">Select Persona</p>
      </div>

      <div className="w-full max-w-5xl space-y-8">
        
        {/* Section: Command & Leads */}
        <section>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">Command & Dept Leads</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {leads.map(user => <UserCard key={user.id} user={user} onLogin={handleLogin} />)}
            </div>
        </section>

        {/* Section: Participants & Camps */}
        <section>
             <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">Camps & Participants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {others.map(user => <UserCard key={user.id} user={user} onLogin={handleLogin} />)}
            </div>
        </section>

      </div>
    </div>
  );
};

export default LoginScreen;

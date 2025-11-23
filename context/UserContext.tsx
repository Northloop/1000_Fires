
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Membership, Permission } from '../types';
import { MOCK_USERS } from '../constants';

interface UserContextType {
  user: User | null;
  activeMembership: Membership | null;
  login: (userId: string) => void;
  logout: () => void;
  updateProfile: (name: string, avatarUrl: string) => void;
  switchContext: (membershipId: string) => void;
  checkPermission: (permission: Permission) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeMembership, setActiveMembership] = useState<Membership | null>(null);

  const login = (userId: string) => {
    const foundUser = MOCK_USERS.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      // Default to the first membership or the most important one
      setActiveMembership(foundUser.memberships[0]);
    }
  };

  const logout = () => {
    setUser(null);
    setActiveMembership(null);
  };

  const updateProfile = (name: string, avatarUrl: string) => {
    if (user) {
      setUser({ ...user, name, avatarUrl });
    }
  };

  const switchContext = (membershipId: string) => {
    if (!user) return;
    const membership = user.memberships.find(m => m.id === membershipId);
    if (membership) {
      setActiveMembership(membership);
    }
  };

  const checkPermission = (permission: Permission): boolean => {
    if (!activeMembership) return false;
    return activeMembership.permissions.includes(permission);
  };

  return (
    <UserContext.Provider value={{ user, activeMembership, login, logout, updateProfile, switchContext, checkPermission }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

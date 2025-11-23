
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CampManager from './components/CampManager';
import MapInterface from './components/MapInterface';
import Schedule from './components/Schedule';
import SafetyModule from './components/SafetyModule';
import DepartmentDashboard from './components/DepartmentDashboard';
import LoginScreen from './components/LoginScreen';
import ProfileSettings from './components/ProfileSettings';
import MapBuilder from './components/MapBuilder';
import { UserProvider, useUser } from './context/UserContext';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path="/login" element={<LoginScreen />} />
        
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="camp" element={<CampManager />} />
          <Route path="map" element={<MapInterface />} />
          <Route path="map-builder" element={<MapBuilder />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="safety" element={<SafetyModule />} />
          <Route path="department" element={<DepartmentDashboard />} />
          <Route path="profile" element={<ProfileSettings />} />
        </Route>
      </Routes>
  );
}

const App: React.FC = () => {
  return (
    <UserProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </UserProvider>
  );
};

export default App;

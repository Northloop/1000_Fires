import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CampManager from './components/CampManager';
import MapInterface from './components/MapInterface';
import Schedule from './components/Schedule';
import SafetyModule from './components/SafetyModule';
import DepartmentDashboard from './components/DepartmentDashboard';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="camp" element={<CampManager />} />
          <Route path="map" element={<MapInterface />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="safety" element={<SafetyModule />} />
          <Route path="department" element={<DepartmentDashboard />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
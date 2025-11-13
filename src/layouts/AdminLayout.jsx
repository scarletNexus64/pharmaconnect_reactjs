import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import AdminDashboard from '../components/admin/AdminDashboard';
import UserManagement from '../components/admin/UserManagement';
import RoleManagement from '../components/admin/RoleManagement';
import OrganizationManagement from '../components/admin/OrganizationManagement';
import SuperAdminDashboard from '../components/dashboard/SuperAdminDashboard';
import OrgAdminDashboard from '../components/dashboard/OrgAdminDashboard';
import ProjectDashboard from '../components/dashboard/ProjectDashboard';

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Récupérer le rôle utilisateur (pour la démo, on assume Super Admin)
  const userRole = localStorage.getItem('userRole') || 'Super Admin';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        userRole={userRole}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            {/* Admin Routes */}
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="roles" element={<RoleManagement />} />
            <Route path="organizations" element={<OrganizationManagement />} />
            
            {/* Dashboard Routes */}
            <Route path="dashboard/super" element={<SuperAdminDashboard />} />
            <Route path="dashboard/org" element={<OrgAdminDashboard />} />
            <Route path="dashboard/project" element={<ProjectDashboard />} />
            
            {/* Placeholder pour autres modules */}
            <Route path="settings" element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Paramètres Système</h1>
                <p className="text-gray-600 mt-2">Module à implémenter</p>
              </div>
            } />
            
            {/* Redirect par défaut */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
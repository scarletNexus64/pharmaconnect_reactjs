import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Bell } from 'lucide-react';

// Import components
import Sidebar from './components/layout/Sidebar';
import Login from './pages/auth/Login';
import LandingPage from './pages/landing/LandingPage';
import DemoDashboard from './pages/dashboard/DemoDashboard';
import Dashboard from './pages/dashboard/Dashboard';
import { useAuth } from './hooks/useAuth';
import apiService from './services/api';

// Dashboard components
import SuperAdminDashboard from './components/dashboard/SuperAdminDashboard';
import OrgAdminDashboard from './components/dashboard/OrgAdminDashboard';
import ProjectDashboard from './components/dashboard/ProjectDashboard';

// Feature components
import MedicationsList from './components/Medications/MedicationsList';
import StockManagement from './components/Stock/StockManagement';
import InventoriesManager from './components/Stock/InventoriesManager';
import StockMovements from './components/Stock/StockMovements';
import NewDispensation from './components/Dispensation/NewDispensation';
import PharmacoepiDashboard from './components/Analytics/PharmacoepiDashboard';

// New components
import UserProfile from './components/Profile/UserProfile';
import OrganizationsList from './components/Organizations/OrganizationsList';
import ProjectsList from './components/Projects/ProjectsList';
import MedicationsManager from './components/Medications/MedicationsManager';
import CategoriesManager from './components/Medications/CategoriesManager';
import HealthFacilitiesManager from './components/HealthFacilities/HealthFacilitiesManager';

// New pages without sidebar
import Organizations from './pages/organizations/Organizations';
import OrganizationDetail from './pages/organizations/OrganizationDetail';
import Projects from './pages/projects/Projects';
import ProjectDetail from './pages/projects/ProjectDetail';
import Medications from './pages/medications/Medications';
import HealthFacilities from './pages/health-facilities/HealthFacilities';
import Stock from './pages/stock/Stock';
import Dispensation from './pages/dispensation/Dispensation';
import Users from './pages/users/Users';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Layout wrapper for authenticated pages
const AuthenticatedLayout = ({ children, userRole }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications] = useState([
    { id: 1, type: 'alert', message: 'Rupture Artémether - CS Bangangté', time: '2h ago' },
    { id: 2, type: 'info', message: 'Nouvelle livraison reçue', time: '4h ago' },
    { id: 3, type: 'warning', message: 'Expiration proche - Lot A123', time: '1j ago' }
  ]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        userRole={userRole} 
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {userRole === 'Super Admin' ? 'Administration Globale' :
                 userRole === 'Admin ONG' ? 'Coordination Organisation' :
                 userRole === 'Gestionnaire Projet' ? 'Gestion Projet' :
                 'Interface Terrain'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>
              
              {/* User info */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {localStorage.getItem('username') || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-gray-600">{userRole}</p>
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {(localStorage.getItem('username') || 'U')[0].toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children, userRole, allowedRoles }) => {
  const isDemoMode = localStorage.getItem('isDemoMode') === 'true';
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  // Allow access if in demo mode or authenticated
  if (!userRole && !isDemoMode && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Use demo role if in demo mode
  const effectiveRole = isDemoMode ? 'Coordinateur Terrain' : userRole;
  
  if (allowedRoles && effectiveRole && !allowedRoles.includes(effectiveRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <AuthenticatedLayout userRole={effectiveRole}>{children}</AuthenticatedLayout>;
};

// Dashboard Router based on user role
const DashboardRouter = ({ userRole }) => {
  // Check if demo mode
  const isDemoMode = localStorage.getItem('isDemoMode') === 'true';
  
  if (isDemoMode) {
    return <DemoDashboard />;
  }
  
  // Check if user is authenticated with real API
  const isRealAuth = apiService.isAuthenticated();
  
  if (isRealAuth) {
    // Le nouveau Dashboard a déjà son propre layout, pas besoin d'wrapper
    return <Dashboard />;
  }
  
  switch (userRole) {
    case 'Super Admin':
      return <SuperAdminDashboard />;
    case 'Admin ONG':
      return <OrgAdminDashboard />;
    case 'Gestionnaire Projet':
    case 'Utilisateur Site':
      return <ProjectDashboard />;
    case 'Coordinateur Terrain':
      return <DemoDashboard />;
    default:
      return <SuperAdminDashboard />;
  }
};

// Placeholder components for unimplemented pages
const PlaceholderPage = ({ title, description }) => (
  <div className="p-6">
    <div className="text-center py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600">{description}</p>
      <p className="text-sm text-gray-500 mt-4">Module en cours de développement</p>
    </div>
  </div>
);

function App() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      setUserRole(savedRole);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage onLogin={() => window.location.href = '/login'} />} />
        <Route path="/login" element={<Login onBack={() => window.location.href = '/'} />} />
        
        {/* Protected Routes - All dashboard pages wrapped with DashboardLayout */}
        <Route path="/dashboard" element={
          (() => {
            // Si authentifié avec l'API réelle, utiliser le nouveau dashboard avec le layout
            if (apiService.isAuthenticated()) {
              return (
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              );
            }
            // Sinon utiliser l'ancien système avec wrapper
            return (
              <ProtectedRoute userRole={userRole}>
                <DashboardRouter userRole={userRole} />
              </ProtectedRoute>
            );
          })()
        } />

        {/* Medications Routes */}
        <Route path="/medications" element={
          <DashboardLayout>
            <Medications />
          </DashboardLayout>
        } />
        
        <Route path="/medication-categories" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Super Admin', 'Admin ONG', 'Gestionnaire Projet']}>
            <CategoriesManager />
          </ProtectedRoute>
        } />

        <Route path="/standard-lists" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Super Admin', 'Admin ONG', 'Gestionnaire Projet']}>
            <PlaceholderPage title="Listes Standard" description="Génération automatique et gestion des listes de médicaments" />
          </ProtectedRoute>
        } />

        <Route path="/substitutions" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Super Admin', 'Admin ONG']}>
            <PlaceholderPage title="Substitutions" description="Gestion des substitutions médicamenteuses" />
          </ProtectedRoute>
        } />

        {/* Stock Routes */}
        <Route path="/stock/current" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Admin ONG', 'Gestionnaire Projet', 'Utilisateur Site']}>
            <StockManagement />
          </ProtectedRoute>
        } />

        <Route path="/stock/entries" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Admin ONG', 'Gestionnaire Projet', 'Utilisateur Site']}>
            <StockManagement />
          </ProtectedRoute>
        } />

        <Route path="/stock/inventories" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Admin ONG', 'Gestionnaire Projet', 'Utilisateur Site']}>
            <InventoriesManager />
          </ProtectedRoute>
        } />

        <Route path="/stock/movements" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Admin ONG', 'Gestionnaire Projet', 'Utilisateur Site']}>
            <StockMovements />
          </ProtectedRoute>
        } />

        {/* Dispensation Routes */}
        <Route path="/dispensation/new" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Gestionnaire Projet', 'Utilisateur Site']}>
            <NewDispensation />
          </ProtectedRoute>
        } />

        <Route path="/dispensation/history" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Gestionnaire Projet', 'Utilisateur Site']}>
            <PlaceholderPage title="Historique Dispensations" description="Consultation des dispensations passées" />
          </ProtectedRoute>
        } />

        <Route path="/dispensation/reports" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Gestionnaire Projet', 'Utilisateur Site']}>
            <PlaceholderPage title="Rapports Dispensation" description="Rapports et statistiques de dispensation" />
          </ProtectedRoute>
        } />

        {/* Analytics Routes */}
        <Route path="/analytics" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Super Admin', 'Admin ONG', 'Gestionnaire Projet']}>
            <PlaceholderPage title="Dashboard Analytics" description="Tableaux de bord et indicateurs clés" />
          </ProtectedRoute>
        } />

        <Route path="/analytics/pharmacoepi" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Super Admin', 'Admin ONG', 'Gestionnaire Projet']}>
            <PharmacoepiDashboard />
          </ProtectedRoute>
        } />

        <Route path="/analytics/reports" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Super Admin', 'Admin ONG', 'Gestionnaire Projet']}>
            <PlaceholderPage title="Rapports Personnalisés" description="Génération de rapports sur mesure" />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/organizations" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Super Admin']}>
            <OrganizationsList />
          </ProtectedRoute>
        } />
        
        <Route path="/organizations" element={
          <DashboardLayout>
            <Organizations />
          </DashboardLayout>
        } />
        <Route path="/organizations/:id" element={
          <DashboardLayout>
            <OrganizationDetail />
          </DashboardLayout>
        } />

        <Route path="/admin/users" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Super Admin']}>
            <PlaceholderPage title="Gestion Utilisateurs" description="Administration des comptes utilisateurs" />
          </ProtectedRoute>
        } />

        <Route path="/admin/settings" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Super Admin']}>
            <PlaceholderPage title="Paramètres Système" description="Configuration globale du système" />
          </ProtectedRoute>
        } />

        {/* Projects Routes */}
        <Route path="/projects" element={
          <DashboardLayout>
            <Projects />
          </DashboardLayout>
        } />
        <Route path="/projects/:id" element={
          <DashboardLayout>
            <ProjectDetail />
          </DashboardLayout>
        } />

        {/* Health Facilities Routes */}
        <Route path="/health-facilities" element={
          <DashboardLayout>
            <HealthFacilities />
          </DashboardLayout>
        } />

        {/* Users Routes */}
        <Route path="/users" element={
          <DashboardLayout>
            <Users />
          </DashboardLayout>
        } />

        {/* Stock Routes */}
        <Route path="/stock" element={
          <DashboardLayout>
            <Stock />
          </DashboardLayout>
        } />

        {/* Dispensation Routes */}
        <Route path="/dispensation" element={
          <DashboardLayout>
            <Dispensation />
          </DashboardLayout>
        } />
        
        <Route path="/health-facilities-old" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Admin ONG', 'Gestionnaire Projet']}>
            <HealthFacilitiesManager />
          </ProtectedRoute>
        } />

        <Route path="/teams" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Admin ONG', 'Gestionnaire Projet']}>
            <PlaceholderPage title="Gestion Équipes" description="Administration des équipes terrain" />
          </ProtectedRoute>
        } />

        {/* Map Routes */}
        <Route path="/map" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Super Admin', 'Admin ONG']}>
            <PlaceholderPage title="Carte Interactive" description="Visualisation géographique des sites" />
          </ProtectedRoute>
        } />

        <Route path="/map/logistics" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Super Admin', 'Admin ONG']}>
            <PlaceholderPage title="Suivi Logistique" description="Tracking des livraisons et transport" />
          </ProtectedRoute>
        } />

        <Route path="/map/epidemio" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Super Admin', 'Admin ONG']}>
            <PlaceholderPage title="Analyse Épidémiologique" description="Surveillance géographique des épidémies" />
          </ProtectedRoute>
        } />

        {/* Import/Export Routes */}
        <Route path="/import" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Super Admin', 'Admin ONG', 'Gestionnaire Projet']}>
            <PlaceholderPage title="Import Données" description="Import de données Excel et autres formats" />
          </ProtectedRoute>
        } />

        <Route path="/exports" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Super Admin', 'Admin ONG', 'Gestionnaire Projet']}>
            <PlaceholderPage title="Exports" description="Export de données et rapports" />
          </ProtectedRoute>
        } />

        <Route path="/templates" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Super Admin', 'Admin ONG', 'Gestionnaire Projet']}>
            <PlaceholderPage title="Templates" description="Modèles d'import et export" />
          </ProtectedRoute>
        } />

        {/* Settings Routes */}
        <Route path="/settings/user" element={
          <ProtectedRoute userRole={userRole}>
            <UserProfile />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute userRole={userRole}>
            <UserProfile />
          </ProtectedRoute>
        } />

        <Route path="/settings/organization" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Admin ONG', 'Gestionnaire Projet']}>
            <PlaceholderPage title="Paramètres Organisation" description="Configuration de l'organisation" />
          </ProtectedRoute>
        } />

        <Route path="/settings/notifications" element={
          <ProtectedRoute userRole={userRole}>
            <PlaceholderPage title="Paramètres Notifications" description="Configuration des alertes et notifications" />
          </ProtectedRoute>
        } />
        
        {/* 404 Page */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
              <p className="text-gray-600 mb-4">Page non trouvée</p>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retour
              </button>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
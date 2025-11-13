import React, { useState, useEffect } from 'react';
import { 
  Activity, Package, AlertTriangle, Users, TrendingUp, 
  Calendar, MapPin, Bell, Settings, LogOut, Home,
  ShoppingCart, FileText, BarChart3, Map, Upload,
  Camera, CheckCircle, XCircle, Clock, Shield,
  Building, FolderOpen, Pill
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../services/api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Charger les données en parallèle
      const [
        medicationsRes,
        stockEntriesRes,
        dispensationsRes,
        alertsRes
      ] = await Promise.all([
        apiService.getMedications().catch(() => ({ results: [] })),
        apiService.getStockEntries().catch(() => ({ results: [] })),
        apiService.getDispensations().catch(() => ({ results: [] })),
        apiService.getAlerts().catch(() => ({ results: [] }))
      ]);

      setDashboardData({
        medications: medicationsRes.results || [],
        stockEntries: stockEntriesRes.results || [],
        dispensations: dispensationsRes.results || [],
        alerts: alertsRes.results || []
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      // Utiliser des données par défaut en cas d'erreur
      setDashboardData({
        medications: [],
        stockEntries: [],
        dispensations: [],
        alerts: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du tableau de bord...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Calculer les statistiques
  const stats = {
    medications: dashboardData?.medications?.length || 0,
    activeStock: dashboardData?.stockEntries?.length || 0,
    dispensations: dashboardData?.dispensations?.length || 0,
    alerts: dashboardData?.alerts?.filter(alert => alert.is_active)?.length || 0,
    criticalAlerts: dashboardData?.alerts?.filter(alert => alert.is_active && alert.severity === 'CRITICAL')?.length || 0
  };

  // Récentes dispensations (5 dernières)
  const recentDispensations = dashboardData?.dispensations?.slice(0, 5) || [];

  // Alertes critiques
  const criticalAlerts = dashboardData?.alerts?.filter(alert => alert.is_active)?.slice(0, 5) || [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">PharmaConnect</span>
                </div>
                <div className="hidden md:block text-sm text-gray-500">
                  {user?.organization_name}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-4 text-sm">
                  <button 
                    onClick={() => window.location.href = '/profile'}
                    className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="text-gray-700 font-medium">
                        {user?.first_name} {user?.last_name}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {user?.access_level === 'COORDINATION' ? 'Coordinateur' : 
                         user?.access_level === 'PROJECT' ? 'Projet' : 'Formation Sanitaire'}
                      </div>
                    </div>
                  </button>
                </div>

                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-400 hover:text-gray-500"
                >
                  <Bell className="w-6 h-6" />
                  {stats.alerts > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {stats.alerts}
                    </span>
                  )}
                </button>

                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Vue d\'ensemble', icon: Home },
                { id: 'organizations', label: 'Organisations', icon: Building, link: '/organizations' },
                { id: 'projects', label: 'Projets', icon: FolderOpen, link: '/projects' },
                { id: 'medications', label: 'Médicaments', icon: Pill, link: '/medications' },
                { id: 'health-facilities', label: 'Formations', icon: MapPin, link: '/health-facilities' },
                { id: 'stock', label: 'Stock', icon: Package, link: '/stock/current' },
                { id: 'dispensation', label: 'Dispensation', icon: ShoppingCart }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.link) {
                      window.location.href = tab.link;
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Package className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Médicaments</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.medications}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Activity className="w-8 h-8 text-green-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Stock Actif</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.activeStock}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ShoppingCart className="w-8 h-8 text-purple-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Dispensations</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.dispensations}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Alertes</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.alerts}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Actions Rapides</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                    <Camera className="w-6 h-6 mb-2" />
                    <span className="text-sm">Photo Ordonnance</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                    <Package className="w-6 h-6 mb-2" />
                    <span className="text-sm">Nouvel Inventaire</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                    <Upload className="w-6 h-6 mb-2" />
                    <span className="text-sm">Entrée Stock</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                    <FileText className="w-6 h-6 mb-2" />
                    <span className="text-sm">Rapport</span>
                  </Button>
                </div>
              </Card>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Dispensations */}
                <Card className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Dispensations Récentes</h3>
                  <div className="space-y-4">
                    {recentDispensations.length > 0 ? recentDispensations.map((dispensation) => (
                      <div key={dispensation.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{dispensation.patient_name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(dispensation.dispensation_date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            dispensation.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            dispensation.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {dispensation.status === 'COMPLETED' ? 'Complet' :
                             dispensation.status === 'PARTIAL' ? 'Partiel' : dispensation.status}
                          </span>
                        </div>
                      </div>
                    )) : (
                      <p className="text-gray-500 text-center py-4">Aucune dispensation récente</p>
                    )}
                  </div>
                </Card>

                {/* Alerts */}
                <Card className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Alertes</h3>
                  <div className="space-y-4">
                    {criticalAlerts.length > 0 ? criticalAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                          alert.severity === 'CRITICAL' ? 'bg-red-500' :
                          alert.severity === 'WARNING' ? 'bg-yellow-500' :
                          alert.severity === 'INFO' ? 'bg-blue-500' : 'bg-gray-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                          <p className="text-sm text-gray-500">{alert.message}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(alert.created_at).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-gray-500 text-center py-4">Aucune alerte active</p>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Autres onglets à implémenter */}
          {activeTab !== 'overview' && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Section {activeTab} en développement
              </h3>
              <p className="text-gray-500">
                Cette section sera bientôt disponible.
              </p>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
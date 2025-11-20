import React, { useState, useEffect } from 'react';
import {
  Activity, Package, AlertTriangle,
  ShoppingCart, Upload, Camera, FileText
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ProtectedRoute from '../../components/ProtectedRoute';
import apiService from '../../services/api';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center py-12">
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
    </ProtectedRoute>
  );
};

export default Dashboard;
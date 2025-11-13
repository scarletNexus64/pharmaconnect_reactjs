import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FolderOpen, Calendar, DollarSign, Users, MapPin, ChevronRight, ChevronLeft,
  Activity, Bell, LogOut, Building, Package, TrendingUp, Clock,
  CheckCircle, AlertCircle, FileText, BarChart3, Pill
} from 'lucide-react';
import Card from '../../components/ui/Card';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../services/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [stockEntries, setStockEntries] = useState([]);
  const [dispensations, setDispensations] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuth();

  useEffect(() => {
    loadProjectData();
  }, [id, loadProjectData]);

  const loadProjectData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Charger les données du projet
      const projectRes = await apiService.request(`/projects/${id}/`);
      setProject(projectRes);

      // Charger les données liées en parallèle
      const [stockRes, dispensationsRes, inventoriesRes] = await Promise.all([
        apiService.request('/stock-entries/', { 
          method: 'GET',
          headers: { ...apiService.getHeaders() }
        }).then(res => res.results?.filter(entry => entry.project === parseInt(id)) || []).catch(() => []),
        apiService.request('/dispensations/', {
          method: 'GET', 
          headers: { ...apiService.getHeaders() }
        }).then(res => res.results?.filter(disp => disp.project === parseInt(id)) || []).catch(() => []),
        apiService.request('/inventories/', {
          method: 'GET',
          headers: { ...apiService.getHeaders() }
        }).then(res => res.results?.filter(inv => inv.project === parseInt(id)) || []).catch(() => [])
      ]);

      setStockEntries(stockRes);
      setDispensations(dispensationsRes);
      setInventories(inventoriesRes);

      // Calculer les statistiques
      const totalStock = stockRes.reduce((sum, entry) => sum + (entry.quantity_delivered || 0), 0);
      const totalDispensed = dispensationsRes.length;
      const completedDispensations = dispensationsRes.filter(d => d.status === 'COMPLETED').length;

      setStats({
        totalStock,
        totalDispensed,
        completedDispensations,
        totalInventories: inventoriesRes.length,
        stockValue: stockRes.reduce((sum, entry) => sum + ((entry.quantity_delivered || 0) * (entry.unit_cost || 0)), 0)
      });

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      if (error.message.includes('404')) {
        navigate('/projects');
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const getProjectStatus = () => {
    if (!project) return { label: 'Inconnu', color: 'bg-gray-100 text-gray-800', icon: Clock };
    
    const now = new Date();
    const startDate = new Date(project.start_date);
    const endDate = new Date(project.end_date);

    if (now < startDate) {
      return { label: 'À venir', color: 'bg-blue-100 text-blue-800', icon: Clock };
    } else if (now > endDate) {
      return { label: 'Terminé', color: 'bg-gray-100 text-gray-800', icon: CheckCircle };
    } else {
      return { label: 'En cours', color: 'bg-green-100 text-green-800', icon: Activity };
    }
  };

  const calculateProgress = () => {
    if (!project) return 0;
    
    const now = new Date();
    const startDate = new Date(project.start_date);
    const endDate = new Date(project.end_date);
    
    if (now < startDate) return 0;
    if (now > endDate) return 100;
    
    const total = endDate - startDate;
    const elapsed = now - startDate;
    return Math.round((elapsed / total) * 100);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des détails du projet...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!project) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Projet non trouvé
            </h3>
            <p className="text-gray-500 mb-4">
              Le projet demandé n'existe pas ou vous n'y avez pas accès.
            </p>
            <button
              onClick={() => navigate('/projects')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Retour aux projets
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const status = getProjectStatus();
  const progress = calculateProgress();
  const StatusIcon = status.icon;

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
                  Détails du Projet
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
                        Administrateur Plateforme
                      </div>
                    </div>
                  </button>
                </div>

                <button 
                  className="relative p-2 text-gray-400 hover:text-gray-500"
                >
                  <Bell className="w-6 h-6" />
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

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <a href="/dashboard" className="hover:text-gray-700">Dashboard</a>
            <ChevronRight className="w-4 h-4" />
            <a href="/projects" className="hover:text-gray-700">Projets</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-700 font-medium">{project.name}</span>
          </nav>

          {/* Back Button */}
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Retour aux projets</span>
          </button>

          {/* Project Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg text-white mb-8">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <FolderOpen className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
                    <p className="text-green-100 mb-1">Code: {project.code}</p>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${status.color.replace('text-', 'text-white ').replace('bg-', 'bg-white bg-opacity-20 ')}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </span>
                      <span className="text-green-100">{progress}% terminé</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mb-4">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center text-green-100">
                  <Building className="w-4 h-4 mr-2" />
                  <span>{project.organization_name || 'Organisation'}</span>
                </div>
                <div className="flex items-center text-green-100">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>{project.donor_name || 'Bailleur'}</span>
                </div>
                <div className="flex items-center text-green-100">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{project.health_facility_name || 'Formation sanitaire'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="w-8 h-8 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Stock Total</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalStock}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Pill className="w-8 h-8 text-green-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Dispensations</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalDispensed}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-purple-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Complétées</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.completedDispensations}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="w-8 h-8 text-orange-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Inventaires</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalInventories}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="w-8 h-8 text-red-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Valeur Stock</p>
                  <p className="text-2xl font-semibold text-gray-900">{Math.round(stats.stockValue || 0)}€</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
                { id: 'stock', label: 'Stock', icon: Package },
                { id: 'dispensations', label: 'Dispensations', icon: Pill },
                { id: 'inventories', label: 'Inventaires', icon: BarChart3 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Project Info */}
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du Projet</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nom</label>
                    <p className="text-gray-900">{project.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Code</label>
                    <p className="text-gray-900">{project.code}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-gray-900">{project.description || 'Aucune description'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Organisation</label>
                    <p className="text-gray-900">{project.organization_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Bailleur</label>
                    <p className="text-gray-900">{project.donor_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Formation sanitaire</label>
                    <p className="text-gray-900">{project.health_facility_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Période</label>
                    <p className="text-gray-900">
                      {new Date(project.start_date).toLocaleDateString('fr-FR')} - {new Date(project.end_date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Activité Récente</h3>
                <div className="space-y-4">
                  {stockEntries.slice(0, 3).map((entry, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Package className="w-5 h-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Nouvelle entrée stock</p>
                        <p className="text-xs text-gray-500">
                          {entry.quantity_delivered} unités - {new Date(entry.delivery_date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  ))}
                  {dispensations.slice(0, 2).map((disp, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Pill className="w-5 h-5 text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Dispensation</p>
                        <p className="text-xs text-gray-500">
                          {disp.patient_name} - {new Date(disp.dispensation_date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  ))}
                  {stockEntries.length === 0 && dispensations.length === 0 && (
                    <p className="text-gray-500 text-center py-4">Aucune activité récente</p>
                  )}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'stock' && (
            <div className="space-y-6">
              {stockEntries.length > 0 ? stockEntries.map((entry, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Livraison #{entry.id}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Quantité livrée:</span> {entry.quantity_delivered}
                        </div>
                        <div>
                          <span className="font-medium">Date de livraison:</span> {new Date(entry.delivery_date).toLocaleDateString('fr-FR')}
                        </div>
                        <div>
                          <span className="font-medium">Date d'expiration:</span> {new Date(entry.expiry_date).toLocaleDateString('fr-FR')}
                        </div>
                        {entry.batch_number && (
                          <div>
                            <span className="font-medium">Lot:</span> {entry.batch_number}
                          </div>
                        )}
                        {entry.supplier && (
                          <div>
                            <span className="font-medium">Fournisseur:</span> {entry.supplier}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )) : (
                <Card className="p-12">
                  <div className="text-center">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune entrée stock</h3>
                    <p className="text-gray-500">Ce projet n'a pas encore d'entrées en stock.</p>
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'dispensations' && (
            <div className="space-y-6">
              {dispensations.length > 0 ? dispensations.map((disp, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Dispensation #{disp.id}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                        <div>
                          <span className="font-medium">Patient:</span> {disp.patient_name}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {new Date(disp.dispensation_date).toLocaleDateString('fr-FR')}
                        </div>
                        <div>
                          <span className="font-medium">Destination:</span> {disp.destination}
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        disp.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        disp.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {disp.status === 'COMPLETED' ? 'Complet' :
                         disp.status === 'PARTIAL' ? 'Partiel' : disp.status}
                      </span>
                    </div>
                  </div>
                </Card>
              )) : (
                <Card className="p-12">
                  <div className="text-center">
                    <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune dispensation</h3>
                    <p className="text-gray-500">Ce projet n'a pas encore de dispensations.</p>
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'inventories' && (
            <div className="space-y-6">
              {inventories.length > 0 ? inventories.map((inventory, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Inventaire {inventory.month}/{inventory.year}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Date d'inventaire:</span> {new Date(inventory.inventory_date).toLocaleDateString('fr-FR')}
                        </div>
                        <div>
                          <span className="font-medium">Créé par:</span> {inventory.created_by_name || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )) : (
                <Card className="p-12">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun inventaire</h3>
                    <p className="text-gray-500">Ce projet n'a pas encore d'inventaires.</p>
                  </div>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default ProjectDetail;
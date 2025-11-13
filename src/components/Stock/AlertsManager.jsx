import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, CheckCircle, Clock, X, Eye, 
  Search, Filter, Bell, Package, Calendar, Users
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import apiService from '../../services/api';

const AlertsManager = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showResolved, setShowResolved] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAlerts();
      setAlerts(response.results || response);
    } catch (error) {
      console.error('Erreur lors du chargement des alertes:', error);
      setError('Impossible de charger les alertes');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await apiService.request(`/alerts/${alertId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: false, resolved_at: new Date().toISOString() })
      });
      await loadAlerts();
    } catch (error) {
      console.error('Erreur lors de la résolution de l\'alerte:', error);
      setError('Erreur lors de la résolution de l\'alerte');
    }
  };

  const handleViewDetails = (alert) => {
    setSelectedAlert(alert);
    setShowDetails(true);
  };

  const getSeverityInfo = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          label: 'Critique',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: AlertTriangle
        };
      case 'WARNING':
        return {
          label: 'Attention',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: AlertTriangle
        };
      case 'MEDIUM':
        return {
          label: 'Moyen',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          icon: AlertTriangle
        };
      case 'LOW':
        return {
          label: 'Faible',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          icon: AlertTriangle
        };
      default:
        return {
          label: 'Inconnu',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          icon: AlertTriangle
        };
    }
  };

  const getAlertTypeInfo = (type) => {
    switch (type) {
      case 'STOCKOUT':
        return {
          label: 'Rupture de stock',
          icon: Package,
          description: 'Stock épuisé'
        };
      case 'LOW_STOCK':
        return {
          label: 'Stock faible',
          icon: Package,
          description: 'Niveau de stock critique'
        };
      case 'EXPIRY':
        return {
          label: 'Expiration proche',
          icon: Calendar,
          description: 'Médicaments proches de l\'expiration'
        };
      case 'QUALITY':
        return {
          label: 'Problème qualité',
          icon: AlertTriangle,
          description: 'Alerte qualité produit'
        };
      default:
        return {
          label: 'Autre',
          icon: Bell,
          description: 'Alerte générale'
        };
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.organization_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    const matchesType = selectedType === 'all' || alert.alert_type === selectedType;
    const matchesResolved = showResolved || alert.is_active;
    
    return matchesSearch && matchesSeverity && matchesType && matchesResolved;
  });

  // Statistiques
  const stats = {
    total: alerts.length,
    active: alerts.filter(a => a.is_active).length,
    critical: alerts.filter(a => a.is_active && a.severity === 'CRITICAL').length,
    resolved: alerts.filter(a => !a.is_active).length
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-4 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des Alertes
          </h1>
          <p className="text-gray-600 mt-1">
            Surveillance et traitement des alertes stock et qualité
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={loadAlerts}
            className="flex items-center space-x-2"
          >
            <Bell className="w-4 h-4" />
            <span>Actualiser</span>
          </Button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher alertes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">Toutes les sévérités</option>
              <option value="CRITICAL">Critique</option>
              <option value="WARNING">Attention</option>
              <option value="MEDIUM">Moyen</option>
              <option value="LOW">Faible</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">Tous les types</option>
              <option value="STOCKOUT">Rupture de stock</option>
              <option value="LOW_STOCK">Stock faible</option>
              <option value="EXPIRY">Expiration proche</option>
              <option value="QUALITY">Problème qualité</option>
            </select>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Inclure résolues</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="text-sm text-red-700 underline mt-1"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Alertes</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Actives</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Critiques</p>
              <p className="text-2xl font-semibold text-red-600">{stats.critical}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Résolues</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.resolved}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Liste des alertes */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => {
            const severityInfo = getSeverityInfo(alert.severity);
            const typeInfo = getAlertTypeInfo(alert.alert_type);
            const SeverityIcon = severityInfo.icon;
            const TypeIcon = typeInfo.icon;
            
            return (
              <Card 
                key={alert.id} 
                className={`p-6 border-l-4 ${severityInfo.borderColor} ${alert.is_active ? '' : 'opacity-60'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-2 rounded-lg ${severityInfo.bgColor}`}>
                      <SeverityIcon className={`w-5 h-5 ${severityInfo.color}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityInfo.bgColor} ${severityInfo.color}`}>
                          {severityInfo.label}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 flex items-center space-x-1">
                          <TypeIcon className="w-3 h-3" />
                          <span>{typeInfo.label}</span>
                        </span>
                        {!alert.is_active && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Résolue</span>
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{alert.message}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{alert.organization_name}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(alert.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                        
                        {alert.resolved_at && (
                          <div className="flex items-center space-x-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>Résolue le {new Date(alert.resolved_at).toLocaleDateString('fr-FR')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button
                      onClick={() => handleViewDetails(alert)}
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    {alert.is_active && (
                      <Button
                        onClick={() => handleResolveAlert(alert.id)}
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune alerte trouvée
            </h3>
            <p className="text-gray-600">
              {searchTerm ? 'Aucune alerte ne correspond à votre recherche.' : 
               showResolved ? 'Aucune alerte dans le système.' :
               'Aucune alerte active. Excellent travail !'}
            </p>
          </Card>
        )}
      </div>

      {/* Modal de détails */}
      {showDetails && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Détails de l'alerte
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">{selectedAlert.title}</h3>
                <p className="text-gray-600">{selectedAlert.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="text-sm text-gray-900">
                    {getAlertTypeInfo(selectedAlert.alert_type).label}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sévérité</label>
                  <p className="text-sm text-gray-900">
                    {getSeverityInfo(selectedAlert.severity).label}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Organisation</label>
                  <p className="text-sm text-gray-900">{selectedAlert.organization_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Statut</label>
                  <p className="text-sm text-gray-900">
                    {selectedAlert.is_active ? 'Active' : 'Résolue'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Créée le</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedAlert.created_at).toLocaleString('fr-FR')}
                  </p>
                </div>
                {selectedAlert.resolved_at && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Résolue le</label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedAlert.resolved_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowDetails(false)}>
                Fermer
              </Button>
              {selectedAlert.is_active && (
                <Button 
                  onClick={() => {
                    handleResolveAlert(selectedAlert.id);
                    setShowDetails(false);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Marquer comme résolue
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsManager;
import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Search, Eye, Edit, Calendar, 
  CheckCircle, AlertTriangle, TrendingUp, FileText, Download
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import apiService from '../../services/api';

const InventoriesManager = () => {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);

  useEffect(() => {
    loadInventories();
  }, []);

  const loadInventories = async () => {
    try {
      setLoading(true);
      const response = await apiService.getInventories();
      setInventories(response.results || response);
    } catch (error) {
      console.error('Erreur lors du chargement des inventaires:', error);
      setError('Impossible de charger les inventaires');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (inventory) => {
    setSelectedInventory(inventory);
    setShowDetails(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'PENDING': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'COMPLETED': return 'Terminé';
      case 'IN_PROGRESS': return 'En cours';
      case 'PENDING': return 'En attente';
      default: return 'Inconnu';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'IN_PROGRESS': return <Package className="w-4 h-4" />;
      case 'PENDING': return <AlertTriangle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  // Données fictives pour la démonstration
  const mockInventories = [
    {
      id: 1,
      date: '2024-10-01',
      type: 'MONTHLY',
      status: 'COMPLETED',
      site: 'CS Bangangté',
      items_count: 45,
      discrepancies_count: 3,
      total_value: 12850,
      responsible: 'Marie Dupont',
      completion_rate: 95,
      notes: 'Inventaire mensuel standard. Quelques écarts mineurs détectés.'
    },
    {
      id: 2,
      date: '2024-09-15',
      type: 'AUDIT',
      status: 'COMPLETED',
      site: 'Hôpital Yaoundé',
      items_count: 120,
      discrepancies_count: 8,
      total_value: 35400,
      responsible: 'Jean Mballa',
      completion_rate: 100,
      notes: 'Audit annuel. Écarts acceptables dans les normes.'
    },
    {
      id: 3,
      date: '2024-10-20',
      type: 'MONTHLY',
      status: 'IN_PROGRESS',
      site: 'CS Garoua',
      items_count: 32,
      discrepancies_count: 0,
      total_value: 0,
      responsible: 'Paul Nkomo',
      completion_rate: 65,
      notes: 'Inventaire en cours de réalisation.'
    }
  ];

  const displayInventories = inventories.length > 0 ? inventories : mockInventories;

  const filteredInventories = displayInventories.filter(inventory => {
    const matchesSearch = inventory.site?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inventory.responsible?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || inventory.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-lg shadow space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
            Gestion des Inventaires
          </h1>
          <p className="text-gray-600 mt-1">
            Suivi et contrôle des inventaires mensuels et audits
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nouvel Inventaire</span>
        </Button>
      </div>

      {/* Filtres et recherche */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par site ou responsable..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="COMPLETED">Terminés</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="PENDING">En attente</option>
            </select>
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="w-8 h-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Inventaires</p>
              <p className="text-2xl font-semibold text-gray-900">{displayInventories.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Terminés</p>
              <p className="text-2xl font-semibold text-gray-900">
                {displayInventories.filter(inv => inv.status === 'COMPLETED').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Écarts Détectés</p>
              <p className="text-2xl font-semibold text-gray-900">
                {displayInventories.reduce((sum, inv) => sum + inv.discrepancies_count, 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Valeur Totale</p>
              <p className="text-2xl font-semibold text-gray-900">
                {displayInventories.reduce((sum, inv) => sum + inv.total_value, 0).toLocaleString()}€
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Liste des inventaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredInventories.map((inventory) => (
          <Card key={inventory.id} className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{inventory.site}</h3>
                <p className="text-sm text-gray-600 flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(inventory.date).toLocaleDateString('fr-FR')}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inventory.status)}`}>
                  {getStatusIcon(inventory.status)}
                  <span className="ml-1">{getStatusLabel(inventory.status)}</span>
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Type:</span>
                <span className="text-sm font-medium">
                  {inventory.type === 'MONTHLY' ? 'Mensuel' : 
                   inventory.type === 'AUDIT' ? 'Audit' : 'Autre'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Articles:</span>
                <span className="text-sm font-medium">{inventory.items_count}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Écarts:</span>
                <span className={`text-sm font-medium ${inventory.discrepancies_count > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {inventory.discrepancies_count}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Valeur:</span>
                <span className="text-sm font-medium">{inventory.total_value.toLocaleString()}€</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Responsable:</span>
                <span className="text-sm font-medium">{inventory.responsible}</span>
              </div>

              {inventory.status === 'IN_PROGRESS' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Progression:</span>
                    <span className="text-sm font-medium">{inventory.completion_rate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${inventory.completion_rate}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={() => handleViewDetails(inventory)}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-1" />
                Détails
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-blue-50 hover:bg-blue-100"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-green-50 hover:bg-green-100"
              >
                <FileText className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de détails */}
      {showDetails && selectedInventory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Inventaire - {selectedInventory.site}
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Informations Générales</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Date:</span>
                      <span className="text-sm font-medium">
                        {new Date(selectedInventory.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Type:</span>
                      <span className="text-sm font-medium">
                        {selectedInventory.type === 'MONTHLY' ? 'Mensuel' : 'Audit'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Statut:</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${getStatusColor(selectedInventory.status)}`}>
                        {getStatusLabel(selectedInventory.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Responsable:</span>
                      <span className="text-sm font-medium">{selectedInventory.responsible}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Résultats</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Articles comptés:</span>
                      <span className="text-sm font-medium">{selectedInventory.items_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Écarts détectés:</span>
                      <span className={`text-sm font-medium ${selectedInventory.discrepancies_count > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {selectedInventory.discrepancies_count}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Valeur totale:</span>
                      <span className="text-sm font-medium">{selectedInventory.total_value.toLocaleString()}€</span>
                    </div>
                    {selectedInventory.status === 'IN_PROGRESS' && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Progression:</span>
                        <span className="text-sm font-medium">{selectedInventory.completion_rate}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedInventory.notes && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Notes</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedInventory.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowDetails(false)}>
                Fermer
              </Button>
              <Button>
                <FileText className="w-4 h-4 mr-2" />
                Rapport
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* État vide */}
      {!loading && filteredInventories.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun inventaire trouvé
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Aucun inventaire ne correspond à votre recherche.' : 'Commencez par créer votre premier inventaire.'}
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Inventaire
          </Button>
        </Card>
      )}
    </div>
  );
};

export default InventoriesManager;
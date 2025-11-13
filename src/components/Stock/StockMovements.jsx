import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Search, Calendar, Filter,
  Package, ArrowRight, Eye, Download, RefreshCw
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import apiService from '../../services/api';

const StockMovements = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [dateRange, setDateRange] = useState('week');

  useEffect(() => {
    loadMovements();
  }, []);

  const loadMovements = async () => {
    try {
      setLoading(true);
      // API endpoint à implémenter
      // const response = await apiService.getStockMovements();
      // setMovements(response.results || response);
      
      // Données fictives en attendant l'API
      setMovements(mockMovements);
    } catch (error) {
      console.error('Erreur lors du chargement des mouvements:', error);
      setError('Impossible de charger les mouvements de stock');
    } finally {
      setLoading(false);
    }
  };

  // Données fictives pour la démonstration
  const mockMovements = [
    {
      id: 1,
      date: '2024-10-25T14:30:00Z',
      type: 'ENTRY',
      medication: 'Amoxicilline 500mg',
      medication_code: 'AMOX500',
      quantity: 100,
      unit: 'gélules',
      reference: 'LIV-2024-0125',
      source: 'Livraison MDM/GFFO5',
      destination: 'Stock CS Bangangté',
      responsible: 'Marie Dupont',
      batch: 'LOT2024001',
      expiry_date: '2025-06-01',
      cost: 250.00,
      notes: 'Livraison complète conforme'
    },
    {
      id: 2,
      date: '2024-10-25T10:15:00Z',
      type: 'EXIT',
      medication: 'Paracétamol 500mg',
      medication_code: 'PARA500',
      quantity: 20,
      unit: 'comprimés',
      reference: 'DISP-2024-0089',
      source: 'Stock CS Bangangté',
      destination: 'Patient: Jean MBALLA',
      responsible: 'Paul Nkomo',
      batch: 'LOT2024012',
      expiry_date: '2025-03-15',
      cost: 24.00,
      notes: 'Dispensation sur ordonnance'
    },
    {
      id: 3,
      date: '2024-10-24T16:45:00Z',
      type: 'TRANSFER',
      medication: 'Artémether 80mg/ml',
      medication_code: 'ARTE80',
      quantity: 15,
      unit: 'ampoules',
      reference: 'TRANS-2024-0034',
      source: 'Stock Hôpital Yaoundé',
      destination: 'Stock CS Garoua',
      responsible: 'Dr. Ateba',
      batch: 'LOT2024008',
      expiry_date: '2025-09-30',
      cost: 375.00,
      notes: 'Transfert d\'urgence pour rupture'
    },
    {
      id: 4,
      date: '2024-10-24T09:20:00Z',
      type: 'ADJUSTMENT',
      medication: 'Cotrimoxazole 480mg',
      medication_code: 'COTRI480',
      quantity: -3,
      unit: 'comprimés',
      reference: 'ADJ-2024-0012',
      source: 'Stock CS Bangangté',
      destination: 'Ajustement inventaire',
      responsible: 'Marie Dupont',
      batch: 'LOT2024015',
      expiry_date: '2025-12-31',
      cost: -5.40,
      notes: 'Correction suite inventaire - produits expirés'
    },
    {
      id: 5,
      date: '2024-10-23T13:10:00Z',
      type: 'WASTE',
      medication: 'Fer + Acide folique',
      medication_code: 'FER200',
      quantity: 30,
      unit: 'comprimés',
      reference: 'WASTE-2024-0007',
      source: 'Stock CS Garoua',
      destination: 'Destruction',
      responsible: 'Infirmier Chef',
      batch: 'LOT2024003',
      expiry_date: '2024-10-20',
      cost: 135.00,
      notes: 'Destruction pour expiration'
    }
  ];

  const getMovementTypeInfo = (type) => {
    switch (type) {
      case 'ENTRY':
        return {
          label: 'Entrée',
          icon: TrendingUp,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'EXIT':
        return {
          label: 'Sortie',
          icon: TrendingDown,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'TRANSFER':
        return {
          label: 'Transfert',
          icon: ArrowRight,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200'
        };
      case 'ADJUSTMENT':
        return {
          label: 'Ajustement',
          icon: RefreshCw,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200'
        };
      case 'WASTE':
        return {
          label: 'Perte',
          icon: TrendingDown,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return {
          label: 'Autre',
          icon: Package,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const getDateRangeMovements = () => {
    const now = new Date();
    const filterDate = new Date();
    
    switch (dateRange) {
      case 'day':
        filterDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      default:
        return movements;
    }
    
    return movements.filter(movement => new Date(movement.date) >= filterDate);
  };

  const filteredMovements = getDateRangeMovements().filter(movement => {
    const matchesSearch = movement.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.medication_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || movement.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Statistiques
  const stats = {
    totalMovements: filteredMovements.length,
    entries: filteredMovements.filter(m => m.type === 'ENTRY').length,
    exits: filteredMovements.filter(m => m.type === 'EXIT').length,
    totalValue: filteredMovements.reduce((sum, m) => sum + Math.abs(m.cost), 0)
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
            Mouvements de Stock
          </h1>
          <p className="text-gray-600 mt-1">
            Traçabilité complète des entrées, sorties et transferts
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
          <Button onClick={loadMovements} className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
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
                placeholder="Rechercher médicament, code ou référence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">Tous les types</option>
              <option value="ENTRY">Entrées</option>
              <option value="EXIT">Sorties</option>
              <option value="TRANSFER">Transferts</option>
              <option value="ADJUSTMENT">Ajustements</option>
              <option value="WASTE">Pertes</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="day">Dernières 24h</option>
              <option value="week">7 derniers jours</option>
              <option value="month">30 derniers jours</option>
              <option value="all">Tous</option>
            </select>
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
              <p className="text-sm font-medium text-gray-500">Total Mouvements</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalMovements}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Entrées</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.entries}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Sorties</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.exits}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-semibold">€</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Valeur Totale</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalValue.toFixed(2)}€</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Liste des mouvements */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Historique des Mouvements
          </h3>
        </div>

        {filteredMovements.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredMovements.map((movement) => {
              const typeInfo = getMovementTypeInfo(movement.type);
              const Icon = typeInfo.icon;
              
              return (
                <div key={movement.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${typeInfo.bgColor} ${typeInfo.borderColor} border`}>
                        <Icon className={`w-5 h-5 ${typeInfo.color}`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">{movement.medication}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.bgColor} ${typeInfo.color}`}>
                            {typeInfo.label}
                          </span>
                          <span className="text-sm text-gray-500">#{movement.reference}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Quantité:</span>
                            <span className={`ml-2 font-medium ${movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {movement.quantity > 0 ? '+' : ''}{movement.quantity} {movement.unit}
                            </span>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Source:</span>
                            <span className="ml-2 font-medium text-gray-900">{movement.source}</span>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Destination:</span>
                            <span className="ml-2 font-medium text-gray-900">{movement.destination}</span>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Responsable:</span>
                            <span className="ml-2 font-medium text-gray-900">{movement.responsible}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-2">
                          <div>
                            <span className="text-gray-500">Lot:</span>
                            <span className="ml-2 font-mono text-gray-900">{movement.batch}</span>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Expiration:</span>
                            <span className="ml-2 text-gray-900">
                              {new Date(movement.expiry_date).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Coût:</span>
                            <span className={`ml-2 font-medium ${movement.cost >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {movement.cost >= 0 ? '+' : ''}{movement.cost.toFixed(2)}€
                            </span>
                          </div>
                        </div>

                        {movement.notes && (
                          <div className="mt-2">
                            <span className="text-gray-500 text-sm">Notes:</span>
                            <p className="text-sm text-gray-600 italic mt-1">{movement.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <span className="text-sm text-gray-500">
                        {new Date(movement.date).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(movement.date).toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun mouvement trouvé
            </h3>
            <p className="text-gray-600">
              {searchTerm ? 'Aucun mouvement ne correspond à votre recherche.' : 'Aucun mouvement enregistré pour cette période.'}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default StockMovements;
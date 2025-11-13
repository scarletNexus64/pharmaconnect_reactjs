import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, AlertTriangle, TrendingUp, Plus, Search, Filter, Calendar, Download, Eye, Edit, Trash2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import apiService from '../../services/api';

const StockManagement = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlert, setSelectedAlert] = useState('all');
  const [stockEntries, setStockEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStockData();
  }, []);

  const loadStockData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getStockEntries();
      setStockEntries(response.results || response);
    } catch (error) {
      console.error('Erreur lors du chargement des stocks:', error);
      setError('Impossible de charger les données de stock');
    } finally {
      setLoading(false);
    }
  };

  // Données fictives pour la gestion des stocks
  const stockSummary = [
    { label: 'Références', value: '245', icon: Package, color: 'bg-blue-500', change: '+12' },
    { label: 'Alertes Actives', value: '15', icon: AlertTriangle, color: 'bg-red-500', change: '-3' },
    { label: 'Valeur Stock', value: '12.5k€', icon: TrendingUp, color: 'bg-green-500', change: '+2.1k€' },
    { label: 'Disponibilité', value: '95%', icon: Package, color: 'bg-purple-500', change: '+2%' }
  ];

  const currentStock = [
    {
      id: 1,
      name: 'Amoxicilline 500mg',
      code: 'AMX-500',
      currentStock: 145,
      cmm: 67,
      status: 'ok',
      expiry: '6 mois',
      batch: 'A123-2024',
      lastMovement: '3j ago',
      alert: null
    },
    {
      id: 2,
      name: 'Paracétamol 500mg',
      code: 'PAR-500',
      currentStock: 45,
      cmm: 67,
      status: 'pre-rupture',
      expiry: '8 mois',
      batch: 'P456-2024',
      lastMovement: '1j ago',
      alert: 'Pré-rupture: Stock insuffisant pour couvrir le délai de livraison'
    },
    {
      id: 3,
      name: 'Artémether 80mg/ml',
      code: 'ART-80',
      currentStock: 0,
      cmm: 12,
      status: 'rupture',
      expiry: '-',
      batch: '-',
      lastMovement: '5j ago',
      alert: 'Rupture complète: Commande urgente nécessaire'
    },
    {
      id: 4,
      name: 'SRO Sachets',
      code: 'SRO-001',
      currentStock: 298,
      cmm: 45,
      status: 'ok',
      expiry: '12 mois',
      batch: 'S789-2024',
      lastMovement: '2h ago',
      alert: null
    },
    {
      id: 5,
      name: 'Cotrimoxazole 480mg',
      code: 'COT-480',
      currentStock: 23,
      cmm: 34,
      status: 'pre-rupture',
      expiry: '4 mois',
      batch: 'C234-2024',
      lastMovement: '6h ago',
      alert: 'Pré-rupture: Stock critique'
    }
  ];


  const criticalAlerts = [
    {
      id: 1,
      type: 'Rupture',
      medicine: 'Artémether 80mg',
      site: 'CS Bangangté',
      severity: 'critical',
      description: 'Stock épuisé depuis 5 jours',
      action: 'Commande urgente',
      timeAgo: '5j'
    },
    {
      id: 2,
      type: 'Pré-rupture',
      medicine: 'Paracétamol 500mg',
      site: 'CS Bangangté',
      severity: 'warning',
      description: 'Stock insuffisant (45 unités, CMM: 67)',
      action: 'Planifier commande',
      timeAgo: '1j'
    },
    {
      id: 3,
      type: 'Expiration',
      medicine: 'Amoxicilline Lot#A123',
      site: 'CS Garoua',
      severity: 'warning',
      description: 'Expiration dans 2 mois',
      action: 'Redistribution urgente',
      timeAgo: '2h'
    }
  ];

  const stockByCategory = [
    { name: 'Antibiotiques', value: 35, color: '#3B82F6' },
    { name: 'Antalgiques', value: 25, color: '#10B981' },
    { name: 'Antipaludiques', value: 20, color: '#F59E0B' },
    { name: 'Réhydratation', value: 15, color: '#8B5CF6' },
    { name: 'Autres', value: 5, color: '#EF4444' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ok': return 'bg-green-100 text-green-800';
      case 'pre-rupture': return 'bg-yellow-100 text-yellow-800';
      case 'rupture': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ok': return '🟢';
      case 'pre-rupture': return '🟡';
      case 'rupture': return '🔴';
      default: return '⚪';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const filteredStock = currentStock.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAlert = selectedAlert === 'all' || 
                        (selectedAlert === 'alerts' && item.alert) ||
                        (selectedAlert === 'ok' && !item.alert);
    return matchesSearch && matchesAlert;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Stocks</h1>
          <p className="text-gray-600 mt-1">Suivi en temps réel des stocks médicaux</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Livraison
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Statistiques Stocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stockSummary.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">
                    {stat.change} ce mois
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alertes prioritaires & Répartition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
            Alertes Prioritaires
          </h3>
          <div className="space-y-3">
            {criticalAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-sm">{alert.type}</p>
                    <p className="text-xs text-gray-600">{alert.site}</p>
                  </div>
                  <span className="text-xs">{alert.timeAgo}</span>
                </div>
                <p className="font-medium text-sm">{alert.medicine}</p>
                <p className="text-xs text-gray-600 mb-2">{alert.description}</p>
                <button className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded hover:bg-opacity-75">
                  {alert.action}
                </button>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-sm font-medium">
            Voir toutes les alertes (15)
          </button>
        </div>

        {/* Répartition par catégorie */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Catégorie</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stockByCategory}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {stockByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Proportion']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {stockByCategory.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm text-gray-600">{entry.name}: {entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'current', label: 'Stock Actuel', icon: Package },
              { id: 'entries', label: 'Entrées', icon: Plus },
              { id: 'movements', label: 'Mouvements', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Stock Actuel */}
          {activeTab === 'current' && (
            <div className="space-y-4">
              {/* Filtres */}
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Rechercher médicament..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select
                  value={selectedAlert}
                  onChange={(e) => setSelectedAlert(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="alerts">Avec alertes</option>
                  <option value="ok">Stock OK</option>
                </select>
              </div>

              {/* Table des stocks */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Statut</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Médicament</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Stock</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">CMM</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Expiration</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Lot</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStock.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {getStatusIcon(item.status)} {
                              item.status === 'ok' ? 'OK' :
                              item.status === 'pre-rupture' ? 'Pré-rupt.' :
                              'Rupture'
                            }
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-600">{item.code}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">{item.currentStock}</span>
                          <span className="text-gray-500 text-sm ml-1">unités</span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{item.cmm}</td>
                        <td className="py-3 px-4 text-gray-600">{item.expiry}</td>
                        <td className="py-3 px-4 text-gray-600 font-mono text-sm">{item.batch}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">Détail</button>
                            {item.status === 'rupture' && (
                              <button className="text-red-600 hover:text-red-800 text-sm">Commande</button>
                            )}
                            {item.status === 'pre-rupture' && (
                              <button className="text-yellow-600 hover:text-yellow-800 text-sm">Alerte</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Alertes détaillées */}
              {filteredStock.some(item => item.alert) && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Alertes Détaillées</h4>
                  <div className="space-y-2">
                    {filteredStock.filter(item => item.alert).map((item) => (
                      <div key={`alert-${item.id}`} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-yellow-800">{item.name}</p>
                            <p className="text-sm text-yellow-700">{item.alert}</p>
                          </div>
                          <button className="text-yellow-600 hover:text-yellow-800 text-sm">
                            Traiter
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Entrées en stock */}
          {activeTab === 'entries' && (
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Livraisons Récentes</h3>
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Nouvelle Livraison</span>
                </Button>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-gray-50 rounded-lg p-6 border animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : stockEntries.length > 0 ? (
                <>
                  {stockEntries.map((entry) => (
                    <Card key={entry.id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(entry.delivery_date).toLocaleDateString('fr-FR')}</span>
                            <span>|</span>
                            <span>{entry.supplier}</span>
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {entry.organization_name} → {entry.project_name}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Livré: {entry.reception_percentage}%
                          </span>
                          {entry.is_expiry_risk && (
                            <div className="mt-1">
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                Risque expiration
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                            <Package className="w-4 h-4" />
                            <span>Médicament livré</span>
                          </h5>
                          <div className="bg-white rounded p-4 border">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-sm">{entry.medication_details.name}</p>
                                <p className="text-xs text-gray-600">
                                  {entry.medication_details.dosage} | {entry.medication_details.form}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Commandé: {entry.quantity_ordered} → Livré: {entry.quantity_delivered}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full" 
                                    style={{ width: `${entry.reception_percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500">{entry.reception_percentage}%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-white rounded p-4 border">
                            <h5 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                              <TrendingUp className="w-4 h-4" />
                              <span>Informations Financières</span>
                            </h5>
                            <p className="text-2xl font-bold text-green-600">
                              {(parseFloat(entry.unit_price) * entry.quantity_delivered).toFixed(2)}€
                            </p>
                            <p className="text-sm text-gray-600">Valeur totale livrée</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Prix unitaire: {entry.unit_price}€
                            </p>
                          </div>

                          <div className="bg-white rounded p-4 border">
                            <h5 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                              <AlertTriangle className="w-4 h-4" />
                              <span>Gestion Expiration</span>
                            </h5>
                            <p className="text-sm">
                              <span className="font-medium">Expiration:</span> {new Date(entry.expiry_date).toLocaleDateString('fr-FR')}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Lot:</span> {entry.batch_number}
                            </p>
                            {entry.is_expiry_risk && (
                              <p className="text-sm text-red-600 font-medium mt-1">
                                ⚠️ Risque d'expiration proche
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-3 mt-4">
                        <Button variant="outline" size="sm" className="flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span>Détails</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center space-x-2">
                          <Download className="w-4 h-4" />
                          <span>Rapport</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center space-x-2 text-red-600 hover:text-red-700">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Signaler</span>
                        </Button>
                      </div>
                    </Card>
                  ))}

                  <div className="text-center py-6">
                    <p className="text-gray-600">
                      {stockEntries.length} livraison{stockEntries.length > 1 ? 's' : ''} • 
                      Taux réception moyen: {stockEntries.reduce((sum, entry) => sum + entry.reception_percentage, 0) / stockEntries.length}%
                    </p>
                  </div>
                </>
              ) : (
                <Card className="p-12 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune livraison enregistrée
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Commencez par enregistrer des livraisons de stock.
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle Livraison
                  </Button>
                </Card>
              )}
            </div>
          )}

          {/* Mouvements de stock */}
          {activeTab === 'movements' && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Module de suivi des mouvements en développement</p>
              <p className="text-sm text-gray-500 mt-2">Historique des entrées/sorties et traçabilité</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockManagement;
import React, { useState, useEffect } from 'react';
import {
  Package, TrendingUp, TrendingDown, AlertTriangle,
  Search, Filter, Download, Plus, Calendar, ChevronRight,
  Edit, Trash2, DollarSign, BarChart
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ProtectedRoute from '../../components/ProtectedRoute';
import apiService from '../../services/api';
import { Link } from 'react-router-dom';
import StockEntryModal from '../../components/Stock/StockEntryModal';

const Stock = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    loadStockData();
  }, []);

  const loadStockData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getStockEntries();
      setStockData(response.results || []);
    } catch (error) {
      console.error('Erreur lors du chargement du stock:', error);
      setStockData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = () => {
    setSelectedEntry(null);
    setShowModal(true);
  };

  const handleEditStock = (entry) => {
    setSelectedEntry(entry);
    setShowModal(true);
  };

  const handleDeleteStock = async (entryId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entrée de stock ?')) {
      try {
        await apiService.deleteStockEntry(entryId);
        loadStockData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de l\'entrée de stock');
      }
    }
  };

  const handleExportData = () => {
    // Préparer les données pour l'export CSV
    const csvData = filteredStock.map(item => ({
      'Médicament': item.medication_details?.name || item.medication_name || 'N/A',
      'Lot': item.batch_number || '-',
      'Quantité commandée': item.quantity_ordered || 0,
      'Quantité livrée': item.quantity_delivered || 0,
      'Date de livraison': item.delivery_date ? new Date(item.delivery_date).toLocaleDateString('fr-FR') : '-',
      'Date d\'expiration': item.expiry_date ? new Date(item.expiry_date).toLocaleDateString('fr-FR') : '-',
      'Fournisseur': item.supplier || '-',
      'Prix unitaire': item.unit_price || 0,
      'Valeur totale': (item.quantity_delivered || 0) * (item.unit_price || 0)
    }));

    // Créer le CSV
    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    // Télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `stock_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du stock...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  };

  const stats = {
    totalItems: stockData.length,
    totalQuantity: stockData.reduce((sum, item) => sum + (item.quantity_delivered || 0), 0),
    totalValue: stockData.reduce((sum, item) => sum + ((item.quantity_delivered || 0) * (item.unit_price || 0)), 0),
    expiringSoon: stockData.filter(item => {
      if (!item.expiry_date) return false;
      const daysUntilExpiry = Math.floor((new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry > 0 && daysUntilExpiry <= 90;
    }).length,
    expired: stockData.filter(item => {
      if (!item.expiry_date) return false;
      return new Date(item.expiry_date) < new Date();
    }).length
  };

  const filteredStock = stockData.filter(item => {
    const medicationName = item.medication_details?.name || item.medication_name || '';
    const matchesSearch = medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.batch_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'expiring') {
      if (!item.expiry_date) return false;
      const daysUntilExpiry = Math.floor((new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24));
      return matchesSearch && daysUntilExpiry > 0 && daysUntilExpiry <= 90;
    } else if (filterStatus === 'expired') {
      if (!item.expiry_date) return false;
      return matchesSearch && new Date(item.expiry_date) < new Date();
    }

    return matchesSearch;
  });

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-700 font-medium">Gestion du Stock</span>
        </nav>

        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion du Stock</h1>
          <p className="text-gray-600 mt-2">
            Consultez et gérez l'état du stock de médicaments.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="w-8 h-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Entrées en stock</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalItems}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Quantité totale</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalQuantity.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="w-8 h-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Valeur totale</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalValue.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Alertes</p>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-orange-600">{stats.expiringSoon}</span>
                  <span className="text-sm text-gray-500">/</span>
                  <span className="text-lg font-semibold text-red-600">{stats.expired}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Proche / Expiré</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions and Filters */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un médicament..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Tous les articles</option>
                <option value="expiring">Expiration proche (90j)</option>
                <option value="expired">Expiré</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="flex items-center space-x-2"
                onClick={handleExportData}
                disabled={filteredStock.length === 0}
              >
                <Download className="w-4 h-4" />
                <span>Exporter</span>
              </Button>
              <Button
                className="flex items-center space-x-2"
                onClick={handleAddStock}
              >
                <Plus className="w-4 h-4" />
                <span>Nouvelle entrée</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Stock Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Médicament
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lot / Fournisseur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix / Valeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStock.length > 0 ? filteredStock.map((item) => {
                  const daysUntilExpiry = item.expiry_date
                    ? Math.floor((new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24))
                    : null;
                  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry > 0 && daysUntilExpiry <= 90;
                  const isExpired = daysUntilExpiry !== null && daysUntilExpiry <= 0;
                  const receptionRate = item.quantity_ordered > 0
                    ? Math.round((item.quantity_delivered / item.quantity_ordered) * 100)
                    : 100;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.medication_details?.name || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.medication_details?.dosage} - {item.medication_details?.form}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{item.batch_number || '-'}</div>
                        <div className="text-xs text-gray-500">{item.supplier || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.quantity_delivered?.toLocaleString() || 0}
                        </div>
                        {item.quantity_ordered > 0 && (
                          <div className="text-xs text-gray-500">
                            Cmd: {item.quantity_ordered?.toLocaleString()} ({receptionRate}%)
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            Livr: {item.delivery_date ? new Date(item.delivery_date).toLocaleDateString('fr-FR') : '-'}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Exp: {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString('fr-FR') : '-'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {(item.unit_price || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                        </div>
                        <div className="text-xs text-gray-500">
                          Total: {((item.quantity_delivered || 0) * (item.unit_price || 0)).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isExpired ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Expiré
                          </span>
                        ) : isExpiringSoon ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Expire dans {daysUntilExpiry}j
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditStock(item)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStock(item.id)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p>Aucune entrée de stock trouvée</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <div className="p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Gestion du stock</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Le système surveille automatiquement les dates d'expiration des entrées en stock.
                  Les alertes vous permettent de gérer efficacement les produits à risque de péremption.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Modal d'ajout/modification d'entrée de stock */}
        {showModal && (
          <StockEntryModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setSelectedEntry(null);
            }}
            onSave={loadStockData}
            stockEntry={selectedEntry}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Stock;

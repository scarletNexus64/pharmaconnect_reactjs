import React, { useState, useEffect } from 'react';
import {
  ShoppingCart, Calendar, User, Package, CheckCircle,
  XCircle, Clock, Search, Plus, ChevronRight, FileText
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ProtectedRoute from '../../components/ProtectedRoute';
import apiService from '../../services/api';
import { Link } from 'react-router-dom';

const Dispensation = () => {
  const [dispensations, setDispensations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadDispensations();
  }, []);

  const loadDispensations = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDispensations();
      setDispensations(response.results || []);
    } catch (error) {
      console.error('Erreur lors du chargement des dispensations:', error);
      setDispensations([]);
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
            <p className="text-gray-600">Chargement des dispensations...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  };

  const stats = {
    total: dispensations.length,
    completed: dispensations.filter(d => d.status === 'COMPLETED').length,
    partial: dispensations.filter(d => d.status === 'PARTIAL').length,
    pending: dispensations.filter(d => d.status === 'PENDING').length
  };

  const filteredDispensations = dispensations.filter(disp => {
    const matchesSearch = disp.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         disp.prescription_number?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && disp.status === filterStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PARTIAL':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'Complet';
      case 'PARTIAL':
        return 'Partiel';
      case 'PENDING':
        return 'En attente';
      case 'CANCELLED':
        return 'Annulé';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return CheckCircle;
      case 'PARTIAL':
        return Clock;
      case 'PENDING':
        return Clock;
      case 'CANCELLED':
        return XCircle;
      default:
        return Clock;
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-700 font-medium">Dispensation</span>
        </nav>

        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dispensation de Médicaments</h1>
          <p className="text-gray-600 mt-2">
            Gérez les dispensations de médicaments aux patients.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingCart className="w-8 h-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Complètes</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Partielles</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.partial}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">En attente</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
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
                  placeholder="Rechercher un patient..."
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
                <option value="all">Tous les statuts</option>
                <option value="COMPLETED">Complet</option>
                <option value="PARTIAL">Partiel</option>
                <option value="PENDING">En attente</option>
                <option value="CANCELLED">Annulé</option>
              </select>
            </div>

            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Nouvelle dispensation</span>
            </Button>
          </div>
        </Card>

        {/* Dispensations List */}
        <div className="space-y-4">
          {filteredDispensations.length > 0 ? filteredDispensations.map((disp) => {
            const StatusIcon = getStatusIcon(disp.status);

            return (
              <Card key={disp.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{disp.patient_name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(disp.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {getStatusLabel(disp.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{new Date(disp.dispensation_date).toLocaleDateString('fr-FR')}</span>
                      </div>

                      {disp.prescription_number && (
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Ordonnance: {disp.prescription_number}</span>
                        </div>
                      )}

                      {disp.dispensed_by_name && (
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Par: {disp.dispensed_by_name}</span>
                        </div>
                      )}
                    </div>

                    {disp.notes && (
                      <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium text-gray-700 mb-1">Notes:</p>
                        <p>{disp.notes}</p>
                      </div>
                    )}
                  </div>

                  <Button variant="outline" className="ml-4">
                    Détails
                  </Button>
                </div>
              </Card>
            );
          }) : (
            <Card className="p-12">
              <div className="text-center">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune dispensation trouvée
                </h3>
                <p className="text-gray-500">
                  Aucune dispensation ne correspond à vos critères de recherche.
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <div className="p-6">
            <div className="flex items-start space-x-3">
              <Package className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Dispensation de médicaments</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Toutes les dispensations sont enregistrées et tracées pour assurer une gestion optimale
                  du stock et un suivi précis des traitements distribués aux patients.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default Dispensation;

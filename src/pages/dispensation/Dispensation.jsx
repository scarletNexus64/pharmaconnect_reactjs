import React, { useState, useEffect } from 'react';
import {
  ShoppingCart, Calendar, User, Package, CheckCircle,
  XCircle, Clock, Search, ChevronRight, FileText, Smartphone,
  Pill, MapPin, AlertCircle, RefreshCw
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
      setDispensations(response.results || response || []);
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
  }

  const stats = {
    total: dispensations.length,
    completed: dispensations.filter(d => d.status === 'COMPLETED' || d.status === 'DELIVERED').length,
    partial: dispensations.filter(d => d.status === 'PARTIAL').length,
    pending: dispensations.filter(d => d.status === 'PENDING').length
  };

  const filteredDispensations = dispensations.filter(disp => {
    const matchesSearch = disp.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         disp.prescription_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         disp.service_name?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && disp.status === filterStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
      case 'DELIVERED':
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
      case 'DELIVERED':
        return 'Délivrée';
      case 'PARTIAL':
        return 'Partielle';
      case 'PENDING':
        return 'En attente';
      case 'CANCELLED':
        return 'Annulée';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
      case 'DELIVERED':
        return CheckCircle;
      case 'PARTIAL':
        return AlertCircle;
      case 'PENDING':
        return Clock;
      case 'CANCELLED':
        return XCircle;
      default:
        return Clock;
    }
  };

  const getDestinationLabel = (destination) => {
    switch (destination) {
      case 'PATIENT':
        return 'Patient';
      case 'SERVICE':
        return 'Service Hôpital';
      case 'EXPIRED':
        return 'Périmés/Détériorés';
      case 'RETURN':
        return 'Retour Pharmacie';
      default:
        return destination;
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-700 font-medium">Dispensations</span>
        </nav>

        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dispensations de Médicaments</h1>
          <p className="text-gray-600 mt-2">
            Visualisez les dispensations effectuées depuis l'application mobile terrain.
          </p>
        </div>

        {/* Mobile App Info Banner */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Dispensations depuis l'application mobile
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  Les dispensations sont enregistrées directement sur le terrain par les agents de santé
                  via l'application mobile PharmaConnect. Cette interface web vous permet de consulter
                  et suivre toutes les dispensations effectuées en temps réel.
                </p>
                <div className="flex items-center space-x-4 text-xs text-blue-600">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span>Traçabilité complète</span>
                  </div>
                  <div className="flex items-center">
                    <Pill className="w-4 h-4 mr-1" />
                    <span>Gestion du stock automatique</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>Géolocalisation</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={loadDispensations}
                variant="outline"
                className="flex-shrink-0"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        {dispensations.length > 0 && (
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
                  <p className="text-sm font-medium text-gray-500">Délivrées</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="w-8 h-8 text-yellow-500" />
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
        )}

        {/* Filters */}
        {dispensations.length > 0 && (
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1 sm:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un patient, ordonnance..."
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
                <option value="COMPLETED">Délivrée</option>
                <option value="DELIVERED">Délivrée</option>
                <option value="PARTIAL">Partielle</option>
                <option value="PENDING">En attente</option>
                <option value="CANCELLED">Annulée</option>
              </select>
            </div>
          </Card>
        )}

        {/* Dispensations List */}
        <div className="space-y-4">
          {filteredDispensations.length > 0 ? (
            filteredDispensations.map((disp) => {
              const StatusIcon = getStatusIcon(disp.status);

              return (
                <Card key={disp.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {disp.patient_name || disp.service_name || 'N/A'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Destination: {getDestinationLabel(disp.destination)}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(disp.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {getStatusLabel(disp.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 ml-13">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{new Date(disp.dispensation_date).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                        </div>

                        {disp.prescription_number && (
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-gray-400" />
                            <span>N° {disp.prescription_number}</span>
                          </div>
                        )}

                        {disp.prescriber_name && (
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-gray-400" />
                            <span>Prescripteur: {disp.prescriber_name}</span>
                          </div>
                        )}

                        {disp.patient_age && (
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-gray-400" />
                            <span>Âge: {disp.patient_age} ans</span>
                          </div>
                        )}

                        {disp.patient_sex && (
                          <div className="flex items-center">
                            <span>Sexe: {disp.patient_sex === 'M' ? 'Masculin' : 'Féminin'}</span>
                          </div>
                        )}

                        {disp.care_type && (
                          <div className="flex items-center">
                            <Pill className="w-4 h-4 mr-2 text-gray-400" />
                            <span>{disp.care_type}</span>
                          </div>
                        )}
                      </div>

                      {disp.notes && (
                        <div className="mt-3 ml-13 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
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
            })
          ) : dispensations.length === 0 ? (
            // Empty State - No dispensations at all
            <Card className="p-12">
              <div className="text-center max-w-2xl mx-auto">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4">
                    <Smartphone className="w-10 h-10 text-blue-600" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Aucune dispensation enregistrée
                </h3>

                <p className="text-gray-600 mb-6">
                  Les dispensations apparaîtront ici dès qu'elles seront effectuées par les agents
                  de santé via l'application mobile PharmaConnect.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <Smartphone className="w-5 h-5 mr-2" />
                    Comment ça marche ?
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                      <span>Les agents de santé scannent l'ordonnance ou saisissent les données patient</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                      <span>Les médicaments sont dispensés et enregistrés en temps réel</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                      <span>Les données se synchronisent automatiquement avec la plateforme web</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                      <span>Le stock est mis à jour instantanément</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6">
                  <Button onClick={loadDispensations} className="inline-flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualiser la page
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            // No results from search/filter
            <Card className="p-12">
              <div className="text-center">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune dispensation trouvée
                </h3>
                <p className="text-gray-500 mb-4">
                  Aucune dispensation ne correspond à vos critères de recherche.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dispensation;

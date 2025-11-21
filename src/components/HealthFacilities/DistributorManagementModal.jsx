import React, { useState, useEffect } from 'react';
import {
  X, Search, UserPlus, UserX, User, Check, AlertCircle,
  Mail, Phone, Building, Calendar, Loader
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import apiService from '../../services/api';

const DistributorManagementModal = ({ facility, onClose, onUpdate }) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [currentDistributors, setCurrentDistributors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('current'); // 'current' or 'available'
  const [processing, setProcessing] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (facility) {
      loadData();
    }
  }, [facility]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      // Charger les données en parallèle
      const [distributorsRes, usersRes] = await Promise.all([
        apiService.getHealthFacilityDistributors(facility.id),
        apiService.getAvailableDistributors(facility.id)
      ]);

      setCurrentDistributors(distributorsRes);
      setAvailableUsers(usersRes);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDistributor = async (user) => {
    try {
      setProcessing(user.id);
      setError('');

      await apiService.createHealthFacilityDistributor({
        user: user.id,
        health_facility: facility.id,
        is_active: true
      });

      // Recharger les données
      await loadData();

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Erreur lors de l\'assignation:', error);
      setError('Erreur lors de l\'assignation du distributeur');
    } finally {
      setProcessing(null);
    }
  };

  const handleUnassignDistributor = async (distributor) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir retirer ${distributor.user_full_name} de cette formation sanitaire ?`)) {
      return;
    }

    try {
      setProcessing(distributor.id);
      setError('');

      // Désactiver le distributeur plutôt que de le supprimer
      await apiService.updateHealthFacilityDistributor(distributor.id, {
        is_active: false
      });

      // Recharger les données
      await loadData();

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Erreur lors du retrait:', error);
      setError('Erreur lors du retrait du distributeur');
    } finally {
      setProcessing(null);
    }
  };

  const filteredUsers = availableUsers.filter(user => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      user.first_name?.toLowerCase().includes(search) ||
      user.last_name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.username?.toLowerCase().includes(search)
    );
  });

  const filteredDistributors = currentDistributors.filter(dist => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      dist.user_full_name?.toLowerCase().includes(search) ||
      dist.user_email?.toLowerCase().includes(search)
    );
  });

  if (!facility) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-500 to-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                Gestion des Distributeurs
              </h2>
              <p className="text-green-100 text-sm mt-1">
                {facility.name} ({facility.code})
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Statistics Bar */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Distributeurs actifs</p>
                <p className="text-2xl font-bold text-gray-900">{currentDistributors.length}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Users disponibles</p>
                <p className="text-2xl font-bold text-gray-900">{availableUsers.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-900">Erreur</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="px-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('current')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'current'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Distributeurs actuels ({currentDistributors.length})
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'available'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users disponibles ({availableUsers.length})
            </button>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={activeTab === 'current' ? "Rechercher un distributeur..." : "Rechercher un utilisateur..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-green-500 animate-spin" />
              <span className="ml-2 text-gray-600">Chargement...</span>
            </div>
          ) : (
            <>
              {/* Current Distributors Tab */}
              {activeTab === 'current' && (
                <div className="space-y-3">
                  {filteredDistributors.length > 0 ? (
                    filteredDistributors.map((distributor) => (
                      <Card key={distributor.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{distributor.user_full_name}</h4>
                              <div className="mt-2 space-y-1">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                  <span>{distributor.user_email}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                  <span>Assigné le {new Date(distributor.assigned_date).toLocaleDateString('fr-FR')}</span>
                                </div>
                                {distributor.assigned_by_name && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <User className="w-4 h-4 mr-2 text-gray-400" />
                                    <span>Par {distributor.assigned_by_name}</span>
                                  </div>
                                )}
                              </div>
                              {distributor.notes && (
                                <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                  <span className="font-medium">Notes:</span> {distributor.notes}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => handleUnassignDistributor(distributor)}
                            disabled={processing === distributor.id}
                            className="ml-4 flex-shrink-0 text-red-600 border-red-300 hover:bg-red-50"
                          >
                            {processing === distributor.id ? (
                              <>
                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                                Retrait...
                              </>
                            ) : (
                              <>
                                <UserX className="w-4 h-4 mr-2" />
                                Retirer
                              </>
                            )}
                          </Button>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        {searchTerm ? 'Aucun distributeur trouvé' : 'Aucun distributeur assigné à cette formation sanitaire'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Available Users Tab */}
              {activeTab === 'available' && (
                <div className="space-y-3">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <Card key={user.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm font-medium">
                                {user.first_name?.[0]}{user.last_name?.[0]}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">
                                {user.first_name} {user.last_name}
                              </h4>
                              <p className="text-sm text-gray-500">@{user.username}</p>
                              <div className="mt-2 space-y-1">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                  <span>{user.email}</span>
                                </div>
                                {user.phone && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                    <span>{user.phone}</span>
                                  </div>
                                )}
                                {user.organization_name && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Building className="w-4 h-4 mr-2 text-gray-400" />
                                    <span>{user.organization_name}</span>
                                  </div>
                                )}
                                <div className="mt-2">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    user.access_level === 'COORDINATION' ? 'bg-purple-100 text-purple-800' :
                                    user.access_level === 'PROJECT' ? 'bg-blue-100 text-blue-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {user.access_level === 'COORDINATION' ? 'Coordinateur' :
                                     user.access_level === 'PROJECT' ? 'Projet' : 'Formation Sanitaire'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleAssignDistributor(user)}
                            disabled={processing === user.id}
                            className="ml-4 flex-shrink-0"
                          >
                            {processing === user.id ? (
                              <>
                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                                Assignation...
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Assigner
                              </>
                            )}
                          </Button>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        {searchTerm ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur disponible'}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Tous les utilisateurs de votre organisation sont déjà assignés à cette formation sanitaire.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributorManagementModal;

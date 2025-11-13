import React, { useState, useEffect } from 'react';
import { X, Users, Plus, Trash2, UserPlus, Search, Save } from 'lucide-react';
import apiService from '../../services/api';

const DistributorModal = ({ isOpen, onClose, facility, onSave }) => {
  const [distributors, setDistributors] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (facility && isOpen) {
      loadData();
    }
  }, [facility, isOpen]);

  const loadData = async () => {
    if (!facility) return;
    
    setLoading(true);
    try {
      const [distributorsRes, usersRes] = await Promise.all([
        apiService.getDistributorsByFacility(facility.id),
        apiService.request('/users/')
      ]);
      
      setDistributors(distributorsRes.results || []);
      
      // Filtrer les utilisateurs pour exclure ceux déjà assignés (actifs et inactifs)
      const assignedUserIds = (distributorsRes.results || [])
        .map(d => d.user);
      
      const available = (usersRes.results || []).filter(user => 
        !assignedUserIds.includes(user.id)
      );
      setAvailableUsers(available);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setDistributors([]);
      setAvailableUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDistributor = async () => {
    if (!selectedUserId) {
      setErrors({ user: 'Veuillez sélectionner un utilisateur' });
      return;
    }

    setSaving(true);
    try {
      await apiService.createHealthFacilityDistributor({
        user: parseInt(selectedUserId),
        health_facility: facility.id,
        is_active: true
      });

      // Recharger les données
      await loadData();
      setSelectedUserId('');
      setShowAddForm(false);
      setErrors({});
      
      // Notifier le parent
      onSave();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du distributeur:', error);
      
      if (error.response && error.response.data) {
        const serverErrors = {};
        Object.keys(error.response.data).forEach(key => {
          if (Array.isArray(error.response.data[key])) {
            serverErrors[key] = error.response.data[key][0];
          } else {
            serverErrors[key] = error.response.data[key];
          }
        });
        setErrors(serverErrors);
      } else {
        setErrors({ general: 'Erreur lors de l\'ajout du distributeur' });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveDistributor = async (distributorId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir désactiver ce distributeur ?')) {
      return;
    }

    try {
      await apiService.updateHealthFacilityDistributor(distributorId, {
        is_active: false
      });

      // Recharger les données
      await loadData();
      
      // Notifier le parent
      onSave();
    } catch (error) {
      console.error('Erreur lors de la suppression du distributeur:', error);
      alert('Erreur lors de la suppression du distributeur');
    }
  };

  const handleReactivateDistributor = async (distributorId) => {
    try {
      await apiService.updateHealthFacilityDistributor(distributorId, {
        is_active: true
      });

      // Recharger les données
      await loadData();
      
      // Notifier le parent
      onSave();
    } catch (error) {
      console.error('Erreur lors de la réactivation du distributeur:', error);
      alert('Erreur lors de la réactivation du distributeur');
    }
  };

  const filteredUsers = availableUsers.filter(user =>
    !searchTerm || 
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen || !facility) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-blue-600 mr-2" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Gestion des distributeurs
              </h2>
              <p className="text-sm text-gray-600">{facility.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.general}
            </div>
          )}

          {/* Bouton d'ajout */}
          <div className="mb-6">
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter un distributeur</span>
              </button>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Ajouter un nouveau distributeur
                </h3>
                
                {/* Recherche d'utilisateurs */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rechercher un utilisateur
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom, email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Sélection d'utilisateur */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sélectionner un utilisateur *
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => {
                      setSelectedUserId(e.target.value);
                      setErrors(prev => ({ ...prev, user: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.user ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Choisir un utilisateur...</option>
                    {filteredUsers.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.first_name} {user.last_name} ({user.email})
                      </option>
                    ))}
                  </select>
                  {errors.user && (
                    <p className="mt-1 text-sm text-red-600">{errors.user}</p>
                  )}
                </div>

                {/* Boutons d'action */}
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddDistributor}
                    disabled={saving}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>{saving ? 'Ajout...' : 'Ajouter'}</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setSelectedUserId('');
                      setSearchTerm('');
                      setErrors({});
                    }}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Liste des distributeurs */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Distributeurs actuels ({distributors.filter(d => d.is_active).length} actifs)
            </h3>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : distributors.length > 0 ? (
              <div className="space-y-3">
                {distributors.map((distributor) => (
                  <div 
                    key={distributor.id} 
                    className={`flex items-center justify-between p-4 border rounded-lg ${
                      distributor.is_active ? 'bg-white' : 'bg-gray-50 opacity-75'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          distributor.is_active ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <Users className={`h-5 w-5 ${
                            distributor.is_active ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {distributor.user_full_name || 'Nom non disponible'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {distributor.user_email}
                        </p>
                        <p className="text-xs text-gray-400">
                          Assigné le {new Date(distributor.assigned_date).toLocaleDateString('fr-FR')}
                          {distributor.assigned_by_name && ` par ${distributor.assigned_by_name}`}
                        </p>
                        {distributor.notes && (
                          <p className="text-xs text-gray-600 mt-1">
                            Note: {distributor.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        distributor.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {distributor.is_active ? 'Actif' : 'Inactif'}
                      </span>

                      {distributor.is_active ? (
                        <button
                          onClick={() => handleRemoveDistributor(distributor.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                          title="Désactiver"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivateDistributor(distributor.id)}
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors"
                          title="Réactiver"
                        >
                          <UserPlus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun distributeur assigné</p>
                <p className="text-sm text-gray-400">
                  Commencez par ajouter votre premier distributeur
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DistributorModal;
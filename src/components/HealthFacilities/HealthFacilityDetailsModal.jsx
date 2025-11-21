import React, { useState, useEffect } from 'react';
import { X, MapPin, Building2, Users, Navigation, Edit, Phone, Mail, Plus, Trash2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';
import apiService from '../../services/api';

// Configuration Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const HealthFacilityDetailsModal = ({ isOpen, onClose, facility }) => {
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [showAddDistributor, setShowAddDistributor] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [addingDistributor, setAddingDistributor] = useState(false);

  const facilityTypes = {
    'CSI': 'Centre de Santé Intégré',
    'CS': 'Centre de Santé',
    'HOSPITAL': 'Hôpital',
    'MOBILE_CLINIC': 'Clinique mobile',
    'ASC': 'Agent de Santé Communautaire'
  };

  const levelOfCareTypes = {
    'PRIMARY': 'Soins de santé primaire',
    'SECONDARY': 'Soins de santé secondaire',
    'HIV': 'Programme VIH',
    'MALARIA': 'Programme Paludisme',
    'TB': 'Programme Tuberculose',
    'NUTRITION': 'Programme Nutrition',
    'LABORATORY': 'Programme Laboratoire'
  };

  useEffect(() => {
    if (facility && isOpen) {
      loadDistributors();
      loadAvailableUsers();
    }
  }, [facility, isOpen]);

  const loadDistributors = async () => {
    if (!facility) return;
    
    setLoading(true);
    try {
      const response = await apiService.getDistributorsByFacility(facility.id);
      // L'API peut renvoyer directement un tableau ou un objet avec results
      const distributors = Array.isArray(response) ? response : (response.results || []);
      setDistributors(distributors);
    } catch (error) {
      console.error('Erreur lors du chargement des distributeurs:', error);
      setDistributors([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableUsers = async () => {
    if (!facility) return;
    
    try {
      const response = await apiService.getAvailableDistributors(facility.id);
      // L'API peut renvoyer directement un tableau ou un objet avec results
      const users = Array.isArray(response) ? response : (response.results || []);
      setAvailableUsers(users);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs disponibles:', error);
      setAvailableUsers([]);
    }
  };

  const handleAddDistributor = async () => {
    if (!selectedUser || !facility) return;
    
    setAddingDistributor(true);
    try {
      await apiService.createHealthFacilityDistributor({
        user: selectedUser,
        health_facility: facility.id,
        is_active: true
      });
      
      // Recharger les listes
      await loadDistributors();
      await loadAvailableUsers();
      
      // Reset form
      setSelectedUser('');
      setShowAddDistributor(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du distributeur:', error);
      alert('Erreur lors de l\'ajout du distributeur');
    } finally {
      setAddingDistributor(false);
    }
  };

  const handleRemoveDistributor = async (distributorId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir retirer ce distributeur ?')) return;
    
    try {
      await apiService.deleteHealthFacilityDistributor(distributorId);
      
      // Recharger les listes
      await loadDistributors();
      await loadAvailableUsers();
    } catch (error) {
      console.error('Erreur lors de la suppression du distributeur:', error);
      alert('Erreur lors de la suppression du distributeur');
    }
  };

  if (!isOpen || !facility) return null;

  const hasCoordinates = facility.latitude && facility.longitude;
  const mapCenter = hasCoordinates ? [parseFloat(facility.latitude), parseFloat(facility.longitude)] : [12.5, -8.0];
  const radiusInMeters = facility.coverage_radius_km ? parseFloat(facility.coverage_radius_km) * 1000 : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Building2 className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Détails de la formation sanitaire
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-8rem)]">
          {/* Informations de la formation */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Informations générales */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informations générales</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Nom</label>
                    <p className="mt-1 text-sm text-gray-900">{facility.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Code</label>
                    <p className="mt-1 text-sm text-gray-900">{facility.code}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Type</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {facilityTypes[facility.type] || facility.type}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Niveau de soins</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {levelOfCareTypes[facility.level_of_care] || facility.level_of_care}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Localisation</label>
                    <p className="mt-1 text-sm text-gray-900">{facility.location}</p>
                  </div>
                  {facility.address && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Adresse</label>
                      <p className="mt-1 text-sm text-gray-900">{facility.address}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Géolocalisation */}
            {hasCoordinates && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Géolocalisation</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Latitude</label>
                      <p className="mt-1 text-sm text-gray-900">{facility.latitude}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Longitude</label>
                      <p className="mt-1 text-sm text-gray-900">{facility.longitude}</p>
                    </div>
                    {facility.coverage_radius_km && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Rayon de couverture</label>
                        <p className="mt-1 text-sm text-gray-900">{facility.coverage_radius_km} km</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Distributeurs */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Distributeurs ({distributors.length})
                </h3>
                <button
                  onClick={() => setShowAddDistributor(!showAddDistributor)}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ajouter</span>
                </button>
              </div>

              {/* Formulaire d'ajout de distributeur */}
              {showAddDistributor && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Ajouter un distributeur</h4>
                  <div className="flex items-end space-x-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Utilisateur
                      </label>
                      <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Sélectionner un utilisateur</option>
                        {availableUsers.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.first_name && user.last_name 
                              ? `${user.first_name} ${user.last_name}` 
                              : user.username} ({user.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleAddDistributor}
                        disabled={!selectedUser || addingDistributor}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {addingDistributor ? 'Ajout...' : 'Ajouter'}
                      </button>
                      <button
                        onClick={() => {
                          setShowAddDistributor(false);
                          setSelectedUser('');
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                  {availableUsers.length === 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Tous les utilisateurs disponibles sont déjà assignés à cette formation sanitaire.
                    </p>
                  )}
                </div>
              )}
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : distributors.length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-4">
                    {distributors.map((distributor) => (
                      <div key={distributor.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-blue-600" />
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
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            distributor.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {distributor.is_active ? 'Actif' : 'Inactif'}
                          </span>
                          <button
                            onClick={() => handleRemoveDistributor(distributor.id)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                            title="Retirer ce distributeur"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun distributeur assigné</p>
                </div>
              )}
            </div>

            {/* Statistiques */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Statistiques</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-blue-600">{distributors.length}</p>
                    <p className="text-sm text-gray-500">Distributeurs total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-green-600">
                      {distributors.filter(d => d.is_active).length}
                    </p>
                    <p className="text-sm text-gray-500">Distributeurs actifs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-gray-600">
                      {hasCoordinates ? 'Oui' : 'Non'}
                    </p>
                    <p className="text-sm text-gray-500">Géolocalisé</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carte */}
          {hasCoordinates && (
            <div className="w-1/2 border-l border-gray-200">
              <div className="h-full">
                <MapContainer
                  center={mapCenter}
                  zoom={radiusInMeters ? 12 : 10}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={mapCenter} />
                  {radiusInMeters && (
                    <Circle
                      center={mapCenter}
                      radius={radiusInMeters}
                      pathOptions={{
                        color: '#3b82f6',
                        fillColor: '#3b82f6',
                        fillOpacity: 0.1
                      }}
                    />
                  )}
                </MapContainer>
              </div>
            </div>
          )}
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

export default HealthFacilityDetailsModal;